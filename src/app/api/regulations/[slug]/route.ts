import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analyzeRegulation } from '@/lib/ai/openai'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const regulation = await db.regulation.findUnique({
      where: { slug: params.slug },
      include: { source: true },
    })

    if (!regulation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Get user's compliance status for this regulation
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { company: true },
    })

    let companyRegulation = null
    if (user?.company) {
      companyRegulation = await db.companyRegulation.findUnique({
        where: { companyId_regulationId: { companyId: user.company.id, regulationId: regulation.id } },
      })
    }

    return NextResponse.json({ regulation, companyRegulation })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action } = await req.json()

    if (action === 'analyze') {
      const regulation = await db.regulation.findUnique({ where: { slug: params.slug } })
      if (!regulation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const analysis = await analyzeRegulation(regulation.title, regulation.fullText || regulation.summary)

      await db.regulation.update({
        where: { id: regulation.id },
        data: {
          aiSummary: analysis.summary,
          aiImpact: analysis.impact,
          aiActions: analysis.actions,
          aiChecklist: analysis.checklist,
          aiRisks: analysis.risks,
          impactLevel: analysis.impactLevel,
          isAnalyzed: true,
        },
      })

      return NextResponse.json({ analysis })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
