'use client';

import { DemoBanner } from '@/components/DemoBadge';

import Link from 'next/link';
import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  thumbnail: string;
  featured: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'First-Time Home Buyer\'s Guide',
    description: 'Complete guide to buying your first property in Nigeria, from search to closing.',
    category: 'Buying',
    level: 'Beginner',
    duration: '2 hours',
    lessons: 12,
    thumbnail: '🏠',
    featured: true
  },
  {
    id: '2',
    title: 'Understanding Land Titles in Nigeria',
    description: 'Learn about C of O, Governor\'s Consent, Excision, and how to verify land titles.',
    category: 'Legal',
    level: 'Beginner',
    duration: '1.5 hours',
    lessons: 8,
    thumbnail: '📜',
    featured: true
  },
  {
    id: '3',
    title: 'Property Investment Strategies',
    description: 'Advanced strategies for building wealth through Nigerian real estate investments.',
    category: 'Investment',
    level: 'Advanced',
    duration: '3 hours',
    lessons: 15,
    thumbnail: '📈',
    featured: true
  },
  {
    id: '4',
    title: 'Rental Property Management',
    description: 'How to manage rental properties effectively and maximize returns.',
    category: 'Management',
    level: 'Intermediate',
    duration: '2.5 hours',
    lessons: 10,
    thumbnail: '🔑',
    featured: false
  },
  {
    id: '5',
    title: 'Real Estate Financing in Nigeria',
    description: 'Understanding mortgages, payment plans, and financing options for property purchases.',
    category: 'Finance',
    level: 'Intermediate',
    duration: '2 hours',
    lessons: 9,
    thumbnail: '💰',
    featured: false
  },
  {
    id: '6',
    title: 'Property Valuation Methods',
    description: 'Learn how to accurately value properties using comparable sales and income approaches.',
    category: 'Valuation',
    level: 'Advanced',
    duration: '2.5 hours',
    lessons: 11,
    thumbnail: '📊',
    featured: false
  },
  {
    id: '7',
    title: 'Real Estate Tax Guide',
    description: 'Navigate Nigerian property taxes, capital gains, and tax-efficient investment structures.',
    category: 'Legal',
    level: 'Intermediate',
    duration: '1.5 hours',
    lessons: 7,
    thumbnail: '🏛️',
    featured: false
  },
  {
    id: '8',
    title: 'Diaspora Investment Masterclass',
    description: 'Special guide for Nigerians abroad investing in Nigerian real estate.',
    category: 'Investment',
    level: 'Beginner',
    duration: '3 hours',
    lessons: 14,
    thumbnail: '🌍',
    featured: true
  }
];

const categories = ['All', 'Buying', 'Investment', 'Legal', 'Finance', 'Management', 'Valuation'];

export default function PropertyInvestmentAcademy() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredCourses = courses.filter(c => c.featured);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'Advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <DemoBanner description="Investment Academy — Preview curriculum with sample lessons. Full courses will be published before launch." />
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Property Investment Academy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert-led courses to help you make informed real estate decisions in Nigeria
            </p>
          </div>

          {/* Featured Courses */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-charcoal mb-6">Featured Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
                  <div className="bg-gradient-to-br from-forest/10 to-sage/10 p-8 text-center">
                    <div className="text-6xl mb-4">{course.thumbnail}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="text-xs bg-ivory text-charcoal px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-charcoal mb-2 line-clamp-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {course.lessons} lessons</span>
                    </div>
                    <button className="btn-primary w-full">
                      Start Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-forest text-white'
                        : 'bg-ivory text-charcoal hover:bg-forest/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* All Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
                <div className="bg-gradient-to-br from-forest/5 to-sage/5 p-8 text-center">
                  <div className="text-5xl mb-4">{course.thumbnail}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="text-xs bg-ivory text-charcoal px-2 py-1 rounded">
                      {course.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-charcoal mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.lessons} lessons</span>
                  </div>
                  <button className="btn-outline w-full">
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Paths */}
          <div className="mt-12 bg-white rounded-2xl shadow-soft p-8">
            <h3 className="text-2xl font-bold text-charcoal mb-6">Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-forest/5 to-forest/10 rounded-xl">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="text-lg font-bold text-charcoal mb-2">First-Time Buyer Path</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Everything you need to know to buy your first property with confidence.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  4 courses • 8 hours • Beginner
                </div>
                <button className="btn-primary w-full">
                  Start Path
                </button>
              </div>

              <div className="p-6 bg-gradient-to-br from-sage/5 to-sage/10 rounded-xl">
                <div className="text-3xl mb-3">💼</div>
                <h4 className="text-lg font-bold text-charcoal mb-2">Investor Path</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Build a profitable real estate portfolio with proven investment strategies.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  5 courses • 12 hours • Intermediate
                </div>
                <button className="btn-primary w-full">
                  Start Path
                </button>
              </div>

              <div className="p-6 bg-gradient-to-br from-magenta/5 to-magenta/10 rounded-xl">
                <div className="text-3xl mb-3">🌍</div>
                <h4 className="text-lg font-bold text-charcoal mb-2">Diaspora Path</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Special guide for Nigerians abroad investing in Nigerian real estate.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  3 courses • 6 hours • Beginner
                </div>
                <button className="btn-primary w-full">
                  Start Path
                </button>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-charcoal mb-4">Free Resources</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 bg-ivory rounded-lg hover:bg-forest/5 transition-colors">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1">
                    <div className="font-semibold text-charcoal">Property Buying Checklist</div>
                    <div className="text-sm text-gray-600">PDF Download</div>
                  </div>
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-ivory rounded-lg hover:bg-forest/5 transition-colors">
                  <span className="text-2xl">📊</span>
                  <div className="flex-1">
                    <div className="font-semibold text-charcoal">Market Report 2026</div>
                    <div className="text-sm text-gray-600">PDF Download</div>
                  </div>
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-ivory rounded-lg hover:bg-forest/5 transition-colors">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <div className="font-semibold text-charcoal">Legal Templates Pack</div>
                    <div className="text-sm text-gray-600">Word Documents</div>
                  </div>
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need Personal Guidance?</h3>
              <p className="text-white/90 mb-6">
                Book a one-on-one consultation with our real estate experts to discuss your specific needs and goals.
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/2347041754800?text=Hello%20De-Greenacres,%20I'm%20interested%20in%20booking%20a%20consultation%20with%20a%20real%20estate%20expert."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-white text-forest hover:bg-ivory w-full"
                >
                  Book Consultation
                </a>
                <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-forest w-full block text-center">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
              <div className="text-3xl font-bold text-forest mb-2">50+</div>
              <div className="text-sm text-gray-600">Video Lessons</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
              <div className="text-3xl font-bold text-forest mb-2">100+</div>
              <div className="text-sm text-gray-600">Hours of Content</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
              <div className="text-3xl font-bold text-forest mb-2">5K+</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
              <div className="text-3xl font-bold text-forest mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
      </>
  );
}
