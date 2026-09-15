'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  Database,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage platform configuration and preferences</p>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-semibold"
        >
          ✅ Settings saved successfully!
        </motion.div>
      )}

      {/* Company Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-forest" />
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
            <input type="text" defaultValue="De-Greenacres Properties Limited" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">RC Number</label>
            <input type="text" defaultValue="RC: 1856064" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" defaultValue="de_greenacrespropertiesltd@yahoo.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input type="tel" defaultValue="+234 806 501 9971" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input type="text" defaultValue="5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-forest" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { label: 'New user registration', desc: 'Get notified when a new user signs up' },
            { label: 'New property submission', desc: 'When a seller submits a property for review' },
            { label: 'New enquiry', desc: 'When a buyer sends a property enquiry' },
            { label: 'Payment received', desc: 'When a payment is processed' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-semibold text-sm text-charcoal">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-forest" />
          Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-forest-light transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Changes
      </button>
    </div>
  );
}
