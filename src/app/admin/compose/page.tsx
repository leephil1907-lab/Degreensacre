'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Users,
  Send,
  Paperclip,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Globe,
} from 'lucide-react';

const emailTemplates = [
  { id: 'custom', label: 'Custom Message', icon: Mail },
  { id: 'welcome', label: 'Welcome Email', icon: CheckCircle },
  { id: 'newsletter', label: 'Weekly Digest', icon: Globe },
  { id: 'announcement', label: 'Announcement', icon: AlertCircle },
];

const recipientOptions = [
  { id: 'all', label: 'All Users', count: 2847 },
  { id: 'buyers', label: 'All Buyers', count: 1923 },
  { id: 'sellers', label: 'All Sellers', count: 567 },
  { id: 'agents', label: 'All Agents', count: 357 },
  { id: 'active', label: 'Active Users (30 days)', count: 1842 },
  { id: 'inactive', label: 'Inactive Users (90+ days)', count: 423 },
  { id: 'unverified', label: 'Unverified Users', count: 156 },
  { id: 'custom', label: 'Custom Selection', count: 0 },
];

export default function ComposeEmailPage() {
  const [template, setTemplate] = useState('custom');
  const [recipient, setRecipient] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Compose Email</h2>
        <p className="text-sm text-gray-600 mt-1">Send branded emails to users using De-Greenacres templates</p>
      </div>

      {/* Success Message */}
      {sent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-semibold text-green-800 text-sm">Email sent successfully!</div>
            <div className="text-xs text-green-600">Your email has been queued for delivery.</div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <label className="block text-sm font-semibold text-charcoal mb-3">Email Template</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emailTemplates.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      template === t.id
                        ? 'border-forest bg-forest/5'
                        : 'border-gray-200 hover:border-forest/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${template === t.id ? 'text-forest' : 'text-gray-400'}`} />
                    <div className={`text-xs font-semibold ${template === t.id ? 'text-forest' : 'text-gray-600'}`}>
                      {t.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Subject & Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here... HTML is supported."
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Paperclip className="w-4 h-4" />
                Attach File
              </button>
            </div>
          </motion.div>

          {/* Send Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleSend}
              disabled={sending || !subject || !message}
              className="w-full bg-forest text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-forest-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <label className="block text-sm font-semibold text-charcoal mb-3">Recipients</label>
            <div className="space-y-2">
              {recipientOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRecipient(opt.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                    recipient === opt.id
                      ? 'bg-forest/10 text-forest font-semibold border border-forest/30'
                      : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      recipient === opt.id ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {opt.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {recipient === 'custom' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Enter email addresses (comma separated)
                </label>
                <textarea
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  placeholder="john@example.com, jane@example.com"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
                />
              </div>
            )}
          </motion.div>

          {/* Preview Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-ivory rounded-xl p-6 border border-gray-200"
          >
            <h4 className="text-sm font-bold text-charcoal mb-3">Email Preview</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Branded De-Greenacres template</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>From: De-Greenacres</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Includes logo, footer, RC number</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Mobile responsive design</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
