'use client'

import Link from 'next/link'
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusColor, getImpactLabel, cn } from '@/lib/utils'
import type { CompanyRegulation, Regulation } from '@prisma/client'

type CompanyRegulationWithRegulation = CompanyRegulation & { regulation: Regulation }

interface Props {
  companyRegulations: CompanyRegulationWithRegulation[]
  score: number
  breakdown: Record<string, number>
}

export function ComplianceDashboard({ companyRegulations, score, breakdown }: Props) {
  const todo = companyRegulations.filter(r => r.status === 'TODO').length
  const inProgress = companyRegulations.filter(r => r.status === 'IN_PROGRESS').length
  const compliant = companyRegulations.filter(r => r.status === 'COMPLIANT').length

  const impactBadge: Record<string, 'critical' | 'warning' | 'info' | 'success'> = {
    CRITICAL: 'critical', HIGH: 'warning', MEDIUM: 'info', LOW: 'success',
  }

  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400 text-sm mb-1">Score global</p>
            <p className="text-5xl font-bold">{score}<span className="text-2xl text-slate-400">%</span></p>
            <div className="flex items-center justify-center gap-1 mt-2 text-emerald-400 text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3 ce mois</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">À traiter</span>
            </div>
            <p className="text-3xl font-bold text-[#0F172A]">{todo}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500">En cours</span>
            </div>
            <p className="text-3xl font-bold text-[#0F172A]">{inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-500">Conformes</span>
            </div>
            <p className="text-3xl font-bold text-[#0F172A]">{compliant}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Breakdown by domain */}
        {Object.keys(breakdown).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score par domaine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(breakdown).map(([domain, score]) => (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">{domain}</span>
                    <span className="font-semibold text-[#0F172A]">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Regulations list */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-[#0F172A]">Réglementations à traiter</h3>
          {companyRegulations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Tout est en ordre !</p>
                <p className="text-sm text-gray-400 mt-1">Aucune réglementation en attente</p>
              </CardContent>
            </Card>
          ) : (
            companyRegulations.slice(0, 8).map((cr) => (
              <Link key={cr.id} href={`/regulations/${cr.regulation.slug}`} className="block">
                <Card className="card-hover">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={cn('text-xs font-medium px-2.5 py-1 rounded-full', getStatusColor(cr.status))}>
                      {getStatusLabel(cr.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] line-clamp-1">{cr.regulation.title}</p>
                    </div>
                    <Badge variant={impactBadge[cr.regulation.impactLevel] || 'info'} className="shrink-0">
                      {getImpactLabel(cr.regulation.impactLevel)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
