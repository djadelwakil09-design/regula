import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  impact: z.string().optional(),
  sector: z.string().optional(),
  search: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    const skip = (query.page - 1) * query.limit

    const where: Record<string, unknown> = { isActive: true }
    if (query.impact) where.impactLevel = query.impact
    if (query.sector) where.sectors = { has: query.sector }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const [regulations, total] = await Promise.all([
      db.regulation.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: query.limit,
        select: {
          id: true, title: true, slug: true, summary: true,
          impactLevel: true, effectiveDate: true, deadlineDate: true,
          publishedAt: true, sectors: true, tags: true, isAnalyzed: true,
        },
      }),
      db.regulation.count({ where }),
    ])

    return NextResponse.json({ regulations, total, page: query.page, limit: query.limit })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role === 'USER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const regulation = await db.regulation.create({ data: body })

    return NextResponse.json(regulation, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
