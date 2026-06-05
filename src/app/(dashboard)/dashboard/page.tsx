import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { ComplianceScoreCard } from '@/components/dashboard/compliance-score-card'
import { RegulationCards } from '@/components/dashboard/regulation-cards'
import { TaskList } from '@/components/dashboard/task-list'
import { RegulatoryCalendar } from '@/components/dashboard/regulatory-calendar'
import { StatsRow } from '@/components/dashboard/stats-row'

export const metadata = { title: 'Tableau de bord' }

async function getDashboardData(userId: string) {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!user?.company?.onboardingDone) return null

  const [regulations, tasks, score, notifications] = await Promise.all([
    db.regulation.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    db.task.findMany({
      where: { userId: user.id, status: { in: ['TODO', 'IN_PROGRESS'] } },
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
      take: 5,
    }),
    db.complianceScore.findFirst({
      where: { companyId: user.company.id },
      orderBy: { createdAt: 'desc' },
    }),
    db.notification.count({ where: { userId: user.id, isRead: false } }),
  ])

  return { user, company: user.company, regulations, tasks, score, unreadCount: notifications }
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const data = await getDashboardData(userId)
  if (!data) redirect('/onboarding')

  const { company, regulations, tasks, score } = data
  const complianceScore = score?.score ?? 72

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <Header
        title={`Bonjour, ${company.name} 👋`}
        subtitle="Voici l'état de votre conformité réglementaire"
      />

      <StatsRow
        complianceScore={complianceScore}
        totalRegulations={regulations.length}
        pendingTasks={tasks.length}
        criticalCount={regulations.filter(r => r.impactLevel === 'CRITICAL').length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RegulationCards regulations={regulations} />
          <TaskList tasks={tasks} />
        </div>
        <div className="space-y-6">
          <ComplianceScoreCard score={complianceScore} />
          <RegulatoryCalendar regulations={regulations} />
        </div>
      </div>
    </div>
  )
}
