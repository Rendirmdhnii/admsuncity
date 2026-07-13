import { useState } from 'react';
import ContactPickerModal from './ContactPickerModal';

/**
 * Reusable party input card (Pihak Pertama / Pihak Kedua).
 * Manages its own "show modal" and "saved" UI states.
 * Receives data, setData, contacts, and onSaveContact via props.
 */
export default function KartuPihak({ label, data, setData, contacts, onSaveContact }) {
  const [showModal, setShowModal] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSelect = (contact) => {
    setData({
      nama: contact.nama,
      nik: contact.nik,
      alamat: contact.alamat,
      noWa: contact.noWa || '',
    });
    setShowModal(false);
  };

  const handleSave = () => {
    if (!data.nama.trim()) return;
    onSaveContact({ nama: data.nama, nik: data.nik, alamat: data.alamat, noWa: data.noWa || '' });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            Pilih Kontak
          </button>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nama Lengkap<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            placeholder="Masukkan nama lengkap..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            NIK (16 digit)<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={16}
            value={data.nik}
            onChange={(e) => {
              const hanyaAngka = e.target.value.replace(/\D/g, '');
              setData({ ...data, nik: hanyaAngka.slice(0, 16) });
            }}
            placeholder="3500XXXXXXXXXXXX"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Alamat Domisili<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            rows={2}
            value={data.alamat}
            onChange={(e) => setData({ ...data, alamat: e.target.value })}
            placeholder="Jl. Contoh No. 1, Kecamatan, Kota..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base resize-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nomor WhatsApp
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={15}
            value={data.noWa}
            onChange={(e) => {
              const hanyaAngka = e.target.value.replace(/\D/g, '');
              setData({ ...data, noWa: hanyaAngka.slice(0, 15) });
            }}
            placeholder="628123456789"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm"
          />
        </div>

        {/* Save to contacts */}
        <button
          onClick={handleSave}
          className={[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold',
            'transition-all active:scale-95 cursor-pointer border',
            justSaved
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200',
          ].join(' ')}
        >
          {justSaved ? (
            <>
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Kontak Tersimpan!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simpan ke Kontak Baru
            </>
          )}
        </button>
      </div>

      {showModal && (
        <ContactPickerModal
          contacts={contacts}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
