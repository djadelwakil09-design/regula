import Link from 'next/link'
import { ArrowRight, Shield, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  'Veille réglementaire automatique',
  'Actions IA personnalisées',
  'Alertes en temps réel',
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-sm text-blue-300 font-medium">Propulsé par GPT-4 — Conformité intelligente</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Anticipez les règles.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Gardez une longueur
          </span>
          <br />
          d&apos;avance.
        </h1>

        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Regula transforme automatiquement les changements réglementaires en{' '}
          <strong className="text-white">actions concrètes et prioritaires</strong>{' '}
          pour votre entreprise. Fini les surprises. Fini les amendes.
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {h}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="xl" variant="gradient" asChild className="shadow-2xl shadow-blue-500/25">
            <Link href="/sign-up">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="#fonctionnalites">Voir une démo</Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Données hébergées en France</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <span>RGPD conforme</span>
          <div className="w-px h-4 bg-slate-700" />
          <span>14 jours d&apos;essai gratuit</span>
          <div className="w-px h-4 bg-slate-700" />
          <span>Sans carte bancaire</span>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-[#1E293B]/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0F172A]/50">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 mx-4 bg-white/10 rounded px-3 py-1 text-xs text-slate-400">
                app.regula.fr/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'Score conformité', value: '86%', color: 'text-emerald-400' },
                { label: 'Réglementations', value: '24', color: 'text-blue-400' },
                { label: 'Tâches en attente', value: '7', color: 'text-amber-400' },
                { label: 'Alertes critiques', value: '2', color: 'text-red-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-left">
                  <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white/5 rounded-xl p-4 h-32" />
              <div className="bg-white/5 rounded-xl p-4 h-32" />
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-emerald-500/20 rounded-2xl blur-xl -z-10" />
        </div>
      </div>
    </section>
  )
}
