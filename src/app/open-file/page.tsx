'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OpenFilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('No file opened yet. Use your OS to open a PDF or image with De-Greenacres.');

  useEffect(() => {
    // Modern file_handlers via launchQueue
    // @ts-ignore
    if ('launchQueue' in window && 'setConsumer' in (window as any).launchQueue) {
      // @ts-ignore
      (window as any).launchQueue.setConsumer((launchParams: any) => {
        if (launchParams.files && launchParams.files.length) {
          Promise.all(launchParams.files.map((f: FileSystemFileHandle) => f.getFile())).then((fileList: File[]) => {
            setFiles(fileList);
            setMessage(`Opened ${fileList.length} file(s) with De-Greenacres`);
          });
        }
      });
    }
    // Fallback: check ?file param for share_target
    const params = new URLSearchParams(window.location.search);
    if (params.get('file')) setMessage('File parameter detected');
  }, []);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="container-custom py-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="text-2xl font-serif text-charcoal mb-2">Open with De-Greenacres</h1>
          <p className="text-gray-600 mb-6">Your PWA is registered as a file handler for <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.pdf, .jpg, .png, .webp</code>. When you double-click a property document or floor plan on your device and choose De-Greenacres, it will open here.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-900">{message}</p>
          </div>

          {files.length > 0 ? (
            <div className="space-y-3">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
                  <div className="w-10 h-10 bg-forest text-white rounded-lg grid place-items-center text-xs font-bold">{f.name.split('.').pop()?.toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.type || 'unknown'} • {(f.size/1024).toFixed(1)} KB</p>
                  </div>
                  <a href={URL.createObjectURL(f)} target="_blank" rel="noopener noreferrer" className="text-forest text-sm font-semibold hover:underline">Preview</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Drag & drop a PDF or image here to test</p>
              <label className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-forest-dark">
                <input type="file" className="hidden" accept=".pdf,image/*" multiple onChange={e => e.target.files && setFiles(Array.from(e.target.files))} />
                Choose files
              </label>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className="btn-primary">Browse Properties</Link>
            <Link href="/" className="btn-outline">Home</Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">Manifest: <code>file_handlers</code> → <code>/open-file</code> handles <code>application/pdf</code> and <code>image/*</code>. Registered via <code>launchQueue</code>.</p>
        </div>
      </div>
    </div>
  );
}
