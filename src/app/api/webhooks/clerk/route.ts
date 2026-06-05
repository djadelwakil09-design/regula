import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { db } from '@/lib/db'

type ClerkEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string }>
    first_name?: string
    last_name?: string
    image_url?: string
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const headersList = await headers()
  const svix_id = headersList.get('svix-id')
  const svix_timestamp = headersList.get('svix-timestamp')
  const svix_signature = headersList.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let event: ClerkEvent
  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    event = wh.verify(body, { 'svix-id': svix_id, 'svix-timestamp': svix_timestamp, 'svix-signature': svix_signature }) as ClerkEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { id, email_addresses, first_name, last_name, image_url } = event.data
  const email = email_addresses?.[0]?.email_address

  if (event.type === 'user.created') {
    await db.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        email: email || '',
        firstName: first_name,
        lastName: last_name,
        avatarUrl: image_url,
      },
    })
  } else if (event.type === 'user.updated') {
    await db.user.updateMany({
      where: { clerkId: id },
      data: {
        email: email || '',
        firstName: first_name,
        lastName: last_name,
        avatarUrl: image_url,
      },
    })
  } else if (event.type === 'user.deleted') {
    await db.user.deleteMany({ where: { clerkId: id } })
  }

  return NextResponse.json({ received: true })
}
