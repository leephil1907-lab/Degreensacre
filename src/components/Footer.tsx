import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-magenta to-plum rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl font-serif">D</span>
              </div>
              <div>
                <div className="font-bold text-lg">De-Greenacres</div>
                <div className="text-xs text-gray-400">PROPERTIES LIMITED</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Premium property discovery across Nigeria. Homes, land and investment opportunities worth knowing.
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="font-semibold text-white">RC: 1856064</p>
              <p>CAC Registered</p>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-bold text-lg mb-6">Properties</h3>
            <ul className="space-y-3">
              <li><Link href="/properties?type=sale" className="text-gray-400 hover:text-white transition-colors">Buy Property</Link></li>
              <li><Link href="/properties?type=rent" className="text-gray-400 hover:text-white transition-colors">Rent Property</Link></li>
              <li><Link href="/properties?type=land" className="text-gray-400 hover:text-white transition-colors">Land for Sale</Link></li>
              <li><Link href="/properties?type=commercial" className="text-gray-400 hover:text-white transition-colors">Commercial</Link></li>
              <li><Link href="/properties?type=short-let" className="text-gray-400 hover:text-white transition-colors">Short Lets</Link></li>
              <li><Link href="/list-property" className="text-gray-400 hover:text-white transition-colors">List Property</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-bold text-lg mb-6">Locations</h3>
            <ul className="space-y-3">
              <li><Link href="/location/lagos" className="text-gray-400 hover:text-white transition-colors">Lagos</Link></li>
              <li><Link href="/location/abuja" className="text-gray-400 hover:text-white transition-colors">Abuja</Link></li>
              <li><Link href="/location/enugu" className="text-gray-400 hover:text-white transition-colors">Enugu</Link></li>
              <li><Link href="/location/uyo" className="text-gray-400 hover:text-white transition-colors">Uyo</Link></li>
              <li><Link href="/location/port-harcourt" className="text-gray-400 hover:text-white transition-colors">Port Harcourt</Link></li>
              <li><Link href="/locations" className="text-gray-400 hover:text-white transition-colors">All Locations</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div>
                <p className="font-semibold text-white mb-2">Phone</p>
                <p>+234 806 501 9971</p>
                <p>+234 901 939 4204</p>
                <p>+234 803 938 8397</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Email</p>
                <p>de_greenacrespropertiesltd@yahoo.com</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">WhatsApp</p>
                <a
                  href="https://wa.me/2348065019971"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-magenta hover:text-magenta-light transition-colors"
                >
                  Chat with us →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} De-Greenacres Properties Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
