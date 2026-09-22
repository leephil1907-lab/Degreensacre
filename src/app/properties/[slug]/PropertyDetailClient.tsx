'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Bed, Bath, Square, Car, Heart, Share2,
  Phone, Mail, MessageSquare, CheckCircle, Shield, Clock,
  Calendar, Eye, Bookmark, BookmarkPlus, Loader2, ChevronLeft,
  ChevronRight, AlertTriangle, FileText, User, Star, Navigation,
  CreditCard, Building, Map, TreePine
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdSense from '@/components/GoogleAdsense';
import { properties as sampleProperties } from '@/data/properties';

interface Property {
  id: string;
  slug: string;
  title: string;
  type: string;
  property_type: string;
  price: number;
  price_period?: string;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  sqm: number;
  parking: number;
  area: string;
  state: string;
  lga?: string;
  city?: string;
  address?: string;
  description?: string;
  features: string[];
  amenities: string[];
  verification_status: string;
  status: string;
  featured: boolean;
  views: number;
  saves: number;
  furnished?: boolean;
  serviced?: boolean;
  gated_estate?: boolean;
  documentation?: string;
  payment_plan?: string;
  paymentPlan?: string;
  development_status?: string;
  developmentStatus?: string;
  coordinates?: { lat: number; lng: number };
  landmarks?: string[];
  region?: string;
  available_plots?: number;
  total_plots?: number;
  date_added: string;
  published_at?: string;
  property_images?: { url: string; display_order: number; is_primary: boolean; alt_text?: string }[];
  property_documents?: { name: string; document_type: string; url: string; is_public: boolean }[];
  agents?: { name: string; phone: string; whatsapp: string; email: string; photo_url?: string };
}

