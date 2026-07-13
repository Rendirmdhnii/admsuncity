import { useState } from 'react';

/**
 * Modal overlay for picking a contact from the stored list.
 * Fully standalone — receives contacts via props, calls onSelect/onClose.
 */
export default function ContactPickerModal({ contacts, onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.nama.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">Pilih dari Kontak</h3>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.586a1 1 0 01-.293.707l-2.829 2.828a1 1 0 01-.707.293H7.828a1 1 0 01-.707-.293L4.293 14.29a1 1 0 01-.293-.707V13" />
              </svg>
              <span>
                {contacts.length === 0
                  ? 'Belum ada kontak tersimpan.'
                  : 'Kontak tidak ditemukan.'}
              </span>
            </div>
          ) : (
            filtered.map((c, i) => (
              <button
                key={i}
                onClick={() => onSelect(c)}
                className="w-full text-left px-5 py-4 hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-slate-900 text-base leading-tight">{c.nama}</p>
                <p className="text-xs text-slate-500 mt-0.5">NIK: {c.nik}</p>
                {c.alamat && <p className="text-xs text-slate-400 mt-0.5 truncate">{c.alamat}</p>}
              </button>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
