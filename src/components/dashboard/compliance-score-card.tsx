'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shield, TrendingUp } from 'lucide-react'

interface ComplianceScoreCardProps {
  score: number
}

function getScoreStatus(score: number) {
  if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600' }
  if (score >= 70) return { label: 'Bon', color: 'text-blue-600' }
  if (score >= 50) return { label: 'Moyen', color: 'text-amber-600' }
  return { label: 'Insuffisant', color: 'text-red-600' }
}

export function ComplianceScoreCard({ score }: ComplianceScoreCardProps) {
  const status = getScoreStatus(score)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Score de conformité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="relative inline-flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#scoreGradient)" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 314} 314`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#0F172A]">{score}</span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>
          <p className={`text-lg font-semibold mt-3 ${status.color}`}>{status.label}</p>
        </div>

        <div className="space-y-3 mt-2">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Droit du travail</span>
              <span>88%</span>
            </div>
            <Progress value={88} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Fiscal & Comptable</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Données & RGPD</span>
              <span>62%</span>
            </div>
            <Progress value={62} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Cybersécurité</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-1.5" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span>+3 points ce mois</span>
        </div>
      </CardContent>
    </Card>
  )
}
