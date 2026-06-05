'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/stripe'
import { cn } from '@/lib/utils'

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const discount = billing === 'annual' ? 0.8 : 1

  return (
    <section id="tarifs" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Tarifs</span>
          <h2 className="text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            Des prix transparents,<br />sans surprise
          </h2>
          <p className="text-lg text-gray-500">14 jours d&apos;essai gratuit. Annulation à tout moment.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-white border rounded-xl p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', billing === 'monthly' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500')}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', billing === 'annual' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500')}
            >
              Annuel
              <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-sm font-medium text-gray-500 mb-1">{PLANS.FREE.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#0F172A]">0€</span>
              <span className="text-gray-400 mb-1">/mois</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Pour découvrir Regula</p>
            <Button variant="outline" asChild className="w-full mb-6">
              <Link href="/sign-up">Commencer gratuitement</Link>
            </Button>
            <ul className="space-y-3">
              {PLANS.FREE.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro - highlighted */}
          <div className="relative bg-gradient-to-b from-[#0F172A] to-[#1E293B] rounded-2xl p-8 shadow-2xl shadow-blue-900/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Populaire
              </span>
            </div>
            <p className="text-sm font-medium text-blue-400 mb-1">{PLANS.PRO.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-white">
                {Math.round(PLANS.PRO.price * discount)}€
              </span>
              <span className="text-slate-400 mb-1">/mois</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">Pour les PME et cabinets</p>
            <Button variant="gradient" asChild className="w-full mb-6 shadow-lg shadow-blue-500/25">
              <Link href="/sign-up?plan=pro">Essayer 14 jours gratuit</Link>
            </Button>
            <ul className="space-y-3">
              {PLANS.PRO.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-sm font-medium text-gray-500 mb-1">{PLANS.BUSINESS.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#0F172A]">
                {Math.round(PLANS.BUSINESS.price * discount)}€
              </span>
              <span className="text-gray-400 mb-1">/mois</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Pour les ETI et groupes</p>
            <Button variant="default" asChild className="w-full mb-6">
              <Link href="/sign-up?plan=business">Démarrer l&apos;essai</Link>
            </Button>
            <ul className="space-y-3">
              {PLANS.BUSINESS.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Tous les plans incluent le chiffrement SSL, la conformité RGPD et un accès à notre base de réglementations françaises.
        </p>
      </div>
    </section>
  )
}
