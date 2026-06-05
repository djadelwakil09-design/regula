import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getImpactColor, getImpactLabel, formatRelativeDate } from '@/lib/utils'
import type { Regulation } from '@prisma/client'

interface RegulationCardsProps {
  regulations: Regulation[]
}

function impactToBadgeVariant(level: string) {
  switch (level) {
    case 'CRITICAL': return 'critical' as const
    case 'HIGH': return 'warning' as const
    case 'MEDIUM': return 'info' as const
    default: return 'success' as const
  }
}

export function RegulationCards({ regulations }: RegulationCardsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Nouvelles obligations détectées</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/regulations">
              Voir tout <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {regulations.slice(0, 4).map((reg) => (
          <Link
            key={reg.id}
            href={`/regulations/${reg.slug}`}
            className="block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={impactToBadgeVariant(reg.impactLevel)}>
                    {getImpactLabel(reg.impactLevel)}
                  </Badge>
                  {reg.deadlineDate && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDate(reg.deadlineDate)}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-[#0F172A] line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {reg.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{reg.summary}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
            </div>
          </Link>
        ))}
        {regulations.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Aucune réglementation pour le moment</p>
        )}
      </CardContent>
    </Card>
  )
}
