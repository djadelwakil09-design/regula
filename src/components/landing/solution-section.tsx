import { Sparkles, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Veille automatique 24/7',
    desc: 'Regula surveille en continu plus de 50 sources officielles : Journal Officiel, URSSAF, Ministère du Travail, Legifrance, et bien d\'autres.',
  },
  {
    number: '02',
    title: 'Analyse IA personnalisée',
    desc: 'Notre IA (GPT-4) analyse chaque réglementation et détermine précisément son impact sur votre entreprise selon votre secteur, taille et région.',
  },
  {
    number: '03',
    title: 'Actions concrètes générées',
    desc: 'Pour chaque obligation, Regula génère automatiquement une liste d\'actions priorisées, une checklist et les risques en cas de non-conformité.',
  },
  {
    number: '04',
    title: 'Alertes et suivi',
    desc: 'Recevez des alertes par email et dashboard, suivez votre progression et maintenez un score de conformité optimal.',
  },
]

export function SolutionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">La solution</span>
            <h2 className="text-4xl font-bold text-[#0F172A] mt-4 mb-6">
              Regula fait la veille.
              <br />
              Vous faites l&apos;essentiel.
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              En 10 minutes par semaine, restez en conformité avec toutes les réglementations qui impactent votre activité. Notre IA fait le travail complexe à votre place.
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-full mx-auto bg-blue-100 mt-2 ml-5" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold text-[#0F172A] mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Analyse IA en temps réel</span>
              </div>

              {/* AI analysis card mockup */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xs text-red-400 font-bold">!</div>
                    <div>
                      <p className="text-white text-sm font-medium">Directive NIS2 — Cybersécurité</p>
                      <p className="text-slate-400 text-xs mt-0.5">Échéance : 18 octobre 2024</p>
                    </div>
                    <div className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Critique</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-slate-300 text-xs font-medium uppercase tracking-wide">Actions générées par IA</p>
                  {[
                    'Désigner un RSSI ou prestataire',
                    'Réaliser un audit de sécurité',
                    'Former les équipes (8h min.)',
                    'Rédiger la politique de sécurité',
                  ].map((action, i) => (
                    <div key={action} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{action}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span className="text-emerald-400 text-sm">Score conformité</span>
                  <span className="text-emerald-400 font-bold text-lg">86%</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border">
              <p className="text-xs text-gray-500">Nouvelles réglementations</p>
              <p className="text-2xl font-bold text-[#0F172A]">3 <span className="text-sm text-emerald-500 font-normal">aujourd&apos;hui</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
