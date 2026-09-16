'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search, CheckCircle, Clock, XCircle, Eye, Edit, Trash2, Plus,
  Loader2, MapPin, X, ChevronDown, Image as ImageIcon
} from 'lucide-react';

interface Property {
  id: string;
  slug: string;
  title: string;
  type: string;
  property_type: string;
  price: number;
  state: string;
  area: string;
  status: string;
  verification_status: string;
  featured: boolean;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  documentation: string;
  date_added: string;
  views: number;
  property_images?: { url: string; is_primary: boolean }[];
}

const PROPERTY_TYPES = ['sale', 'rent', 'land', 'commercial', 'short-let'];
const STATES = ['Lagos', 'Abuja', 'Akwa Ibom', 'Enugu', 'Rivers', 'Delta', 'Oyo', 'Anambra', 'Imo', 'Abia', 'Edo', 'Kaduna', 'Kano', 'Ogun', 'Osun', 'Cross River'];
const STATUSES = ['available', 'sold', 'rented', 'pending', 'archived'];
const DOC_TYPES = ['C of O', "Governor's Consent", 'Excision', 'Gazette', 'Deed of Assignment', 'Registered Survey', 'None'];

export default function AdminPropertiesPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    property_type: 'House',
    type: 'sale',
    price: '',
    price_period: '',
    bedrooms: '0',
    bathrooms: '0',
    sqm: '',
    parking: '0',
    state: '',
    area: '',
    lga: '',
    address: '',
    documentation: '',
    features: '',
    status: 'available',
    featured: false,
    image_urls: '',
  });

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
    fetchProperties();
  }, [user, profile, router, fetchProperties]);

  const filtered = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.area?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatPrice = (price: number) => {
    if (!price) return '₦0';
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`;
    return `₦${price.toLocaleString()}`;
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.state) {
      setError('Title, price and state are required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: parseInt(form.price) || 0,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        sqm: parseInt(form.sqm) || 0,
        parking: parseInt(form.parking) || 0,
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        image_urls: form.image_urls.split('\n').map((u: string) => u.trim()).filter(Boolean),
      };

      const url = editingId ? `/api/admin/properties?id=${editingId}` : '/api/admin/properties';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingId(null);
        resetForm();
        fetchProperties();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save property');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setForm({
      title: property.title || '',
      description: '',
      property_type: property.property_type || 'House',
      type: property.type || 'sale',
      price: property.price?.toString() || '',
      price_period: '',
      bedrooms: property.bedrooms?.toString() || '0',
      bathrooms: property.bathrooms?.toString() || '0',
      sqm: property.sqm?.toString() || '',
      parking: '0',
      state: property.state || '',
      area: property.area || '',
      lga: '',
      address: '',
      documentation: property.documentation || '',
      features: '',
      status: property.status || 'available',
      featured: property.featured || false,
      image_urls: property.property_images?.map(img => img.url).join('\n') || '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', property_type: 'House', type: 'sale', price: '', price_period: '',
      bedrooms: '0', bathrooms: '0', sqm: '', parking: '0', state: '', area: '', lga: '', address: '',
      documentation: '', features: '', status: 'available', featured: false, image_urls: '',
    });
    setError('');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">Property Management</h2>
          <p className="text-sm text-gray-500 mt-1">{properties.length} total listings · {properties.filter(p => p.status === 'available').length} active</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-forest-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Types</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {property.property_images?.[0]?.url ? (
                          <img src={property.property_images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-300" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal text-sm truncate max-w-[200px]">{property.title}</p>
                        <p className="text-xs text-gray-400">{property.property_type} · {property.sqm}sqm</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      property.type === 'sale' ? 'bg-forest/10 text-forest' :
                      property.type === 'rent' ? 'bg-blue-100 text-blue-700' :
                      property.type === 'land' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{property.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-charcoal">{formatPrice(property.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{property.area}, {property.state}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      property.status === 'available' ? 'bg-green-100 text-green-700' :
                      property.status === 'sold' ? 'bg-red-100 text-red-700' :
                      property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status === 'available' && <CheckCircle className="w-3 h-3" />}
                      {property.status === 'pending' && <Clock className="w-3 h-3" />}
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/properties/${property.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-forest rounded">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleEdit(property)} className="p-1.5 text-gray-400 hover:text-forest rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(property.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No properties found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-display text-xl text-charcoal">{editingId ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" placeholder="e.g., 5 Bedroom Duplex in Lekki" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" placeholder="Detailed description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Listing Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t === 'sale' ? 'For Sale' : t === 'rent' ? 'For Rent' : t === 'short-let' ? 'Short Let' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Property Type</label>
                  <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    {['House', 'Apartment', 'Duplex', 'Detached Duplex', 'Semi-Detached', 'Terrace', 'Land', 'Commercial', 'Office', 'Warehouse', 'Shop'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price (₦) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., 85000000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price Period</label>
                  <select value={form.price_period} onChange={(e) => setForm({ ...form, price_period: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    <option value="">One-time (Sale/Land)</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Beds</label>
                  <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Baths</label>
                  <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">SQM</label>
                  <input type="number" value={form.sqm} onChange={(e) => setForm({ ...form, sqm: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Parking</label>
                  <input type="number" value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">State *</label>
                  <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Area</label>
                  <input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Lekki Phase 1" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., 15 Admiralty Way, Lekki" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Documentation</label>
                  <select value={form.documentation} onChange={(e) => setForm({ ...form, documentation: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select</option>
                    {DOC_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Features (comma-separated)</label>
                <input type="text" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Swimming Pool, CCTV, 24/7 Security" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Image URLs (one per line)</label>
                <textarea value={form.image_urls} onChange={(e) => setForm({ ...form, image_urls: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-xs" placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-forest border-gray-300 rounded focus:ring-forest" />
                <span className="text-sm font-medium text-charcoal">Featured property</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-forest text-white rounded-xl text-sm font-bold hover:bg-forest-light disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
