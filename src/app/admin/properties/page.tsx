'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Building2, CheckCircle, ExternalLink, FilePenLine, Loader2,
  Plus, Search, Trash2,
} from 'lucide-react';
import { NIGERIAN_STATES } from '@/lib/validation';
import { getPropertyCoordinates, type PropertyLocation } from '@/lib/property';
import LocationPicker from '@/components/LocationPicker';

type Property = Record<string, any> & { id: string; title: string; status: string };
type FormState = {
  slug: string; title: string; description: string; property_type: string; type: string;
  price: string; price_period: string; bedrooms: string; bathrooms: string; toilets: string;
  parking: string; sqm: string; land_size: string; address: string; area: string; lga: string;
  city: string; state: string; latitude: string; longitude: string; documentation: string; status: string; verification_status: string;
  furnished: boolean; serviced: boolean; gated_estate: boolean; featured: boolean; negotiable: boolean;
  features: string[]; amenities: string[]; images: string[];
};

const EMPTY_FORM: FormState = {
  slug: '', title: '', description: '', property_type: '', type: 'sale', price: '', price_period: '',
  bedrooms: '0', bathrooms: '0', toilets: '0', parking: '0', sqm: '0', land_size: '',
  address: '', area: '', lga: '', city: '', state: 'Lagos', latitude: '', longitude: '', documentation: '',
  status: 'draft', verification_status: 'pending', furnished: false, serviced: false,
  gated_estate: false, featured: false, negotiable: false, features: [], amenities: [], images: [],
};

const PROPERTY_TYPES = ['Detached Duplex', 'Semi-Detached Duplex', 'Terrace Duplex', 'Bungalow', 'Flat', 'Apartment', 'Penthouse', 'Mansion', 'Commercial Building', 'Office Space', 'Shop', 'Warehouse', 'Land', 'Mixed Use'];
const STATUSES = ['draft', 'pending_review', 'available', 'sold', 'rented', 'withdrawn'];
const VERIFICATION_STATUSES = ['pending', 'verified', 'unverified'];
const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10';

