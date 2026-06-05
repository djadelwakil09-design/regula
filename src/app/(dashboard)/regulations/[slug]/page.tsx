import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'
import { RegulationDetail } from '@/components/compliance/regulation-detail'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const reg = await db.regulation.findUnique({ where: { slug: params.slug }, select: { title: true } })
  return { title: reg?.title || 'Réglementation' }
}

export default async function RegulationPage({ params }: Props) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId }, include: { company: true } })
  const regulation = await db.regulation.findUnique({
    where: { slug: params.slug },
    include: { source: true },
  })

  if (!regulation) notFound()

  let companyRegulation = null
  if (user?.company) {
    companyRegulation = await db.companyRegulation.findUnique({
      where: { companyId_regulationId: { companyId: user.company.id, regulationId: regulation.id } },
    })
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title={regulation.title} subtitle="Analyse détaillée et actions recommandées" />
      <RegulationDetail regulation={regulation} companyRegulation={companyRegulation} />
    </div>
  )
}
