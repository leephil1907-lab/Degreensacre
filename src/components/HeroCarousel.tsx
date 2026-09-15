'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    url: '/properties/property-1.jpg',
    alt: 'Premium property in Nigeria',
    tagline: 'Premium Living',
    heading: 'Discover Your Dream Home',
    description: 'From luxury duplexes to spacious family estates — find properties that match your lifestyle and budget across Nigeria\'s most sought-after locations.',
  },
  {
    url: '/properties/property-2.jpg',
    alt: 'Luxury residential home',
    tagline: 'Trusted Investments',
    heading: 'Build Wealth Through Property',
    description: 'Every listing on De-Greenacres is verified. Invest with confidence knowing your money goes into legitimate, title-checked properties with real growth potential.',
  },
  {
    url: '/properties/property-3.jpg',
    alt: 'Modern architectural duplex',
    tagline: 'Modern Architecture',
    heading: 'Contemporary Designs, Timeless Value',
    description: 'Explore modern homes built to international standards — smart layouts, premium finishes, and energy-efficient designs in Lagos, Abuja, Enugu, and beyond.',
  },
  {
    url: '/properties/property-4.jpg',
    alt: 'Elegant family residence',
    tagline: 'Family First',
    heading: 'Where Families Put Down Roots',
    description: 'Safe neighbourhoods, good schools nearby, and communities that thrive. We help Nigerian families find homes they\'ll love for generations.',
  },
  {
    url: '/properties/property-5.jpg',
    alt: 'Residential land and estate',
    tagline: 'Land & Estates',
    heading: 'Secure Land, Clear Titles',
    description: 'From prime plots in developing areas to ready-to-build estate lots — all with verified C of O, Governor\'s Consent, or Gazette titles. No stories, no wahala.',
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

  const slide = SLIDES[current];

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="sync">
        {SLIDES.map((s, index) =>
          index === current ? (
            <motion.div
              key={s.url}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <img
                src={s.url}
                alt={s.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Animated text overlay — positioned bottom-left on desktop, bottom-center on mobile */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="container-custom w-full pb-28 md:pb-36">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <span className="inline-block text-sage font-bold text-xs uppercase tracking-[0.2em] mb-3 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  {slide.tagline}
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.heading}
                </h2>
                <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed font-light hidden md:block">
                  {slide.description}
                </p>
                <p className="text-sm text-white/85 max-w-md leading-relaxed md:hidden">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
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
