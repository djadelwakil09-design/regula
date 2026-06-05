import { Metadata } from 'next'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export const metadata: Metadata = { title: 'Configuration de votre profil | Regula' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-6">
      <OnboardingWizard />
    </div>
  )
}
