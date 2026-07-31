import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Kontak() {
  const { contacts, deleteContact } = useApp();
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.nama.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.includes(search)
  );

  return (
    <div className="space-y-4 max-w-lg mx-auto">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm font-medium"
          />
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.586a1 1 0 01-.293.707l-2.829 2.828a1 1 0 01-.707.293H7.828a1 1 0 01-.707-.293L4.293 14.29a1 1 0 01-.293-.707V13" />
            </svg>
            <p className="font-semibold text-slate-700">
              {contacts.length === 0 ? 'Belum ada kontak' : 'Tidak ada hasil'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {contacts.length === 0
                ? 'Simpan kontak pertama Anda lewat form isian surat.'
                : 'Coba kata kunci lain.'}
            </p>
          </div>
        )}

        {/* Contact list */}
        {filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((c, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-sm flex gap-3 items-center"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md shadow-blue-500/20">
                  {c.nama.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{c.nama}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">NIK: {c.nik}</p>
                  {c.alamat && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.alamat}</p>
                  )}
                  {c.noWa && (
                    <p className="text-xs text-emerald-600 mt-0.5 font-medium">WhatsApp: {c.noWa}</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteContact(contacts.indexOf(c))}
                  aria-label={`Hapus kontak ${c.nama}`}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
