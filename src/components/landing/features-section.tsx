import {
  Shield, Bell, MessageSquare, Upload, BarChart3,
  Calendar, CheckSquare, Zap,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Centre de conformité',
    desc: 'Chaque réglementation dispose d\'une page dédiée avec résumé IA, checklist et statut de conformité personnalisé.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Bell,
    title: 'Alertes intelligentes',
    desc: 'Notifications email et dashboard pour chaque nouvelle obligation, échéance approchante ou risque élevé.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: MessageSquare,
    title: 'Assistant IA',
    desc: '"Que dois-je faire avant septembre ?" L\'IA répond instantanément en tenant compte du contexte de votre entreprise.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Upload,
    title: 'Analyse de documents',
    desc: 'Uploadez vos contrats, règlements ou politiques. L\'IA identifie les manquements et propose des améliorations.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: BarChart3,
    title: 'Score de conformité',
    desc: 'Suivez votre progression avec un score global et par domaine (RH, fiscal, RGPD, cybersécurité...).',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Calendar,
    title: 'Calendrier réglementaire',
    desc: 'Vue mensuelle de toutes vos échéances. Ne manquez plus jamais une date limite réglementaire.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: CheckSquare,
    title: 'Gestion des tâches',
    desc: 'Liste de tâches priorisée automatiquement. Déléguez, suivez l\'avancement et marquez comme conforme.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Zap,
    title: 'Intégration facile',
    desc: 'Connectez vos outils métier. API disponible en plan Business pour intégrer Regula à votre workflow.',
    color: 'bg-yellow-50 text-yellow-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Fonctionnalités</span>
          <h2 className="text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            Tout ce dont vous avez besoin
            <br />
            pour rester en conformité
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            De la veille automatique à la mise en conformité opérationnelle,
            Regula couvre l&apos;intégralité du cycle réglementaire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
