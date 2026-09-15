'use client';

import ScrollReveal from '@/components/ScrollReveal';
import { Shield, MapPin, FileCheck, MessageSquare, FileText, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal to-plum text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-display-lg font-bold mb-6">About De-Greenacres</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Premium property discovery across Nigeria. We connect discerning buyers with exceptional homes, land, and investment opportunities worth knowing.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="heading-primary mb-8">Our Story</h2>
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    De-Greenacres Properties Limited was founded with a clear vision: to transform how Nigerians discover and invest in real estate. We believe that finding the right property should be an experience defined by trust, transparency, and expert guidance.
                  </p>
                  <p>
                    As a CAC-registered company (RC: 1856064), we operate with the highest standards of professionalism and integrity. Our presence spans Lagos, Abuja, Enugu, Akwa Ibom, and the Southeast, allowing us to serve clients across Nigeria&apos;s most dynamic real estate markets.
                  </p>
                  <p>
                    We understand that real estate is more than transactions—it&apos;s about building wealth, creating homes, and securing futures. That&apos;s why we&apos;re committed to helping our clients make informed decisions that lead to long-term success.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=90"
                  alt="Real Estate Investment"
                  className="rounded-2xl shadow-strong"
                />
                <div className="absolute -bottom-8 -left-8 bg-magenta text-white p-8 rounded-xl shadow-strong">
                  <div className="text-4xl font-bold mb-1">RC: 1856064</div>
                  <div className="text-white/90">CAC Registered</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why De-Greenacres */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="heading-primary mb-4">Why De-Greenacres</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide every interaction with our clients
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-magenta" />
                </div>
                <h3 className="text-xl font-bold mb-3">Property Discovery</h3>
                <p className="text-gray-600 leading-relaxed">
                  We curate premium properties across Nigeria&apos;s most promising markets, ensuring every listing meets our quality standards.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-plum" />
                </div>
                <h3 className="text-xl font-bold mb-3">Local Market Knowledge</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deep expertise across Lagos, Abuja, Enugu, Akwa Ibom, and Southeast markets. We know the locations that matter.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-charcoal/10 rounded-full flex items-center justify-center mb-6">
                  <FileCheck className="w-8 h-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-bold mb-3">Listing Review</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every property is carefully reviewed before publication. We verify documentation and property details to protect our clients.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-magenta" />
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Assistance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated support from inquiry to closing. Our team handles the details so you can focus on your investment decision.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-plum" />
                </div>
                <h3 className="text-xl font-bold mb-3">Documentation Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We provide clear information about property documentation including C of O, Governor&apos;s Consent, and other title documents.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift h-full">
                <div className="w-16 h-16 bg-charcoal/10 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-bold mb-3">Viewing Assistance</h3>
                <p className="text-gray-600 leading-relaxed">
                  We arrange and accompany property viewings, providing expert insights and answering your questions on-site.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="bg-ivory border-l-4 border-magenta rounded-r-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Important Notice</h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  De-Greenacres Properties Limited provides property discovery and marketing services. While we verify listing information and documentation status, we do not provide:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Legal verification of property titles</li>
                  <li>Guarantees of investment returns</li>
                  <li>Government approval endorsements</li>
                  <li>Legal or financial advice</li>
                </ul>
                <p>
                  We strongly recommend that all clients conduct independent due diligence and consult with qualified legal and financial professionals before making property transactions.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-plum text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Browse our curated selection of premium properties or contact us to discuss your real estate needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/properties" className="btn-primary bg-white text-magenta hover:bg-ivory w-full sm:w-auto">
                Browse Properties
              </a>
              <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto">
                Contact Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
