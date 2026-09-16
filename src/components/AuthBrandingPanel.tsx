'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthBrandingPanelProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  extra?: React.ReactNode;
}

export default function AuthBrandingPanel({ eyebrow, title, description, extra }: AuthBrandingPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between">
      {/* Building skyline background (SVG) */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a2810 0%, #283818 30%, #2D5016 60%, #3a6b1e 100%)' }}>
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        {/* Building silhouette skyline */}
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-[0.08]" viewBox="0 0 1200 400" fill="white" preserveAspectRatio="xMidYMax slice">
          <rect x="50" y="200" width="60" height="200" rx="2" />
          <rect x="55" y="180" width="50" height="20" rx="1" />
          <rect x="130" y="120" width="80" height="280" rx="2" />
          <rect x="140" y="100" width="20" height="20" rx="1" />
          <rect x="190" y="110" width="10" height="10" />
          <rect x="230" y="180" width="50" height="220" rx="2" />
          <rect x="300" y="80" width="90" height="320" rx="2" />
          <rect x="330" y="50" width="30" height="30" rx="1" />
          <rect x="340" y="40" width="10" height="10" />
          <rect x="410" y="160" width="70" height="240" rx="2" />
          <rect x="500" y="100" width="100" height="300" rx="2" />
          <rect x="540" y="70" width="20" height="30" rx="1" />
          <rect x="620" y="200" width="60" height="200" rx="2" />
          <rect x="700" y="140" width="80" height="260" rx="2" />
          <rect x="720" y="120" width="40" height="20" rx="1" />
          <rect x="800" y="60" width="100" height="340" rx="2" />
          <rect x="840" y="30" width="20" height="30" rx="1" />
          <rect x="845" y="20" width="10" height="10" />
          <rect x="920" y="180" width="60" height="220" rx="2" />
          <rect x="1000" y="120" width="80" height="280" rx="2" />
          <rect x="1100" y="160" width="70" height="240" rx="2" />
          {/* Windows (decorative dots) */}
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={80 + (i % 10) * 110 + Math.floor(i / 10) * 15} y={180 + (i % 5) * 30} width="6" height="8" rx="1" opacity="0.3" />
          ))}
        </svg>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,40,16,0.9) 0%, rgba(26,40,16,0.3) 40%, rgba(40,56,24,0.5) 70%, rgba(40,56,24,0.8) 100%)' }} />
        
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #788848, transparent 70%)' }} />
        <div className="absolute bottom-40 left-0 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #b8b898, transparent 70%)' }} />
      </div>

      {/* Top — Logo */}
      <div className="relative z-10 p-12">
        <Link href="/" className="inline-flex items-center gap-5 group">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/15 transition-all">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={72} height={72} className="brightness-110 drop-shadow-lg" />
          </div>
          <div>
            <span className="block text-white font-display text-2xl leading-tight">De-Greenacres</span>
            <span className="block text-xs text-white/40 uppercase tracking-[0.25em]">Properties Limited</span>
          </div>
        </Link>
      </div>

      {/* Center — Hero Content */}
      <div className="relative z-10 px-12">
        <p className="text-sage text-xs font-bold uppercase tracking-[0.25em] mb-4">{eyebrow}</p>
        <h1 className="font-display text-4xl xl:text-[2.75rem] text-white leading-[1.15] mb-6">
          {title}
        </h1>
        <p className="text-white/55 text-base leading-relaxed max-w-sm">
          {description}
        </p>

        {/* Website description / value props */}
        <div className="mt-8 bg-white/[0.06] backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            De-Greenacres Properties Limited helps you find, verify, and own property in Nigeria. From residential homes to investment land across 6 states — every listing is documentation-reviewed by our team.
          </p>
          <div className="space-y-2.5">
            {[
              'Verified property listings with full documentation',
              'Physical inspections before you commit — ₦20,000',
              'Flexible payment plans on selected properties',
              'CAC Registered — RC: 1856064',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-white/50 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extra content (step-specific for signup) */}
        {extra}
      </div>

      {/* Bottom — Trust */}
      <div className="relative z-10 p-12">
        <div className="h-px bg-white/10 mb-6" />
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-display text-white">CAC</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Registered</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl font-display text-white">6</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">States</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display text-white">₦20K</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Inspection</p>
          </div>
        </div>
        <p className="text-[10px] text-white/30 text-center mt-4">RC: 1856064 · de-greenacres.com</p>
      </div>
    </div>
  );
}
