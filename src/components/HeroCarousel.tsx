'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    url: '/properties/property-1.jpg',
    alt: 'Premium property in Nigeria',
  },
  {
    url: '/properties/property-2.jpg',
    alt: 'Luxury residential home',
  },
  {
    url: '/properties/property-3.jpg',
    alt: 'Modern architectural duplex',
  },
  {
    url: '/properties/property-4.jpg',
    alt: 'Elegant family residence',
  },
  {
    url: '/properties/property-5.jpg',
    alt: 'Residential land and estate',
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

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
