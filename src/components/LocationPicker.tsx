'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, MapPin, Navigation, Search, X } from 'lucide-react';
import { getPropertyAddress, parseCoordinates, type PropertyLocation } from '@/lib/property';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => <div className="grid h-72 place-items-center rounded-xl bg-gray-50"><Loader2 className="h-6 w-6 animate-spin text-forest" /></div>,
});

type AddressResult = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
};

export default function LocationPicker({ location, latitude, longitude, onChange }: {
  location: PropertyLocation;
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}) {
  const value = useMemo(() => parseCoordinates({ lat: latitude, lng: longitude }), [latitude, longitude]);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [matchedAddress, setMatchedAddress] = useState('');
  const [message, setMessage] = useState('');
  const addressQuery = getPropertyAddress(location, true);
  const previousAddress = useRef(addressQuery);

  useEffect(() => {
    if (previousAddress.current !== addressQuery) {
      previousAddress.current = addressQuery;
      if (value) setMessage('The address changed. Review the map point before saving this listing.');
    }
  }, [addressQuery, value]);

  const markers = useMemo(() => value ? [{ id: 'property-location', position: value, title: 'Property location', subtitle: addressQuery, kind: 'editable' as const }] : [], [value, addressQuery]);

  const locate = async () => {
    if (addressQuery.replaceAll(',', '').trim().length < 3) {
      setMessage('Add at least an area and state before searching.');
      return;
    }
    setSearching(true);
    setMessage('');
    setResults([]);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(addressQuery)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Address search failed.');
      const matches = (data.results || []) as AddressResult[];
      setResults(matches);
      if (!matches.length) {
        setMessage('No match was found. Try a nearby landmark, or click the map only if you can confirm the exact location.');
        return;
      }
      if (matches.length === 1) {
        chooseResult(matches[0]);
        setResults([]);
      } else {
        setMessage('Several places matched. Review the alternatives below and choose the correct one; no location has been selected automatically.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Address search failed.');
    } finally {
      setSearching(false);
    }
  };

  const chooseResult = (result: AddressResult) => {
    onChange(String(result.lat), String(result.lng));
    setMatchedAddress(result.displayName);
    setResults([]);
    setMessage('');
  };

  const updateCoordinate = (key: 'lat' | 'lng', input: string) => {
    onChange(key === 'lat' ? input : latitude, key === 'lng' ? input : longitude);
  };

  return (
    <div className="md:col-span-2 rounded-2xl border border-forest/10 bg-forest-50/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-sans text-sm font-extrabold text-charcoal">Map location</h4>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">Locate the address, choose the correct match, then drag the marker to the confirmed property entrance. Do not guess an exact point.</p>
        </div>
        <button type="button" onClick={() => void locate()} disabled={searching} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2 text-xs font-extrabold text-white hover:bg-forest-light disabled:opacity-60">
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{searching ? 'Searching…' : 'Locate address'}
        </button>
      </div>

      {message && <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-gray-600" role="status">{message}</p>}
      {results.length > 1 && (
        <div className="mt-3 grid gap-2 rounded-xl border border-gray-200 bg-white p-2">
          <p className="px-2 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-gray-400">Choose the correct address</p>
          {results.map((result) => <button key={result.id} type="button" onClick={() => chooseResult(result)} className="rounded-lg px-3 py-2 text-left transition-colors hover:bg-forest-50"><span className="block text-xs font-bold text-charcoal">{result.name || result.type || 'Matched place'}</span><span className="mt-0.5 block text-[11px] leading-4 text-gray-500">{result.displayName}</span></button>)}
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label><span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Latitude</span><input type="number" step="any" min="-90" max="90" value={latitude} onChange={(event) => updateCoordinate('lat', event.target.value)} placeholder="e.g. 6.428100" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" /></label>
        <label><span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Longitude</span><input type="number" step="any" min="-180" max="180" value={longitude} onChange={(event) => updateCoordinate('lng', event.target.value)} placeholder="e.g. 3.421900" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" /></label>
      </div>

      {matchedAddress && <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-gray-500"><Navigation className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" /><span><strong className="text-gray-700">Geocoder match:</strong> {matchedAddress}</span></p>}

      {value ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <LocationMap markers={markers} selectedId="property-location" onPickLocation={(coordinates) => { onChange(coordinates.lat.toFixed(7), coordinates.lng.toFixed(7)); setMessage('Map point adjusted. Confirm it before saving.'); }} editable autoFit={false} zoom={16} className="h-72" label="Editable property location" />
          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-forest" /> Click the map or drag the marker to refine.</span>
            <button type="button" onClick={() => { onChange('', ''); setMatchedAddress(''); setResults([]); setMessage('Map location cleared.'); }} className="inline-flex items-center gap-1 self-start font-bold text-red-700 hover:underline"><X className="h-3.5 w-3.5" /> Clear location</button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white/70 px-4 py-5 text-center text-xs leading-5 text-gray-500">No coordinates saved. The public map will label this listing as awaiting a location instead of inventing one.</div>
      )}
    </div>
  );
}
