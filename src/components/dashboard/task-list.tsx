'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeDate } from '@/lib/utils'
import type { Task } from '@prisma/client'

interface TaskListProps {
  tasks: Task[]
}

const priorityConfig = {
  1: { label: 'Urgent', variant: 'critical' as const },
  2: { label: 'Élevé', variant: 'warning' as const },
  3: { label: 'Normal', variant: 'info' as const },
}

export function TaskList({ tasks }: TaskListProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggle = async (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Tâches prioritaires</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">Voir tout <ArrowRight className="w-3 h-3 ml-1" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => {
          const isDone = completed.has(task.id)
          const pConfig = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig[3]
          return (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
                isDone ? 'opacity-50' : 'hover:bg-gray-50'
              )}
            >
              <button
                onClick={() => toggle(task.id)}
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                  isDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 hover:border-blue-500'
                )}
              >
                {isDone && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant={pConfig.variant} className="text-xs">{pConfig.label}</Badge>
                  {task.dueDate && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDate(task.dueDate)}
                    </span>
                  )}
                </div>
                <p className={cn('text-sm font-medium text-[#0F172A]', isDone && 'line-through')}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                )}
              </div>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <div className="text-center py-8">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Toutes les tâches sont à jour !</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
