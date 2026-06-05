'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Building2, Users, MapPin, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  companyName: z.string().min(2, 'Nom requis'),
  siret: z.string().optional(),
  sector: z.string().min(1, 'Secteur requis'),
  employeeCount: z.string().min(1, 'Requis'),
  country: z.string().default('France'),
  region: z.string().optional(),
  companyType: z.string().min(1, 'Requis'),
})

type FormData = z.infer<typeof schema>

const SECTORS = [
  { value: 'COMPTABILITE', label: 'Cabinet comptable' },
  { value: 'RH', label: 'Cabinet RH' },
  { value: 'BTP', label: 'BTP & Construction' },
  { value: 'COMMERCE', label: 'Commerce & Distribution' },
  { value: 'INDUSTRIE', label: 'Industrie & Manufacturing' },
  { value: 'IT', label: 'Technologies & IT' },
  { value: 'SANTE', label: 'Santé & Médical' },
  { value: 'FINANCE', label: 'Finance & Assurance' },
  { value: 'IMMOBILIER', label: 'Immobilier' },
  { value: 'RESTAURATION', label: 'Restauration & Hôtellerie' },
  { value: 'TRANSPORT', label: 'Transport & Logistique' },
  { value: 'AUTRE', label: 'Autre secteur' },
]

const EMPLOYEE_COUNTS = [
  { value: '1-9', label: '1 à 9 salariés (TPE)' },
  { value: '10-49', label: '10 à 49 salariés (PME)' },
  { value: '50-249', label: '50 à 249 salariés (PME)' },
  { value: '250-499', label: '250 à 499 salariés (ETI)' },
  { value: '500+', label: '500+ salariés (Grande entreprise)' },
]

const COMPANY_TYPES = [
  { value: 'SAS', label: 'SAS / SASU' },
  { value: 'SARL', label: 'SARL / EURL' },
  { value: 'SA', label: 'SA' },
  { value: 'SNC', label: 'SNC' },
  { value: 'EI', label: 'Entreprise individuelle' },
  { value: 'ASSOCIATION', label: 'Association' },
  { value: 'AUTRE', label: 'Autre' },
]

const steps = [
  { id: 1, title: 'Votre entreprise', icon: Building2, desc: 'Informations générales' },
  { id: 2, title: 'Secteur & Taille', icon: Users, desc: 'Activité et effectif' },
  { id: 3, title: 'Localisation', icon: MapPin, desc: 'Pays et région' },
]

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'France' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur')
      toast({ title: 'Profil créé !', description: 'Votre profil réglementaire est prêt.', variant: 'success' })
      router.push('/dashboard')
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de créer votre profil.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="w-full max-w-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Bienvenue sur Regula</h1>
        <p className="text-slate-400 mt-2">Configurez votre profil réglementaire en 3 étapes</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === s.id
                ? 'bg-blue-600 text-white'
                : step > s.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/10 text-slate-400'
            }`}>
              <s.icon className="w-3.5 h-3.5" />
              {s.title}
            </div>
            {i < steps.length - 1 && <div className="w-6 h-px bg-white/20" />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Votre entreprise</h2>
                <p className="text-sm text-gray-500">Ces informations permettent de personnaliser votre veille réglementaire</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="ACME SARL"
                    className="mt-1"
                  />
                  {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="siret">SIRET (optionnel)</Label>
                  <Input
                    id="siret"
                    {...register('siret')}
                    placeholder="12345678900012"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type d&apos;entreprise *</Label>
                  <Select onValueChange={(v) => setValue('companyType', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyType && <p className="text-xs text-red-500 mt-1">{errors.companyType.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Secteur & Effectif</h2>
                <p className="text-sm text-gray-500">Ces données déterminent les réglementations applicables</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Secteur d&apos;activité *</Label>
                  <Select onValueChange={(v) => setValue('sector', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner votre secteur..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sector && <p className="text-xs text-red-500 mt-1">{errors.sector.message}</p>}
                </div>
                <div>
                  <Label>Nombre de salariés *</Label>
                  <Select onValueChange={(v) => setValue('employeeCount', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_COUNTS.map(e => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeCount && <p className="text-xs text-red-500 mt-1">{errors.employeeCount.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Localisation</h2>
                <p className="text-sm text-gray-500">Pour afficher les réglementations régionales pertinentes</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Pays *</Label>
                  <Select onValueChange={(v) => setValue('country', v)} defaultValue="France">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">🇫🇷 France</SelectItem>
                      <SelectItem value="Belgique">🇧🇪 Belgique</SelectItem>
                      <SelectItem value="Suisse">🇨🇭 Suisse</SelectItem>
                      <SelectItem value="Luxembourg">🇱🇺 Luxembourg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Région (optionnel)</Label>
                  <Input
                    id="region"
                    {...register('region')}
                    placeholder="Île-de-France, Auvergne-Rhône-Alpes..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Profil réglementaire</span>
                </div>
                <p className="text-sm text-blue-700">
                  Regula va créer votre profil réglementaire personnalisé et configurer les alertes adaptées à votre entreprise.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" variant="primary" onClick={nextStep} className="flex-1">
                Suivant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" variant="gradient" loading={loading} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Créer mon profil
              </Button>
            )}
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500 mt-4">
        Vous pourrez modifier ces informations dans les paramètres
      </p>
    </div>
  )
}
