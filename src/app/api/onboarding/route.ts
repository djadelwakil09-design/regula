import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  companyName: z.string().min(2),
  siret: z.string().optional(),
  sector: z.string().min(1),
  employeeCount: z.string().min(1),
  country: z.string().default('France'),
  region: z.string().optional(),
  companyType: z.string().min(1),
  website: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const data = schema.parse(body)

    // Récupérer les infos Clerk
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ''
    const firstName = clerkUser?.firstName ?? undefined
    const lastName = clerkUser?.lastName ?? undefined

    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: { email, firstName, lastName },
      create: { clerkId: userId, email, firstName, lastName },
    })

    const company = await db.company.upsert({
      where: { userId: user.id },
      update: {
        name: data.companyName,
        siret: data.siret,
        sector: data.sector,
        employeeCount: data.employeeCount,
        country: data.country,
        region: data.region,
        companyType: data.companyType,
        website: data.website,
        onboardingDone: true,
      },
      create: {
        userId: user.id,
        name: data.companyName,
        siret: data.siret,
        sector: data.sector,
        employeeCount: data.employeeCount,
        country: data.country,
        region: data.region,
        companyType: data.companyType,
        website: data.website,
        onboardingDone: true,
      },
    })

    // Create initial compliance score
    await db.complianceScore.create({
      data: {
        companyId: company.id,
        score: 50,
        period: new Date().toISOString().substring(0, 7),
        breakdown: {
          'Droit du travail': 60,
          'Fiscal & Comptable': 50,
          'Données & RGPD': 40,
          'Cybersécurité': 30,
        },
      },
    })

    // Create subscription (free plan)
    await db.subscription.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
      },
    })

    // Seed initial tasks based on sector
    const initialTasks = [
      {
        title: 'Vérifier la conformité RGPD',
        description: 'Audit de vos traitements de données personnelles',
        priority: 1,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Mettre à jour les fiches de paie',
        description: 'Appliquer les nouvelles règles de rémunération',
        priority: 2,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Réviser le règlement intérieur',
        description: 'Intégrer les obligations légales récentes',
        priority: 3,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.task.createMany({
      data: initialTasks.map(t => ({ ...t, userId: user.id })),
    })

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'ONBOARDING_COMPLETE',
        resource: 'Company',
        resourceId: company.id,
      },
    })

    return NextResponse.json({ company, message: 'Onboarding complete' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
