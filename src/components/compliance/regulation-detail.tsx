'use client'

import { useState } from 'react'
import { ExternalLink, Brain, AlertTriangle, CheckSquare, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getImpactLabel, getStatusLabel, getStatusColor, formatDate, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { Regulation, CompanyRegulation, RegulationSource } from '@prisma/client'

type RegulationWithSource = Regulation & { source: RegulationSource | null }

interface Props {
  regulation: RegulationWithSource
  companyRegulation: CompanyRegulation | null
}

export function RegulationDetail({ regulation, companyRegulation }: Props) {
  const [status, setStatus] = useState(companyRegulation?.status || 'TODO')
  const [checklist, setChecklist] = useState<Array<{ id: string; text: string; done: boolean }>>(
    (regulation.aiChecklist as Array<{ id: string; text: string; done: boolean }>) || []
  )
  const { toast } = useToast()

  const impactBadge: Record<string, 'critical' | 'warning' | 'info' | 'success'> = {
    CRITICAL: 'critical', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
  }

  const updateStatus = async (newStatus: string) => {
    setStatus(newStatus as typeof status)
    toast({ title: 'Statut mis à jour', variant: 'success' })
  }

  const toggleCheckItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  const completedCount = checklist.filter(i => i.done).length
  const actions = (regulation.aiActions as string[]) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Info card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={impactBadge[regulation.impactLevel]}>
                Impact {getImpactLabel(regulation.impactLevel)}
              </Badge>
              {regulation.isAnalyzed && (
                <Badge variant="success" className="flex items-center gap-1">
                  <Brain className="w-3 h-3" /> Analysé par IA
                </Badge>
              )}
              {regulation.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              {regulation.effectiveDate && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">En vigueur</p>
                  <p className="font-medium text-[#0F172A]">{formatDate(regulation.effectiveDate)}</p>
                </div>
              )}
              {regulation.deadlineDate && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Échéance</p>
                  <p className="font-semibold text-amber-600">{formatDate(regulation.deadlineDate)}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Publié</p>
                <p className="font-medium text-[#0F172A]">{formatDate(regulation.publishedAt)}</p>
              </div>
              {regulation.source && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Source</p>
                  <p className="font-medium text-[#0F172A]">{regulation.source.name}</p>
                </div>
              )}
            </div>

            {regulation.sourceUrl && (
              <a
                href={regulation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Voir la source officielle
              </a>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        {regulation.aiSummary && (
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                Résumé IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">{regulation.aiSummary}</p>
            </CardContent>
          </Card>
        )}

        {/* Impact */}
        {regulation.aiImpact && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Impact sur votre entreprise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">{regulation.aiImpact}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Actions recommandées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Risks */}
        {regulation.aiRisks && (
          <Card className="border-red-100 bg-red-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Risques en cas de non-conformité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700/80 text-sm leading-relaxed">{regulation.aiRisks}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Statut de conformité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={status} onValueChange={updateStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">À faire</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLIANT">Conforme</SelectItem>
                <SelectItem value="NON_COMPLIANT">Non conforme</SelectItem>
              </SelectContent>
            </Select>
            <div className={cn('rounded-lg px-3 py-2 text-sm font-medium text-center', getStatusColor(status))}>
              {getStatusLabel(status)}
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        {checklist.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  Checklist
                </CardTitle>
                <span className="text-xs text-gray-500">{completedCount}/{checklist.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${checklist.length ? (completedCount / checklist.length) * 100 : 0}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className="flex items-start gap-2.5 cursor-pointer group"
                >
                  <div className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    item.done ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 group-hover:border-emerald-400'
                  )}>
                    {item.done && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className={cn('text-xs leading-relaxed', item.done ? 'line-through text-gray-400' : 'text-gray-700')}>
                    {item.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Deadline */}
        {regulation.deadlineDate && (
          <Card className="border-amber-100 bg-amber-50/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-medium">Échéance réglementaire</p>
                <p className="text-sm font-bold text-amber-800">{formatDate(regulation.deadlineDate)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
