import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Directrice RH',
    company: 'Cabinet Martin & Associés',
    avatar: 'MD',
    text: 'Regula a transformé notre façon de gérer la conformité RH. On est passé de 3 jours de veille manuelle par mois à 30 minutes de revue hebdomadaire. L\'IA détecte tout avant nous.',
    stars: 5,
  },
  {
    name: 'Thomas Bernard',
    role: 'Expert-Comptable',
    company: 'Fiduciaire Bernard',
    avatar: 'TB',
    text: 'Enfin un outil qui comprend notre secteur ! Les alertes sont pertinentes, les actions concrètes. J\'ai évité plusieurs amendes en 6 mois. Mon retour sur investissement est évident.',
    stars: 5,
  },
  {
    name: 'Sophie Mercier',
    role: 'Responsable Juridique',
    company: 'BTP Conseil Group',
    avatar: 'SM',
    text: 'Le BTP est particulièrement complexe réglementairement. Regula agrège les règles DUERP, SST, urbanisme, droit du travail... Notre score de conformité est passé de 58% à 84% en 4 mois.',
    stars: 5,
  },
  {
    name: 'Laurent Klein',
    role: 'DAF',
    company: 'Groupe Klein Industries',
    avatar: 'LK',
    text: 'L\'assistant IA est bluffant. Je lui pose des questions précises sur nos obligations et il répond en tenant compte du contexte de notre entreprise. C\'est comme avoir un juriste interne.',
    stars: 5,
  },
  {
    name: 'Amina Diallo',
    role: 'Gérante',
    company: 'Cabinet Diallo & Co',
    avatar: 'AD',
    text: 'Simple, efficace, indispensable. Regula m\'a permis de me concentrer sur mon cœur de métier sans stress réglementaire. La facturation électronique, on l\'a anticipé 8 mois à l\'avance.',
    stars: 5,
  },
  {
    name: 'Pierre Fontaine',
    role: 'DRH',
    company: 'Fontaine Distribution',
    avatar: 'PF',
    text: 'L\'onboarding prend 5 minutes et le profil réglementaire est immédiatement opérationnel. En une semaine, j\'avais une vue complète de mes obligations. Du jamais vu dans ma carrière.',
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Témoignages</span>
          <h2 className="text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            Plus de 500 entreprises nous font confiance
          </h2>
          <p className="text-lg text-gray-500">PME, cabinets, ETI — ils ont transformé leur conformité avec Regula</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} — {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
