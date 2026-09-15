'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, MessageSquare, Home, CalendarDays, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface SavedProperty {
  id: string;
  property_id: string;
  properties: { id: string; title: string; area: string; state: string; price: number; images: string[] } | null;
}

interface Enquiry {
  id: string;
  message: string;
  status: string;
  created_at: string;
  properties: { title: string } | null;
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const [savedResult, enquiriesResult, listingsResult] = await Promise.all([
        supabase.from('saved_properties').select('id, property_id, properties(id, title, area, state, price, images)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
        supabase.from('enquiries').select('id, message, status, created_at, properties(title)').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(6),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
      ]);

      if (!savedResult.error) setSaved((savedResult.data || []) as unknown as SavedProperty[]);
      if (!enquiriesResult.error) setEnquiries((enquiriesResult.data || []) as unknown as Enquiry[]);
      setListingCount(listingsResult.count || 0);
      setLoading(false);
    };

    load();
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-soft p-10 text-center max-w-md w-full">
          <Home className="w-12 h-12 mx-auto text-forest mb-4" />
          <h1 className="text-3xl font-bold text-charcoal">Your property dashboard</h1>
          <p className="text-gray-600 mt-3 mb-6">Sign in to manage saved properties, enquiries and your listings.</p>
          <Link href="/signin" className="btn-primary inline-flex">Sign In</Link>
        </div>
      </div>
    );
  }

  const firstName = profile?.first_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-ivory py-10">
      <div className="container-custom">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-forest">My De-Greenacres</p>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mt-2">Welcome, {firstName}</h1>
          <p className="text-gray-600 mt-2">Your property search and activity, all in one place.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Stat icon={<Heart />} label="Saved properties" value={saved.length} />
          <Stat icon={<MessageSquare />} label="Enquiries" value={enquiries.length} />
          <Stat icon={<Home />} label="My listings" value={listingCount} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-charcoal">Saved properties</h2>
              <Link href="/properties" className="text-sm font-semibold text-forest flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></Link>
            </div>
            {saved.length === 0 ? (
              <Empty icon={<Heart />} title="No saved properties yet" text="Save properties you love and they will appear here." />
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {saved.map((item) => item.properties && (
                  <Link key={item.id} href={`/properties/${item.properties.id}`} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    {item.properties.images?.[0] ? <img src={item.properties.images[0]} alt={item.properties.title} className="w-full h-36 object-cover" /> : <div className="h-36 bg-gray-100 flex items-center justify-center"><Home className="text-gray-400" /></div>}
                    <div className="p-4">
                      <h3 className="font-bold text-charcoal line-clamp-1">{item.properties.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.properties.area}, {item.properties.state}</p>
                      <p className="font-bold text-forest mt-2">₦{Number(item.properties.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-charcoal">Recent enquiries</h2>
              <MessageSquare className="w-5 h-5 text-forest" />
            </div>
            {enquiries.length === 0 ? (
              <Empty icon={<MessageSquare />} title="No enquiries yet" text="When you contact a property, your conversations will appear here." />
            ) : (
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="font-semibold text-charcoal line-clamp-1">{enquiry.properties?.title || 'Property enquiry'}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{enquiry.message}</p>
                    <span className="inline-block mt-2 text-xs font-semibold capitalize bg-forest/10 text-forest rounded-full px-2 py-1">{enquiry.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/list-property" className="btn-primary inline-flex"><Home className="w-4 h-4 mr-2" />List a property</Link>
          <Link href="/properties" className="btn-outline inline-flex">Find a property</Link>
          <Link href="/contact" className="btn-outline inline-flex"><CalendarDays className="w-4 h-4 mr-2" />Request a viewing</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="bg-white rounded-2xl shadow-soft p-5 flex items-center gap-4"><div className="w-11 h-11 rounded-xl bg-forest/10 text-forest flex items-center justify-center">{icon}</div><div><p className="text-2xl font-bold text-charcoal">{value}</p><p className="text-sm text-gray-500">{label}</p></div></div>;
}

function Empty({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="py-10 text-center text-gray-500"><div className="mx-auto mb-3 w-10 h-10 text-sage">{icon}</div><p className="font-semibold text-charcoal">{title}</p><p className="text-sm mt-1">{text}</p></div>;
}
