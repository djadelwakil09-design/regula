import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '5 alertes par mois',
      'Tableau de bord basique',
      'Veille réglementaire limitée',
      'Support communautaire',
    ],
    limits: { alertsPerMonth: 5, aiAnalysis: false, multiUser: false },
  },
  PRO: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Alertes illimitées',
      'IA avancée (GPT-4)',
      'Analyse de documents',
      'Assistant IA',
      'Calendrier réglementaire',
      'Export PDF',
      'Support prioritaire',
    ],
    limits: { alertsPerMonth: Infinity, aiAnalysis: true, multiUser: false },
  },
  BUSINESS: {
    name: 'Business',
    price: 299,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      'Tout le plan Pro',
      'Multi-utilisateurs (10)',
      'API RESTful',
      'Exports avancés',
      'Rapport de conformité',
      'Onboarding dédié',
      'Support SLA 24h',
      'Audit logs',
    ],
    limits: { alertsPerMonth: Infinity, aiAnalysis: true, multiUser: true },
  },
} as const

export type PlanKey = keyof typeof PLANS

export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: 'PRO' | 'BUSINESS',
  successUrl: string,
  cancelUrl: string
) {
  const priceId = PLANS[plan].priceId
  if (!priceId) throw new Error('Invalid plan')

  return stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, plan },
    subscription_data: {
      metadata: { userId, plan },
      trial_period_days: 14,
    },
    allow_promotion_codes: true,
  })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}
