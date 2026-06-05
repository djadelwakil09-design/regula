import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { AiAssistant } from '@/components/dashboard/ai-assistant'

export const metadata: Metadata = { title: 'Assistant IA' }

export default function AssistantPage() {
  return (
    <div className="p-8 h-[calc(100vh-0px)] flex flex-col animate-fade-in">
      <Header title="Assistant IA" subtitle="Posez vos questions réglementaires en langage naturel" />
      <div className="flex-1 mt-6 min-h-0">
        <AiAssistant />
      </div>
    </div>
  )
}
