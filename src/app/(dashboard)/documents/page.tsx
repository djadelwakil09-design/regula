import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { DocumentUpload } from '@/components/dashboard/document-upload'

export const metadata: Metadata = { title: 'Documents' }

export default function DocumentsPage() {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <Header title="Espace Documents" subtitle="Uploadez vos documents pour une analyse IA de conformité" />
      <DocumentUpload />
    </div>
  )
}
