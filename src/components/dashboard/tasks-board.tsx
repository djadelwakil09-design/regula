'use client'

import { useState } from 'react'
import { Clock, AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusLabel, getStatusColor, formatRelativeDate, cn } from '@/lib/utils'
import type { Task, Regulation } from '@prisma/client'

type TaskWithRegulation = Task & { regulation: Pick<Regulation, 'title' | 'slug' | 'impactLevel'> | null }

const COLUMNS = [
  { status: 'TODO', label: 'À faire', icon: AlertCircle, color: 'text-gray-500' },
  { status: 'IN_PROGRESS', label: 'En cours', icon: Clock, color: 'text-blue-500' },
  { status: 'DONE', label: 'Terminé', icon: CheckCircle2, color: 'text-emerald-500' },
]

const priorityColors = { 1: 'critical', 2: 'warning', 3: 'info' } as const

export function TasksBoard({ tasks: initialTasks }: { tasks: TaskWithRegulation[] }) {
  const [tasks, setTasks] = useState(initialTasks)

  const updateStatus = async (id: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: status as Task['status'] } : t))
    await fetch(`/api/tasks?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const getColumnTasks = (status: string) => tasks.filter(t => t.status === status)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map(col => {
        const colTasks = getColumnTasks(col.status)
        return (
          <div key={col.status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <col.icon className={cn('w-4 h-4', col.color)} />
                <h3 className="font-semibold text-[#0F172A] text-sm">{col.label}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {colTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-2 min-h-[200px]">
              {colTasks.map(task => (
                <Card key={task.id} className="card-hover cursor-default">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant={priorityColors[task.priority as keyof typeof priorityColors] || 'info'} className="text-xs">
                        {['Urgent', 'Élevé', 'Normal'][task.priority - 1] || 'Normal'}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#0F172A] mb-1">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
                    )}
                    {task.regulation && (
                      <p className="text-xs text-blue-600 mt-2 line-clamp-1">📋 {task.regulation.title}</p>
                    )}
                    <div className="flex gap-1.5 mt-3">
                      {COLUMNS.filter(c => c.status !== task.status).map(c => (
                        <button
                          key={c.status}
                          onClick={() => updateStatus(task.id, c.status)}
                          className="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded px-1.5 py-0.5 transition-colors"
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {colTasks.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-xl py-8 text-center">
                  <p className="text-xs text-gray-400">Aucune tâche</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
