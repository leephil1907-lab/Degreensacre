'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: 'office' | 'property' | 'landmark';
  address?: string;
  description?: string;
}

interface MapComponentProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onLocationClick?: (location: Location) => void;
}

// Fix Leaflet default marker icon issue with Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// Custom colored markers using SVG
const createCustomIcon = (type: string) => {
  const colors: Record<string, string> = {
    office: '#2D5016',    // Forest green
    property: '#C41E7A',  // Magenta
    landmark: '#87A96B',  // Sage green
  };
  const color = colors[type] || '#2D5016';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 36px; height: 44px;">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="${color}"/>
          <circle cx="18" cy="18" r="8" fill="white"/>
          <text x="18" y="22" text-anchor="middle" font-size="12" fill="${color}">
            ${type === 'office' ? '🏢' : type === 'property' ? '🏠' : '📍'}
          </text>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

// Component to fly to a location when center prop changes
function FlyToLocation({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.2 });
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

export default function MapComponent({
  locations,
  center = { lat: 9.082, lng: 8.6753 },
  zoom = 6,
  height = '500px',
  onLocationClick,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    fixLeafletIcons();
    setIsMounted(true);
  }, []);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  if (!isMounted) {
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
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation center={center} zoom={zoom} />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.position.lat, location.position.lng]}
            icon={createCustomIcon(location.type)}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', color: '#1A1A1A' }}>
                  {location.name}
                </h3>
                {location.address && (
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>{location.address}</p>
                )}
                {location.description && (
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{location.description}</p>
                )}
                {location.type === 'office' && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: '#2D5016', fontWeight: '600' }}
                  >
                    Get Directions →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
