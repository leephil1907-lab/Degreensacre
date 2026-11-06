'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PropertyCoordinates } from '@/lib/property';

export type LocationMapMarker = {
  id: string;
  position: PropertyCoordinates;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  kind?: 'property' | 'search' | 'editable';
};

type LocationMapProps = {
  markers: LocationMapMarker[];
  center?: PropertyCoordinates;
  zoom?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onPickLocation?: (coordinates: PropertyCoordinates) => void;
  editable?: boolean;
  autoFit?: boolean;
  focusZoom?: number;
  className?: string;
  label?: string;
};

const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };

export default function LocationMap({
  markers,
  center = NIGERIA_CENTER,
  zoom = 6,
  selectedId = null,
  onSelect,
  onPickLocation,
  editable = false,
  autoFit = true,
  focusZoom = 15,
  className = '',
  label = 'Interactive property location map',
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markerRefs = useRef(new Map<string, L.Marker>());
  const fittedSignatureRef = useRef('');
  const initialViewRef = useRef({ center, zoom });
  const onSelectRef = useRef(onSelect);
  const onPickRef = useRef(onPickLocation);
  const [ready, setReady] = useState(false);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onPickRef.current = onPickLocation; }, [onPickLocation]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const { center: initialCenter, zoom: initialZoom } = initialViewRef.current;
    const map = L.map(containerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: false,
      scrollWheelZoom: false,
      keyboard: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    const layer = L.layerGroup().addTo(map);
    map.on('click', (event: L.LeafletMouseEvent) => {
      onPickRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    });
    mapRef.current = map;
    layerRef.current = layer;
    setReady(true);
    const frame = window.requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.cancelAnimationFrame(frame);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markerRefs.current.clear();
    };
  }, []);

  const markerSignature = markers.map((marker) => `${marker.id}:${marker.position.lat.toFixed(6)},${marker.position.lng.toFixed(6)}`).join('|');

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !map || !layer) return;

    layer.clearLayers();
    markerRefs.current.clear();
    if (!markerSignature) fittedSignatureRef.current = '';

    markers.forEach((item) => {
      const kind = item.kind || 'property';
      const icon = L.divIcon({
        className: `location-marker location-marker--${kind}${selectedId === item.id ? ' location-marker--selected' : ''}`,
        html: `<div class="location-marker__pin"><span>${kind === 'search' ? 'A' : kind === 'editable' ? '✓' : '⌂'}</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 34],
        popupAnchor: [0, -32],
      });
      const marker = L.marker([item.position.lat, item.position.lng], {
        icon,
        draggable: editable,
        autoPan: editable,
        title: item.title,
        alt: item.title,
      });

      const popup = document.createElement('div');
      popup.className = 'min-w-[190px] max-w-[240px] font-sans';
      const title = document.createElement('p');
      title.className = 'font-bold text-charcoal';
      title.textContent = item.title;
      popup.appendChild(title);
      if (item.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.className = 'mt-1 text-xs leading-5 text-gray-500';
        subtitle.textContent = item.subtitle;
        popup.appendChild(subtitle);
      }
      if (item.href) {
        const link = document.createElement('a');
        link.className = 'mt-2 inline-block text-xs font-extrabold text-forest underline underline-offset-2';
        link.href = item.href;
        link.textContent = item.linkLabel || 'View details';
        popup.appendChild(link);
      }
      if (editable) {
        const hint = document.createElement('p');
        hint.className = 'mt-2 text-[11px] text-gray-400';
        hint.textContent = 'Drag the marker or click the map to refine this location.';
        popup.appendChild(hint);
      }

      marker.bindPopup(popup, { maxWidth: 280, closeButton: true });
      marker.on('click', () => onSelectRef.current?.(item.id));
      if (editable) {
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          onPickRef.current?.({ lat: position.lat, lng: position.lng });
        });
      }
      marker.addTo(layer);
      markerRefs.current.set(item.id, marker);
    });

    if (autoFit && markerSignature && fittedSignatureRef.current !== markerSignature) {
      fittedSignatureRef.current = markerSignature;
      if (markers.length === 1) {
        map.setView([markers[0].position.lat, markers[0].position.lng], Math.max(zoom, 14));
      } else if (markers.length > 1) {
        map.fitBounds(L.latLngBounds(markers.map((item) => [item.position.lat, item.position.lng] as [number, number])).pad(0.18), { maxZoom: 15 });
      }
    }
  }, [ready, markers, markerSignature, editable, autoFit, zoom, selectedId]);

  useEffect(() => {
    if (!ready || !selectedId) return;
    const map = mapRef.current;
    const marker = markerRefs.current.get(selectedId);
    if (!map || !marker) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), focusZoom), { duration: 0.55 });
    marker.openPopup();
  }, [ready, selectedId, markerSignature, focusZoom]);

  return <div ref={containerRef} className={`h-full min-h-64 w-full ${className}`} aria-label={label} />;
}
