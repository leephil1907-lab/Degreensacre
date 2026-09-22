'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewNotePage() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('degreensacre-notes');
    if (stored) setNotes(JSON.parse(stored));
    // If launched as note app, focus immediately
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') !== null) {
      document.getElementById('note-input')?.focus();
    }
  }, []);

  const save = () => {
    if (!note.trim()) return;
    const updated = [note, ...notes].slice(0, 20);
    setNotes(updated);
    localStorage.setItem('degreensacre-notes', JSON.stringify(updated));
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom py-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-sage/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-serif text-charcoal">New Property Note</h1>
              <p className="text-xs text-gray-500">OS integrated — launched via <code>note_taking.new_note_url</code></p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">Jot viewing notes, inspection checklists, or client requirements. Saved locally and available offline via Service Worker.</p>

          <textarea
            id="note-input"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g., Chevron Drive 5-bed — check docs, ask about C of O, schedule 2nd viewing..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest focus:border-transparent text-sm"
          />

          <div className="flex items-center gap-3 mt-4">
            <button onClick={save} className="bg-forest text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-forest-dark transition-colors">Save note</button>
            <Link href="/" className="text-sm text-gray-500 hover:text-charcoal">Home</Link>
            {saved && <span className="text-sm text-green-600 font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Saved</span>}
          </div>

          {notes.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-sm font-bold text-charcoal mb-3">Recent notes ({notes.length})</h2>
              <div className="space-y-3 max-h-64 overflow-auto pr-1">
                {notes.map((n, i) => (
                  <div key={i} className="bg-ivory rounded-xl p-3 border border-gray-100">
                    <p className="text-sm text-charcoal whitespace-pre-wrap">{n}</p>
                    <p className="text-xs text-gray-400 mt-1">#{notes.length - i}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 bg-sage/10 border border-sage/20 rounded-xl p-4">
            <p className="text-xs text-forest font-semibold mb-1">Registered as OS notes app</p>
            <p className="text-xs text-gray-600">Manifest <code>note_taking.new_note_url: /notes/new</code> lets Windows/macOS “New note” create a note directly in De-Greenacres. Try <code>Win + N</code> or system note widget.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
