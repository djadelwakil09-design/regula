import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().min(1).max(3).default(2),
  dueDate: z.string().datetime().optional(),
  regulationId: z.string().optional(),
})

const updateSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'SKIPPED']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.number().optional(),
  dueDate: z.string().datetime().optional(),
})

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const tasks = await db.task.findMany({
      where: { userId: user.id, ...(status ? { status: status as never } : {}) },
      include: { regulation: { select: { title: true, slug: true, impactLevel: true } } },
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const data = createSchema.parse(body)

    const task = await db.task.create({
      data: {
        ...data,
        userId: user.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Task ID required' }, { status: 400 })

    const body = await req.json()
    const data = updateSchema.parse(body)

    const task = await db.task.updateMany({
      where: { id, userId: user.id },
      data: {
        ...data,
        completedAt: data.status === 'DONE' ? new Date() : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
