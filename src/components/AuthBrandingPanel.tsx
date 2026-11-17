'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

interface AuthBrandingPanelProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  extra?: React.ReactNode;
}

const HIGHLIGHTS = [
  'CAC Registered Platform (RC: 1856064)',
  'Verified title & documentation workflow',
  'Saved searches, favourites & direct messaging',
];

export default function AuthBrandingPanel({ eyebrow, title, description, extra }: AuthBrandingPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-charcoal via-forest-800 to-forest text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sage/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-14">
        <div className="flex items-center justify-between">
          <Logo size="md" onDark />
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Browse properties
          </Link>
        </div>

        <motion.div
          key={eyebrow}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="my-auto max-w-md py-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage-400/30 bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-sage-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="font-display text-4xl xl:text-[2.75rem] leading-[1.1] tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">{description}</p>

          {extra || (
            <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/55">
          <span>De-Greenacres Properties Limited</span>
          <Link href="/diaspora" className="inline-flex items-center gap-1.5 text-white/75 transition hover:text-white">
            <Globe className="h-3.5 w-3.5 text-sage-300" /> Diaspora Advisory
          </Link>
        </div>
      </div>
    </div>
  );
}
