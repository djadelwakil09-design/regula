import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { RegulationsTable } from '@/components/compliance/regulations-table'

export const metadata: Metadata = { title: 'Réglementations' }

export default async function RegulationsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const regulations = await db.regulation.findMany({
    where: { isActive: true },
    orderBy: [{ impactLevel: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id: true, title: true, slug: true, summary: true,
      impactLevel: true, effectiveDate: true, deadlineDate: true,
      publishedAt: true, sectors: true, tags: true, isAnalyzed: true,
    },
  })

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Réglementations" subtitle="Toutes les réglementations applicables à votre entreprise" />
      <RegulationsTable regulations={regulations} />
    </div>
  )
}
