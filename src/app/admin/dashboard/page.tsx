'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Users, Building2, MessageSquare, Eye, TrendingUp,
  Calendar, DollarSign, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalViewings: number;
}

interface RecentProperty {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  state: string;
  date_added: string;
}

interface RecentEnquiry {
  id: string;
  buyer_name: string;
  buyer_email: string;
  message: string;
  status: string;
  created_at: string;
  properties?: { title: string };
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentProperties(data.recentProperties || []);
        setRecentEnquiries(data.recentEnquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (profile && !profile.is_admin) {
      router.push('/');
      return;
    }
    fetchDashboardData();
  }, [user, profile, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B`;
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`;
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-charcoal-900 mb-2">Admin Dashboard</h1>
        <p className="text-charcoal-600">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.totalUsers || 0}</p>
          <p className="text-sm text-charcoal-500">Total Users</p>
        </div>

        {/* Total Properties */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.totalProperties || 0}</p>
          <p className="text-sm text-charcoal-500">Total Properties</p>
        </div>

        {/* Published Properties */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.publishedProperties || 0}</p>
          <p className="text-sm text-charcoal-500">Published</p>
        </div>

        {/* Pending Properties */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.pendingProperties || 0}</p>
          <p className="text-sm text-charcoal-500">Pending Review</p>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.totalEnquiries || 0}</p>
          <p className="text-sm text-charcoal-500">Total Enquiries</p>
        </div>

        {/* New Enquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            {stats?.newEnquiries && stats.newEnquiries > 0 ? (
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.newEnquiries || 0}</p>
          <p className="text-sm text-charcoal-500">New Enquiries</p>
        </div>

        {/* Total Viewings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{stats?.totalViewings || 0}</p>
          <p className="text-sm text-charcoal-500">Total Viewings</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">Quick Actions</p>
          <Link href="/admin/properties" className="text-sm text-white/90 hover:text-white underline">
            Manage Properties →
          </Link>
        </div>
      </div>

      {/* Recent Properties & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-charcoal-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-green-600 hover:text-green-700">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProperties.slice(0, 5).map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-charcoal-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal-900 truncate">{property.title}</p>
                  <p className="text-sm text-charcoal-500">{property.state} • {formatPrice(property.price)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  property.status === 'available' ? 'bg-green-100 text-green-700' :
                  property.status === 'sold' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {property.status}
                </span>
              </Link>
            ))}
            {recentProperties.length === 0 && (
              <p className="text-center text-charcoal-400 py-8">No properties yet</p>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-charcoal-900">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-green-600 hover:text-green-700">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentEnquiries.slice(0, 5).map((enquiry) => (
              <div
                key={enquiry.id}
                className="p-3 rounded-lg hover:bg-charcoal-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-charcoal-900">{enquiry.buyer_name}</p>
                    <p className="text-sm text-charcoal-500">{enquiry.buyer_email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    enquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {enquiry.status}
                  </span>
                </div>
                <p className="text-sm text-charcoal-600 line-clamp-2">{enquiry.message}</p>
                {enquiry.properties && (
                  <p className="text-xs text-charcoal-400 mt-1">
                    Re: {enquiry.properties.title}
                  </p>
                )}
              </div>
            ))}
            {recentEnquiries.length === 0 && (
              <p className="text-center text-charcoal-400 py-8">No enquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
