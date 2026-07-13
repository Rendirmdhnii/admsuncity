import { useState } from 'react';
import { useApp } from '../context/AppContext';
import KartuPihak from '../components/KartuPihak';
import IsiSurat from '../templates/IsiSurat';
import { formatTanggalID, formatTanggalPendek, hitungTanggalAkhir, today } from '../utils/dateHelper';

const JENIS_OPTIONS = [
  { id: 'sewa', title: 'Perjanjian Sewa' },
  { id: 'serah_terima', title: 'Serah Terima Kunci' },
  { id: 'komplain', title: 'Surat Komplain' },
];

// ── Accordion Item ─────────────────────────────────────────────────────────────

function AccordionSection({ id, title, icon, openId, setOpenId, children }) {
  const isOpen = openId === id;
  return (
    <div className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden ${isOpen ? 'border-blue-300 shadow-blue-50' : 'border-slate-200'}`}>
      {/* Header */}
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500">{icon}</span>
          <span className={`text-sm font-bold transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Segmented Control (Tab Switcher) ──────────────────────────────────────────

function SegmentedControl({ value, onChange }) {
  return (
    <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5 max-w-lg mx-auto">
      {[
        { key: 'form', label: 'Isi Data' },
        { key: 'preview', label: 'Lihat Surat' },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={[
            'flex-1 py-1.5 text-xs font-semibold rounded-[10px] transition-all cursor-pointer',
            value === tab.key
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Editor View ───────────────────────────────────────────────────────────────

export default function Editor() {
  const {
    jenisSurat, gantiJenis,
    pihak1, setPihak1,
    pihak2, setPihak2,
    durasi, setDurasi,
    satuanDurasi, setSatuanDurasi,
    nomorKontrak, setNomorKontrak,
    unitInfo, setUnitInfo,
    fontPilihan, setFontPilihan,
    logo, handleLogoUpload, handleClearLogo,
    contacts,
    template,
    exportRef, handleDownloadPDF, isExporting,
    activeSubTab, setActiveSubTab,
  } = useApp();

  // Accordion: which section is open (null = all collapsed)
  const [openSection, setOpenSection] = useState('detail');

  const jenisOpt = JENIS_OPTIONS.find((o) => o.id === jenisSurat);
  const tanggalAkhir = hitungTanggalAkhir(durasi, satuanDurasi);

  return (
    <div className="flex flex-col h-full">

      {/* ── Sub-header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 z-20">
        <div className="flex items-center gap-2 mb-2 max-w-lg mx-auto">
          <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-bold text-slate-700 flex-1 truncate">{jenisOpt?.title}</span>
          <button
            onClick={gantiJenis}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Ganti
          </button>
        </div>
        <SegmentedControl value={activeSubTab} onChange={setActiveSubTab} />
      </div>

      {/* ── Scrollable Content Area ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-40">

        {/* ─── FORM TAB ───────────────────────────────────────────────────── */}
        {activeSubTab === 'form' && (
          <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto">

            {/* Kalender Pintar banner */}
            <div className="bg-slate-800 rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tanggal Surat — Otomatis
                  </p>
                  <p className="font-bold text-sm mt-0.5">{formatTanggalID(today)}</p>
                  {jenisSurat === 'sewa' && (
                    <>
                      <div className="border-t border-slate-700 my-2" />
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Tanggal Akhir Sewa — Otomatis
                      </p>
                      <p className="font-bold text-sm mt-0.5 text-blue-300">
                        {formatTanggalPendek(tanggalAkhir)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── ACCORDION 1: Detail Surat ─────────────────────────────── */}
            <AccordionSection
              id="detail"
              title="Detail Surat"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              openId={openSection}
              setOpenId={setOpenSection}
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Kontrak</label>
                <input type="text" value={nomorKontrak} onChange={(e) => setNomorKontrak(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Info Unit (Tipe / Nomor Unit)</label>
                <input type="text" value={unitInfo} onChange={(e) => setUnitInfo(e.target.value)} placeholder="cth: tipe 2BR unit 12C"
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm" />
              </div>
              {jenisSurat === 'sewa' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Durasi Sewa</label>
                  <div className="flex gap-2">
                    <input type="number" min={1} value={durasi} onChange={(e) => setDurasi(e.target.value)}
                      className="w-24 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm text-center font-bold" />
                    <select value={satuanDurasi} onChange={(e) => setSatuanDurasi(e.target.value)}
                      className="flex-1 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm">
                      <option value="hari">Hari</option>
                      <option value="bulan">Bulan</option>
                      <option value="tahun">Tahun</option>
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Huruf</label>
                <select value={fontPilihan} onChange={(e) => setFontPilihan(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none shadow-sm">
                  <option value="Times New Roman">Times New Roman (Formal)</option>
                  <option value="Arial">Arial (Modern)</option>
                  <option value="Calibri">Calibri (Bersih)</option>
                  <option value="Georgia">Georgia (Klasik)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Logo Kop Surat</label>
                {!logo ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 rounded-xl p-5 cursor-pointer transition-all">
                    <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-slate-500 font-medium">Unggah Logo</span>
                    <input id="logo-upload-input" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <img src={logo} alt="Logo" className="h-10 w-auto object-contain rounded border border-slate-200 bg-white p-1" />
                    <p className="flex-1 text-sm text-slate-700 font-semibold">Logo Aktif</p>
                    <button onClick={handleClearLogo} className="text-sm text-red-500 font-bold hover:text-red-700 cursor-pointer">Hapus</button>
                  </div>
                )}
              </div>
            </AccordionSection>

            {/* ── ACCORDION 2: Pihak Pertama ────────────────────────────── */}
            <AccordionSection
              id="pihak1"
              title="Data Pihak Pertama (Pemilik)"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              openId={openSection}
              setOpenId={setOpenSection}
            >
              <KartuPihak
                label="Pihak Pertama"
                data={pihak1}
                setData={setPihak1}
                contacts={contacts}
                onSaveContact={saveContact}
              />
            </AccordionSection>

            {/* ── ACCORDION 3: Pihak Kedua ──────────────────────────────── */}
            <AccordionSection
              id="pihak2"
              title="Data Pihak Kedua (Penyewa)"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              openId={openSection}
              setOpenId={setOpenSection}
            >
              <KartuPihak
                label="Pihak Kedua"
                data={pihak2}
                setData={setPihak2}
                contacts={contacts}
                onSaveContact={saveContact}
              />
            </AccordionSection>

          </div>
        )}

        {/* ─── SINGLE SOURCE OF TRUTH A4 PREVIEW NODE ─────────────────────── */}
        {/* Rendered normally in viewport when 'preview' is active, and rendered off-screen when 'form' is active */}
        <div className={activeSubTab === 'preview' ? 'p-4 pb-8' : 'fixed left-[-9999px] top-0 pointer-events-none'}>
          <div className="bg-slate-200 rounded-2xl p-4 shadow-inner flex justify-center overflow-hidden">
            <div 
              style={{ 
                width: '100%', 
                overflow: 'hidden', 
                display: 'flex', 
                justifyContent: 'center',
                height: 'calc(297mm * min(1, (100vw - 32px) / 820))'
              }}
            >
              <div 
                style={{ 
                  transform: 'scale(min(1, (100vw - 32px) / 820))', 
                  transformOrigin: 'top center',
                  width: '210mm',
                  boxSizing: 'border-box'
                }}
              >
                <div
                  ref={exportRef}
                  className="bg-white text-black shadow-2xl"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '15mm',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: `${fontPilihan}, 'Times New Roman', Times, serif`
                  }}
                >
                  <IsiSurat template={template} pihak1={pihak1} pihak2={pihak2} logo={logo} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Sticky PDF CTA — OUTSIDE scroll flow, always visible ─────────── */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 bg-white border-t border-slate-100 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={[
              'w-full flex items-center justify-center gap-3 font-bold py-4 rounded-2xl text-base',
              'transition-all cursor-pointer',
              isExporting
                ? 'bg-blue-400 cursor-wait text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-200',
            ].join(' ')}
          >
            {isExporting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Menyiapkan PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Pratinjau &amp; Unduh PDF
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
