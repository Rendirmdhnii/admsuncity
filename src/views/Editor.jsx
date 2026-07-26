import { useState } from 'react';
import { useApp } from '../context/AppContext';
import KartuPihak from '../components/KartuPihak';
import IsiSurat from '../templates/IsiSurat';
import { formatTanggalPendek, hitungTanggalAkhir, formatRupiah } from '../utils/dateHelper';

const JENIS_OPTIONS = [
  { id: 'sewa', title: 'Perjanjian Sewa' },
  { id: 'serah_terima', title: 'Serah Terima Kunci' },
  { id: 'komplain', title: 'Surat Teguran & Invoice Tagihan' },
  { id: 'invoice_sewa', title: 'Invoice Pembayaran Sewa' },
];

// ── Accordion Item ─────────────────────────────────────────────────────────────

function AccordionSection({ id, title, icon, openId, setOpenId, children }) {
  const isOpen = openId === id;
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-3 transition-all duration-200">
      {/* Header */}
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full px-4 py-3.5 flex justify-between items-center bg-white/80 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2.5">
          <span className="text-slate-500 group-hover:text-slate-800 transition-colors">{icon}</span>
          <span className={isOpen ? 'text-slate-900 font-extrabold' : 'text-slate-700'}>
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-800' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 bg-white/50">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Segmented Control (Tab Switcher) ──────────────────────────────────────────

function SegmentedControl({ value, onChange }) {
  return (
    <div className="flex bg-slate-200/70 p-1 rounded-xl gap-1 w-full border border-slate-200/80">
      {[
        { key: 'form', label: 'Isi Data' },
        { key: 'preview', label: 'Lihat Surat' },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={[
            'flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer',
            value === tab.key
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800',
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
    tanggalSurat, setTanggalSurat,
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
    exportRef, handleDownloadPDF,
    activeSubTab, setActiveSubTab,
    fotoBukti, setFotoBukti,
    detailKerusakan, setDetailKerusakan,
    nominalTagihan, setNominalTagihan,
    batasWaktuPembayaran, setBatasWaktuPembayaran,
    tanggalCheckIn, setTanggalCheckIn,
    totalSewa, setTotalSewa,
    nominalDP, setNominalDP,
    statusPembayaran, setStatusPembayaran,
    teksInclude, setTeksInclude,
    teksExclude, setTeksExclude,
  } = useApp();

  const [openSection, setOpenSection] = useState('detail');
  const [isProcessing, setIsProcessing] = useState(false);

  const jenisOpt = JENIS_OPTIONS.find((o) => o.id === jenisSurat);
  const tanggalAkhir = hitungTanggalAkhir(tanggalSurat, durasi, satuanDurasi);

  const isFormValid = () => {
    const isTanggalSuratValid = tanggalSurat?.trim() !== '';
    const isPihak2Valid = pihak2.nama?.trim() !== '';

    if (jenisSurat === 'invoice_sewa') {
      return (
        isTanggalSuratValid &&
        isPihak2Valid &&
        tanggalCheckIn?.trim() !== '' &&
        String(totalSewa).trim() !== ''
      );
    }

    const isNamaPropertiValid = namaProperti?.trim() !== '';
    const isNomorKontrakValid = nomorKontrak?.trim() !== '';
    const isUnitInfoValid = unitInfo?.trim() !== '';
    const isPihak1Valid = pihak1.nama?.trim() !== '' && pihak1.nik?.trim() !== '' && pihak1.alamat?.trim() !== '';

    const isSewaValid = jenisSurat === 'sewa' 
      ? (durasi !== null && durasi !== undefined && String(durasi).trim() !== '') 
      : true;
      
    const isKomplainValid = jenisSurat === 'komplain' 
      ? (detailKerusakan?.trim() !== '' && nominalTagihan?.trim() !== '' && batasWaktuPembayaran?.trim() !== '') 
      : true;
      
    const isSerahTerimaValid = jenisSurat === 'serah_terima' 
      ? (fotoBukti !== null && fotoBukti !== '') 
      : true;

    return (
      isTanggalSuratValid &&
      isNamaPropertiValid &&
      isNomorKontrakValid &&
      isUnitInfoValid &&
      isPihak1Valid &&
      isPihak2Valid &&
      isSewaValid &&
      isKomplainValid &&
      isSerahTerimaValid
    );
  };

  const handleUnduhPDF = async () => {
    if (!isFormValid()) {
      alert('Akses Ditolak: Seluruh kolom formulir yang bertanda bintang merah wajib diisi sebelum Anda dapat mengekspor dan mengirim dokumen.');
      return;
    }

    setIsProcessing(true);
    try {
      const success = await handleDownloadPDF();
      if (success) {
        const amanPihak2 = pihak2.nama ? pihak2.nama.trim() : 'Penyewa';
        const amanJenis = jenisSurat === 'sewa' 
          ? 'Perjanjian Sewa' 
          : jenisSurat === 'serah_terima' 
          ? 'Serah Terima Kunci' 
          : jenisSurat === 'komplain'
          ? 'Surat Teguran dan Invoice Tagihan'
          : 'Invoice Pembayaran Sewa';

        const pesanWA = `Halo Admin Suncity,\n\nBerikut adalah dokumen administrasi baru yang telah dicetak melalui sistem:\n\nJenis Dokumen: *${amanJenis}*\nNama Penyewa: *${amanPihak2}*\n\nMohon untuk menerima lampiran PDF yang akan saya kirimkan setelah pesan ini untuk diarsipkan.\n\nTerima kasih.`;

        // Buka WA di luar PWA agar PWA tetap menyala di memori HP
        window.open(`https://wa.me/6289678449424?text=${encodeURIComponent(pesanWA)}`, '_blank');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#f8fafc] flex flex-col overflow-hidden font-sans relative z-0">

      {/* Mesh Gradient Dekorasi */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none"></div>

      {/* Hidden Export Node (Always mounted for PDF Generation) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', overflow: 'hidden' }}>
        <div id="kertas-surat-final" ref={exportRef} style={{ width: '794px', minHeight: '1123px', padding: '75px', background: 'white', boxSizing: 'border-box', color: 'black', fontFamily: '"Times New Roman", Times, serif', fontSize: '15px', lineHeight: '1.5', textAlign: 'justify' }}>
          <IsiSurat 
            template={template} 
            pihak1={pihak1} 
            pihak2={pihak2} 
            logo={logo} 
            namaProperti={namaProperti} 
            jenisSurat={jenisSurat} 
            fotoBukti={fotoBukti} 
            tanggalSurat={tanggalSurat}
            tanggalCheckIn={tanggalCheckIn}
            totalSewa={totalSewa}
            nominalDP={nominalDP}
            statusPembayaran={statusPembayaran}
            teksInclude={teksInclude}
            teksExclude={teksExclude}
            durasi={durasi}
            satuanDurasi={satuanDurasi}
            unitInfo={unitInfo}
          />
        </div>
      </div>

      {/* Konten Utama Terstruktur */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-4xl mx-auto px-4 pt-4 pb-28 overflow-hidden">

        {/* Smart Document Header */}
        <div className="flex-none bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 mb-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Dokumen Aktif</p>
              <h2 className="text-xs font-extrabold text-slate-800 truncate">{jenisOpt?.title || 'Perjanjian Sewa'}</h2>
            </div>
          </div>
          <button 
            onClick={gantiJenis}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 border border-slate-200 shadow-sm shrink-0 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            <span>Ganti Dokumen</span>
          </button>
        </div>

        {/* Tab Switcher (Isi Data / Lihat Surat) */}
        <div className="flex-none mb-3">
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

        {/* Form Body dengan Internal Scroll yang Halus & Minimalis */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-6">

          {/* ─── FORM TAB ───────────────────────────────────────────────────── */}
          {activeSubTab === 'form' && (
            <div className="space-y-3">

              {/* ── ACCORDION 1: Detail Surat ─────────────────────────────── */}
              <AccordionSection
                id="detail"
                title="Detail Surat"
                icon={
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                }
                openId={openSection}
                setOpenId={setOpenSection}
              >
                {/* GRID 2 KOLOM FORM DETIL SURAT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Input Tanggal Surat */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                      Tanggal Surat<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input 
                      type="date" 
                      required 
                      value={tanggalSurat} 
                      onChange={(e) => setTanggalSurat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-medium" 
                    />
                  </div>

                  {jenisSurat !== 'invoice_sewa' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Nama Properti / Gedung<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="text" 
                          autoCapitalize="words"
                          value={namaProperti} 
                          onChange={(e) => setNamaProperti(e.target.value)} 
                          placeholder="Contoh: Suncity Residence"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Nomor Kontrak<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="text" 
                          autoCapitalize="characters"
                          value={nomorKontrak} 
                          onChange={(e) => setNomorKontrak(e.target.value)} 
                          placeholder="Contoh: SUNCITY/SEWA/REG/2026"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Info Unit (Tipe / Nomor Unit)<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="text" 
                          autoCapitalize="words"
                          value={unitInfo} 
                          onChange={(e) => setUnitInfo(e.target.value)} 
                          placeholder="Contoh: Unit 2 BR 26 A Lantai 21"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium" 
                        />
                      </div>
                    </>
                  )}

                  {/* Form Input Khusus Invoice Pembayaran Sewa */}
                  {jenisSurat === 'invoice_sewa' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Tanggal Check-in<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="date" 
                          required 
                          value={tanggalCheckIn} 
                          onChange={(e) => setTanggalCheckIn(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-medium" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Durasi Sewa
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            inputMode="numeric"
                            min={1} 
                            value={durasi} 
                            onChange={(e) => setDurasi(e.target.value)} 
                            placeholder="1"
                            className="w-20 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm text-center font-bold" 
                          />
                          <select 
                            value={satuanDurasi} 
                            onChange={(e) => setSatuanDurasi(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-semibold"
                          >
                            <option value="hari">Hari</option>
                            <option value="bulan">Bulan</option>
                            <option value="tahun">Tahun</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Total Harga Sewa (Rp)<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                            Rp
                          </span>
                          <input 
                            type="text" 
                            required 
                            inputMode="numeric"
                            value={formatRupiah(totalSewa)} 
                            onChange={(e) => setTotalSewa(e.target.value.replace(/\D/g, ''))}
                            placeholder="0"
                            className="w-full pl-9 pr-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-bold" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Nominal DP Dibayar (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                            Rp
                          </span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={formatRupiah(nominalDP)} 
                            onChange={(e) => setNominalDP(e.target.value.replace(/\D/g, ''))}
                            placeholder="0"
                            className="w-full pl-9 pr-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-bold" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Status Pembayaran
                        </label>
                        <select 
                          value={statusPembayaran} 
                          onChange={(e) => setStatusPembayaran(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-bold"
                        >
                          <option value="DP Telah Diterima">DP Telah Diterima</option>
                          <option value="Lunas">Lunas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Catatan Include
                        </label>
                        <textarea
                          rows={2}
                          autoCapitalize="sentences"
                          value={teksInclude}
                          onChange={(e) => setTeksInclude(e.target.value)}
                          placeholder="Service Charge"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Catatan Exclude
                        </label>
                        <textarea
                          rows={2}
                          autoCapitalize="sentences"
                          value={teksExclude}
                          onChange={(e) => setTeksExclude(e.target.value)}
                          placeholder="Air, Token Listrik, Internet / WiFi, Parkir"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </>
                  )}

                  {jenisSurat === 'sewa' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                        Durasi Sewa<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          inputMode="numeric"
                          min={1} 
                          value={durasi} 
                          onChange={(e) => setDurasi(e.target.value)}
                          className="w-20 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm text-center font-bold" 
                        />
                        <select 
                          value={satuanDurasi} 
                          onChange={(e) => setSatuanDurasi(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-semibold"
                        >
                          <option value="hari">Hari</option>
                          <option value="bulan">Bulan</option>
                          <option value="tahun">Tahun</option>
                        </select>
                      </div>
                      {durasi && (
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                          Selesai: <span className="font-bold text-slate-800">{formatTanggalPendek(tanggalAkhir)}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Input Tambahan Khusus Surat Teguran & Invoice Tagihan */}
                  {jenisSurat === 'komplain' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Detail Pelanggaran / Kerusakan<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <textarea
                          rows={3}
                          autoCapitalize="sentences"
                          value={detailKerusakan}
                          onChange={(e) => setDetailKerusakan(e.target.value)}
                          placeholder="Contoh: Kerusakan fasilitas AC unit retak dan belum diselesaikan..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Nominal Tagihan (Rp)<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                            Rp
                          </span>
                          <input 
                            type="text" 
                            required 
                            inputMode="numeric"
                            value={nominalTagihan} 
                            onChange={(e) => setNominalTagihan(formatRupiah(e.target.value))}
                            placeholder="0"
                            className="w-full pl-9 pr-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-bold" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                          Batas Waktu Pembayaran<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="date" 
                          required 
                          value={batasWaktuPembayaran} 
                          onChange={(e) => setBatasWaktuPembayaran(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-medium" 
                        />
                      </div>
                    </>
                  )}

                  {/* Input Upload Foto Bukti (Khusus Serah Terima Kunci) */}
                  {jenisSurat === 'serah_terima' && (
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                        Foto Kondisi Fisik Unit<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      {!fotoBukti ? (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl p-4 cursor-pointer transition-all">
                          <svg className="w-5 h-5 text-slate-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                          </svg>
                          <span className="text-xs text-slate-600 font-bold">Unggah Foto Bukti</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFotoBukti(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                          <img src={fotoBukti} alt="Bukti" className="h-9 w-auto object-contain rounded border border-slate-200 bg-white p-1" />
                          <p className="flex-1 text-xs text-slate-700 font-bold">Foto Terunggah</p>
                          <button onClick={() => setFotoBukti(null)} className="text-xs text-red-500 font-bold hover:text-red-700 cursor-pointer">Hapus</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">Jenis Huruf</label>
                    <select 
                      value={fontPilihan} 
                      onChange={(e) => setFontPilihan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm font-semibold"
                    >
                      <option value="Times New Roman">Times New Roman (Formal)</option>
                      <option value="Arial">Arial (Modern)</option>
                      <option value="Calibri">Calibri (Bersih)</option>
                      <option value="Georgia">Georgia (Klasik)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">Logo Kop Surat</label>
                    {!logo ? (
                      <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl p-2.5 cursor-pointer transition-all">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs text-slate-600 font-bold">Unggah Logo</span>
                        <input id="logo-upload-input" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <img src={logo} alt="Logo" className="h-8 w-auto object-contain rounded border border-slate-200 bg-white p-0.5" />
                        <p className="flex-1 text-xs text-slate-700 font-bold">Logo Aktif</p>
                        <button onClick={handleClearLogo} className="text-xs text-red-500 font-bold hover:text-red-700 cursor-pointer">Hapus</button>
                      </div>
                    )}
                  </div>

                </div>
              </AccordionSection>

              {/* ── ACCORDION 2: Pihak Pertama ────────────────────────────── */}
              {jenisSurat !== 'invoice_sewa' && (
                <AccordionSection
                  id="pihak1"
                  title="Data Pihak Pertama (Pemilik)"
                  icon={
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              )}

              {/* ── ACCORDION 3: Pihak Kedua / Pelanggan ──────────────────── */}
              <AccordionSection
                id="pihak2"
                title={jenisSurat === 'invoice_sewa' ? 'Data Pelanggan / Penyewa' : 'Data Pihak Kedua (Penyewa)'}
                icon={
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                }
                openId={openSection}
                setOpenId={setOpenSection}
              >
                <KartuPihak
                  label={jenisSurat === 'invoice_sewa' ? 'Pelanggan / Penyewa' : 'Pihak Kedua'}
                  data={pihak2}
                  setData={setPihak2}
                  contacts={contacts}
                  onSaveContact={saveContact}
                />
              </AccordionSection>

            </div>
          )}

          {/* ─── PREVIEW TAB (Perfect Fit-to-Screen Anti-Scroll Wrapper) ─── */}
          {activeSubTab === 'preview' && (
            <div className="w-full h-[60vh] bg-slate-200/80 rounded-2xl border border-slate-200 flex justify-center items-start overflow-hidden p-3 shadow-inner relative">
              <div 
                className="origin-top shadow-xl transition-all duration-300"
                style={{
                  width: '794px',
                  height: '1123px',
                  transform: 'scale(min(calc((100vw - 48px) / 794), calc((60vh - 24px) / 1123)))',
                  backgroundColor: 'white'
                }}
              >
                <div id="kertas-pratinjau-inline" style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
                  <IsiSurat 
                    template={template} 
                    pihak1={pihak1} 
                    pihak2={pihak2} 
                    logo={logo} 
                    namaProperti={namaProperti} 
                    jenisSurat={jenisSurat} 
                    fotoBukti={fotoBukti} 
                    tanggalSurat={tanggalSurat}
                    tanggalCheckIn={tanggalCheckIn}
                    totalSewa={totalSewa}
                    nominalDP={nominalDP}
                    statusPembayaran={statusPembayaran}
                    teksInclude={teksInclude}
                    teksExclude={teksExclude}
                    durasi={durasi}
                    satuanDurasi={satuanDurasi}
                    unitInfo={unitInfo}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── PREMIUM GLASSMORPHISM DIRECT ACTION BUTTON (One-Click PDF & WA) ── */}
      <div className="fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-lg border-t border-slate-200 p-3 pb-6 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={handleUnduhPDF}
            disabled={isProcessing}
            className="w-full bg-slate-900 text-white font-bold text-sm px-6 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex justify-center items-center gap-3 disabled:opacity-80 disabled:scale-100 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="tracking-wide">Menyusun Dokumen...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="tracking-wide">Cetak PDF & Kirim WhatsApp</span>
                <svg className="w-4 h-4 text-emerald-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
