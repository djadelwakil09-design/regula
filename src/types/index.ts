export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED'
export type ComplianceStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLIANT' | 'NON_COMPLIANT'
export type SubscriptionPlan = 'FREE' | 'PRO' | 'BUSINESS'
export type NotificationType = 'NEW_REGULATION' | 'DEADLINE_APPROACHING' | 'HIGH_RISK' | 'TASK_DUE' | 'SYSTEM'

export interface RegulationCard {
  id: string
  title: string
  slug: string
  summary: string
  impactLevel: ImpactLevel
  effectiveDate: string | null
  deadlineDate: string | null
  sectors: string[]
  tags: string[]
  isAnalyzed: boolean
  status?: ComplianceStatus
}

export interface DashboardStats {
  complianceScore: number
  totalRegulations: number
  pendingTasks: number
  criticalAlerts: number
  recentRegulations: RegulationCard[]
  upcomingDeadlines: Array<{
    id: string
    title: string
    deadlineDate: string
    impactLevel: ImpactLevel
  }>
}

export interface OnboardingData {
  companyName: string
  siret?: string
  sector: string
  employeeCount: string
  country: string
  region?: string
  companyType: string
  website?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
