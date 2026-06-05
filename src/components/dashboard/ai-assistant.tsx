'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  'Quels changements réglementaires impactent mon entreprise ce mois-ci ?',
  'Que dois-je faire pour être conforme à la directive NIS2 ?',
  'Résume les obligations RGPD pour une PME de 30 salariés.',
  'Quelles sont les sanctions en cas de non-conformité au SMIC ?',
]

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis Regula AI, votre assistant expert en conformité réglementaire.\n\nJe peux vous aider à :\n- Comprendre les réglementations qui vous concernent\n- Identifier les actions à prendre en priorité\n- Analyser vos obligations légales\n- Préparer vos échéances réglementaires\n\nQue souhaitez-vous savoir ?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (content: string = input) => {
    if (!content.trim() || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Désolé, une erreur est survenue : ${err instanceof Error ? err.message : 'Erreur inconnue'}. Veuillez réessayer.`,
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
            {/* Avatar */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-blue-600 to-emerald-500'
                : 'bg-[#0F172A]'
            )}>
              {msg.role === 'assistant'
                ? <Sparkles className="w-4 h-4 text-white" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>
            {/* Bubble */}
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
              msg.role === 'assistant'
                ? 'bg-gray-50 text-gray-800 rounded-tl-sm'
                : 'bg-[#0F172A] text-white rounded-tr-sm'
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-500">Regula AI réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-400 mb-2">Suggestions :</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4 flex gap-3 items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question réglementaire... (Entrée pour envoyer)"
          className="flex-1 min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
        <Button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          variant="primary"
          size="icon"
          className="shrink-0 h-10 w-10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
