import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as 'PRO' | 'BUSINESS'

        if (!userId || !plan) break

        const user = await db.user.findUnique({ where: { clerkId: userId } })
        if (!user) break

        await db.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            plan,
            status: 'ACTIVE',
          },
          create: {
            userId: user.id,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            plan,
            status: 'ACTIVE',
          },
        })
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const sub = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!sub) break

        await db.subscription.update({
          where: { id: sub.id },
          data: {
            status: subscription.status === 'active' ? 'ACTIVE'
              : subscription.status === 'canceled' ? 'CANCELED'
              : subscription.status === 'past_due' ? 'PAST_DUE'
              : 'INACTIVE',
            currentPeriodStart: new Date((subscription.current_period_start as number) * 1000),
            currentPeriodEnd: new Date((subscription.current_period_end as number) * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            ...(event.type === 'customer.subscription.deleted' && { plan: 'FREE' }),
          },
        })
        break
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
