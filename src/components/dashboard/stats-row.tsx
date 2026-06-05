import { Shield, FileText, CheckSquare, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsRowProps {
  complianceScore: number
  totalRegulations: number
  pendingTasks: number
  criticalCount: number
}

const stats = (p: StatsRowProps) => [
  {
    label: 'Score conformité',
    value: `${p.complianceScore}%`,
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    trend: '+3% ce mois',
    trendUp: true,
  },
  {
    label: 'Réglementations actives',
    value: p.totalRegulations.toString(),
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    trend: '3 nouvelles',
    trendUp: false,
  },
  {
    label: 'Tâches en attente',
    value: p.pendingTasks.toString(),
    icon: CheckSquare,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    trend: '2 urgentes',
    trendUp: false,
  },
  {
    label: 'Alertes critiques',
    value: p.criticalCount.toString(),
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    trend: 'Action requise',
    trendUp: false,
  },
]

export function StatsRow(props: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats(props).map((stat) => (
        <Card key={stat.label} className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
