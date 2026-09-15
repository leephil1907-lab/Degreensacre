import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'De-Greenacres Properties Limited terms of service. Rules and guidelines for using our property marketplace.',
};

export default function TermsPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Terms of Service</h1>
          <p className="text-gray-600 mb-8"><strong>Last updated:</strong> January 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the De-Greenacres Properties Limited platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
          <p>De-Greenacres Properties Limited is registered with the Corporate Affairs Commission (CAC) of Nigeria under RC: 1856064.</p>

          <h2>2. Description of Service</h2>
          <p>De-Greenacres provides an online property marketplace that connects property seekers with property owners and agents across Nigeria. Our services include:</p>
          <ul>
            <li>Property listings and search</li>
            <li>Property enquiry and viewing scheduling</li>
            <li>Property listing submission for owners and agents</li>
            <li>Investment tools and market insights</li>
          </ul>
          <p><strong>Important:</strong> De-Greenacres is a platform that facilitates property discovery and communication. We are not a party to any property transaction between users. All property transactions are between the buyer/tenant and the seller/landlord.</p>

          <h2>3. User Accounts</h2>
          <ul>
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must provide accurate, current, and complete information during registration.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>

          <h2>4. Property Listings</h2>
          <h3>4.1 For Property Submitters</h3>
          <ul>
            <li>You must have the legal right to list the property (as owner, authorized agent, or with proper authorization).</li>
            <li>All information provided must be accurate and truthful.</li>
            <li>Images must be genuine representations of the property.</li>
            <li>Price information must reflect the actual asking price.</li>
            <li>You must not list properties that are already sold or unavailable without updating their status.</li>
            <li>De-Greenacres reserves the right to verify, moderate, suspend, or remove any listing.</li>
          </ul>

          <h3>4.2 Verification Status</h3>
          <p>Properties on our platform may carry different verification statuses:</p>
          <ul>
            <li><strong>Verified:</strong> Documentation has been reviewed by our team.</li>
            <li><strong>Pending Verification:</strong> Documentation is under review.</li>
            <li><strong>Unverified:</strong> No documentation has been submitted or reviewed.</li>
          </ul>
          <p>Verification indicates that documentation was reviewed but does not constitute a guarantee of title or legal standing. Always conduct your own due diligence.</p>

          <h2>5. Prohibited Conduct</h2>
          <ul>
            <li>Posting false, misleading, or fraudulent property listings</li>
            <li>Impersonating another person or entity</li>
            <li>Attempting to circumvent platform security measures</li>
            <li>Using the platform for money laundering or fraudulent transactions</li>
            <li>Scraping, data mining, or automated access without permission</li>
            <li>Harassing or threatening other users</li>
            <li>Uploading malicious code or attempting to compromise the platform</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>The De-Greenacres brand, logo, website design, and platform features are owned by De-Greenacres Properties Limited and protected under Nigerian intellectual property law.</p>
          <p>Property listing content (photos, descriptions) remains the property of the submitter but is licensed to De-Greenacres for display on the platform.</p>

          <h2>7. Disclaimers</h2>
          <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. Specifically:</p>
          <ul>
            <li>We do not guarantee the accuracy of any property listing.</li>
            <li>We do not guarantee that any property transaction will be completed.</li>
            <li>Investment calculators and ROI projections are estimates only and not financial advice.</li>
            <li>We are not responsible for the conduct of users on or off the platform.</li>
          </ul>

          <h2>8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by Nigerian law, De-Greenacres Properties Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.</p>

          <h2>9. Termination</h2>
          <p>We may suspend or terminate your account at any time for violation of these Terms. You may also deactivate your account at any time through your dashboard settings.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of competent jurisdiction in Lagos State, Nigeria.</p>

          <h2>11. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

          <h2>12. Contact</h2>
          <p>For questions about these Terms:</p>
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
