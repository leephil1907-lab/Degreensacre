'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Download,
} from 'lucide-react';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+234 801 234 5678', type: 'Buyer', status: 'Active', joined: '2024-01-15', verified: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 802 345 6789', type: 'Seller', status: 'Active', joined: '2024-01-20', verified: true },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 803 456 7890', type: 'Buyer', status: 'Pending', joined: '2024-02-01', verified: false },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+234 804 567 8901', type: 'Agent', status: 'Active', joined: '2024-02-05', verified: true },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+234 805 678 9012', type: 'Buyer', status: 'Suspended', joined: '2024-02-10', verified: true },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', phone: '+234 806 789 0123', type: 'Seller', status: 'Active', joined: '2024-02-15', verified: true },
  { id: 7, name: 'Chris Martin', email: 'chris@example.com', phone: '+234 807 890 1234', type: 'Buyer', status: 'Active', joined: '2024-02-20', verified: true },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+234 808 901 2345', type: 'Agent', status: 'Pending', joined: '2024-02-25', verified: false },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">{users.length} total registered users</p>
        </div>
        <button className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          >
            <option value="all">All Types</option>
            <option value="Buyer">Buyers</option>
            <option value="Seller">Sellers</option>
            <option value="Agent">Agents</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                        <span className="text-forest font-bold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-charcoal">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      user.type === 'Buyer' ? 'bg-blue-100 text-blue-700' :
                      user.type === 'Seller' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status === 'Active' && <CheckCircle className="w-4 h-4 text-forest" />}
                      {user.status === 'Pending' && <Clock className="w-4 h-4 text-amber-600" />}
                      {user.status === 'Suspended' && <XCircle className="w-4 h-4 text-red-600" />}
                      <span className={`text-sm font-semibold ${
                        user.status === 'Active' ? 'text-forest' :
                        user.status === 'Pending' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {user.status}
                      </span>
                      {user.verified && <UserCheck className="w-4 h-4 text-forest" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send Email">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Profile">
                        <UserCheck className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More Options">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">No users found matching your filters</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
