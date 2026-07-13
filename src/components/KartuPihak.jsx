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
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Pilih Kontak
          </button>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            placeholder="Masukkan nama lengkap..."
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            NIK (16 digit)
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={16}
            value={data.nik}
            onChange={(e) => setData({ ...data, nik: e.target.value })}
            placeholder="3500XXXXXXXXXXXX"
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Alamat Domisili
          </label>
          <textarea
            rows={2}
            value={data.alamat}
            onChange={(e) => setData({ ...data, alamat: e.target.value })}
            placeholder="Jl. Contoh No. 1, Kecamatan, Kota..."
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nomor WhatsApp
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={data.noWa}
            onChange={(e) => setData({ ...data, noWa: e.target.value })}
            placeholder="628123456789"
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
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
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              Kontak Tersimpan!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
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
