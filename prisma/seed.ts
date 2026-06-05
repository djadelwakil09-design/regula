import { PrismaClient, ImpactLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed regulation sources
  const sources = await Promise.all([
    prisma.regulationSource.upsert({
      where: { id: 'src-jo' },
      update: {},
      create: {
        id: 'src-jo',
        name: 'Journal Officiel',
        url: 'https://www.legifrance.gouv.fr',
        type: 'OFFICIAL_JOURNAL',
        country: 'France',
      },
    }),
    prisma.regulationSource.upsert({
      where: { id: 'src-urssaf' },
      update: {},
      create: {
        id: 'src-urssaf',
        name: 'URSSAF',
        url: 'https://www.urssaf.fr',
        type: 'GOVERNMENT',
        country: 'France',
      },
    }),
    prisma.regulationSource.upsert({
      where: { id: 'src-travail' },
      update: {},
      create: {
        id: 'src-travail',
        name: 'Ministère du Travail',
        url: 'https://travail-emploi.gouv.fr',
        type: 'GOVERNMENT',
        country: 'France',
      },
    }),
  ])

  // Seed sample regulations
  const regulations = [
    {
      id: 'reg-001',
      title: 'Revalorisation du SMIC au 1er novembre 2024',
      slug: 'revalorisation-smic-novembre-2024',
      summary: 'Le SMIC est revalorisé de 2% au 1er novembre 2024, portant le taux horaire brut à 11,88€.',
      aiSummary: 'Le gouvernement a annoncé une revalorisation automatique du SMIC de 2% à compter du 1er novembre 2024. Le nouveau taux horaire brut passe à 11,88€, soit un SMIC mensuel brut de 1 801,80€ pour 35h/semaine.',
      aiImpact: 'Impact direct sur la masse salariale des entreprises employant des salariés au SMIC. Nécessite une mise à jour des bulletins de paie et des contrats de travail au salaire minimum.',
      aiActions: JSON.stringify([
        'Mettre à jour les fiches de paie dès novembre 2024',
        'Vérifier tous les contrats dont le salaire est proche du SMIC',
        'Informer le service comptabilité de la revalorisation',
        'Mettre à jour les contrats en dessous du nouveau minimum',
      ]),
      aiChecklist: JSON.stringify([
        { id: '1', text: 'Identifier les salariés au SMIC', done: false },
        { id: '2', text: 'Mettre à jour les logiciels de paie', done: false },
        { id: '3', text: 'Informer les managers concernés', done: false },
        { id: '4', text: 'Vérifier la conformité des nouveaux bulletins', done: false },
      ]),
      aiRisks: 'Risque de contentieux prud\'homal et amendes en cas de non-conformité. Pénalités pouvant aller jusqu\'à 1 500€ par salarié concerné.',
      impactLevel: ImpactLevel.HIGH,
      sectors: ['ALL'],
      companySizes: ['ALL'],
      countries: ['France'],
      tags: ['SMIC', 'Paie', 'RH', 'Salaire'],
      publishedAt: new Date('2024-10-15'),
      effectiveDate: new Date('2024-11-01'),
      deadlineDate: new Date('2024-11-01'),
      sourceUrl: 'https://www.legifrance.gouv.fr',
      isAnalyzed: true,
      sourceId: 'src-jo',
    },
    {
      id: 'reg-002',
      title: 'Obligation de formation Cybersécurité - Directive NIS2',
      slug: 'directive-nis2-cybersecurite-2024',
      summary: 'La directive NIS2 impose de nouvelles obligations de cybersécurité aux entreprises de taille intermédiaire.',
      aiSummary: 'La directive européenne NIS2 (Network and Information Security) entre en vigueur et étend les obligations de cybersécurité à un plus grand nombre d\'entreprises. Les PME de secteurs critiques doivent mettre en place des mesures de sécurité renforcées.',
      aiImpact: 'Les entreprises concernées devront investir dans leur infrastructure de sécurité informatique, former leur personnel et mettre en place des procédures de notification d\'incidents.',
      aiActions: JSON.stringify([
        'Réaliser un audit de sécurité informatique',
        'Former les équipes à la cybersécurité',
        'Mettre en place une politique de gestion des incidents',
        'Désigner un responsable de la sécurité (RSSI)',
        'Tester les sauvegardes et plans de continuité',
      ]),
      aiChecklist: JSON.stringify([
        { id: '1', text: 'Audit de sécurité réalisé', done: false },
        { id: '2', text: 'Plan de formation cybersécurité créé', done: false },
        { id: '3', text: 'Politique de mot de passe mise à jour', done: false },
        { id: '4', text: 'Procédure de notification des incidents rédigée', done: false },
        { id: '5', text: 'RSSI ou prestataire désigné', done: false },
      ]),
      aiRisks: 'Sanctions pouvant aller jusqu\'à 10 millions d\'euros ou 2% du chiffre d\'affaires mondial. Responsabilité personnelle des dirigeants engagée.',
      impactLevel: ImpactLevel.CRITICAL,
      sectors: ['IT', 'FINANCE', 'SANTE', 'ENERGIE'],
      companySizes: ['PME', 'ETI', 'GE'],
      countries: ['France', 'EU'],
      tags: ['Cybersécurité', 'NIS2', 'RSSI', 'Conformité IT'],
      publishedAt: new Date('2024-10-17'),
      effectiveDate: new Date('2024-10-18'),
      deadlineDate: new Date('2025-01-01'),
      sourceUrl: 'https://www.ssi.gouv.fr',
      isAnalyzed: true,
      sourceId: 'src-jo',
    },
    {
      id: 'reg-003',
      title: 'Facturation électronique obligatoire - Grandes entreprises',
      slug: 'facturation-electronique-2025',
      summary: 'L\'obligation de facturation électronique s\'applique progressivement à toutes les entreprises à partir de 2025.',
      aiSummary: 'Le calendrier de déploiement de la facturation électronique obligatoire a été revu. Les grandes entreprises doivent émettre en format électronique dès septembre 2026, les PME en 2027.',
      aiImpact: 'Toutes les entreprises assujetties à la TVA devront adopter un système de facturation électronique via une plateforme agréée (PDP) ou le portail public Chorus Pro.',
      aiActions: JSON.stringify([
        'Choisir une Plateforme de Dématérialisation Partenaire (PDP)',
        'Mettre à jour le logiciel de facturation',
        'Former les équipes comptables',
        'Tester les flux avec les partenaires commerciaux',
        'Archiver les paramètres de configuration',
      ]),
      aiChecklist: JSON.stringify([
        { id: '1', text: 'PDP choisie et contractualisée', done: false },
        { id: '2', text: 'Logiciel de facturation mis à jour', done: false },
        { id: '3', text: 'Formation équipe comptable réalisée', done: false },
        { id: '4', text: 'Tests effectués avec clients/fournisseurs', done: false },
      ]),
      aiRisks: 'Amendes administratives en cas de non-conformité. Risque opérationnel lié à la continuité des flux de facturation.',
      impactLevel: ImpactLevel.HIGH,
      sectors: ['ALL'],
      companySizes: ['ALL'],
      countries: ['France'],
      tags: ['Facturation', 'TVA', 'Numérique', 'Comptabilité'],
      publishedAt: new Date('2024-09-01'),
      effectiveDate: new Date('2026-09-01'),
      deadlineDate: new Date('2026-09-01'),
      sourceUrl: 'https://www.impots.gouv.fr',
      isAnalyzed: true,
      sourceId: 'src-jo',
    },
  ]

  for (const reg of regulations) {
    await prisma.regulation.upsert({
      where: { id: reg.id },
      update: {},
      create: reg,
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
