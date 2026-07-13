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
    <div className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden ${isOpen ? 'border-slate-400 shadow-slate-100' : 'border-slate-200'}`}>
      {/* Header */}
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500">{icon}</span>
          <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-800' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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
            'flex-1 py-2 text-xs font-semibold rounded-[10px] transition-all cursor-pointer',
            value === tab.key
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
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
    namaProperti, setNamaProperti,
    pihak1, setPihak1,
    pihak2, setPihak2,
    durasi, setDurasi,
    satuanDurasi, setSatuanDurasi,
    nomorKontrak, setNomorKontrak,
    unitInfo, setUnitInfo,
    fontPilihan, setFontPilihan,
    logo, handleLogoUpload, handleClearLogo,
    contacts, saveContact,
    template,
    exportRef, handleDownloadPDF, isExporting,
    activeSubTab, setActiveSubTab,
  } = useApp();

  // Accordion: which section is open (null = all collapsed)
  const [openSection, setOpenSection] = useState('detail');
  const [showModalPratinjau, setShowModalPratinjau] = useState(false);

  const jenisOpt = JENIS_OPTIONS.find((o) => o.id === jenisSurat);
  const tanggalAkhir = hitungTanggalAkhir(durasi, satuanDurasi);

  const isFormValid = () => {
    const isSewaValid = jenisSurat === 'sewa' ? (durasi !== null && durasi !== undefined && String(durasi).trim() !== '') : true;
    return (
      namaProperti?.trim() !== '' &&
      nomorKontrak?.trim() !== '' &&
      unitInfo?.trim() !== '' &&
      pihak1.nama?.trim() !== '' &&
      pihak1.nik?.trim() !== '' &&
      pihak1.alamat?.trim() !== '' &&
      pihak1.noWa?.trim() !== '' &&
      pihak2.nama?.trim() !== '' &&
      pihak2.nik?.trim() !== '' &&
      pihak2.alamat?.trim() !== '' &&
      pihak2.noWa?.trim() !== '' &&
      isSewaValid
    );
  };

  const handleOpenPreview = () => {
    if (!isFormValid()) {
      alert('Akses Ditolak: Seluruh kolom formulir yang bertanda bintang merah wajib diisi sebelum Anda dapat melihat atau mengunduh surat.');
      return;
    }
    setShowModalPratinjau(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* ── Sub-header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 z-20">
        <div className="flex items-center gap-2 mb-2 max-w-lg mx-auto">
          <svg className="w-5 h-5 text-slate-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-sm font-semibold text-slate-800 flex-1 truncate">{jenisOpt?.title}</span>
          <button
            onClick={gantiJenis}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Ganti
          </button>
        </div>
        <SegmentedControl 
          value={activeSubTab} 
          onChange={(newTab) => {
            if (newTab === 'preview' && !isFormValid()) {
              alert('Akses Ditolak: Seluruh kolom formulir yang bertanda bintang merah wajib diisi sebelum Anda dapat melihat atau mengunduh surat.');
              return;
            }
            setActiveSubTab(newTab);
          }} 
        />
      </div>

      {/* ── Scrollable Content Area ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-40">

        {/* ─── FORM TAB ───────────────────────────────────────────────────── */}
        {activeSubTab === 'form' && (
          <div className="flex flex-col gap-3 p-4 max-w-lg mx-auto">

            {/* Kalender Pintar banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tanggal Surat — Otomatis
                  </p>
                  <p className="font-bold text-sm mt-0.5">{formatTanggalID(today)}</p>
                  {jenisSurat === 'sewa' && (
                    <>
                      <div className="border-t border-slate-800 my-2" />
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Tanggal Akhir Sewa — Otomatis
                      </p>
                      <p className="font-bold text-sm mt-0.5 text-slate-300">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              }
              openId={openSection}
              setOpenId={setOpenSection}
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nama Properti / Gedung<span className="text-red-500 ml-1">*</span>
                </label>
                <input type="text" value={namaProperti} onChange={(e) => setNamaProperti(e.target.value)} placeholder="Contoh: Suncity Residence"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nomor Kontrak<span className="text-red-500 ml-1">*</span>
                </label>
                <input type="text" value={nomorKontrak} onChange={(e) => setNomorKontrak(e.target.value)} placeholder="Contoh: SUNCITY/SEWA/REG/2026"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Info Unit (Tipe / Nomor Unit)<span className="text-red-500 ml-1">*</span>
                </label>
                <input type="text" value={unitInfo} onChange={(e) => setUnitInfo(e.target.value)} placeholder="Contoh: Unit 2 BR 26 A Lantai 21"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm" />
              </div>
              {jenisSurat === 'sewa' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Durasi Sewa<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="number" min={1} value={durasi} onChange={(e) => setDurasi(e.target.value)}
                      className="w-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm text-center font-semibold" />
                    <select value={satuanDurasi} onChange={(e) => setSatuanDurasi(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm">
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
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-base focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 focus:outline-none transition-all shadow-sm">
                  <option value="Times New Roman">Times New Roman (Formal)</option>
                  <option value="Arial">Arial (Modern)</option>
                  <option value="Calibri">Calibri (Bersih)</option>
                  <option value="Georgia">Georgia (Klasik)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Logo Kop Surat</label>
                {!logo ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 rounded-xl p-5 cursor-pointer transition-all">
                    <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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

        {/* ─── PREVIEW TAB (Visual Only) ──────────────────────────────────── */}
        {activeSubTab === 'preview' && (
          <div className="p-4 pb-8">
            <div className="w-full bg-slate-200 rounded-xl p-2 flex justify-center overflow-hidden" style={{ minHeight: '70vh' }}>
              {/* Origin top-center memastikan kertas mengecil ke tengah, bukan ke kiri */}
              <div 
                className="origin-top" 
                style={{ 
                  width: '794px', 
                  /* Kalkulasi: (Lebar Layar Mobile - margin kiri kanan) dibagi Lebar A4 */
                  transform: 'scale(calc((100vw - 32px) / 794))',
                  marginBottom: '-100%' /* Mencegah sisa ruang kosong akibat scale down */
                }}
              >
                <div 
                  className="bg-white shadow-xl" 
                  style={{ 
                    width: '794px', 
                    minHeight: '1123px', 
                    padding: '75px', // Setara 20mm
                    boxSizing: 'border-box',
                    color: '#000000',
                    fontFamily: '"Times New Roman", Times, serif'
                  }}
                >
                  <IsiSurat template={template} pihak1={pihak1} pihak2={pihak2} logo={logo} namaProperti={namaProperti} />
                </div>
              </div>
            </div>
          </div>
        )}



      </div>

      {/* ── Sticky CTA: Open Preview Modal ── */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 bg-white border-t border-slate-100 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleOpenPreview}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 shadow-lg shadow-slate-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lihat Pratinjau Surat
          </button>
        </div>
      </div>

      {/* ── Full-Screen Preview Modal (100% WYSIWYG) ── */}
      {showModalPratinjau && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-md justify-between animate-fade-in">
          {/* Modal Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <span className="text-sm font-bold text-slate-800">Pratinjau Dokumen Final</span>
            <button
              onClick={() => setShowModalPratinjau(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body (Scaled A4) */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start">
            <div className="w-full flex justify-center bg-gray-600 overflow-hidden py-4" style={{ height: '530px' }}>
              {/* Pembungkus ini memaksa kertas A4 menyusut 50% secara visual di HP, TAPI ukuran aslinya tetap A4 */}
              <div style={{ transform: 'scale(0.45)', transformOrigin: 'top center', width: '210mm' }} className="origin-top">
                <div id="kertas-surat-final" ref={exportRef} style={{ width: '210mm', minHeight: '297mm', padding: '20mm', background: 'white', color: 'black', fontFamily: '"Times New Roman", serif', fontSize: '11pt', lineHeight: '1.4', textAlign: 'justify' }}>
                  <IsiSurat template={template} pihak1={pihak1} pihak2={pihak2} logo={logo} namaProperti={namaProperti} />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer: Action Buttons */}
          <div className="bg-white border-t border-slate-200 p-4 flex gap-3 z-50">
            <button
              onClick={() => setShowModalPratinjau(false)}
              className="flex-1 py-4 border border-slate-200 text-slate-700 font-bold rounded-2xl text-base hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Tutup Pratinjau
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className={[
                'flex-1 flex items-center justify-center gap-3 font-bold py-4 rounded-2xl text-base transition-all cursor-pointer',
                isExporting ? 'bg-slate-400 cursor-wait text-white' : 'bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200'
              ].join(' ')}
            >
              {isExporting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Mengunduh...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Unduh PDF (Final)
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
