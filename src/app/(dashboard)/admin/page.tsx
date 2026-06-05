import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Header } from '@/components/shared/header'

export const metadata: Metadata = { title: 'Administration' }

export default async function AdminPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) redirect('/dashboard')

  const [userCount, regulationCount, companyCount] = await Promise.all([
    db.user.count(),
    db.regulation.count(),
    db.company.count(),
  ])

  const recentUsers = await db.user.findMany({
    include: { company: true, subscription: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="p-8 space-y-6">
      <Header title="Administration" subtitle="Gestion de la plateforme Regula" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Utilisateurs', value: userCount },
          { label: 'Réglementations', value: regulationCount },
          { label: 'Entreprises', value: companyCount },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-[#0F172A]">Utilisateurs récents</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {['Email', 'Entreprise', 'Plan', 'Inscrit'].map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">{u.company?.name || '—'}</td>
                <td className="px-6 py-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {u.subscription?.plan || 'FREE'}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
