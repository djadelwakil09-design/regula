'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface AnalysisResult {
  id: string
  name: string
  status: string
  analysis?: {
    summary: string
    missingElements: string[]
    improvements: string[]
    complianceIssues: string[]
    score: number
  }
}

export function DocumentUpload() {
  const [dragging, setDragging] = useState(false)
  const [documents, setDocuments] = useState<AnalysisResult[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uploadFile = async (file: File) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({ title: 'Format non supporté', description: 'Seuls les fichiers PDF et DOCX sont acceptés.', variant: 'destructive' })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'contract')

    const tempId = Date.now().toString()
    setDocuments(prev => [...prev, { id: tempId, name: file.name, status: 'ANALYZING' }])

    try {
      const res = await fetch('/api/documents', { method: 'POST', body: formData })
      const data = await res.json()

      setDocuments(prev => prev.map(d =>
        d.id === tempId
          ? {
              id: data.id,
              name: data.originalName,
              status: data.status,
              analysis: data.analysis ? {
                summary: data.analysis.summary,
                missingElements: data.analysis.missingElements || [],
                improvements: data.analysis.improvements || [],
                complianceIssues: data.analysis.complianceIssues || [],
                score: data.analysis.score || 0,
              } : undefined,
            }
          : d
      ))

      toast({ title: 'Document analysé !', description: `${file.name} a été analysé par l'IA.`, variant: 'success' })
    } catch {
      setDocuments(prev => prev.filter(d => d.id !== tempId))
      toast({ title: 'Erreur', description: 'Impossible d\'analyser ce document.', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <Card
        className={cn(
          'border-2 border-dashed transition-all duration-200 cursor-pointer',
          dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="py-12 text-center">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors',
            dragging ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <Upload className={cn('w-7 h-7', dragging ? 'text-blue-600' : 'text-gray-400')} />
          </div>
          <p className="font-semibold text-[#0F172A] mb-1">
            {dragging ? 'Déposez le fichier ici' : 'Glissez-déposez votre document'}
          </p>
          <p className="text-sm text-gray-400 mb-4">PDF ou DOCX — Max 10 Mo</p>
          <Button variant="outline" size="sm" disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Parcourir les fichiers
          </Button>
          <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onFileChange} />
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Upload, title: 'Upload', desc: 'Importez votre document PDF ou DOCX' },
          { icon: Brain, title: 'Analyse IA', desc: 'L\'IA analyse la conformité en temps réel' },
          { icon: CheckCircle, title: 'Rapport', desc: 'Recevez les recommandations détaillées' },
        ].map((step) => (
          <Card key={step.title}>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-sm text-[#0F172A]">{step.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#0F172A]">Documents analysés</h3>
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{doc.name}</CardTitle>
                      {doc.analysis && (
                        <p className="text-xs text-gray-400 mt-0.5">Score de conformité : {doc.analysis.score}%</p>
                      )}
                    </div>
                  </div>
                  {doc.status === 'ANALYZING' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  {doc.status === 'ANALYZED' && <Badge variant="success">Analysé</Badge>}
                  {doc.status === 'ERROR' && <Badge variant="destructive">Erreur</Badge>}
                </div>
              </CardHeader>
              {doc.analysis && (
                <CardContent className="pt-0 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Résumé IA</p>
                    <p className="text-sm text-gray-700">{doc.analysis.summary}</p>
                  </div>
                  {doc.analysis.missingElements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-2">
                        <AlertCircle className="w-3.5 h-3.5" /> Éléments manquants
                      </p>
                      <ul className="space-y-1.5">
                        {doc.analysis.missingElements.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {doc.analysis.improvements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 mb-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Améliorations suggérées
                      </p>
                      <ul className="space-y-1.5">
                        {doc.analysis.improvements.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">→</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
