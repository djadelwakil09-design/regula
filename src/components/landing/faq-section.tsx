'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Regula couvre-t-il tous les secteurs d\'activité ?',
    a: 'Oui. Regula surveille les réglementations transversales (droit du travail, fiscal, RGPD, cybersécurité) et les réglementations sectorielles (BTP, santé, finance, comptabilité, RH, commerce, industrie...). Lors de l\'onboarding, vous renseignez votre secteur et Regula filtre les réglementations pertinentes pour vous.',
  },
  {
    q: 'Comment l\'IA analyse-t-elle les réglementations ?',
    a: 'Regula utilise GPT-4 (OpenAI) pour analyser chaque texte réglementaire. L\'IA tient compte de votre profil entreprise (secteur, taille, région, type) pour déterminer les obligations qui vous concernent, évaluer l\'impact et générer des actions concrètes et priorisées.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Absolument. Vos données sont hébergées en France (Vercel/AWS eu-west-3), chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous sommes conformes au RGPD et n\'utilisons jamais vos données pour entraîner des modèles IA. Vous pouvez demander la suppression de vos données à tout moment.',
  },
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: 'Oui, sans engagement ni frais. Vous pouvez annuler depuis votre espace facturation. Votre accès reste actif jusqu\'à la fin de la période facturée. Aucune rétention de données après suppression de compte.',
  },
  {
    q: 'L\'essai gratuit nécessite-t-il une carte bancaire ?',
    a: 'Non. Vous pouvez créer un compte et accéder au plan Free sans carte bancaire. L\'essai Pro de 14 jours ne nécessite une carte qu\'à la fin de la période d\'essai, et vous pouvez annuler avant d\'être facturé.',
  },
  {
    q: 'Proposez-vous un support pour la mise en place ?',
    a: 'Le plan Pro inclut un support prioritaire par email (réponse sous 24h). Le plan Business inclut un onboarding dédié avec un expert Regula, la configuration personnalisée et un support SLA 24h en semaine.',
  },
  {
    q: 'Regula remplace-t-il un conseiller juridique ?',
    a: 'Non, Regula est un outil de veille et d\'aide à la décision. Pour des questions juridiques complexes ou litigieuses, nous recommandons de consulter un avocat ou expert-comptable. Regula vous permet de ne jamais manquer une obligation et d\'être toujours informé — mais ne se substitue pas à un conseil juridique professionnel.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">FAQ</span>
          <h2 className="text-4xl font-bold text-[#0F172A] mt-4">Questions fréquentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#0F172A] pr-4">{faq.q}</span>
                <ChevronDown className={cn('w-4 h-4 text-gray-400 shrink-0 transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
