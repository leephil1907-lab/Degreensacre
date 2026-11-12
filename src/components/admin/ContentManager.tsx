'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpenText, Building2, ExternalLink, FilePenLine, Loader2, Plus,
  Search, ShieldCheck, Star, Trash2, Users, X,
} from 'lucide-react';
import {
  CMS_RESOURCES, CMS_RESOURCE_NAMES, emptyCmsValues,
  type CmsField, type CmsResource,
} from '@/lib/cms-config';

type CmsItem = Record<string, any>;

const resourceIcons: Record<string, typeof Building2> = {
  developments: Building2,
  agencies: ShieldCheck,
  agents: Users,
  articles: BookOpenText,
  reviews: Star,
};

function fieldValue(item: CmsItem, field: CmsField) {
  const value = item[field.name];
  if (field.type === 'list') return Array.isArray(value) ? value : [];
  if (field.type === 'json') return Array.isArray(value) ? value : [];
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'date' && typeof value === 'string') return value.slice(0, 10);
  return value ?? '';
}

function publicPath(resource: string, item: CmsItem) {
  if (!item.slug || resource === 'reviews') return null;
  if (resource === 'articles') return `/insights/${item.slug}`;
  return `/${resource}/${item.slug}`;
}

export default function ContentManager({ resourceName }: { resourceName: string }) {
  const resource: CmsResource = CMS_RESOURCES[resourceName];
  const [items, setItems] = useState<CmsItem[]>([]);
  const [agencies, setAgencies] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CmsItem | null>(null);
  const [values, setValues] = useState<Record<string, any>>(() => emptyCmsValues(resource));
  const [slugTouched, setSlugTouched] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/content/${resourceName}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to load ${resource.plural.toLowerCase()}.`);
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Content could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [resource.plural, resourceName]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (resourceName !== 'agents') return;
    let active = true;
    void fetch('/api/admin/content/agencies', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Agencies could not be loaded.');
        if (active) setAgencies(data.items || []);
      })
      .catch((agencyError) => {
        if (active) setError(agencyError instanceof Error ? agencyError.message : 'Agencies could not be loaded.');
      });
    return () => { active = false; };
  }, [resourceName]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item[resource.titleField], item[resource.subtitleField || ''], item.slug, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [items, resource.subtitleField, resource.titleField, search]);

  const openCreate = () => {
    const initial = emptyCmsValues(resource);
    if (resourceName === 'articles') initial.published_at = new Date().toISOString().slice(0, 10);
    setValues(initial);
    setEditing(null);
    setSlugTouched(false);
    setNotice('');
    setError('');
    setEditorOpen(true);
  };

  const openEdit = (item: CmsItem) => {
    const initial = emptyCmsValues(resource);
    resource.fields.forEach((field) => { initial[field.name] = fieldValue(item, field); });
    setValues(initial);
    setEditing(item);
    setSlugTouched(true);
    setNotice('');
    setError('');
    setEditorOpen(true);
  };

  const updateValue = (field: CmsField, value: unknown) => {
    setValues((current) => {
      const next = { ...current, [field.name]: value };
      if (!editing && field.name === resource.titleField && !slugTouched) {
        next.slug = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      return next;
    });
    if (field.name === 'slug') setSlugTouched(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/content/${resourceName}`, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...values, id: editing.id } : values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The content could not be saved.');
      setEditorOpen(false);
      setNotice(`${resource.singular.charAt(0).toUpperCase() + resource.singular.slice(1)} ${editing ? 'updated' : 'created'} successfully.`);
      await loadItems();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The content could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: CmsItem) => {
    const title = item[resource.titleField] || resource.singular;
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setDeleting(item.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/content/${resourceName}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The content could not be deleted.');
      setNotice(`${resource.singular.charAt(0).toUpperCase() + resource.singular.slice(1)} deleted.`);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'The content could not be deleted.');
    } finally {
      setDeleting(null);
    }
  };

  const renderField = (field: CmsField) => {
    const value = values[field.name];
    const id = `cms-${field.name}`;
    const common = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 disabled:bg-gray-50';

    let input: React.ReactNode;
    if (field.type === 'boolean') {
      input = (
        <label htmlFor={id} className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => updateValue(field, event.target.checked)} className="h-4 w-4 accent-forest" />
          {field.label}
        </label>
      );
    } else if (field.type === 'select') {
      const options = field.dynamicOptions === 'agencies'
        ? agencies.map((agency) => ({ value: agency.id, label: agency.name }))
        : field.options || [];
      input = (
        <select id={id} value={String(value || '')} required={field.required} onChange={(event) => updateValue(field, event.target.value)} className={common}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      );
    } else if (field.type === 'textarea' || field.type === 'list' || field.type === 'json') {
      const displayValue = field.type === 'json'
        ? JSON.stringify(value || [], null, 2)
        : field.type === 'list'
          ? (Array.isArray(value) ? value.join('\n') : String(value || ''))
          : String(value || '');
      input = (
        <textarea
          id={id}
          value={displayValue}
          required={field.required}
          rows={field.name === 'content' ? 14 : field.type === 'json' ? 7 : 5}
          placeholder={field.placeholder}
          onChange={(event) => updateValue(field, event.target.value)}
          className={`${common} resize-y ${field.type === 'json' ? 'font-mono text-xs' : ''}`}
        />
      );
    } else {
      input = (
        <input
          id={id}
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          value={String(value ?? '')}
          required={field.required}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          onChange={(event) => updateValue(field, event.target.value)}
          className={common}
        />
      );
    }

    return (
      <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
        {field.type !== 'boolean' && <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">{field.label}{field.required && <span className="ml-1 text-red-500">*</span>}</label>}
        {input}
        {field.help && <p className="mt-2 text-xs leading-relaxed text-gray-400">{field.help}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">Website content</p>
          <h1 className="font-display text-3xl text-charcoal">{resource.plural}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">{resource.description}</p>
        </div>
        <button onClick={openCreate} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-forest-light">
          <Plus className="h-4 w-4" /> Add {resource.singular}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CMS_RESOURCE_NAMES.map((name) => {
          const Icon = resourceIcons[name] || FilePenLine;
          const active = name === resourceName;
          return (
            <Link key={name} href={`/admin/content/${name}`} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${active ? 'border-forest bg-forest text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-forest hover:text-forest'}`}>
              <Icon className="h-4 w-4" /> {CMS_RESOURCES[name].plural}
            </Link>
          );
        })}
      </div>

      {notice && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{notice}</div>}
      {error && !editorOpen && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}<button onClick={() => void loadItems()} className="ml-3 font-bold underline">Retry</button></div>}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${resource.plural.toLowerCase()}…`} aria-label={`Search ${resource.plural}`} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest" />
          </div>
          <p className="text-xs font-semibold text-gray-400">{filteredItems.length} of {items.length} records</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <FilePenLine className="mx-auto mb-4 h-10 w-10 text-gray-200" />
            <h3 className="font-display text-xl text-charcoal">{items.length ? 'No matching content' : `No ${resource.plural.toLowerCase()} yet`}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{items.length ? 'Try a different search.' : `Add the first ${resource.singular} to start managing this section.`}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((item) => {
              const path = publicPath(resourceName, item);
              const status = resource.statusField ? item[resource.statusField] : null;
              return (
                <div key={item.id} className="flex flex-col gap-4 p-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-bold text-charcoal">{item[resource.titleField]}</h3>
                      {status !== null && status !== undefined && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${status === true || ['published', 'approved', 'completed'].includes(String(status)) ? 'bg-green-100 text-green-700' : ['rejected', 'archived', 'sold-out'].includes(String(status)) || status === false ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                          {typeof status === 'boolean' ? (status ? 'Verified' : 'Unverified') : String(status).replaceAll('-', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">{item[resource.subtitleField || ''] || item.slug || 'No subtitle'}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.updated_at || item.created_at || item.published_at ? `Last updated ${new Date(item.updated_at || item.created_at || item.published_at).toLocaleDateString('en-NG')}` : ''}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {path && <Link href={path} target="_blank" className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-forest" title="View public page"><ExternalLink className="h-4 w-4" /></Link>}
                    <button onClick={() => openEdit(item)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-forest hover:text-forest"><FilePenLine className="h-4 w-4" /> Edit</button>
                    <button onClick={() => void remove(item)} disabled={deleting === item.id} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50" title="Delete">
                      {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${editing ? 'Edit' : 'Add'} ${resource.singular}`}>
          <div className="max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-ivory shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h3 className="font-display text-2xl text-charcoal">{editing ? 'Edit' : 'Add'} {resource.singular}</h3>
                <p className="mt-1 text-xs text-gray-500">Fields marked * are required. Save to write directly to the website database.</p>
              </div>
              <button onClick={() => setEditorOpen(false)} disabled={saving} aria-label="Close editor" className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-charcoal"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="max-h-[calc(94vh-86px)] overflow-y-auto">
              <div className="grid gap-5 p-6 md:grid-cols-2">
                {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</div>}
                {resource.fields.map(renderField)}
              </div>
              <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
                <button type="button" onClick={() => setEditorOpen(false)} disabled={saving} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white hover:bg-forest-light disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} {saving ? 'Saving…' : editing ? 'Save changes' : `Create ${resource.singular}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