function toForm(property: Property): FormState {
  const text = (key: string, fallback = '') => property[key] === null || property[key] === undefined ? fallback : String(property[key]);
  const coordinates = getPropertyCoordinates(property as PropertyLocation);
  return {
    slug: text('slug'), title: text('title'), description: text('description'), property_type: text('property_type'), type: text('type', 'sale'),
    price: text('price'), price_period: text('price_period'), bedrooms: text('bedrooms', '0'), bathrooms: text('bathrooms', '0'), toilets: text('toilets', '0'),
    parking: text('parking', '0'), sqm: text('sqm', '0'), land_size: text('land_size'), address: text('address'), area: text('area'), lga: text('lga'),
    city: text('city'), state: text('state', 'Lagos'), latitude: coordinates ? String(coordinates.lat) : '', longitude: coordinates ? String(coordinates.lng) : '', documentation: text('documentation'), status: text('status', 'draft'), verification_status: text('verification_status', 'pending'),
    furnished: Boolean(property.furnished), serviced: Boolean(property.serviced), gated_estate: Boolean(property.gated_estate), featured: Boolean(property.featured), negotiable: Boolean(property.negotiable),
    features: Array.isArray(property.features) ? property.features : [], amenities: Array.isArray(property.amenities) ? property.amenities : [], images: Array.isArray(property.images) ? property.images : [],
  };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/properties', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Properties could not be loaded.');
      setProperties(data.properties || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Properties could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProperties(); }, [loadProperties]);

  const filtered = useMemo(() => properties.filter((property) => {
    if (statusFilter !== 'all' && property.status !== statusFilter) return false;
    const query = search.trim().toLowerCase();
    return !query || [property.title, property.slug, property.area, property.state].some((value) => String(value || '').toLowerCase().includes(query));
  }), [properties, search, statusFilter]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (!editing && key === 'title' && !slugTouched) next.slug = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return next;
    });
    if (key === 'slug') setSlugTouched(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setSlugTouched(false);
    setError('');
    setNotice('');
    setFormOpen(true);
  };

  const openEdit = (property: Property) => {
    setEditing(property);
    setForm(toForm(property));
    setSlugTouched(true);
    setError('');
    setNotice('');
    setFormOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const { latitude, longitude, ...fields } = form;
      const coordinates = latitude === '' && longitude === '' ? null : { lat: Number(latitude), lng: Number(longitude) };
      const response = await fetch(editing ? `/api/admin/properties?id=${editing.id}` : '/api/admin/properties', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, coordinates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The property could not be saved.');
      setFormOpen(false);
      setNotice(`Property ${editing ? 'updated' : 'created'} successfully.`);
      await loadProperties();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The property could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (property: Property) => {
    if (!window.confirm(`Delete “${property.title}” and remove it from the website? This cannot be undone.`)) return;
    setDeleting(property.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/properties?id=${property.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The property could not be deleted.');
      setNotice('Property deleted.');
      await loadProperties();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'The property could not be deleted.');
    } finally {
      setDeleting(null);
    }
  };

  const textField = (name: keyof FormState, label: string, options?: { type?: string; required?: boolean; full?: boolean; help?: string; placeholder?: string }) => (
    <div className={options?.full ? 'md:col-span-2' : ''}>
      <label htmlFor={`property-${name}`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">{label}{options?.required && <span className="ml-1 text-red-500">*</span>}</label>
      <input id={`property-${name}`} type={options?.type || 'text'} value={String(form[name])} min={options?.type === 'number' ? 0 : undefined} required={options?.required} placeholder={options?.placeholder} onChange={(event) => update(name, event.target.value as FormState[typeof name])} className={inputClass} />
      {options?.help && <p className="mt-2 text-xs text-gray-400">{options.help}</p>}
    </div>
  );

  const selectField = (name: keyof FormState, label: string, options: string[], required = false) => (
    <div>
      <label htmlFor={`property-${name}`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
      <select id={`property-${name}`} value={String(form[name])} required={required} onChange={(event) => update(name, event.target.value as FormState[typeof name])} className={inputClass}>
        <option value="">Select…</option>
        {options.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
      </select>
    </div>
  );

  const listField = (name: 'features' | 'amenities' | 'images', label: string, help: string) => (
    <div className="md:col-span-2">
      <label htmlFor={`property-${name}`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">{label}</label>
      <textarea id={`property-${name}`} value={form[name].join('\n')} onChange={(event) => update(name, event.target.value.split(/\r?\n/))} rows={name === 'images' ? 6 : 4} className={`${inputClass} resize-y`} />
      <p className="mt-2 text-xs text-gray-400">{help}</p>
    </div>
  );

  if (formOpen) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button onClick={() => setFormOpen(false)} disabled={saving} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Back to properties</button>
            <h2 className="font-display text-3xl text-charcoal">{editing ? 'Edit property' : 'Add property'}</h2>
            <p className="mt-2 text-sm text-gray-500">All listing fields are loaded into this editor. Saving replaces only the fields shown here.</p>
          </div>
          {editing?.status === 'available' && <Link href={`/properties/${editing.slug}`} target="_blank" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600"><ExternalLink className="h-4 w-4" /> Public page</Link>}
        </div>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={save} className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl text-charcoal">Basic information</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {textField('title', 'Listing title', { required: true, full: true })}
              {textField('slug', 'URL slug', { required: true, help: 'Lowercase letters, numbers and hyphens.' })}
              {selectField('property_type', 'Property type', PROPERTY_TYPES, true)}
              {selectField('type', 'Listing category', ['sale', 'rent', 'land', 'commercial', 'short-let'], true)}
              {textField('price', 'Price (₦)', { type: 'number', required: true })}
              {selectField('price_period', 'Price period', ['', 'one-time', 'per-year', 'per-month', 'per-week', 'per-night', 'per-sqm'])}
              <div className="md:col-span-2">
                <label htmlFor="property-description" className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Description <span className="text-red-500">*</span></label>
                <textarea id="property-description" value={form.description} onChange={(event) => update('description', event.target.value)} rows={7} minLength={50} required className={`${inputClass} resize-y`} />
                <p className="mt-2 text-xs text-gray-400">At least 50 characters. Include the property condition, title, nearby landmarks and buyer-relevant details.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl text-charcoal">Location</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {selectField('state', 'State', NIGERIAN_STATES, true)}
              {textField('city', 'City / town')}
              {textField('area', 'Area / neighbourhood', { required: true })}
              {textField('lga', 'Local government area')}
              {textField('address', 'Street address', { full: true })}
              <LocationPicker location={form} latitude={form.latitude} longitude={form.longitude} onChange={(latitude, longitude) => setForm((current) => ({ ...current, latitude, longitude }))} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl text-charcoal">Property details</h3>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {textField('bedrooms', 'Bedrooms', { type: 'number' })}
              {textField('bathrooms', 'Bathrooms', { type: 'number' })}
              {textField('toilets', 'Toilets', { type: 'number' })}
              {textField('parking', 'Parking spaces', { type: 'number' })}
              {textField('sqm', 'Building / plot size (sqm)', { type: 'number' })}
              {textField('land_size', 'Separate land size (sqm)', { type: 'number' })}
              <div className="sm:col-span-2 md:col-span-3">{textField('documentation', 'Title / documentation', { help: 'For example: C of O, Governor’s Consent, Registered Survey.' })}</div>
              {([['furnished', 'Furnished'], ['serviced', 'Serviced'], ['gated_estate', 'Gated estate'], ['negotiable', 'Price negotiable']] as const).map(([name, label]) => (
                <label key={name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"><input type="checkbox" checked={form[name]} onChange={(event) => update(name, event.target.checked)} className="h-4 w-4 accent-forest" />{label}</label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl text-charcoal">Media, features & amenities</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {listField('images', 'Property image URLs', 'One absolute https:// URL or local /path per line. The first image is the cover; maximum 20.')}
              {listField('features', 'Features', 'One feature per line, for example: All Rooms Ensuite.')}
              {listField('amenities', 'Amenities', 'One amenity per line, for example: 24/7 Security.')}
            </div>
            {form.images.filter(Boolean).length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.images.filter(Boolean).slice(0, 4).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Property preview ${index + 1}`} className="h-28 w-full rounded-xl border border-gray-100 object-cover" />)}</div>}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl text-charcoal">Publishing & verification</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {selectField('status', 'Publication status', STATUSES, true)}
              {selectField('verification_status', 'Verification status', VERIFICATION_STATUSES, true)}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 md:col-span-2"><input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} className="h-4 w-4 accent-forest" />Feature this property on the homepage</label>
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">Only <strong>available</strong> listings appear publicly. Use <strong>draft</strong> while editing and <strong>pending_review</strong> when awaiting moderation.</p>
          </section>

          <div className="sticky bottom-3 z-10 flex items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? 'Saving…' : editing ? 'Save all changes' : 'Create property'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">Inventory</p><h2 className="font-display text-3xl text-charcoal">Properties</h2><p className="mt-2 text-sm text-gray-500">Create, verify, publish and maintain every listing field.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white hover:bg-forest-light"><Plus className="h-4 w-4" /> Add property</button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[['Total', properties.length], ['Available', properties.filter((item) => item.status === 'available').length], ['Pending review', properties.filter((item) => item.status === 'pending_review').length], ['Verified', properties.filter((item) => item.verification_status === 'verified').length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><p className="text-2xl font-bold text-charcoal">{value}</p><p className="mt-1 text-xs text-gray-500">{label}</p></div>)}
      </div>

      {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><CheckCircle className="h-4 w-4" />{notice}</div>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}<button onClick={() => void loadProperties()} className="ml-3 font-bold underline">Retry</button></div>}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, area or state…" className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest" /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"><option value="all">All statuses</option>{STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select>
        </div>

        {loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div> : filtered.length === 0 ? (
          <div className="py-20 text-center"><Building2 className="mx-auto mb-4 h-10 w-10 text-gray-200" /><h3 className="font-display text-xl text-charcoal">No properties found</h3><p className="mt-2 text-sm text-gray-500">Add a listing or change the current filters.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500"><th className="px-4 py-3">Property</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><img src={property.images?.[0] || '/property-placeholder.svg'} alt="" className="h-12 w-16 rounded-lg object-cover" /><div className="min-w-0"><p className="max-w-64 truncate text-sm font-bold text-charcoal">{property.title}</p><p className="mt-1 text-xs text-gray-400">{property.property_type} · {property.type}</p></div></div></td>
                    <td className="px-4 py-4 text-sm font-bold text-forest">₦{Number(property.price || 0).toLocaleString()}<span className="block text-[10px] font-normal text-gray-400">{property.price_period || ''}</span></td>
                    <td className="px-4 py-4 text-sm text-gray-600">{property.area}<span className="block text-xs text-gray-400">{property.state}</span></td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${property.status === 'available' ? 'bg-green-100 text-green-700' : property.status === 'pending_review' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{property.status.replaceAll('_', ' ')}</span></td>
                    <td className="px-4 py-4 text-xs capitalize text-gray-500">{property.verification_status}</td>
                    <td className="px-4 py-4"><div className="flex justify-end gap-2">{property.status === 'available' && <Link href={`/properties/${property.slug}`} target="_blank" className="rounded-lg p-2 text-gray-400 hover:text-forest" title="View public page"><ExternalLink className="h-4 w-4" /></Link>}<button onClick={() => openEdit(property)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-forest hover:text-forest"><FilePenLine className="h-4 w-4" />Edit</button><button onClick={() => void remove(property)} disabled={deleting === property.id} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">{deleting === property.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
