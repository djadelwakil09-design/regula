import Link from 'next/link'
import { Bell, AlertTriangle, Clock, FileText, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Notification, Regulation } from '@prisma/client'

type NotificationWithRegulation = Notification & {
  regulation: Pick<Regulation, 'title' | 'slug'> | null
}

const TYPE_CONFIG = {
  NEW_REGULATION: { icon: FileText, label: 'Nouvelle obligation', variant: 'info' as const, color: 'bg-blue-50 text-blue-600' },
  DEADLINE_APPROACHING: { icon: Clock, label: 'Échéance proche', variant: 'warning' as const, color: 'bg-amber-50 text-amber-600' },
  HIGH_RISK: { icon: AlertTriangle, label: 'Risque élevé', variant: 'critical' as const, color: 'bg-red-50 text-red-600' },
  TASK_DUE: { icon: Bell, label: 'Tâche en attente', variant: 'secondary' as const, color: 'bg-gray-50 text-gray-600' },
  SYSTEM: { icon: Info, label: 'Système', variant: 'secondary' as const, color: 'bg-gray-50 text-gray-600' },
}

export function AlertsCenter({ notifications }: { notifications: NotificationWithRegulation[] }) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Aucune alerte</p>
          <p className="text-sm text-gray-400 mt-1">Vous êtes à jour sur toutes vos obligations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => {
        const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.SYSTEM
        const Wrapper = notif.regulation ? Link : 'div'
        const wrapperProps = notif.regulation
          ? { href: `/regulations/${notif.regulation.slug}` }
          : {}

        return (
          <Wrapper key={notif.id} {...(wrapperProps as Record<string, string>)} className="block">
            <Card className={`transition-all hover:shadow-sm ${!notif.isRead ? 'border-blue-200 bg-blue-50/20' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                  <config.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <p className="font-semibold text-sm text-[#0F172A]">{notif.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      {notif.regulation && (
                        <p className="text-xs text-blue-600 mt-1">📋 {notif.regulation.title}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {formatDate(notif.createdAt, { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Wrapper>
        )
      })}
    </div>
  )
}
