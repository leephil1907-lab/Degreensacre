'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role?: string;
  content: string;
  rating: number;
  propertyType?: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Chioma O.',
    location: 'Lagos',
    role: 'First-time Buyer',
    content: 'De-Greenacres made my first property purchase seamless. The verification process gave me confidence that I was making a safe investment. Highly recommended!',
    rating: 5,
    propertyType: 'Residential',
    date: '2026-08-15',
    verified: true
  },
  {
    id: '2',
    name: 'Emeka N.',
    location: 'Abuja',
    role: 'Property Investor',
    content: 'As a diaspora investor, I needed a trustworthy partner. De-Greenacres provided transparent information and excellent support throughout the process.',
    rating: 5,
    propertyType: 'Land',
    date: '2026-07-22',
    verified: true
  },
  {
    id: '3',
    name: 'Aisha M.',
    location: 'Enugu',
    role: 'Homeowner',
    content: 'The team was professional and knowledgeable about the local market. They helped me find the perfect family home within my budget.',
    rating: 5,
    propertyType: 'Residential',
    date: '2026-06-10',
    verified: true
  },
  {
    id: '4',
    name: 'Tunde A.',
    location: 'Lagos',
    role: 'Real Estate Developer',
    content: 'I\'ve worked with De-Greenacres on multiple projects. Their market insights and verified listings save me time and reduce risk.',
    rating: 5,
    propertyType: 'Commercial',
    date: '2026-05-18',
    verified: true
  },
  {
    id: '5',
    name: 'Grace U.',
    location: 'Akwa Ibom',
    role: 'Land Buyer',
    content: 'The land title verification service is invaluable. I avoided a problematic property thanks to their thorough checks.',
    rating: 5,
    propertyType: 'Land',
    date: '2026-04-05',
    verified: true
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by property buyers and investors across Nigeria
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-ivory rounded-xl">
            <div className="text-3xl font-bold text-forest mb-2">500+</div>
            <div className="text-sm text-gray-600">Properties Sold</div>
          </div>
          <div className="text-center p-6 bg-ivory rounded-xl">
            <div className="text-3xl font-bold text-forest mb-2">98%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-ivory rounded-xl">
            <div className="text-3xl font-bold text-forest mb-2">4.9/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-ivory rounded-xl">
            <div className="text-3xl font-bold text-forest mb-2">4 States</div>
            <div className="text-sm text-gray-600">Coverage</div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-ivory rounded-2xl p-8 md:p-12 shadow-soft">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-forest/10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <div className="mb-6">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              <p className="text-xl md:text-2xl text-charcoal mb-8 leading-relaxed">
                &quot;{testimonials[currentIndex].content}&quot;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-charcoal text-lg">
                    {testimonials[currentIndex].name}
                    {testimonials[currentIndex].verified && (
                      <svg className="w-5 h-5 text-green-600 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].location}
                    {testimonials[currentIndex].role && ` • ${testimonials[currentIndex].role}`}
                  </div>
                  {testimonials[currentIndex].propertyType && (
                    <div className="text-sm text-gray-500 mt-1">
                      Purchased: {testimonials[currentIndex].propertyType}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevTestimonial}
                className="flex items-center gap-2 text-forest hover:text-forest-600 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-forest w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="flex items-center gap-2 text-forest hover:text-forest-600 font-semibold transition-colors"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-forest" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-semibold text-charcoal text-sm">Verified Reviews</div>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-forest" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-semibold text-charcoal text-sm">Secure Transactions</div>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-forest" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="font-semibold text-charcoal text-sm">Expert Support</div>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-forest" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-semibold text-charcoal text-sm">CAC Registered</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to join our satisfied clients?</p>
          <Link href="/properties" className="btn-primary">
            Start Your Property Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
