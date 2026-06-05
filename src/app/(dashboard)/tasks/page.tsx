import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { TasksBoard } from '@/components/dashboard/tasks-board'

export const metadata: Metadata = { title: 'Tâches' }

export default async function TasksPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  const tasks = await db.task.findMany({
    where: { userId: user.id },
    include: { regulation: { select: { title: true, slug: true, impactLevel: true } } },
    orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
  })

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Tâches de conformité" subtitle="Suivez l'avancement de vos obligations réglementaires" />
      <TasksBoard tasks={tasks} />
    </div>
  )
}
