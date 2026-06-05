import { SignUp } from '@clerk/nextjs'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">Regula</span>
      </Link>
      <p className="text-slate-300 mb-6 text-center max-w-sm">
        Démarrez votre essai gratuit de 14 jours.<br />
        <span className="text-slate-400 text-sm">Sans carte bancaire requise.</span>
      </p>
      <SignUp />
      <p className="text-slate-500 text-xs mt-6">
        Déjà un compte ?{' '}
        <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">Se connecter</Link>
      </p>
    </div>
  )
}
