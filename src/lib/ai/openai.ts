import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o'

export interface RegulationAnalysis {
  summary: string
  impact: string
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  actions: string[]
  checklist: Array<{ id: string; text: string; done: boolean }>
  risks: string
  sectors: string[]
  deadlinePriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export async function analyzeRegulation(
  title: string,
  text: string,
  companyContext?: { sector: string; size: string; type: string }
): Promise<RegulationAnalysis> {
  const contextPrompt = companyContext
    ? `\n\nContexte entreprise: Secteur ${companyContext.sector}, Taille ${companyContext.size}, Type ${companyContext.type}`
    : ''

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content: `Tu es un expert en conformité réglementaire française et européenne.
        Analyse les réglementations et produis des analyses structurées, précises et actionnables pour des PME.
        Réponds TOUJOURS en JSON valide avec la structure exacte demandée.`,
      },
      {
        role: 'user',
        content: `Analyse cette réglementation et retourne un JSON avec cette structure exacte:
{
  "summary": "Résumé concis en 2-3 phrases",
  "impact": "Description détaillée de l'impact sur les entreprises",
  "impactLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "actions": ["action 1", "action 2", "action 3"],
  "checklist": [{"id": "1", "text": "Tâche concrète", "done": false}],
  "risks": "Description des risques en cas de non-conformité",
  "sectors": ["secteur1", "secteur2"],
  "deadlinePriority": "LOW|MEDIUM|HIGH|URGENT"
}

Titre: ${title}
Texte: ${text}${contextPrompt}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No response from AI')

  return JSON.parse(content) as RegulationAnalysis
}

export async function analyzeDocument(
  documentText: string,
  documentType: string
): Promise<{
  summary: string
  missingElements: string[]
  improvements: string[]
  complianceIssues: string[]
  score: number
}> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content: `Tu es un expert en conformité documentaire et réglementaire française.
        Analyse les documents d'entreprise et identifie les manquements et améliorations.
        Réponds TOUJOURS en JSON valide.`,
      },
      {
        role: 'user',
        content: `Analyse ce document de type "${documentType}" et retourne:
{
  "summary": "Résumé du document en 2-3 phrases",
  "missingElements": ["élément manquant 1", "élément manquant 2"],
  "improvements": ["amélioration suggérée 1", "amélioration suggérée 2"],
  "complianceIssues": ["problème de conformité 1"],
  "score": 75
}

Document: ${documentText.substring(0, 4000)}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No response from AI')

  return JSON.parse(content)
}

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: {
    companyName: string
    sector: string
    recentRegulations: Array<{ title: string; impactLevel: string; deadlineDate?: string }>
    complianceScore: number
  }
): Promise<string> {
  const systemPrompt = `Tu es Regula AI, l'assistant expert en conformité réglementaire de l'entreprise "${context.companyName}" (secteur: ${context.sector}).

Score de conformité actuel: ${context.complianceScore}%

Réglementations récentes impactant l'entreprise:
${context.recentRegulations.map(r => `- ${r.title} (Impact: ${r.impactLevel}${r.deadlineDate ? `, Échéance: ${new Date(r.deadlineDate).toLocaleDateString('fr-FR')}` : ''})`).join('\n')}

Tu dois:
1. Répondre en français de manière précise et professionnelle
2. Fournir des conseils concrets et actionnables
3. Citer les textes réglementaires pertinents
4. Indiquer les risques en cas de non-conformité
5. Proposer des actions prioritaires

Sois concis, structuré et pratique.`

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content || 'Désolé, je n\'ai pas pu générer une réponse.'
}
