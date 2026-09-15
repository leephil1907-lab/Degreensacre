'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Heart, MessageSquare, Calendar, Bell, Settings, User,
  MapPin, Eye, Loader2, Search, Clock, CheckCircle, XCircle, FileText
} from 'lucide-react';

type Tab = 'overview' | 'saved' | 'enquiries' | 'viewings' | 'listings' | 'messages' | 'notifications' | 'settings';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [savedRes, enquiriesRes, viewingsRes, notificationsRes] = await Promise.all([
        fetch('/api/saved'),
        fetch('/api/enquiries'),
        fetch('/api/viewings'),
        fetch('/api/notifications'),
      ]);

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
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
    { id: 'enquiries' as Tab, label: 'Enquiries', icon: MessageSquare, count: enquiries.length },
    { id: 'viewings' as Tab, label: 'Viewings', icon: Calendar, count: viewings.length },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-green-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-charcoal-900">
                Welcome back, {profile?.first_name || 'User'}
              </h1>
              <p className="text-charcoal-500 text-sm">{profile?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-2 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700'
                      : 'text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-green-200 text-green-800' : 'bg-charcoal-100 text-charcoal-600'
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
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-charcoal-500">Saved Properties</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900">{savedProperties.length}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-charcoal-500">Enquiries</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900">{enquiries.length}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-purple-500" />
                          <span className="text-sm text-charcoal-500">Viewings</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-900">{viewings.length}</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-serif text-charcoal-900 mb-4">Recent Activity</h2>
                      {notifications.length === 0 ? (
                        <p className="text-charcoal-400 text-center py-8">No recent activity</p>
                      ) : (
                        <div className="space-y-3">
                          {notifications.slice(0, 5).map((notif) => (
                            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-charcoal-50">
                              <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-charcoal-900">{notif.title}</p>
                                <p className="text-sm text-charcoal-500">{notif.message}</p>
                                <p className="text-xs text-charcoal-400 mt-1">
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

                {/* Saved Properties Tab */}
                {activeTab === 'saved' && (
                  <div>
                    <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Saved Properties</h2>
                    {savedProperties.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal-900 mb-2">No saved properties</h3>
                        <p className="text-charcoal-500 mb-6">Save properties you like to view them later</p>
                        <Link
                          href="/properties"
                          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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
                              <h3 className="font-medium text-charcoal-900 mb-1">{property.title}</h3>
                              <div className="flex items-center gap-1 text-charcoal-500 text-sm mb-2">
                                <MapPin className="w-4 h-4" />
                                {property.area}, {property.state}
                              </div>
                              <p className="text-green-600 font-bold">{formatPrice(property.price)}</p>
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
                    <h2 className="text-2xl font-serif text-charcoal-900 mb-6">My Enquiries</h2>
                    {enquiries.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal-900 mb-2">No enquiries yet</h3>
                        <p className="text-charcoal-500">Send enquiries to property agents to get more information</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {enquiries.map((enquiry: any) => (
                          <div key={enquiry.id} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-charcoal-900">{enquiry.properties?.title || 'General Enquiry'}</h3>
                                <p className="text-sm text-charcoal-500">
                                  {new Date(enquiry.created_at).toLocaleDateString('en-NG', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                enquiry.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {enquiry.status}
                              </span>
                            </div>
                            <p className="text-sm text-charcoal-600 line-clamp-2">{enquiry.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Viewings Tab */}
                {activeTab === 'viewings' && (
                  <div>
                    <h2 className="text-2xl font-serif text-charcoal-900 mb-6">My Viewings</h2>
                    {viewings.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Calendar className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal-900 mb-2">No viewings scheduled</h3>
                        <p className="text-charcoal-500">Schedule a viewing for properties you're interested in</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {viewings.map((viewing: any) => (
                          <div key={viewing.id} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-charcoal-900">{viewing.properties?.title || 'Property Viewing'}</h3>
                                <div className="flex items-center gap-2 text-sm text-charcoal-500 mt-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(viewing.preferred_date).toLocaleDateString('en-NG', {
                                    weekday: 'short', day: 'numeric', month: 'short'
                                  })}
                                  <Clock className="w-4 h-4 ml-2" />
                                  {viewing.preferred_time}
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                viewing.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                viewing.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                                viewing.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {viewing.status}
                              </span>
                            </div>
                            {viewing.notes && (
                              <p className="text-sm text-charcoal-600 mt-2">{viewing.notes}</p>
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
                      <h2 className="text-2xl font-serif text-charcoal-900">Notifications</h2>
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
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Bell className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-charcoal-900 mb-2">No notifications</h3>
                        <p className="text-charcoal-500">You're all caught up</p>
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
                            <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-charcoal-900">{notif.title}</p>
                              <p className="text-sm text-charcoal-500">{notif.message}</p>
                              <p className="text-xs text-charcoal-400 mt-1">
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
                  <DashboardSettings profile={profile} onUpdate={fetchDashboardData} />
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
      <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Profile Settings</h2>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
