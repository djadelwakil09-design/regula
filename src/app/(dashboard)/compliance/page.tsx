import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { ComplianceDashboard } from '@/components/compliance/compliance-dashboard'

export const metadata: Metadata = { title: 'Centre de conformité' }

export default async function CompliancePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!user?.company) redirect('/onboarding')

  const [companyRegs, score] = await Promise.all([
    db.companyRegulation.findMany({
      where: { companyId: user.company.id },
      include: { regulation: true },
    }),
    db.complianceScore.findFirst({
      where: { companyId: user.company.id },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Centre de conformité" subtitle="Vue globale de votre conformité réglementaire" />
      <ComplianceDashboard
        companyRegulations={companyRegs}
        score={score?.score ?? 72}
        breakdown={(score?.breakdown as Record<string, number>) ?? {}}
      />
    </div>
  )
}
