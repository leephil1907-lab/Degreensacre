import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'De-Greenacres Properties Limited privacy policy. How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Privacy Policy</h1>
          <p className="text-gray-600 mb-8"><strong>Last updated:</strong> January 2026</p>

          <h2>1. Introduction</h2>
          <p>De-Greenacres Properties Limited (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website degreensacre.vercel.app or use our services.</p>
          <p>We are registered with the Corporate Affairs Commission (CAC) of Nigeria under RC: 1856064.</p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, password, country, state, and account type when you create an account.</li>
            <li><strong>Property Listings:</strong> Property details, images, documents, and ownership information when you list a property.</li>
            <li><strong>Enquiries &amp; Communications:</strong> Messages you send through our platform, including property enquiries and viewing requests.</li>
            <li><strong>Transaction Data:</strong> Records of enquiries, viewings, saved properties, and search preferences.</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>IP address and approximate location</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referral source</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our property marketplace</li>
            <li>To process property enquiries and viewing requests</li>
            <li>To send relevant property alerts based on your saved searches</li>
            <li>To verify property listings and prevent fraud</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with Nigerian legal obligations</li>
          </ul>

          <h2>4. Data Storage &amp; Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use Supabase for database management with Row Level Security (RLS) policies to ensure data access is properly controlled.</p>
          <p>While we implement strong security measures, no method of transmission over the Internet is 100% secure. We continuously improve our security practices.</p>

          <h2>5. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your information in these limited circumstances:</p>
          <ul>
            <li><strong>Property Agents:</strong> When you submit an enquiry, your contact details are shared with the relevant property agent to facilitate communication.</li>
            <li><strong>Service Providers:</strong> Email services (Resend), hosting (Vercel), and database services (Supabase) that help us operate our platform.</li>
            <li><strong>Legal Requirements:</strong> When required by Nigerian law, court order, or governmental authority.</li>
          </ul>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data that we hold</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p>To exercise these rights, contact us at <strong>de_greenacrespropertiesltd@yahoo.com</strong>.</p>

          <h2>7. Cookies &amp; Advertising</h2>
          <p>We use essential cookies to maintain your session and preferences. We also use <strong>Google AdSense</strong> to show advertisements.</p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for login, preferences, and security — cannot be disabled.</li>
            <li><strong>Advertising cookies (Google AdSense):</strong> Google and its partners use cookies to serve personalized and non-personalized ads based on your browsing history. This is controlled by Google’s ad technology. You can see personalized ads only if you consent via our cookie banner.</li>
          </ul>
          <p>You can control advertising cookies at any time:</p>
          <ul>
            <li>Use our <strong>Cookie Consent banner</strong> (Decline = non-personalized ads only) or clear <code>cookie-consent</code> from your browser storage.</li>
            <li>Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-forest underline">Google Ad Settings</a> to opt out of personalized ads.</li>
            <li>Visit <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-forest underline">aboutads.info/choices</a> for broader opt-out.</li>
            <li>See Google’s uses of data at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-forest underline">policies.google.com/technologies/partner-sites</a>.</li>
          </ul>
          <p className="text-sm text-gray-600">Our <code>ads.txt</code> at <a href="/ads.txt" className="text-forest underline">/ads.txt</a> verifies our AdSense publisher ID for ad buyers.</p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes via email or a prominent notice on our website.</p>

          <h2>10. Contact Us</h2>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li><strong>Email:</strong> de_greenacrespropertiesltd@yahoo.com</li>
            <li><strong>Phone:</strong> +234 806 501 9971</li>
            <li><strong>Address:</strong> 5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos State, Nigeria</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
