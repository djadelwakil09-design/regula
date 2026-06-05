import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { SettingsTabs } from '@/components/dashboard/settings-tabs'

export const metadata: Metadata = { title: 'Paramètres' }

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true, subscription: true },
  })

  if (!user) redirect('/sign-in')

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Paramètres" subtitle="Gérez votre compte et votre abonnement" />
      <SettingsTabs user={user} />
    </div>
  )
}
