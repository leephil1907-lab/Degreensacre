'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const SLIDES = [
  { url: '/properties/property-1.jpg', label: 'Premium residential property' },
  { url: '/properties/property-2.jpg', label: 'Contemporary Nigerian home' },
  { url: '/properties/property-3.jpg', label: 'Modern architectural duplex' },
  { url: '/properties/property-4.jpg', label: 'Elegant family residence' },
  { url: '/properties/property-5.jpg', label: 'Residential land and estate' },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const next = useCallback(() => setCurrent((value) => (value + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, paused, reduceMotion]);

  return (
    <div className="absolute inset-0 z-0 bg-forest" aria-label="Property image slideshow">
      <AnimatePresence mode="sync">
        <motion.div key={SLIDES[current].url} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 1, ease: 'easeInOut' }}>
          <img src={SLIDES[current].url} alt="" className="h-full w-full object-cover" loading={current === 0 ? 'eager' : 'lazy'} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <p className="absolute left-4 top-4 z-20 rounded bg-black/40 px-2 py-1 text-[10px] text-white/90 sm:bottom-16 sm:left-6 sm:top-auto">Illustrative imagery · not property listings</p>
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
        {SLIDES.map((slide, index) => (
          <button key={slide.url} type="button" onClick={() => setCurrent(index)} aria-label={`Show ${slide.label}`} aria-pressed={index === current} className="grid h-7 w-7 place-items-center rounded-full">
            <span className={`block rounded-full transition-all ${index === current ? 'h-2 w-6 bg-white' : 'h-2 w-2 bg-white/55'}`} />
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setPaused((value) => !value)} className="absolute bottom-5 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 sm:right-6" aria-label={paused ? 'Play background slideshow' : 'Pause background slideshow'}>
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </div>
  );
}
