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
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="pt-3">
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Buku Kontak
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {contacts.length} kontak tersimpan
        </p>
      </div>

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
          className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm"
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
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-3 items-center"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
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
                  <p className="text-xs text-emerald-600 mt-0.5">WhatsApp: {c.noWa}</p>
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
