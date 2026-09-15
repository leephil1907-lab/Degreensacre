'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

interface Location {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: 'office' | 'property' | 'landmark';
  address?: string;
  description?: string;
}

interface GoogleMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onLocationClick?: (location: Location) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export default function GoogleMapComponent({
  locations,
  center = { lat: 9.082, lng: 8.6753 }, // Default to Nigeria center
  zoom = 6,
  height = '500px',
  onLocationClick
}: GoogleMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'office':
        return '🏢';
      case 'property':
        return '🏠';
      case 'landmark':
        return '📍';
      default:
        return '📌';
    }
  };

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">Map Loading Error</p>
        <p className="text-red-600 text-sm">
          Unable to load Google Maps. Please check your API key configuration.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            onClick={() => handleMarkerClick(location)}
            label={{
              text: getMarkerIcon(location.type),
              fontSize: '24px'
            }}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.position}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-3 max-w-xs">
              <h3 className="font-bold text-charcoal mb-1">{selectedLocation.name}</h3>
              {selectedLocation.address && (
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
              )}
              {selectedLocation.description && (
                <p className="text-xs text-gray-500">{selectedLocation.description}</p>
              )}
              {selectedLocation.type === 'office' && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.position.lat},${selectedLocation.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-forest hover:text-forest-light font-semibold"
                >
                  Get Directions →
                </a>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
