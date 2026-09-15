'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();

  const navItems = [
    { label: 'Buy', href: '/properties?type=sale' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Land', href: '/properties?type=land' },
    { label: 'Developments', href: '/developments' },
    { label: 'Insights', href: '/insights' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="bg-charcoal text-white text-xs py-2">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">RC: 1856064</span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="hidden sm:inline text-gray-300">CAC Registered</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+2348065019971" className="text-gray-300 hover:text-white transition-colors hidden sm:inline">+234 806 501 9971</a>
            <a href="https://wa.me/2348065019971" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors font-semibold">💬 WhatsApp</a>
          </div>
        </div>
      </div>

      <nav className="container-custom border-b border-gray-100">
        <div className="flex items-center justify-between h-20">
          <Logo size="md" />

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="px-4 py-2 text-charcoal hover:text-forest font-medium transition-colors rounded-lg hover:bg-sage/10">{item.label}</Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2.5 text-charcoal hover:text-forest font-semibold transition-colors">
                  {profile?.first_name ? `Hi, ${profile.first_name}` : 'Dashboard'}
                </Link>
                <button onClick={() => signOut()} className="px-3 py-2 text-sm text-gray-600 hover:text-charcoal">Sign Out</button>
              </>
            ) : (
              <Link href="/signin" className="px-5 py-2.5 text-charcoal hover:text-forest font-semibold transition-colors">Sign In</Link>
            )}
            <Link href="/list-property" className="btn-primary">List Property</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-ivory" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="px-4 py-3 text-charcoal hover:text-forest font-medium rounded-lg hover:bg-sage/10 transition-colors" onClick={closeMobile}>{item.label}</Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {!loading && user ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-3 text-forest font-semibold" onClick={closeMobile}>Dashboard</Link>
                    <button onClick={() => { signOut(); closeMobile(); }} className="block px-4 py-3 text-left text-gray-600 font-semibold w-full">Sign Out</button>
                  </>
                ) : (
                  <Link href="/signin" className="block px-4 py-3 text-charcoal font-semibold" onClick={closeMobile}>Sign In</Link>
                )}
                <Link href="/list-property" className="btn-primary w-full text-center block" onClick={closeMobile}>List Property</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
