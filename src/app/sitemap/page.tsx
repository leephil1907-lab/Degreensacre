import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Browse all pages on De-Greenacres Properties Limited.',
};

const sections = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Insights & Articles', href: '/insights' },
      { label: 'New Developments', href: '/developments' },
      { label: 'Diaspora Investors', href: '/diaspora' },
      { label: 'Sell Your Property', href: '/sell' },
    ],
  },
  {
    title: 'Properties',
    links: [
      { label: 'All Properties', href: '/properties' },
      { label: 'Properties for Sale', href: '/properties?type=sale' },
      { label: 'Properties for Rent', href: '/properties?type=rent' },
      { label: 'Land for Sale', href: '/properties?type=land' },
      { label: 'Commercial Properties', href: '/properties?type=commercial' },
      { label: 'Short Lets', href: '/properties?type=short-let' },
      { label: 'List Your Property', href: '/list-property' },
      { label: 'Submit Property', href: '/submit-property' },
    ],
  },
  {
    title: 'Locations',
    links: [
      { label: 'All Locations', href: '/locations' },
      { label: 'Lagos', href: '/location/lagos' },
      { label: 'Abuja', href: '/location/abuja' },
      { label: 'Enugu', href: '/location/enugu' },
      { label: 'Akwa Ibom (Uyo)', href: '/location/akwa-ibom' },
      { label: 'Port Harcourt', href: '/location/port-harcourt' },
      { label: 'Uyo', href: '/location/uyo' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/signin' },
      { label: 'Sign Up', href: '/signup' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Forgot Password', href: '/forgot-password' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary text-4xl mb-2">Sitemap</h1>
          <p className="text-lg text-gray-600 mb-12">All pages on De-Greenacres Properties at a glance.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-charcoal mb-4 pb-2 border-b border-gray-200">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-forest transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
