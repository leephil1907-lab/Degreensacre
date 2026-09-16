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
      {/* Premium layered background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg, #0f1a08 0%, #1a2810 25%, #283818 55%, #2D5016 80%, #3a6b1e 100%)' }} />
        
        {/* Animated subtle texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

        {/* Premium architectural skyline with more detail */}
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-[0.06]" viewBox="0 0 1400 500" fill="white" preserveAspectRatio="xMidYMax slice">
          {/* Far buildings */}
          <rect x="30" y="280" width="45" height="220" rx="1" />
          <rect x="35" y="265" width="35" height="15" rx="1" />
          <rect x="95" y="180" width="70" height="320" rx="2" />
          <rect x="105" y="160" width="50" height="20" rx="1" />
          <rect x="120" y="145" width="20" height="15" rx="1" />
          {/* Windows on far building */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <rect key={`w1-${i}`} x={105 + (i % 3) * 18} y={195 + Math.floor(i / 3) * 28} width="8" height="14" rx="1" opacity="0.4" />
          ))}
          
          <rect x="185" y="240" width="55" height="260" rx="2" />
          <rect x="260" y="100" width="90" height="400" rx="2" />
          <rect x="280" y="70" width="50" height="30" rx="2" />
          <rect x="295" y="50" width="20" height="20" rx="1" />
          <rect x="300" y="35" width="10" height="15" rx="1" />
          {/* Windows on tall building */}
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
            <rect key={`w2-${i}`} x={272 + (i % 4) * 20} y={120 + Math.floor(i / 4) * 35} width="10" height="16" rx="1" opacity="0.3" />
          ))}

          <rect x="370" y="200" width="65" height="300" rx="2" />
          <rect x="455" y="130" width="100" height="370" rx="2" />
          <rect x="480" y="100" width="50" height="30" rx="2" />
          <rect x="495" y="80" width="20" height="20" rx="1" />
          {/* Windows */}
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <rect key={`w3-${i}`} x={468 + (i % 3) * 25} y={150 + Math.floor(i / 3) * 40} width="12" height="18" rx="1" opacity="0.35" />
          ))}

          <rect x="575" y="220" width="50" height="280" rx="2" />
          <rect x="645" y="160" width="85" height="340" rx="2" />
          <rect x="660" y="140" width="55" height="20" rx="1" />
          <rect x="680" y="120" width="15" height="20" rx="1" />
          {/* Windows */}
          {[0,1,2,3,4,5].map(i => (
            <rect key={`w4-${i}`} x={658 + (i % 3) * 22} y={180 + Math.floor(i / 3) * 35} width="10" height="16" rx="1" opacity="0.3" />
          ))}

          <rect x="750" y="80" width="110" height="420" rx="2" />
          <rect x="775" y="50" width="60" height="30" rx="2" />
          <rect x="795" y="25" width="20" height="25" rx="1" />
          <rect x="800" y="10" width="10" height="15" rx="1" />
          {/* Windows on tallest */}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(i => (
            <rect key={`w5-${i}`} x={765 + (i % 5) * 20} y={100 + Math.floor(i / 5) * 38} width="10" height="18" rx="1" opacity="0.25" />
          ))}

          <rect x="880" y="240" width="55" height="260" rx="2" />
          <rect x="955" y="150" width="80" height="350" rx="2" />
          <rect x="970" y="130" width="50" height="20" rx="1" />
          <rect x="1055" y="190" width="60" height="310" rx="2" />
          <rect x="1135" y="120" width="90" height="380" rx="2" />
          <rect x="1155" y="95" width="50" height="25" rx="1" />
          <rect x="1170" y="75" width="20" height="20" rx="1" />
          <rect x="1245" y="200" width="65" height="300" rx="2" />
          <rect x="1330" y="250" width="50" height="250" rx="2" />
        </svg>

        {/* Depth overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,26,8,0.95) 0%, rgba(26,40,16,0.4) 35%, transparent 55%, rgba(40,56,24,0.3) 80%, rgba(15,26,8,0.7) 100%)' }} />

        {/* Premium glow accents */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #788848, transparent 65%)' }} />
        <div className="absolute bottom-20 left-10 w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #b8c898, transparent 65%)' }} />

        {/* Animated floating orb (CSS only) */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-sage/20 animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top — Logo */}
      <div className="relative z-10 p-12">
        <Link href="/" className="inline-flex items-center gap-5 group">
          <div className="w-24 h-24 bg-white/[0.08] backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/[0.08] group-hover:bg-white/[0.12] transition-all duration-300">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={72} height={72} className="brightness-110 drop-shadow-lg" />
          </div>
          <div>
            <span className="block text-white font-display text-2xl leading-tight tracking-tight">De-Greenacres</span>
            <span className="block text-[10px] text-white/35 uppercase tracking-[0.3em] mt-1">Properties Limited</span>
          </div>
        </Link>
      </div>

      {/* Center — Hero Content */}
      <div className="relative z-10 px-12">
        {/* Eyebrow with accent line */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-sage/60" />
          <p className="text-sage text-[11px] font-bold uppercase tracking-[0.3em]">{eyebrow}</p>
        </div>

        <h1 className="font-display text-[2.5rem] xl:text-[2.75rem] text-white leading-[1.1] mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-white/45 text-[15px] leading-[1.7] max-w-md">
          {description}
        </p>

        {/* Premium glass card with value props */}
        <div className="mt-10 bg-white/[0.04] backdrop-blur-md rounded-2xl p-6 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            De-Greenacres Properties Limited helps you find, verify, and own property in Nigeria. Every listing is documentation-reviewed by our team.
          </p>
          <div className="space-y-3">
            {[
              'Verified listings with full documentation',
              'Physical inspections before you commit',
              'Flexible payment plans available',
            ].map((item, i) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-white/45 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extra content (step-specific for signup) */}
        {extra}
      </div>

      {/* Bottom — Refined trust bar */}
      <div className="relative z-10 p-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <svg className="w-5 h-5 text-sage/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold">CAC Registered</p>
              <p className="text-white/30 text-[10px]">RC: 1856064</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-xl font-display text-white/70">6</p>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">States</p>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div>
              <p className="text-xl font-display text-white/70">SSL</p>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">256-bit</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-white/15 text-center mt-6 tracking-wide">degreenacres.com</p>
      </div>
    </div>
  );
}
