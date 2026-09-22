import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Trust & Flyer Strip — from flyer */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-charcoal">
        <div className="container-custom py-3 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold"><span className="w-5 h-5 rounded-full bg-charcoal text-white grid place-items-center text-[10px]">✓</span> 100% Genuine Land</span>
          <span className="hidden sm:inline text-charcoal/30">|</span>
          <span className="inline-flex items-center gap-1.5 font-bold"><span className="w-5 h-5 rounded-full bg-charcoal text-white grid place-items-center text-[10px]">✓</span> Verified Documentation</span>
          <span className="hidden sm:inline text-charcoal/30">|</span>
          <span className="inline-flex items-center gap-1.5 font-bold"><span className="w-5 h-5 rounded-full bg-charcoal text-white grid place-items-center text-[10px]">✓</span> Professional Service</span>
          <span className="hidden md:inline-flex items-center gap-2 ml-2 bg-charcoal text-white px-3 py-1.5 rounded-full font-bold">Coastal Highway Uyo — SPREAD ₦2.5M <Link href="/properties/premium-plots-new-coastal-highway-uyo" className="underline decoration-amber-400 hover:text-amber-300">View Plot →</Link></span>
        </div>
      </div>
      {/* Main Footer */}
      <div className="container-custom pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Company Column — wider */}
          <div className="lg:col-span-4">
            <div className="mb-5 [&_img]:brightness-110">
              <Logo size="md" href="/" className="[&_div:first-child_img]:drop-shadow-lg" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">
              Nigeria&apos;s trusted property intelligence platform. Homes, land and investment opportunities — documentation reviewed.
            </p>
            {/* CAC badge — single prominent occurrence */}
            <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-2.5">
              <svg className="w-4 h-4 text-sage/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              <div>
                <p className="text-xs font-semibold text-white/70">CAC Registered</p>
                <p className="text-[10px] text-white/35">RC: 1856064</p>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-5">Properties</h3>
            <ul className="space-y-3">
              {[
                { label: 'Buy', href: '/properties?type=sale' },
                { label: 'Rent', href: '/properties?type=rent' },
                { label: 'Land', href: '/properties?type=land' },
                { label: 'Commercial', href: '/properties?type=commercial' },
                { label: 'Short Lets', href: '/properties?type=short-let' },
                { label: 'List Property', href: '/list-property' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-5">Locations</h3>
            <ul className="space-y-3">
              {[
                { label: 'Lagos', href: '/location/lagos' },
                { label: 'Abuja', href: '/location/abuja' },
                { label: 'Enugu', href: '/location/enugu' },
                { label: 'Uyo', href: '/location/akwa-ibom' },
                { label: 'Port Harcourt', href: '/location/port-harcourt' },
                { label: 'All Locations', href: '/locations' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — compact, action-focused */}
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-5">Get in Touch</h3>
            <div className="space-y-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/2347041754800?text=Hello%2C%20I%27m%20interested%20in%20your%20properties"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600/10 hover:bg-green-600/15 border border-green-600/20 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-green-500 group-hover:text-green-400 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <div>
                  <span className="block text-xs text-gray-400 font-normal">WhatsApp</span>
                  <span className="block text-sm">0704 175 4800</span>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+2348065019971"
                className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white px-4 py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5 text-sage/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <span className="block text-xs text-gray-400">Customer Support</span>
                  <span className="block text-sm font-semibold">0806 501 9971</span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:degreenacrespropertieslimited@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 px-1"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-xs break-all">degreenacrespropertieslimited@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar — refined */}
        <div className="border-t border-white/[0.06] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} De-Greenacres Properties Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors duration-200">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
