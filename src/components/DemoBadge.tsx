'use client';

export default function DemoBadge({ label = 'Preview · Demo data', tone = 'amber' }: { label?: string; tone?: 'amber' | 'sage' | 'forest' }) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    sage: 'bg-sage/10 text-forest border-sage/30',
    forest: 'bg-forest text-ivory border-forest',
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${tones[tone]}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-70 animate-pulse" />
      {label}
    </div>
  );
}

export function DemoBanner({ title = 'Demo Preview', description = 'This feature showcases sample data and UI. Live data, AI and blockchain integrations will be connected before production launch.' }: { title?: string; description?: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
      <span className="mt-0.5 inline-flex w-7 h-7 rounded-full bg-amber-500 text-white items-center justify-center text-xs flex-shrink-0">◈</span>
      <div>
        <p className="text-xs font-extrabold tracking-widest uppercase text-amber-800">{title}</p>
        <p className="text-sm text-amber-900/80 leading-relaxed mt-1">{description}</p>
      </div>
    </div>
  );
}
