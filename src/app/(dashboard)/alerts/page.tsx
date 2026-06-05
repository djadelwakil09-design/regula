import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { AlertsCenter } from '@/components/dashboard/alerts-center'

export const metadata: Metadata = { title: 'Alertes' }

export default async function AlertsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    include: { regulation: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Mark all as read
  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Centre d'alertes" subtitle="Toutes vos notifications réglementaires" />
      <AlertsCenter notifications={notifications} />
    </div>
  )
}
