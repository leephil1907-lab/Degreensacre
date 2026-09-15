'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Buy', href: '/properties?type=sale' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Land', href: '/properties?type=land' },
    { label: 'Developments', href: '/developments' },
    { label: 'Insights', href: '/insights' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-charcoal hover:text-forest font-medium transition-colors rounded-lg hover:bg-sage/10"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/signin"
              className="px-5 py-2.5 text-charcoal hover:text-forest font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link href="/list-property" className="btn-primary">
              List Property
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-ivory"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-charcoal hover:text-forest font-medium rounded-lg hover:bg-sage/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  href="/signin"
                  className="block px-4 py-3 text-charcoal font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/list-property"
                  className="btn-primary w-full text-center block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  List Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
