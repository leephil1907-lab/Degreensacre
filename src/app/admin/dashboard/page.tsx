'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Home,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '2,847', change: '+12.5%', up: true, icon: Users, color: 'bg-blue-500' },
  { label: 'Active Listings', value: '156', change: '+8.2%', up: true, icon: Home, color: 'bg-forest' },
  { label: 'Enquiries', value: '89', change: '+23.1%', up: true, icon: MessageSquare, color: 'bg-magenta' },
  { label: 'Revenue', value: '₦4.2M', change: '-3.4%', up: false, icon: DollarSign, color: 'bg-amber-500' },
];

const recentActivities = [
  { user: 'John Doe', action: 'submitted a property listing', time: '2 minutes ago', icon: Home },
  { user: 'Jane Smith', action: 'sent an enquiry', time: '15 minutes ago', icon: MessageSquare },
  { user: 'Mike Johnson', action: 'registered a new account', time: '1 hour ago', icon: Users },
  { user: 'Sarah Wilson', action: 'scheduled a viewing', time: '2 hours ago', icon: Calendar },
  { user: 'David Brown', action: 'updated property details', time: '3 hours ago', icon: Activity },
];

const topProperties = [
  { title: '5 Bedroom Duplex, Lekki', views: 1247, enquiries: 23 },
  { title: '3 Bedroom Apartment, Victoria Island', views: 892, enquiries: 18 },
  { title: 'Land for Sale, Ajah', views: 756, enquiries: 15 },
  { title: '4 Bedroom Terrace, Ikoyi', views: 634, enquiries: 12 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-charcoal mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-charcoal mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-charcoal">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-charcoal mb-4">Top Performing Properties</h3>
          <div className="space-y-4">
            {topProperties.map((property, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="font-semibold text-charcoal text-sm mb-2">{property.title}</div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {property.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {property.enquiries} enquiries
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-forest to-forest-light rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
        <p className="text-sm text-white/80 mb-4">Manage your platform efficiently</p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white text-forest px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            Add New Property
          </button>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
            Send Newsletter
          </button>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
            View Reports
          </button>
        </div>
      </motion.div>
    </div>
  );
}
