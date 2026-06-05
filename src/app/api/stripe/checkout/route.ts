import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { createCheckoutSession } from '@/lib/stripe'

const schema = z.object({ plan: z.enum(['PRO', 'BUSINESS']) })

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { plan } = schema.parse(body)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await createCheckoutSession(
      userId,
      user.emailAddresses[0]?.emailAddress || '',
      plan,
      `${appUrl}/settings?tab=billing&success=true`,
      `${appUrl}/settings?tab=billing&canceled=true`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 })
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
