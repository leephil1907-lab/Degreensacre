'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';

const properties = [
  { id: 'P001', title: '5 Bedroom Duplex, Lekki Phase 1', price: 150000000, status: 'Approved', views: 1247, enquiries: 23, date: '2024-02-15' },
  { id: 'P002', title: '3 Bedroom Apartment, Victoria Island', price: 85000000, status: 'Pending', views: 0, enquiries: 0, date: '2024-02-20' },
  { id: 'P003', title: 'Land for Sale, Ajah', price: 45000000, status: 'Approved', views: 756, enquiries: 15, date: '2024-02-10' },
  { id: 'P004', title: '4 Bedroom Terrace, Ikoyi', price: 220000000, status: 'Approved', views: 634, enquiries: 12, date: '2024-02-08' },
  { id: 'P005', title: '2 Bedroom Flat, Yaba', price: 35000000, status: 'Rejected', views: 0, enquiries: 0, date: '2024-02-22' },
  { id: 'P006', title: 'Commercial Space, Ikeja', price: 120000000, status: 'Pending', views: 0, enquiries: 0, date: '2024-02-24' },
];

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Property Management</h2>
          <p className="text-sm text-gray-600 mt-1">{properties.length} total listings</p>
        </div>
        <button className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Property</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Enquiries</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((property, i) => (
                <motion.tr
                  key={property.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal text-sm">{property.title}</div>
                        <div className="text-xs text-gray-500">ID: {property.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-forest text-sm">
                    ₦{(property.price / 1000000).toFixed(0)}M
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {property.status === 'Approved' && <CheckCircle className="w-4 h-4 text-forest" />}
                      {property.status === 'Pending' && <Clock className="w-4 h-4 text-amber-600" />}
                      {property.status === 'Rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                      <span className={`text-sm font-semibold ${
                        property.status === 'Approved' ? 'text-forest' :
                        property.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.enquiries}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View"><Eye className="w-4 h-4 text-gray-600" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit"><Edit className="w-4 h-4 text-gray-600" /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
