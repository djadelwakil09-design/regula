import { XCircle, Clock, AlertTriangle, TrendingDown } from 'lucide-react'

const problems = [
  {
    icon: XCircle,
    title: 'Réglementations introuvables',
    desc: 'Les textes officiels sont éparpillés entre Legifrance, l\'URSSAF, la DGT et des dizaines de sources. Impossible à suivre manuellement.',
    color: 'text-red-500 bg-red-50',
  },
  {
    icon: Clock,
    title: 'Délais manqués',
    desc: 'Un simple retard dans la mise en conformité peut coûter des milliers d\'euros d\'amendes et exposer votre entreprise à des contrôles.',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    icon: AlertTriangle,
    title: 'Impact impossible à évaluer',
    desc: 'Même quand vous trouvez un texte réglementaire, déterminer son impact réel sur votre activité demande des heures d\'analyse juridique.',
    color: 'text-orange-500 bg-orange-50',
  },
  {
    icon: TrendingDown,
    title: 'Conformité stagnante',
    desc: 'Sans suivi structuré, votre niveau de conformité régresse progressivement à mesure que de nouvelles obligations s\'accumulent.',
    color: 'text-blue-500 bg-blue-50',
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">Le problème</span>
          <h2 className="text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            La conformité réglementaire est un casse-tête
            <br />
            <span className="text-gray-400">pour les PME</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            En France, une entreprise est soumise à plus de 400 réglementations différentes.
            Et chaque mois, des dizaines de nouvelles obligations entrent en vigueur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-4`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-8 py-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">
              72% des PME n&apos;ont pas connaissance des réglementations qui les concernent.
              <span className="text-red-500"> (Source : INSEE 2024)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
