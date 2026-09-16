'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  Mail,
  Eye,
  Archive,
  Home,
} from 'lucide-react';

const enquiries = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+234 801 234 5678', property: '5 Bedroom Duplex, Lekki', message: 'I am interested in this property. When can I schedule a viewing?', status: 'New', date: '2024-02-25' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 802 345 6789', property: '3 Bedroom Apartment, VI', message: 'Is this property still available? What are the payment terms?', status: 'Replied', date: '2024-02-24' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 803 456 7890', property: 'Land for Sale, Ajah', message: 'I would like to know more about the documentation and title.', status: 'New', date: '2024-02-23' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+234 804 567 8901', property: '4 Bedroom Terrace, Ikoyi', message: 'Can you send me the floor plan and more photos?', status: 'Closed', date: '2024-02-22' },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+234 805 678 9012', property: 'General Enquiry', message: 'I am looking for a property in Lekki Phase 1 with a budget of ₦150M.', status: 'New', date: '2024-02-21' },
];

export default function EnquiriesPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = enquiries.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                         e.property.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Enquiries</h2>
        <p className="text-sm text-gray-600 mt-1">Manage property enquiries and user messages</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
        >
          <option value="all">All Status</option>
          <option value="New">New</option>
          <option value="Replied">Replied</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filtered.map((enquiry, i) => (
          <motion.div
            key={enquiry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-magenta/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-magenta" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal">{enquiry.name}</div>
                  <div className="text-xs text-gray-500">{enquiry.email} · {enquiry.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {enquiry.status === 'New' && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">New</span>}
                {enquiry.status === 'Replied' && <span className="px-2 py-1 bg-forest/10 text-forest-light text-xs font-semibold rounded">Replied</span>}
                {enquiry.status === 'Closed' && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">Closed</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Home className="w-4 h-4" />
              <span className="font-medium">{enquiry.property}</span>
            </div>

            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">{enquiry.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date(enquiry.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors">
                  <Mail className="w-4 h-4" />
                  Reply
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Archive">
                  <Archive className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
