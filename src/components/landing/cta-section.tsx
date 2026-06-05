import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 mb-8">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à anticiper vos
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            obligations réglementaires ?
          </span>
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Rejoignez plus de 500 entreprises qui ont transformé leur conformité avec Regula.
          Commencez gratuitement, sans carte bancaire.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" variant="gradient" asChild className="shadow-2xl">
            <Link href="/sign-up">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 bg-transparent">
            <Link href="/sign-in">J&apos;ai déjà un compte</Link>
          </Button>
        </div>
        <p className="text-slate-500 text-sm mt-6">
          14 jours d&apos;essai Pro gratuit · Sans engagement · RGPD conforme
        </p>
      </div>
    </section>
  )
}
