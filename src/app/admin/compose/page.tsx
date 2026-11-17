'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, Send, CheckCircle, AlertCircle, Globe, User, Loader2,
  Users, ShoppingCart, Building2, Briefcase, Shield, UserCheck, UserX
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RecipientOption {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface SentEmail {
  id: string;
  subject: string;
  recipient_type: string;
  recipient_count: number;
  status: string;
  sent_at: string;
}

const emailTemplates = [
  { id: 'custom', label: 'Service message', icon: Mail },
  { id: 'announcement', label: 'Service update', icon: AlertCircle },
];

const templateMessages: Record<string, { subject: string; body: string }> = {};

export default function ComposeEmailPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [template, setTemplate] = useState('custom');
  const [recipient, setRecipient] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipientOptions, setRecipientOptions] = useState<RecipientOption[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
  }, [user, profile, router]);

  // Fetch sent email history
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/send-email');
      if (res.ok) {
        const data = await res.json();
        setSentEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Failed to fetch email history:', err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users?limit=1000')
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const users: Array<{ account_type?: string; is_verified?: boolean; is_admin?: boolean }> = data.users || [];
        setRecipientOptions([
          { id: 'all', label: 'All Users', icon: Users, count: users.length },
          { id: 'buyers', label: 'Buyers', icon: ShoppingCart, count: users.filter((u) => u.account_type === 'buyer').length },
          { id: 'sellers', label: 'Sellers', icon: Building2, count: users.filter((u) => u.account_type === 'seller').length },
          { id: 'agents', label: 'Agents', icon: Briefcase, count: users.filter((u) => u.account_type === 'agent').length },
          { id: 'verified', label: 'Verified Users', icon: UserCheck, count: users.filter((u) => u.is_verified).length },
          { id: 'unverified', label: 'Unverified Users', icon: UserX, count: users.filter((u) => !u.is_verified).length },
          { id: 'admins', label: 'Admins', icon: Shield, count: users.filter((u) => u.is_admin).length },
          { id: 'custom', label: 'Custom Emails', icon: Mail, count: 0 },
        ]);
      })
      .catch((err) => {
        console.error('Failed to fetch user counts:', err);
        if (active) {
          setRecipientOptions([
            { id: 'all', label: 'All Users', icon: Users, count: 0 },
            { id: 'buyers', label: 'Buyers', icon: ShoppingCart, count: 0 },
            { id: 'sellers', label: 'Sellers', icon: Building2, count: 0 },
            { id: 'agents', label: 'Agents', icon: Briefcase, count: 0 },
            { id: 'custom', label: 'Custom Emails', icon: Mail, count: 0 },
          ]);
        }
      })
      .finally(() => { if (active) setLoading(false); });

    fetch('/api/admin/send-email')
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => { if (active && data) setSentEmails(data.emails || []); })
      .catch((err) => console.error('Failed to fetch email history:', err));

    return () => { active = false; };
  }, []);

  const selectTemplate = (nextTemplate: string) => {
    setTemplate(nextTemplate);
    if (nextTemplate !== 'custom' && templateMessages[nextTemplate]) {
      setSubject(templateMessages[nextTemplate].subject);
      setMessage(templateMessages[nextTemplate].body);
    }
  };

  const handleSend = async () => {
    if (!subject || !message) {
      setResult({ success: false, message: 'Subject and message are required' });
      return;
    }
    if (recipient === 'custom' && !customEmails.trim()) {
      setResult({ success: false, message: 'Please enter at least one email address' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_type: recipient,
          custom_emails: customEmails,
          subject,
          message,
          template,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message || `Email accepted for ${data.sent_to} recipient(s).` });
        setSubject('');
        setMessage('');
        setCustomEmails('');
        fetchHistory();
      } else {
        setResult({ success: false, message: data.error || 'Failed to send email' });
      }
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : 'Network error' });
    } finally {
      setSending(false);
    }
  };

  const selectedCount = recipientOptions.find(r => r.id === recipient)?.count || 0;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Compose Email</h1>
          <p className="text-sm text-gray-500 mt-1">Send relevant, branded service emails to your users</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm font-semibold text-forest hover:text-forest-light transition-colors"
        >
          {showHistory ? '← Back to Compose' : `View History (${sentEmails.length})`}
        </button>
      </div>

      <div className="rounded-xl border border-forest/15 bg-forest-50 p-4 text-sm leading-6 text-gray-600">Every email includes the De-Greenacres logo and support footer. Use this tool only for relevant service communications; marketing needs a consent and unsubscribe system. <Link href="/admin/email-templates" className="font-bold text-forest underline">Preview all event templates</Link>.</div>

      {/* Result message */}
      {result && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
          result.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {result.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {result.message}
        </div>
      )}

      {showHistory ? (
        /* Email History */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Recipients</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Sent To</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sentEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-charcoal">{email.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{email.recipient_type}</td>
                    <td className="px-4 py-3 text-sm text-charcoal font-bold">{email.recipient_count}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        email.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>{email.status === 'sent' ? 'Provider accepted' : email.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(email.sent_at).toLocaleString()}</td>
                  </tr>
                ))}
                {sentEmails.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No emails sent yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Compose Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Email Template</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {emailTemplates.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTemplate(t.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        template === t.id ? 'border-forest bg-forest/5' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${template === t.id ? 'text-forest' : 'text-gray-400'}`} />
                      <div className={`text-xs font-bold ${template === t.id ? 'text-forest' : 'text-gray-500'}`}>{t.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject & Message */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">{message.length} characters</p>
              </div>
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={sending || !subject || !message}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}
            >
              {sending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> Send to {selectedCount} Recipient{selectedCount !== 1 ? 's' : ''}</>}
            </button>
          </div>

          {/* Sidebar — Recipients */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Recipients</label>
              <div className="space-y-2">
                {recipientOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setRecipient(opt.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        recipient === opt.id
                          ? 'bg-forest/10 text-forest font-bold border border-forest/30'
                          : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{opt.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        recipient === opt.id ? 'bg-forest text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {opt.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {recipient === 'custom' && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-400 mb-2">Email addresses (comma separated)</label>
                  <textarea
                    value={customEmails}
                    onChange={(e) => setCustomEmails(e.target.value)}
                    placeholder="john@example.com, jane@example.com"
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-ivory rounded-xl p-5 border border-gray-200">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wide mb-3">Email Details</h4>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Branded service email · logo included</div>
                <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> From: De-Greenacres Properties</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Includes logo + RC badge</div>
                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Mobile responsive</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
