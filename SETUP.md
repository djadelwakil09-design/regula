# Regula – Guide de déploiement

## Prérequis
- Node.js 20+
- PostgreSQL 15+
- Comptes : Clerk, OpenAI, Stripe

## 1. Installation

```bash
cd regula
npm install
```

## 2. Variables d'environnement

Copiez `.env.local` et remplissez :

### Clerk (auth.clerk.com)
1. Créez un projet → copiez `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY`
2. Dans Clerk Dashboard → Webhooks → ajoutez `https://votre-domaine.vercel.app/api/webhooks/clerk`
3. Copiez le webhook secret → `CLERK_WEBHOOK_SECRET`

### Base de données PostgreSQL
```
DATABASE_URL="postgresql://user:password@host:5432/regula"
```
Options : Neon.tech (gratuit), Railway, Supabase

### OpenAI
1. platform.openai.com → API Keys → `OPENAI_API_KEY`

### Stripe
1. dashboard.stripe.com → API Keys → clés publishable & secret
2. Créez 2 produits (Pro 99€/mois, Business 299€/mois)
3. Copiez les Price IDs → `STRIPE_PRO_PRICE_ID`, `STRIPE_BUSINESS_PRICE_ID`
4. Webhooks → `https://votre-domaine.vercel.app/api/webhooks/stripe`
   - Événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 3. Base de données

```bash
npm run db:generate    # génère le client Prisma
npm run db:push        # crée les tables
npm run db:seed        # données de démonstration
```

## 4. Développement local

```bash
npm run dev
# Ouvre http://localhost:3000
```

## 5. Déploiement Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Variables d'env → Vercel Dashboard → Settings → Environment Variables
# Ajoutez toutes les variables de .env.local
```

### Build command Vercel
```
prisma generate && next build
```

## Architecture fichiers

```
regula/
├── prisma/
│   ├── schema.prisma          # Schéma BDD complet
│   └── seed.ts                # Données de démo
├── src/
│   ├── app/
│   │   ├── (auth)/            # Sign-in, Sign-up
│   │   ├── (dashboard)/       # Dashboard, Réglementations, etc.
│   │   ├── api/               # API Routes
│   │   ├── onboarding/        # Wizard onboarding
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── sitemap.ts         # SEO sitemap
│   │   └── robots.ts          # SEO robots
│   ├── components/
│   │   ├── ui/                # Composants Shadcn UI
│   │   ├── dashboard/         # Composants dashboard
│   │   ├── landing/           # Sections landing page
│   │   ├── compliance/        # Conformité & réglementations
│   │   └── shared/            # Sidebar, Header
│   ├── lib/
│   │   ├── ai/openai.ts       # Intégration OpenAI
│   │   ├── stripe/index.ts    # Intégration Stripe
│   │   ├── db.ts              # Client Prisma
│   │   └── utils.ts           # Utilitaires
│   ├── hooks/
│   │   └── use-toast.ts       # Toast notifications
│   ├── middleware.ts           # Auth middleware Clerk
│   └── types/index.ts         # Types TypeScript
```

## Tables BDD (Prisma)

| Table | Description |
|-------|-------------|
| User | Utilisateurs (liés à Clerk) |
| Company | Profil entreprise |
| Regulation | Réglementations |
| RegulationSource | Sources de veille |
| CompanyRegulation | Statut conformité par entreprise |
| Task | Tâches de conformité |
| ComplianceScore | Score historique |
| Notification | Alertes |
| Document | Documents uploadés |
| DocumentAnalysis | Analyses IA |
| Subscription | Abonnements Stripe |
| AuditLog | Journal d'audit |

## API Routes

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/onboarding` | POST | Créer profil entreprise |
| `/api/regulations` | GET/POST | Lister/créer réglementations |
| `/api/regulations/[slug]` | GET/POST | Détail + analyse IA |
| `/api/tasks` | GET/POST/PATCH | Gestion tâches |
| `/api/documents` | GET/POST | Upload + analyse IA |
| `/api/assistant` | POST | Chat IA |
| `/api/alerts` | GET | Notifications |
| `/api/stripe/checkout` | POST | Session Stripe |
| `/api/stripe/portal` | POST | Portail client |
| `/api/webhooks/stripe` | POST | Events Stripe |
| `/api/webhooks/clerk` | POST | Events Clerk |

## Sécurité

- ✅ Authentification Clerk (JWT, MFA)
- ✅ Middleware RBAC (User/Admin/Super Admin)
- ✅ Validation Zod sur toutes les API routes
- ✅ Protection CSRF (Next.js natif)
- ✅ Vérification signature webhooks Stripe
- ✅ Audit logs sur toutes les actions
- ✅ Rate limiting (à configurer sur Vercel Edge)
