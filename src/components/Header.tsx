'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();

  const navItems = [
    { label: 'Buy', href: '/properties?type=sale' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Land', href: '/land' },
    { label: 'Commercial', href: '/properties?type=commercial' },
    { label: 'Short Let', href: '/properties?type=short-let' },
    { label: 'Investment', href: '/diaspora' },
    { label: 'About', href: '/about' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="bg-[#fffff8] dark:bg-charcoal shadow-soft sticky top-0 z-50 transition-colors">
      {/* Top Bar */}
      <div className="bg-forest text-ivory text-xs py-2.5">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold tracking-wide">RC: 1856064</span>
            <span className="hidden sm:inline text-ivory/30">|</span>
            <span className="hidden sm:inline text-ivory/70">CAC Registered</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="hidden xl:flex items-center">
              <div className="scale-90">
                <ThemeToggle variant="forest" />
              </div>
            </div>
            <a
              href="tel:+2348065019971"
              className="text-ivory/70 hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3" />
              <span>0806 501 9971</span>
            </a>
            <a
              href="https://wa.me/2347041754800?text=Hello%2C%20I%27m%20interested%20in%20your%20properties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3.5 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo — fixed width so it doesn't push center */}
          <div className="flex-shrink-0 w-[180px]">
            <Logo size="md" />
          </div>

          {/* Desktop Nav — centered with even spacing */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 xl:px-4 py-2 text-charcoal dark:text-gray-100 hover:text-forest dark:hover:text-white font-medium transition-colors rounded-lg hover:bg-sage/10 dark:hover:bg-white/10 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA — fixed width right-aligned */}
          <div className="hidden xl:flex items-center gap-3 justify-end w-[300px]">
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-charcoal dark:text-white hover:text-forest font-semibold transition-colors text-sm"
                >
                  {profile?.first_name ? `Hi, ${profile.first_name}` : 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-charcoal transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-3 py-2 text-charcoal dark:text-white hover:text-forest font-semibold transition-colors text-sm whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-sm !px-4 !py-2.5 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link href="/list-property" className="btn-outline text-sm !px-3 !py-2 whitespace-nowrap">
              List Property
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal dark:text-white hover:bg-ivory dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-[#fffff8] dark:bg-charcoal animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-charcoal dark:text-gray-200 hover:text-forest dark:hover:text-forest font-medium rounded-lg hover:bg-sage/10 dark:hover:bg-gray-800 transition-colors"
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {!loading && user ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-3 text-forest font-semibold" onClick={closeMobile}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); closeMobile(); }}
                      className="block px-4 py-3 text-left text-gray-600 dark:text-gray-400 font-semibold w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin" className="block px-4 py-3 text-charcoal dark:text-gray-200 font-semibold" onClick={closeMobile}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="block px-4 py-3 text-forest font-semibold" onClick={closeMobile}>
                      Create Account
                    </Link>
                  </>
                )}
                <Link href="/list-property" className="btn-primary w-full text-center block mt-4" onClick={closeMobile}>
                  List Property
                </Link>
                <a
                  href="https://wa.me/2347041754800?text=Hello%2C%20I%27m%20interested%20in%20your%20properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white w-full py-3 rounded-lg font-semibold mt-2"
                  onClick={closeMobile}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
