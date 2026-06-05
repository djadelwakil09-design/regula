import Link from 'next/link'
import { Shield } from 'lucide-react'

const links = {
  Produit: ['Fonctionnalités', 'Tarifs', 'Changelog', 'Roadmap'],
  Ressources: ['Documentation', 'API', 'Blog', 'Status'],
  Légal: ['Confidentialité', 'CGU', 'Mentions légales', 'RGPD'],
  Secteurs: ['Comptabilité', 'Ressources humaines', 'BTP', 'Finance'],
}

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Regula</span>
            </div>
            <p className="text-sm leading-relaxed">
              L&apos;assistant IA de veille réglementaire pour les PME françaises.
            </p>
            <p className="text-xs mt-4">🇫🇷 Hébergé en France</p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white font-semibold text-sm mb-4">{category}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2024 Regula. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-xs">
            <span>Conforme RGPD</span>
            <span>ISO 27001</span>
            <span>Données chiffrées AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
