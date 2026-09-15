'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85',
    alt: 'Luxury modern duplex exterior',
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85',
    alt: 'Premium residential property',
  },
  {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85',
    alt: 'Modern architectural home',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85',
    alt: 'Elegant family residence',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=85',
    alt: 'Contemporary luxury estate',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="sync">
        {SLIDES.map((slide, index) =>
          index === current ? (
            <motion.div
              key={slide.url}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <img
                src={slide.url}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'w-8 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
