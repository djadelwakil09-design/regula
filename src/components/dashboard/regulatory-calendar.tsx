'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, AlertCircle } from 'lucide-react'
import { getImpactLabel, getImpactColor, formatDate } from '@/lib/utils'
import type { Regulation } from '@prisma/client'

interface RegulatoryCalendarProps {
  regulations: Regulation[]
}

export function RegulatoryCalendar({ regulations }: RegulatoryCalendarProps) {
  const upcoming = regulations
    .filter(r => r.deadlineDate && new Date(r.deadlineDate) > new Date())
    .sort((a, b) => new Date(a.deadlineDate!).getTime() - new Date(b.deadlineDate!).getTime())
    .slice(0, 4)

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Prochaines échéances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.map((reg) => (
          <div key={reg.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 rounded-lg p-1.5 border ${getImpactColor(reg.impactLevel)}`}>
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#0F172A] line-clamp-2">{reg.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {reg.deadlineDate ? formatDate(reg.deadlineDate) : 'Date TBD'}
              </p>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">Aucune échéance prochaine</p>
        )}
      </CardContent>
    </Card>
  )
}
