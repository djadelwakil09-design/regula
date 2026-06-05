'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ArrowRight, Brain } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getImpactLabel, formatDate, formatRelativeDate, cn } from '@/lib/utils'

type Regulation = {
  id: string; title: string; slug: string; summary: string
  impactLevel: string; effectiveDate: Date | null; deadlineDate: Date | null
  publishedAt: Date; sectors: string[]; tags: string[]; isAnalyzed: boolean
}

const IMPACT_VARIANT: Record<string, 'critical' | 'warning' | 'info' | 'success'> = {
  CRITICAL: 'critical', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
}

export function RegulationsTable({ regulations }: { regulations: Regulation[] }) {
  const [search, setSearch] = useState('')
  const [impact, setImpact] = useState('ALL')

  const filtered = regulations.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase())
    const matchImpact = impact === 'ALL' || r.impactLevel === impact
    return matchSearch && matchImpact
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher une réglementation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={impact} onValueChange={setImpact}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les niveaux</SelectItem>
              <SelectItem value="CRITICAL">Critique</SelectItem>
              <SelectItem value="HIGH">Élevé</SelectItem>
              <SelectItem value="MEDIUM">Moyen</SelectItem>
              <SelectItem value="LOW">Faible</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-gray-500 px-1">
        {filtered.length} réglementation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((reg) => (
          <Link key={reg.id} href={`/regulations/${reg.slug}`} className="block group">
            <Card className="card-hover cursor-pointer group-hover:border-blue-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={IMPACT_VARIANT[reg.impactLevel] || 'info'}>
                        {getImpactLabel(reg.impactLevel)}
                      </Badge>
                      {reg.isAnalyzed && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Brain className="w-3 h-3" /> Analysé par IA
                        </Badge>
                      )}
                      {reg.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-[#0F172A] group-hover:text-blue-700 transition-colors line-clamp-1">
                      {reg.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{reg.summary}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>Publié le {formatDate(reg.publishedAt)}</span>
                      {reg.effectiveDate && <span>En vigueur : {formatDate(reg.effectiveDate)}</span>}
                      {reg.deadlineDate && (
                        <span className="text-amber-600 font-medium">
                          Échéance : {formatRelativeDate(reg.deadlineDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune réglementation trouvée</p>
            <p className="text-sm text-gray-400 mt-1">Modifiez vos filtres ou lancez une nouvelle recherche</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
