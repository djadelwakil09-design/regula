'use client'

import { useState } from 'react'
import { Check, Zap, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe'
import { cn } from '@/lib/utils'
import type { User, Company, Subscription } from '@prisma/client'

type UserWithRelations = User & { company: Company | null; subscription: Subscription | null }

export function SettingsTabs({ user }: { user: UserWithRelations }) {
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState<string | null>(null)

  const currentPlan = user.subscription?.plan || 'FREE'

  const upgrade = async (plan: 'PRO' | 'BUSINESS') => {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  const openPortal = async () => {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  const tabs = ['profile', 'company', 'billing', 'notifications']
  const tabLabels: Record<string, string> = {
    profile: 'Profil', company: 'Entreprise', billing: 'Abonnement', notifications: 'Notifications',
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-48 shrink-0">
        <nav className="space-y-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                tab === t ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {tabLabels[t]}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5">
        {/* Profile tab */}
        {tab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez votre profil via votre compte Clerk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Prénom</p>
                  <p className="font-medium">{user.firstName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Nom</p>
                  <p className="font-medium">{user.lastName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Rôle</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company tab */}
        {tab === 'company' && user.company && (
          <Card>
            <CardHeader>
              <CardTitle>Profil entreprise</CardTitle>
              <CardDescription>Ces informations définissent votre profil réglementaire</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Nom', value: user.company.name },
                { label: 'SIRET', value: user.company.siret || '—' },
                { label: 'Secteur', value: user.company.sector },
                { label: 'Effectif', value: user.company.employeeCount },
                { label: 'Type', value: user.company.companyType },
                { label: 'Pays', value: user.company.country },
                { label: 'Région', value: user.company.region || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Billing tab */}
        {tab === 'billing' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plan actuel</CardTitle>
                    <CardDescription>Gérez votre abonnement Regula</CardDescription>
                  </div>
                  <Badge variant={currentPlan === 'FREE' ? 'secondary' : 'info'} className="text-sm px-3 py-1">
                    {currentPlan}
                  </Badge>
                </div>
              </CardHeader>
              {currentPlan !== 'FREE' && (
                <CardContent>
                  <Button variant="outline" onClick={openPortal} loading={loading === 'portal'}>
                    Gérer mon abonnement
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Plans */}
            {currentPlan === 'FREE' && (
              <div className="grid md:grid-cols-2 gap-4">
                {(['PRO', 'BUSINESS'] as const).map((plan) => (
                  <Card key={plan} className={plan === 'PRO' ? 'border-blue-200 bg-blue-50/30' : ''}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {plan === 'PRO' ? <Zap className="w-4 h-4 text-blue-600" /> : <Crown className="w-4 h-4 text-amber-500" />}
                        <CardTitle className="text-base">{PLANS[plan].name}</CardTitle>
                      </div>
                      <p className="text-2xl font-bold text-[#0F172A]">{PLANS[plan].price}€<span className="text-sm font-normal text-gray-400">/mois</span></p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ul className="space-y-2">
                        {PLANS[plan].features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={plan === 'PRO' ? 'primary' : 'default'}
                        className="w-full"
                        onClick={() => upgrade(plan)}
                        loading={loading === plan}
                      >
                        Passer en {plan}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications tab */}
        {tab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>Choisissez comment être alerté des changements réglementaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Nouvelles réglementations', desc: 'Recevoir un email pour chaque nouvelle obligation' },
                { label: 'Échéances proches', desc: 'Alerte 7 jours avant une échéance réglementaire' },
                { label: 'Risques élevés', desc: 'Notification immédiate pour les obligations critiques' },
                { label: 'Résumé hebdomadaire', desc: 'Digest hebdomadaire de votre conformité' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
