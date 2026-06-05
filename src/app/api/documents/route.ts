import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analyzeDocument } from '@/lib/ai/openai'

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const documents = await db.document.findMany({
      where: { userId: user.id },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ documents })
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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('type') as string || 'general'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Store file metadata (in production, upload to S3/Vercel Blob)
    const document = await db.document.create({
      data: {
        userId: user.id,
        name: file.name,
        originalName: file.name,
        fileUrl: `/uploads/${file.name}`,
        fileSize: file.size,
        mimeType: file.type,
        status: 'ANALYZING',
      },
    })

    // Read file and analyze
    const text = await file.text()

    try {
      const analysis = await analyzeDocument(text, documentType)

      await db.documentAnalysis.create({
        data: {
          documentId: document.id,
          summary: analysis.summary,
          missingElements: analysis.missingElements,
          improvements: analysis.improvements,
          complianceIssues: analysis.complianceIssues,
          score: analysis.score,
        },
      })

      await db.document.update({
        where: { id: document.id },
        data: { status: 'ANALYZED' },
      })
    } catch {
      await db.document.update({ where: { id: document.id }, data: { status: 'ERROR' } })
    }

    const result = await db.document.findUnique({
      where: { id: document.id },
      include: { analysis: true },
    })

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
