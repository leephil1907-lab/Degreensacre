'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { friendlyAuthError } from '@/lib/auth-errors';
import {
  Home, Heart, MessageSquare, Calendar, Bell, Settings, User,
  MapPin, Eye, Loader2, Search, Clock, CheckCircle, XCircle, FileText,
  Receipt, Download, Wallet, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { effectiveStatus, formatNaira, invoiceBalance, STATUS_LABELS, type Invoice } from '@/lib/invoices';

type Tab = 'overview' | 'saved' | 'enquiries' | 'viewings' | 'listings' | 'invoices' | 'messages' | 'notifications' | 'settings';
const TAB_VALUES: Tab[] = ['overview', 'saved', 'enquiries', 'viewings', 'listings', 'invoices', 'messages', 'notifications', 'settings'];

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      const returnPath = `${window.location.pathname}${window.location.search}`;
      router.push(`/signin?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }
    const requestedTab = new URLSearchParams(window.location.search).get('tab') as Tab | null;
    if (requestedTab && TAB_VALUES.includes(requestedTab)) setActiveTab(requestedTab);
  }, [authLoading, user, router]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [savedRes, enquiriesRes, viewingsRes, notificationsRes, listingsRes, invoicesRes] = await Promise.all([
        fetch('/api/saved'),
        fetch('/api/enquiries'),
        fetch('/api/viewings'),
        fetch('/api/notifications'),
        fetch('/api/properties/mine'),
        fetch('/api/invoices/mine'),
      ]);

      if (invoicesRes?.ok) {
        const data = await invoicesRes.json();
        setInvoices(data.invoices || []);
      }

      if (savedRes.ok) {
        const data = await savedRes.json();
        setSavedProperties(data.properties || []);
      }
      if (enquiriesRes.ok) {
        const data = await enquiriesRes.json();
        setEnquiries(data.enquiries || []);
      }
      if (viewingsRes.ok) {
        const data = await viewingsRes.json();
        setViewings(data.viewings || []);
      }
      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
      if (listingsRes.ok) {
        const data = await listingsRes.json();
        setMyListings(data.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`;
    return `₦${price.toLocaleString()}`;
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Home },
    { id: 'saved' as Tab, label: 'Saved', icon: Heart, count: savedProperties.length },
    ...(profile?.account_type === 'seller' || profile?.account_type === 'agent' || profile?.is_admin ? [{ id: 'listings' as Tab, label: 'My Listings', icon: Home, count: myListings.length }] : []),
    { id: 'enquiries' as Tab, label: 'Enquiries', icon: MessageSquare, count: enquiries.length },
    { id: 'viewings' as Tab, label: 'Viewings', icon: Calendar, count: viewings.length },
    { id: 'invoices' as Tab, label: 'Invoices', icon: Receipt, count: invoices.filter((invoice) => !['paid', 'void'].includes(effectiveStatus(invoice))).length },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  const outstandingTotal = invoices
    .filter((invoice) => !['paid', 'void'].includes(effectiveStatus(invoice)))
    .reduce((sum, invoice) => sum + invoiceBalance(invoice), 0);

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      {/* Dashboard header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest/10">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <User className="h-7 w-7 text-forest" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl text-charcoal sm:text-3xl">
                  Welcome back, {profile?.first_name || 'there'}
                </h1>
                <p className="mt-0.5 truncate text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {profile?.is_verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified account
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                {profile?.account_type || 'buyer'}
              </span>
              <Link href="/properties" className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white transition hover:bg-forest-light">
                Browse properties <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Navigation: scrollable pills on phones, sidebar from lg */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <nav
              aria-label="Dashboard sections"
              className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-white lg:p-2"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full lg:py-3 ${
                    activeTab === tab.id
                      ? 'bg-forest text-white lg:bg-forest/5 lg:text-forest'
                      : 'bg-white text-gray-600 hover:bg-gray-50 lg:bg-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    {tab.label}
                  </span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeTab === tab.id ? 'bg-white/20 text-white lg:bg-sage/20 lg:text-forest' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-forest" />
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                      {[
                        { label: 'Saved properties', value: String(savedProperties.length), icon: Heart, tone: 'text-rose-500' },
                        { label: 'Enquiries', value: String(enquiries.length), icon: MessageSquare, tone: 'text-sky-600' },
                        { label: 'Viewings', value: String(viewings.length), icon: Calendar, tone: 'text-violet-600' },
                        {
                          label: outstandingTotal > 0 ? 'Balance due' : 'Invoices paid',
                          value: outstandingTotal > 0
                            ? formatNaira(outstandingTotal)
                            : String(invoices.filter((invoice) => effectiveStatus(invoice) === 'paid').length),
                          icon: Wallet,
                          tone: outstandingTotal > 0 ? 'text-amber-600' : 'text-emerald-600',
                        },
                      ].map((card) => (
                        <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                          <div className="flex items-center gap-2">
                            <card.icon className={`h-4 w-4 ${card.tone}`} />
                            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{card.label}</span>
                          </div>
                          <p className="mt-2 font-display text-2xl text-charcoal sm:text-3xl">{card.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Latest invoice, if the office has billed this account */}
                    {invoices.length > 0 && (() => {
                      const latest = invoices[0];
                      const status = effectiveStatus(latest);
                      const balance = invoiceBalance(latest);
                      return (
                        <div className="rounded-2xl border border-gray-100 bg-white p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Latest invoice</p>
                              <p className="mt-1 font-display text-xl text-charcoal">{latest.invoice_number}</p>
                              <p className="text-sm text-gray-500">
                                {formatNaira(latest.total)} · issued {latest.issue_date}
                                {latest.due_date ? ` · due ${latest.due_date}` : ''}
                              </p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              status === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : status === 'overdue' ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-amber-200 bg-amber-50 text-amber-700'
                            }`}>
                              {STATUS_LABELS[status]}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <a
                              href={`/api/invoices/${latest.id}/pdf`}
                              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white hover:bg-forest-light"
                            >
                              <Download className="h-4 w-4" /> Download invoice
                            </a>
                            <button
                              type="button"
                              onClick={() => setActiveTab('invoices')}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
                            >
                              View all invoices <ArrowRight className="h-4 w-4" />
                            </button>
                            {balance > 0 && (
                              <span className="ml-auto text-sm text-gray-500">
                                Outstanding <strong className="text-charcoal">{formatNaira(balance)}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-display text-charcoal mb-4">Recent Activity</h2>
                      {notifications.length === 0 ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { icon: Search, title: 'Browse verified listings', text: 'Filter by state, price and property type.', href: '/properties', cta: 'Search properties' },
                            { icon: Calendar, title: 'Book an inspection', text: 'Pick a property and choose a viewing slot.', href: '/book-inspection', cta: 'Book a viewing' },
                            { icon: MessageSquare, title: 'Talk to our team', text: 'Ask about a listing, title or payment plan.', href: '/contact', cta: 'Contact us' },
                          ].map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="group rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition hover:border-forest/30 hover:bg-white"
                            >
                              <item.icon className="h-5 w-5 text-forest" />
                              <p className="mt-2 text-sm font-bold text-charcoal">{item.title}</p>
                              <p className="mt-1 text-xs text-gray-500">{item.text}</p>
                              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-forest">
                                {item.cta} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {notifications.slice(0, 5).map((notif) => (
                            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                              <Bell className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-charcoal">{notif.title}</p>
                                <p className="text-sm text-gray-500">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.created_at).toLocaleDateString('en-NG')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Owner / agent listing portfolio */}
                {activeTab === 'listings' && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-display text-charcoal">My Listings</h2>
                        <p className="text-sm text-gray-500 mt-1">Track submissions and see which properties are awaiting review.</p>
                      </div>
                      <Link href="/submit-property" className="inline-flex items-center justify-center bg-forest text-white px-5 py-3 rounded-lg font-medium hover:bg-forest-light transition-colors">
                        Submit a Property
                      </Link>
                    </div>
                    {myListings.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <Home className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal mb-2">No property submissions yet</h3>
                        <p className="text-gray-500 mb-6">Submit a property you own or are authorised to represent. It will remain off the public marketplace while it is reviewed.</p>
                        <Link href="/submit-property" className="inline-flex bg-forest text-white px-6 py-3 rounded-lg font-medium hover:bg-forest-light transition-colors">Start a Listing</Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myListings.map((property: any) => (
                          <div key={property.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                            {property.property_images?.[0]?.url ? (
                              <img src={property.property_images[0].url} alt={property.title} className="w-full sm:w-32 h-28 object-cover rounded-lg" />
                            ) : (
                              <div className="w-full sm:w-32 h-28 rounded-lg bg-gray-100 flex items-center justify-center"><Home className="w-8 h-8 text-gray-400" /></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-charcoal">{property.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{property.area}{property.state ? `, ${property.state}` : ''}</p>
                              <p className="text-forest font-bold mt-2">{formatPrice(Number(property.price || 0))}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800">{String(property.status || 'draft').replace(/_/g, ' ')}</span>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Verification: {property.verification_status || 'pending'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Invoices Tab — the customer's own billing history */}
                {activeTab === 'invoices' && (
                  <section>
                    <div className="mb-5">
                      <h2 className="font-display text-2xl text-charcoal">Invoices &amp; payments</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Every invoice issued to {profile?.email}. Download the PDF for your records, or check what is still outstanding.
                      </p>
                    </div>

                    {invoices.length === 0 ? (
                      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center sm:p-12">
                        <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="font-display text-lg text-charcoal">No invoices yet</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          When De-Greenacres bills you for a property, rent or service, the invoice appears here with its balance.
                        </p>
                        <Link href="/properties" className="mt-6 inline-flex rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white hover:bg-forest-light">
                          Browse properties
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoices.map((invoice) => {
                          const status = effectiveStatus(invoice);
                          const balance = invoiceBalance(invoice);
                          const paid = (invoice.invoice_payments ?? []).length;
                          return (
                            <article key={invoice.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="font-display text-lg text-charcoal">{invoice.invoice_number}</p>
                                  <p className="mt-0.5 text-sm text-gray-500">
                                    Issued {invoice.issue_date}
                                    {invoice.due_date ? ` · due ${invoice.due_date}` : ''}
                                    {invoice.property_title ? ` · ${invoice.property_title}` : ''}
                                  </p>
                                </div>
                                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                  status === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : status === 'overdue' ? 'border-red-200 bg-red-50 text-red-700'
                                    : status === 'void' ? 'border-gray-200 bg-gray-50 text-gray-500'
                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                }`}>
                                  {STATUS_LABELS[status]}
                                </span>
                              </div>

                              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-50 pt-4 sm:grid-cols-4">
                                <div>
                                  <dt className="text-[11px] uppercase tracking-wide text-gray-400">Total</dt>
                                  <dd className="font-semibold text-charcoal">{formatNaira(invoice.total)}</dd>
                                </div>
                                <div>
                                  <dt className="text-[11px] uppercase tracking-wide text-gray-400">Paid</dt>
                                  <dd className="font-semibold text-emerald-700">{formatNaira(invoice.amount_paid)}</dd>
                                </div>
                                <div>
                                  <dt className="text-[11px] uppercase tracking-wide text-gray-400">Balance</dt>
                                  <dd className={`font-semibold ${balance > 0 ? 'text-amber-700' : 'text-charcoal'}`}>{formatNaira(balance)}</dd>
                                </div>
                                <div>
                                  <dt className="text-[11px] uppercase tracking-wide text-gray-400">Payments</dt>
                                  <dd className="font-semibold text-charcoal">{paid}</dd>
                                </div>
                              </dl>

                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <a
                                  href={`/api/invoices/${invoice.id}/pdf`}
                                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-forest hover:text-forest"
                                >
                                  <Download className="h-4 w-4" /> Download PDF
                                </a>
                                {balance > 0 && invoice.bank_account_number && (
                                  <p className="text-xs text-gray-500">
                                    Pay to {invoice.bank_name} · {invoice.bank_account_name} · <strong className="text-charcoal">{invoice.bank_account_number}</strong>
                                  </p>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                )}

                {/* Saved Properties Tab */}
                {activeTab === 'saved' && (
                  <div>
                    <h2 className="text-2xl font-display text-charcoal mb-6">Saved Properties</h2>
                    {savedProperties.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal mb-2">No saved properties</h3>
                        <p className="text-gray-500 mb-6">Save properties you like to view them later</p>
                        <Link
                          href="/properties"
                          className="inline-block bg-forest text-white px-6 py-3 rounded-lg font-medium hover:bg-forest-light transition-colors"
                        >
                          Browse Properties
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedProperties.map((property: any) => (
                          <Link
                            key={property.id}
                            href={`/properties/${property.slug}`}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                          >
                            {property.property_images?.[0]?.url && (
                              <img
                                src={property.property_images[0].url}
                                alt={property.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h3 className="font-medium text-charcoal mb-1">{property.title}</h3>
                              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                <MapPin className="w-4 h-4" />
                                {property.area}, {property.state}
                              </div>
                              <p className="text-forest font-bold">{formatPrice(property.price)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Enquiries Tab */}
                {activeTab === 'enquiries' && (
                  <div>
                    <h2 className="text-2xl font-display text-charcoal mb-6">My Enquiries</h2>
                    {enquiries.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal mb-2">No enquiries yet</h3>
                        <p className="text-gray-500">Send enquiries to property agents to get more information</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {enquiries.map((enquiry: any) => (
                          <div key={enquiry.id} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-charcoal">{enquiry.properties?.title || 'General Enquiry'}</h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(enquiry.created_at).toLocaleDateString('en-NG', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                enquiry.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                                'bg-green-100 text-forest-light'
                              }`}>
                                {enquiry.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{enquiry.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Viewings Tab */}
                {activeTab === 'viewings' && (
                  <div>
                    <h2 className="text-2xl font-display text-charcoal mb-6">My Viewings</h2>
                    {viewings.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Calendar className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal mb-2">No viewings scheduled</h3>
                        <p className="text-gray-500">Schedule a viewing for properties you&apos;re interested in</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {viewings.map((viewing: any) => (
                          <div key={viewing.id} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-charcoal">{viewing.properties?.title || 'Property Viewing'}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(viewing.preferred_date).toLocaleDateString('en-NG', {
                                    weekday: 'short', day: 'numeric', month: 'short'
                                  })}
                                  <Clock className="w-4 h-4 ml-2" />
                                  {viewing.preferred_time}
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                viewing.status === 'confirmed' ? 'bg-green-100 text-forest-light' :
                                viewing.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                                viewing.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {viewing.status}
                              </span>
                            </div>
                            {viewing.notes && (
                              <p className="text-sm text-gray-600 mt-2">{viewing.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-display text-charcoal">Notifications</h2>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            await fetch('/api/notifications', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ mark_all: true }),
                            });
                            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                            setUnreadCount(0);
                          }}
                          className="text-sm text-forest hover:text-forest-light"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Bell className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal mb-2">No notifications</h3>
                        <p className="text-gray-500">You&apos;re all caught up</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notif: any) => (
                          <div
                            key={notif.id}
                            className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 ${
                              !notif.is_read ? 'border-l-4 border-green-500' : ''
                            }`}
                          >
                            <Bell className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-charcoal">{notif.title}</p>
                              <p className="text-sm text-gray-500">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.created_at).toLocaleDateString('en-NG')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <DashboardSettings profile={profile} onUpdate={fetchDashboardData} />
                    <SecurityPanel profile={profile} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSettings({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    state: profile?.state || '',
    bio: profile?.bio || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-charcoal">Profile details</h2>
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-forest/5 border border-green-200 rounded-lg text-sm text-forest">
            Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="">Select state</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja (FCT)</option>
              <option value="Rivers">Rivers</option>
              <option value="Akwa Ibom">Akwa Ibom</option>
              <option value="Oyo">Oyo</option>
              <option value="Kano">Kano</option>
              <option value="Enugu">Enugu</option>
              <option value="Delta">Delta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-forest text-white px-6 py-2 rounded-lg font-medium hover:bg-forest-light transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}


/** Password and sign-in security, separate from the editable profile fields. */
function SecurityPanel({ profile }: { profile: any }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) { setError('Choose a password of at least 8 characters.'); return; }
    if (password !== confirm) { setError('The two passwords do not match.'); return; }
    setState('saving');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setState('done');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(friendlyAuthError(err));
      setState('idle');
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-charcoal">Password &amp; security</h2>
          <p className="mt-1 text-sm text-gray-500">Signed in as {profile?.email}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
          profile?.is_verified
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          {profile?.is_verified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      {state === 'done' && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Password updated. Other devices stay signed in — sign out of them from a shared computer.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal focus:border-forest focus:outline-none"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal focus:border-forest focus:outline-none"
            placeholder="Repeat the password"
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state === 'saving'}
            className="rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white transition hover:bg-forest-light disabled:opacity-60"
          >
            {state === 'saving' ? 'Updating…' : 'Update password'}
          </button>
          <Link href="/forgot-password" className="text-sm font-semibold text-forest hover:underline">
            I don&apos;t know my current password
          </Link>
        </div>
      </form>
    </section>
  );
}
