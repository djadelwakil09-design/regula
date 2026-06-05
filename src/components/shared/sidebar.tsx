'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Shield, FileText, CheckSquare, Bell,
  MessageSquare, Upload, Settings, BarChart3, Users,
  ChevronRight, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/compliance', icon: Shield, label: 'Conformité' },
  { href: '/regulations', icon: FileText, label: 'Réglementations' },
  { href: '/tasks', icon: CheckSquare, label: 'Tâches' },
  { href: '/alerts', icon: Bell, label: 'Alertes' },
  { href: '/assistant', icon: MessageSquare, label: 'Assistant IA' },
  { href: '/documents', icon: Upload, label: 'Documents' },
]

const bottomItems = [
  { href: '/settings', icon: Settings, label: 'Paramètres' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Regula</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'group-hover:text-white')} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold">Passer en Pro</span>
          </div>
          <p className="text-xs text-blue-100 mb-3">Débloquez l&apos;IA avancée et les alertes illimitées</p>
          <Link
            href="/settings?tab=billing"
            className="block text-center text-xs font-semibold bg-white text-blue-700 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
          >
            Voir les offres
          </Link>
        </div>

        {/* Bottom nav */}
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              pathname === item.href
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}

        {/* User */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="text-sm min-w-0">
            <p className="text-white font-medium truncate">Mon compte</p>
            <p className="text-slate-400 text-xs">Plan Free</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
