'use client';

import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';

export default function ShareArticle({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h3 className="mb-3 text-sm font-semibold text-gray-500">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${window.location.href}`)}`, '_blank', 'noopener,noreferrer')} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
        <button onClick={() => void copy()} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}{copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
