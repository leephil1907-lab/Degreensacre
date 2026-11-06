'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2, MapPin, Navigation, Search, X } from 'lucide-react';
import LocationMap, { type LocationMapMarker } from './LocationMap';
import { formatPropertyPrice, getPropertyAddress, getPropertyCoordinates, type PropertyLocation } from '@/lib/property';

export type MapProperty = PropertyLocation & {
  id: string;
  slug: string;
  title: string;
  price: number;
  price_period?: string | null;
  property_type?: string | null;
};

type AddressResult = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  category: string;
  type: string;
  address: Record<string, string>;
};

type PropertyMapViewProps = {
  properties: MapProperty[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string | null) => void;
  initialAddress?: string;
  className?: string;
  emptyMessage?: string;
  showSearch?: boolean;
};

export default function PropertyMapView({
  properties,
  selectedPropertyId = null,
  onSelectProperty,
  initialAddress = '',
  className = 'h-[34rem]',
  emptyMessage = 'No saved property locations match this view.',
  showSearch = true,
}: PropertyMapViewProps) {
  const [query, setQuery] = useState(initialAddress);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<AddressResult | null>(null);

  useEffect(() => { setQuery(initialAddress); }, [initialAddress]);
  useEffect(() => {
    if (selectedPropertyId) setSelectedPlace(null);
  }, [selectedPropertyId]);

  const mappedProperties = useMemo(() => properties.map((property) => ({ property, coordinates: getPropertyCoordinates(property) })).filter((item) => item.coordinates !== null), [properties]);
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId) || null;
  const selectedPropertyCoordinates = selectedProperty ? getPropertyCoordinates(selectedProperty) : null;

  const markers = useMemo<LocationMapMarker[]>(() => {
    const propertyMarkers: LocationMapMarker[] = mappedProperties.map(({ property, coordinates }) => ({
      id: property.id,
      position: coordinates!,
      title: property.title,
      subtitle: `${formatPropertyPrice(property.price, property.price_period)} · ${getPropertyAddress(property)}`,
      href: `/properties/${property.slug}`,
      linkLabel: 'View property',
      kind: 'property' as const,
    }));
    if (selectedPlace) {
      propertyMarkers.push({
        id: `address-${selectedPlace.id}`,
        position: { lat: selectedPlace.lat, lng: selectedPlace.lng },
        title: selectedPlace.name || 'Address search result',
        subtitle: selectedPlace.displayName,
        kind: 'search',
      });
    }
    return propertyMarkers;
  }, [mappedProperties, selectedPlace]);

  const searchAddress = async (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) {
      setSearchError('Enter an address, neighbourhood or landmark to search.');
      return;
    }
    setSearching(true);
    setSearchError('');
    setResults([]);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Address search failed.');
      const matches = (data.results || []) as AddressResult[];
      setResults(matches);
      if (matches.length === 0) {
        setSelectedPlace(null);
        setSearchError('This address was not found in OpenStreetMap. Try the neighbourhood and state, a nearby landmark, or search Google Maps below.');
      } else if (matches.length === 1) {
        setSelectedPlace(matches[0]);
        setResults([]);
        onSelectProperty?.(null);
      } else {
        // Nominatim can rank a school, embassy or business above the
        // neighbourhood of the same name. Never guess between multiple places.
        setSelectedPlace(null);
        onSelectProperty?.(null);
      }
    } catch (error) {
      setSelectedPlace(null);
      setSearchError(error instanceof Error ? error.message : 'Address search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const choosePlace = (place: AddressResult) => {
    setSelectedPlace(place);
    setResults([]);
    setSearchError('');
    onSelectProperty?.(null);
  };

  const selectedMarkerId = selectedPlace ? `address-${selectedPlace.id}` : selectedPropertyId;
  const placeType = selectedPlace?.type ? `${selectedPlace.type}${selectedPlace.category ? ` · ${selectedPlace.category}` : ''}` : selectedPlace?.category;

  return (
    <div className={`relative isolate w-full overflow-hidden bg-forest-50 ${className}`}>
      <LocationMap markers={markers} selectedId={selectedMarkerId} zoom={properties.length === 1 ? 16 : 6} focusZoom={selectedPlace ? 17 : 15} onSelect={(id) => {
        if (id.startsWith('address-')) return;
        setSelectedPlace(null);
        onSelectProperty?.(id);
      }} autoFit={!selectedPlace} />

      {showSearch && (
        <div className="absolute left-3 right-3 top-3 z-[500] sm:left-4 sm:right-auto sm:w-[26rem]">
          <form onSubmit={searchAddress} className="flex gap-2 rounded-xl border border-forest/10 bg-white p-2 shadow-lg" role="search">
            <label htmlFor="property-address-search" className="sr-only">Find an address or landmark in Nigeria</label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input id="property-address-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an address or landmark" className="h-10 w-full rounded-lg border border-transparent bg-gray-50 pl-8 pr-2 text-base text-charcoal outline-none transition focus:border-forest focus:bg-white sm:text-sm" />
            </div>
            <button type="submit" disabled={searching} className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-forest px-3 text-xs font-extrabold text-white transition-colors hover:bg-forest-light disabled:opacity-60">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </form>
          {(results.length > 0 || searchError) && (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-forest/10 bg-white p-2 shadow-xl">
              {searchError && <div className="px-3 py-2"><p role="alert" className="text-xs leading-5 text-gray-700">{searchError}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ', Nigeria')}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center text-xs font-bold text-forest underline">Search this address on Google Maps ↗</a><p className="text-[11px] leading-5 text-gray-500">External search; this does not confirm the property location.</p></div>}
              {results.length > 1 && <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-wide text-gray-400">Choose the correct match</p>}
              {results.map((result) => (
                <button key={result.id} type="button" onClick={() => choosePlace(result)} className={`block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-forest-50 ${selectedPlace?.id === result.id ? 'bg-forest-50' : ''}`}>
                  <span className="block text-xs font-bold text-charcoal">{result.name || result.type || 'Matched place'}</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-gray-500">{result.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedPlace && properties.length > 0 && (
        <div className="absolute bottom-3 left-3 z-[400] rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-gray-600 shadow-md backdrop-blur-sm">
          {mappedProperties.length} mapped{properties.length - mappedProperties.length > 0 ? ` · ${properties.length - mappedProperties.length} awaiting location` : ''}
        </div>
      )}

      {markers.length === 0 && !searching && (
        <div className="pointer-events-none absolute inset-0 z-[300] flex items-center justify-center p-5 pt-20">
          <div className="max-w-sm rounded-2xl border border-forest/10 bg-white/95 p-5 text-center shadow-xl backdrop-blur-sm">
            <MapPin className="mx-auto h-7 w-7 text-forest" />
            <p className="mt-3 font-display text-xl text-charcoal">{emptyMessage}</p>
            <p className="mt-2 text-xs leading-5 text-gray-500">Search an address to explore the area. Exact property locations should be confirmed with the listing agent.</p>
          </div>
        </div>
      )}

      {selectedPlace && (
        <div className="absolute bottom-3 left-3 right-3 z-[500] rounded-xl border border-forest/10 bg-white p-4 shadow-xl sm:right-auto sm:max-w-md">
          <button type="button" onClick={() => setSelectedPlace(null)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-charcoal" aria-label="Close address result"><X className="h-4 w-4" /></button>
          <p className="pr-8 text-[10px] font-extrabold uppercase tracking-[0.15em] text-amber-700">Address search result</p>
          <p className="mt-1 pr-8 font-sans text-sm font-extrabold text-charcoal">{selectedPlace.name || 'Matched place'}{placeType ? <span className="font-normal text-gray-400"> · {placeType}</span> : null}</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">{selectedPlace.displayName}</p>
          <p className="mt-1 text-[10px] text-gray-400">{selectedPlace.lat.toFixed(5)}, {selectedPlace.lng.toFixed(5)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lng}#map=17/${selectedPlace.lat}/${selectedPlace.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-forest hover:underline">Open larger map <ExternalLink className="h-3 w-3" /></a>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-forest hover:underline"><Navigation className="h-3 w-3" /> Directions</a>
          </div>
        </div>
      )}

      {!selectedPlace && selectedProperty && selectedPropertyCoordinates && (
        <div className="absolute bottom-3 left-3 right-3 z-[450] rounded-xl border border-forest/10 bg-white p-4 shadow-xl sm:left-4 sm:right-auto sm:w-80">
          <p className="font-sans text-sm font-extrabold text-charcoal">{selectedProperty.title}</p>
          <p className="mt-1 text-xs font-bold text-forest">{formatPropertyPrice(selectedProperty.price, selectedProperty.price_period)}</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">{getPropertyAddress(selectedProperty)}</p>
          <div className="mt-3 flex gap-4">
            <a href={`/properties/${selectedProperty.slug}`} className="text-xs font-extrabold text-forest hover:underline">View listing</a>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPropertyCoordinates.lat},${selectedPropertyCoordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-forest hover:underline"><Navigation className="h-3 w-3" /> Directions</a>
          </div>
        </div>
      )}
    </div>
  );
}
