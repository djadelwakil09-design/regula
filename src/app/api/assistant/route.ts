import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { generateChatResponse } from '@/lib/ai/openai'

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { messages } = schema.parse(body)

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { company: true, subscription: true },
    })

    if (!user?.company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Check plan limits
    if (user.subscription?.plan === 'FREE') {
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      const count = await db.auditLog.count({
        where: { userId: user.id, action: 'AI_CHAT', createdAt: { gte: monthStart } },
      })
      if (count >= 5) {
        return NextResponse.json({ error: 'Plan limit reached. Upgrade to Pro for unlimited AI access.' }, { status: 429 })
      }
    }

    const recentRegulations = await db.regulation.findMany({
      where: { isActive: true, impactLevel: { in: ['HIGH', 'CRITICAL'] } },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { title: true, impactLevel: true, deadlineDate: true },
    })

    const score = await db.complianceScore.findFirst({
      where: { companyId: user.company.id },
      orderBy: { createdAt: 'desc' },
    })

    const response = await generateChatResponse(messages, {
      companyName: user.company.name,
      sector: user.company.sector,
      recentRegulations: recentRegulations.map(r => ({
        title: r.title,
        impactLevel: r.impactLevel,
        deadlineDate: r.deadlineDate?.toISOString(),
      })),
      complianceScore: score?.score ?? 50,
    })

    await db.auditLog.create({
      data: { userId: user.id, action: 'AI_CHAT', resource: 'Assistant' },
    })

    return NextResponse.json({ response })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Assistant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
