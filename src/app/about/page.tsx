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
          </div>
        </div>
      </section>

      {/* Why De-Greenacres */}
      <section className="section-padding bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-primary mb-4">Why De-Greenacres</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every interaction with our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Property Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                We curate premium properties across Nigeria&apos;s most promising markets, ensuring every listing meets our quality standards.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Local Market Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep expertise across Lagos, Abuja, Enugu, Akwa Ibom, and Southeast markets. We know the locations that matter.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-charcoal/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Listing Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Every property is carefully reviewed before publication. We verify documentation and property details to protect our clients.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-magenta/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Assistance</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated support from inquiry to closing. Our team handles the details so you can focus on your investment decision.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Documentation Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We provide clear information about property documentation including C of O, Governor&apos;s Consent, and other title documents.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft hover-lift">
              <div className="w-16 h-16 bg-charcoal/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Viewing Assistance</h3>
              <p className="text-gray-600 leading-relaxed">
                We arrange and accompany property viewings, providing expert insights and answering your questions on-site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
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
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-charcoal to-plum text-white">
        <div className="container-custom text-center">
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
        </div>
      </section>
    </div>
  );
}
