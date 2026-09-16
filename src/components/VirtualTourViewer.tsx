'use client';

import { useState } from 'react';

interface VirtualTour {
  id: string;
  type: '360' | 'video' | 'drone' | 'floorplan';
  title: string;
  thumbnail: string;
  duration?: string;
  embedUrl?: string;
}

interface VirtualTourViewerProps {
  propertyId: string;
  propertyTitle: string;
  tours: VirtualTour[];
}

export default function VirtualTourViewer({ propertyId, propertyTitle, tours }: VirtualTourViewerProps) {
  const [activeTour, setActiveTour] = useState<VirtualTour | null>(tours[0] || null);
  const [activeTab, setActiveTab] = useState<string>('360');

  const toursByType = {
    '360': tours.filter(t => t.type === '360'),
    'video': tours.filter(t => t.type === 'video'),
    'drone': tours.filter(t => t.type === 'drone'),
    'floorplan': tours.filter(t => t.type === 'floorplan')
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '360':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'drone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'floorplan':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-charcoal mb-2">No Virtual Tours Available</h3>
          <p className="text-gray-600 mb-4">
            Virtual tours for this property are coming soon. Contact us to schedule an in-person viewing.
          </p>
          <a
            href={`https://wa.me/2347041754800?text=${encodeURIComponent(
              `Hello De-Greenacres, I'd like to schedule a physical viewing for ${propertyTitle}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Schedule Physical Viewing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-charcoal">Virtual Tour</h3>
            <p className="text-sm text-gray-600">Explore {propertyTitle} from anywhere</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {Object.entries(toursByType).map(([type, typeTours]) => {
          if (typeTours.length === 0) return null;
          return (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setActiveTour(typeTours[0]);
              }}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === type
                  ? 'text-forest border-b-2 border-forest'
                  : 'text-gray-600 hover:text-forest'
              }`}
            >
              {getTypeIcon(type)}
              <span className="capitalize">
                {type === '360' ? '360° Tours' : 
                 type === 'video' ? 'Video Tours' :
                 type === 'drone' ? 'Drone Footage' : 'Floor Plans'}
              </span>
              <span className="text-xs bg-ivory px-2 py-0.5 rounded-full">
                {typeTours.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Viewer */}
      <div className="p-6">
        {activeTour && (
          <div className="mb-6">
            <div className="relative bg-charcoal rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              {activeTour.embedUrl ? (
                <iframe
                  src={activeTour.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title={activeTour.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest/20 to-sage/20">
                  <div className="text-center text-white">
                    <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-semibold mb-2">{activeTour.title}</p>
                    <p className="text-sm text-white/70">
                      {activeTour.type === '360' && '360° Virtual Tour - Click and drag to explore'}
                      {activeTour.type === 'video' && `Video Tour - ${activeTour.duration || 'Available'}`}
                      {activeTour.type === 'drone' && `Drone Footage - ${activeTour.duration || 'Available'}`}
                      {activeTour.type === 'floorplan' && 'Interactive Floor Plan'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-charcoal">{activeTour.title}</h4>
              {activeTour.duration && (
                <p className="text-sm text-gray-600">Duration: {activeTour.duration}</p>
              )}
            </div>
          </div>
        )}

        {/* Tour Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {toursByType[activeTab as keyof typeof toursByType]?.map((tour) => (
            <button
              key={tour.id}
              onClick={() => setActiveTour(tour)}
              className={`relative rounded-lg overflow-hidden aspect-video transition-all ${
                activeTour?.id === tour.id
                  ? 'ring-2 ring-forest'
                  : 'hover:ring-2 hover:ring-forest/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-sage/20 flex items-center justify-center">
                {getTypeIcon(tour.type)}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-semibold line-clamp-1">{tour.title}</p>
                {tour.duration && (
                  <p className="text-white/70 text-xs">{tour.duration}</p>
                )}
              </div>
              {activeTour?.id === tour.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-forest rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-bold text-charcoal mb-4">Virtual Tour Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
              <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">HD Quality</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
              <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Mobile Friendly</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
              <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Fast Loading</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg">
              <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium text-charcoal">360° Navigation</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`https://wa.me/2347041754800?text=${encodeURIComponent(
              `Hello De-Greenacres, I've viewed the virtual tour for ${propertyTitle} and I'm interested. Please send me more details.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Discuss After Tour
          </a>
          <button className="btn-outline flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Live Tour
          </button>
        </div>
      </div>
    </div>
  );
}