export default function PropertyDetailClient({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showViewing, setShowViewing] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [viewingForm, setViewingForm] = useState({ preferred_date: '', preferred_time: '', notes: '' });
  const [viewingSubmitting, setViewingSubmitting] = useState(false);
  const [viewingSuccess, setViewingSuccess] = useState(false);
  const [slug, setSlug] = useState<string>('');
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [agencyProfile, setAgencyProfile] = useState<any>(null);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (slug) fetchProperty();
  }, [slug]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      // First try the database API
      const response = await fetch(`/api/properties/${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.property) {
          setProperty(data.property);
          // Try to fetch linked agent/agency (DB-primary)
          try {
            const ownerId = (data.property as any).owner_id;
            if (ownerId) {
              const ar = await fetch(`/api/agents?user_id=${ownerId}&limit=1`);
              if (ar.ok) {
                const aj = await ar.json();
                if (aj.agents && aj.agents.length > 0) {
                  setAgentProfile(aj.agents[0]);
                  if (aj.agents[0].agency_id) {
                    const agRes = await fetch(`/api/agencies?limit=100`);
                    // we could fetch agency by id via agencies/[slug] but we have agency_id, try to fetch single via supabase directly
                    // fallback: try agencies api with id filter via slug not available, so try to fetch via agents expand already includes agencies
                    if (aj.agents[0].agencies) setAgencyProfile(aj.agents[0].agencies);
                    else {
                      const agFetch = await fetch(`/api/agencies`);
                      if (agFetch.ok) {
                        const agJ = await agFetch.json();
                        const found = (agJ.agencies || []).find((a: any) => a.id === aj.agents[0].agency_id);
                        if (found) setAgencyProfile(found);
                      }
                    }
                  }
                }
              }
            }
          } catch {}
          setLoading(false);
          return;
        }
      }

      // Fallback: check sample properties from static data
      const sampleMatch = sampleProperties.find(p => p.slug === slug);
      if (sampleMatch) {
        // Convert sample property to match the Property interface
        setProperty({
          id: sampleMatch.id,
          slug: sampleMatch.slug,
          title: sampleMatch.title,
          type: sampleMatch.type,
          property_type: sampleMatch.propertyType,
          price: sampleMatch.price,
          price_period: sampleMatch.pricePeriod,
          bedrooms: sampleMatch.bedrooms,
          bathrooms: sampleMatch.bathrooms,
          toilets: sampleMatch.toilets,
          sqm: sampleMatch.sqm,
          parking: sampleMatch.parking,
          area: sampleMatch.area,
          state: sampleMatch.state,
          lga: sampleMatch.lga,
          address: sampleMatch.address,
          description: sampleMatch.description,
          features: sampleMatch.features,
          amenities: [],
          verification_status: sampleMatch.verificationStatus || 'verified',
          status: sampleMatch.status,
          featured: sampleMatch.featured,
          views: sampleMatch.views,
          saves: 0,
          furnished: sampleMatch.furnished,
          serviced: sampleMatch.serviced,
          gated_estate: sampleMatch.gatedEstate,
          documentation: sampleMatch.documentation,
          payment_plan: sampleMatch.paymentPlan,
          paymentPlan: sampleMatch.paymentPlan,
          development_status: sampleMatch.developmentStatus,
          developmentStatus: sampleMatch.developmentStatus,
          coordinates: sampleMatch.coordinates,
          landmarks: sampleMatch.landmarks,
          region: sampleMatch.region,
          date_added: sampleMatch.dateAdded,
          property_images: sampleMatch.images.map((url, i) => ({
            url,
            display_order: i,
            is_primary: i === 0,
          })),
        });
        setLoading(false);
        return;
      }

      setError('Property not found');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: property?.id }),
      });
      const data = await response.json();
      setIsSaved(data.saved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiryForm,
          property_id: property?.id,
          source: 'property_detail',
        }),
      });
      if (!response.ok) throw new Error('Failed to submit');
      setEnquirySuccess(true);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Enquiry error:', error);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const handleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewingSubmitting(true);
    try {
      const response = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...viewingForm,
          property_id: property?.id,
        }),
      });
      if (!response.ok) throw new Error('Failed to schedule');
      setViewingSuccess(true);
      setViewingForm({ preferred_date: '', preferred_time: '', notes: '' });
    } catch (error) {
      console.error('Viewing error:', error);
    } finally {
      setViewingSubmitting(false);
    }
  };

  const formatPrice = (price: number, period?: string) => {
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B${period ? `/${period}` : ''}`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M${period ? `/${period}` : ''}`;
    return `₦${price.toLocaleString()}${period ? `/${period}` : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal-900 mb-4">Property Not Found</h1>
          <p className="text-charcoal-500 mb-6">{error || 'This property may have been removed.'}</p>
          <Link href="/properties" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.property_images || [];

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Back Button */}
      <div className="bg-white border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-charcoal-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {images.length > 0 ? (
                <div className="relative">
                  <img
                    src={images[currentImage]?.url}
                    alt={images[currentImage]?.alt_text || property.title}
                    className="w-full h-96 object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === currentImage ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-charcoal-100 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-charcoal-300" />
                </div>
              )}
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        i === currentImage ? 'border-green-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      property.type === 'sale' ? 'bg-green-100 text-green-700' :
                      property.type === 'rent' ? 'bg-blue-100 text-blue-700' :
                      property.type === 'land' ? 'bg-amber-100 text-amber-700' :
                      'bg-charcoal-100 text-charcoal-700'
                    }`}>
                      {property.type === 'sale' ? 'For Sale' :
                       property.type === 'rent' ? 'For Rent' :
                       property.type === 'land' ? 'Land' :
                       property.type}
                    </span>
                    {property.verification_status === 'verified' && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {property.verification_status === 'pending' && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Verification Pending
                      </span>
                    )}
                    {property.verification_status === 'unverified' && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif text-charcoal-900">{property.title}</h1>
                  <div className="flex items-center gap-1 text-charcoal-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    {property.address && <span>{property.address}, </span>}
                    {property.area}, {property.state}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSave}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                      isSaved ? 'bg-green-50 border-green-300 text-green-600' : 'border-charcoal-200 text-charcoal-400 hover:text-green-600'
                    }`}
                  >
                    {isSaved ? <Bookmark className="w-5 h-5 fill-current" /> : <BookmarkPlus className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-charcoal-200 text-charcoal-400 hover:text-green-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-3xl font-bold text-green-600 mb-6">
                {formatPrice(property.price, property.price_period)}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="text-center p-3 bg-ivory-50 rounded-lg">
                    <Bed className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-charcoal-900">{property.bedrooms}</p>
                    <p className="text-xs text-charcoal-500">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center p-3 bg-ivory-50 rounded-lg">
                    <Bath className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-charcoal-900">{property.bathrooms}</p>
                    <p className="text-xs text-charcoal-500">Bathrooms</p>
                  </div>
                )}
                {property.sqm > 0 && (
                  <div className="text-center p-3 bg-ivory-50 rounded-lg">
                    <Square className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-charcoal-900">{property.sqm}</p>
                    <p className="text-xs text-charcoal-500">Sqm</p>
                  </div>
                )}
                {property.parking > 0 && (
                  <div className="text-center p-3 bg-ivory-50 rounded-lg">
                    <Car className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-charcoal-900">{property.parking}</p>
                    <p className="text-xs text-charcoal-500">Parking</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif text-charcoal-900 mb-4">Description</h2>
                <p className="text-charcoal-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif text-charcoal-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...(property.features || []), ...(property.amenities || [])].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-charcoal-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad — Property detail (in-content) */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <AdSense label="Property Detail — In-content" format="horizontal" />
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-serif text-charcoal-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-charcoal-500">Property Type</span>
                  <p className="font-medium text-charcoal-900">{property.property_type}</p>
                </div>
                <div>
                  <span className="text-sm text-charcoal-500">Listing Type</span>
                  <p className="font-medium text-charcoal-900 capitalize">{property.type}</p>
                </div>
                {property.documentation && (
                  <div>
                    <span className="text-sm text-charcoal-500">Documentation</span>
                    <p className="font-medium text-charcoal-900 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-green-500" />
                      {property.documentation}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-charcoal-500">Date Listed</span>
                  <p className="font-medium text-charcoal-900">
                    {new Date(property.published_at || property.date_added).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-charcoal-500">Furnished</span>
                  <p className="font-medium text-charcoal-900">{property.furnished ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-charcoal-500">Serviced</span>
                  <p className="font-medium text-charcoal-900">{property.serviced ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-charcoal-500">Gated Estate</span>
                  <p className="font-medium text-charcoal-900">{property.gated_estate ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-charcoal-500">Views</span>
                  <p className="font-medium text-charcoal-900 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {property.views}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className={`rounded-xl p-5 border ${
              property.verification_status === 'verified' ? 'bg-green-50 border-green-200' :
              property.verification_status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {property.verification_status === 'verified' ? (
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : property.verification_status === 'pending' ? (
                  <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium text-charcoal-900 mb-1">
                    {property.verification_status === 'verified' ? 'Verified Property' :
                     property.verification_status === 'pending' ? 'Verification In Progress' :
                     'Unverified Property'}
                  </h3>
                  <p className="text-sm text-charcoal-600">
                    {property.verification_status === 'verified'
                      ? 'This property has been verified by our team. Documentation and ownership have been confirmed.'
                      : property.verification_status === 'pending'
                      ? 'This property is currently undergoing our verification process. We recommend waiting for verification before making any commitments.'
                      : 'This property has not been verified by our team. Please exercise caution and conduct your own due diligence.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Details — Payment Plan + Development Status */}
            {(property.payment_plan || property.paymentPlan || property.development_status || property.developmentStatus || property.region) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif text-charcoal-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Investment Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {(property.payment_plan || property.paymentPlan) && (
                    <div className="bg-ivory-50 rounded-lg p-4">
                      <p className="text-xs text-charcoal-500 uppercase tracking-wide mb-1 font-bold">Payment Plan</p>
                      <p className="font-bold text-charcoal-900 text-sm">{property.payment_plan || property.paymentPlan}</p>
                    </div>
                  )}
                  {(property.development_status || property.developmentStatus) && (
                    <div className="bg-ivory-50 rounded-lg p-4">
                      <p className="text-xs text-charcoal-500 uppercase tracking-wide mb-1 font-bold">Development Status</p>
                      <p className="font-bold text-charcoal-900 text-sm flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-green-600" />
                        {property.development_status || property.developmentStatus}
                      </p>
                    </div>
                  )}
                  {property.region && (
                    <div className="bg-ivory-50 rounded-lg p-4">
                      <p className="text-xs text-charcoal-500 uppercase tracking-wide mb-1 font-bold">Region</p>
                      <p className="font-bold text-charcoal-900 text-sm">{property.region}</p>
                    </div>
                  )}
                  {property.documentation && (
                    <div className="bg-ivory-50 rounded-lg p-4">
                      <p className="text-xs text-charcoal-500 uppercase tracking-wide mb-1 font-bold">Title / Documentation</p>
                      <p className="font-bold text-charcoal-900 text-sm flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-green-600" />
                        {property.documentation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nearby Landmarks */}
            {property.landmarks && property.landmarks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif text-charcoal-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-green-600" />
                  Nearby Landmarks
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {property.landmarks.map((landmark: string) => (
                    <div key={landmark} className="bg-ivory-50 rounded-lg p-3 text-center">
                      <MapPin className="w-4 h-4 text-forest mx-auto mb-1" />
                      <p className="text-xs font-semibold text-charcoal-900">{landmark}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {property.coordinates && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif text-charcoal-900 mb-4 flex items-center gap-2">
                  <Map className="w-5 h-5 text-green-600" />
                  Location Map
                </h2>
                <div className="rounded-xl overflow-hidden border border-charcoal-200 h-64">
                  <iframe
                    title={`Map of ${property.title}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.coordinates.lng - 0.008}%2C${property.coordinates.lat - 0.004}%2C${property.coordinates.lng + 0.008}%2C${property.coordinates.lat + 0.004}&layer=mapnik&marker=${property.coordinates.lat}%2C${property.coordinates.lng}`}
                  />
                </div>
                <p className="text-xs text-charcoal-500 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {property.address && `${property.address}, `}{property.area}, {property.state}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-serif text-lg text-charcoal-900 mb-4">Contact Agent</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  {(agentProfile?.photo_url || property.agents?.photo_url) ? (
                    <img src={agentProfile?.photo_url || property.agents?.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-charcoal-900 flex items-center gap-1">
                    {agentProfile?.name || property.agents?.name || 'De-Greenacres Properties'}
                    {(agentProfile?.is_verified || !agentProfile) && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold"><CheckCircle className="w-3 h-3" /> Verified</span>}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    {agencyProfile?.name ? (
                      <Link href={`/agencies/${agencyProfile.slug}`} className="text-forest hover:underline font-semibold">{agencyProfile.name}</Link>
                    ) : agentProfile?.agencies?.name ? (
                      <Link href={`/agencies/${agentProfile.agencies.slug}`} className="text-forest hover:underline font-semibold">{agentProfile.agencies.name}</Link>
                    ) : (
                      'Verified Agent'
                    )}
                  </p>
                  {agentProfile && (
                    <Link href={`/agents/${agentProfile.slug}`} className="text-xs text-forest font-bold hover:underline">View agent profile →</Link>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${agentProfile?.phone || property.agents?.phone || '+2348065019971'}`}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Agent
                </a>
                <a
                  href={`https://wa.me/${(agentProfile?.whatsapp || agentProfile?.phone || '2347041754800').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${agentProfile?.name || 'De-Greenacres'}, I'm interested in: ${property.title} at ${property.area}, ${property.state}. Price: ₦${(property.price || 0).toLocaleString()}.${property.documentation ? ' Documentation: ' + property.documentation + '.' : ''}${property.bedrooms ? ' ' + property.bedrooms + ' bedrooms.' : ''} Please send more details and available inspection dates.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-medium hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp
                </a>
                <button
                  onClick={() => setShowEnquiry(!showEnquiry)}
                  className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Enquiry
                </button>
                <Link
                  href={`/book-inspection?property=${encodeURIComponent(property.title || '')}&location=${encodeURIComponent(property.area || '')}&state=${encodeURIComponent(property.state || '')}`}
                  className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3 rounded-lg font-bold hover:bg-forest-light transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Request Property Inspection
                </Link>
              </div>

              {/* Enquiry Form */}
              {showEnquiry && (
                <div className="mt-4 pt-4 border-t border-charcoal-100">
                  {enquirySuccess ? (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-charcoal-600">Enquiry sent successfully!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquiry} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <textarea
                        placeholder="Your Message"
                        required
                        rows={3}
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={enquirySubmitting}
                        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {enquirySubmitting ? 'Sending...' : 'Send Enquiry'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Viewing Form */}
              {showViewing && (
                <div className="mt-4 pt-4 border-t border-charcoal-100">
                  {viewingSuccess ? (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-charcoal-600">Viewing request submitted!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleViewing} className="space-y-3">
                      <div>
                        <label className="text-xs text-charcoal-500 mb-1 block">Preferred Date</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={viewingForm.preferred_date}
                          onChange={(e) => setViewingForm({ ...viewingForm, preferred_date: e.target.value })}
                          className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-charcoal-500 mb-1 block">Preferred Time</label>
                        <input
                          type="time"
                          required
                          value={viewingForm.preferred_time}
                          onChange={(e) => setViewingForm({ ...viewingForm, preferred_time: e.target.value })}
                          className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <textarea
                        placeholder="Additional notes (optional)"
                        rows={2}
                        value={viewingForm.notes}
                        onChange={(e) => setViewingForm({ ...viewingForm, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={viewingSubmitting}
                        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {viewingSubmitting ? 'Scheduling...' : 'Schedule Viewing'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Ad — Sidebar rectangle (below agent card, sticky) */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <AdSense label="Property Detail — Sidebar" format="rectangle" className="min-h-[250px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
