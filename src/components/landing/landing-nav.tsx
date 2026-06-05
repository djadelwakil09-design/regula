'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className={cn('text-xl font-bold', scrolled ? 'text-[#0F172A]' : 'text-white')}>Regula</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Fonctionnalités', 'Tarifs', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace('é', 'e').replace('è', 'e')}`}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                scrolled ? 'text-gray-600' : 'text-white/80 hover:text-white'
              )}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild className={scrolled ? '' : 'text-white hover:bg-white/10'}>
            <Link href="/sign-in">Connexion</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/sign-up">Essai gratuit</Link>
          </Button>
        </div>

        <button
          className={cn('md:hidden', scrolled ? 'text-[#0F172A]' : 'text-white')}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          {['Fonctionnalités', 'Tarifs', 'FAQ'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-700 font-medium py-2">
              {item}
            </a>
          ))}
          <div className="pt-3 border-t space-y-2">
            <Button variant="outline" asChild className="w-full">
              <Link href="/sign-in">Connexion</Link>
            </Button>
            <Button variant="gradient" asChild className="w-full">
              <Link href="/sign-up">Essai gratuit</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
