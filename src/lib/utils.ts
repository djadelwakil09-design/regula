import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatRelativeDate(date: Date | string) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Demain'
  if (diffDays < 7) return `Dans ${diffDays} jours`
  if (diffDays < 30) return `Dans ${Math.ceil(diffDays / 7)} semaine${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`
  if (diffDays < 365) return `Dans ${Math.ceil(diffDays / 30)} mois`
  return `Dans ${Math.ceil(diffDays / 365)} an${Math.ceil(diffDays / 365) > 1 ? 's' : ''}`
}

export function getImpactColor(level: string) {
  switch (level) {
    case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200'
    case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getImpactLabel(level: string) {
  switch (level) {
    case 'CRITICAL': return 'Critique'
    case 'HIGH': return 'Élevé'
    case 'MEDIUM': return 'Moyen'
    case 'LOW': return 'Faible'
    default: return level
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case 'TODO': return 'À faire'
    case 'IN_PROGRESS': return 'En cours'
    case 'COMPLIANT': return 'Conforme'
    case 'NON_COMPLIANT': return 'Non conforme'
    case 'DONE': return 'Terminé'
    default: return status
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'TODO': return 'text-gray-600 bg-gray-100'
    case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50'
    case 'COMPLIANT': case 'DONE': return 'text-green-600 bg-green-50'
    case 'NON_COMPLIANT': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + '...' : str
}
