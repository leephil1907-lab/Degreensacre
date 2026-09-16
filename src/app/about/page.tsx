'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import CACIcon from '@/components/CACIcon';
import { Shield, MapPin, FileCheck, Eye, Key, Handshake, BarChart3, TreePine, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-forest text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-4">ABOUT US</p>
            <h1 className="font-display text-5xl md:text-6xl mb-6">De-Greenacres Properties Limited</h1>
            <p className="text-xl text-white/80 leading-relaxed mb-4">
              Real estate. Verified opportunities. Professional guidance.
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              Building systems that create security, wealth and long-term impact through real estate.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <CACIcon className="w-5 h-5" />
                <span className="text-sm font-medium">RC: 1856064</span>
              </div>
              <span className="text-sm text-white/60">CAC Registered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em]">OUR STORY</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal">Helping you find, verify &amp; own property in Nigeria</h2>
              <p>
                De-Greenacres Properties Limited was founded with a clear purpose: to make property ownership in Nigeria transparent, secure and accessible. Too many Nigerians — at home and in the diaspora — have lost money to unverified land, unclear documentation and unprofessional agents. We exist to change that.
              </p>
              <p>
                As a CAC-registered company (RC: 1856064), we operate with accountability. Every property in our catalogue goes through a review process. We help clients understand documentation before they commit. We arrange physical inspections. And we stay involved from the first enquiry to the final handover.
              </p>
              <p>
                Our presence spans Lagos, Abuja, Uyo, Port Harcourt, Asaba, Enugu and the Southeast — Nigeria&apos;s most dynamic real estate markets. Whether you&apos;re buying your first plot of land, investing in rental income, or purchasing a family home from abroad, De-Greenacres is here to guide you.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A Nigeria where property ownership is transparent, secure and accessible to everyone — at home and in the diaspora.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-sage/20 rounded-xl flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To help individuals, families and investors find, verify and own property in Nigeria with confidence — through professional guidance, honest information and physical inspections.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-5">
                  <CheckCircle className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">Our Values</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-forest mt-1 flex-shrink-0" /> Transparency in every transaction</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-forest mt-1 flex-shrink-0" /> Verification before commitment</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-forest mt-1 flex-shrink-0" /> Professional accountability</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-forest mt-1 flex-shrink-0" /> Long-term client relationships</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">WHAT WE DO</p>
              <h2 className="font-display text-4xl text-charcoal mb-4">Full-service property company</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">We don&apos;t just list properties. We help you buy, verify, inspect, manage and invest.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: TreePine, title: 'Land Sales', desc: 'Verified plots with clear documentation across Nigeria.' },
              { icon: MapPin, title: 'Property Sales', desc: 'Homes, duplexes and apartments in prime locations.' },
              { icon: BarChart3, title: 'Investment Advisory', desc: 'Co-ownership, land banking and development projects.' },
              { icon: Eye, title: 'Property Inspection', desc: 'Physical site visits with professional guidance (₦20,000).' },
              { icon: FileCheck, title: 'Documentation Assistance', desc: 'Help understanding C of O, Governor\'s Consent and titles.' },
              { icon: Key, title: 'Property Management', desc: 'We manage properties for owners who can\'t be on-site.' },
              { icon: Handshake, title: 'Co-Ownership', desc: 'Shared investment opportunities for groups and families.' },
              { icon: Shield, title: 'Diaspora Services', desc: 'End-to-end support for Nigerians buying from abroad.' },
              { icon: BarChart3, title: 'Property Valuation', desc: 'Market-based valuations for informed decisions.' },
            ].map((service, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-forest transition-all">
                    <service.icon className="w-5 h-5 text-forest group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Presence */}
      <section className="section-padding bg-forest text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-3">OUR PRESENCE</p>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Where we operate</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">Active operations and representatives across Nigeria&apos;s key markets.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Lagos', focus: 'Residential & Commercial' },
              { city: 'Uyo', focus: 'Land & Development' },
              { city: 'Abuja', focus: 'Premium Residential' },
              { city: 'Port Harcourt', focus: 'Land & Residential' },
              { city: 'Enugu', focus: 'Residential & Land' },
              { city: 'Asaba', focus: 'Land & Investment' },
              { city: 'Aba', focus: 'Commercial' },
              { city: 'Owerri', focus: 'Land & Residential' },
            ].map((loc, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center hover:bg-white/15 transition-all">
                  <MapPin className="w-6 h-6 text-sage mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">{loc.city}</h3>
                  <p className="text-xs text-white/60">{loc.focus}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="bg-ivory border-l-4 border-forest rounded-r-xl p-8">
              <h3 className="font-display text-2xl text-charcoal mb-4">Important Notice</h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  De-Greenacres Properties Limited provides property marketing, inspection and advisory services. While we review listing information and documentation status, we recommend that all clients:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Conduct independent legal due diligence before any transaction</li>
                  <li>Consult with qualified legal professionals for title verification</li>
                  <li>Seek independent financial advice for investment decisions</li>
                </ul>
                <p>
                  We are a property marketing and advisory company, not a law firm. Our documentation review is for informational purposes and does not constitute legal verification of ownership.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-forest text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Ready to take the next step?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Browse properties, book an inspection, or talk to our team about your real estate goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties" className="bg-white text-charcoal px-8 py-4 rounded-xl font-bold text-lg hover:bg-sage hover:text-white transition-all w-full sm:w-auto">
                Browse Properties
              </Link>
              <Link href="/book-inspection" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-charcoal transition-all w-full sm:w-auto">
                Book Inspection — ₦20,000
              </Link>
              <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20visited%20your%20About%20page%20and%20I%27d%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
