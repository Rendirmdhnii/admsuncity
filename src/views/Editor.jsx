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
    showWarning, setShowWarning,
  } = useApp();

  const defaultPasal = [
    { judul: 'OBJEK DAN JANGKA WAKTU SEWA', isi: 'PIHAK PERTAMA menyewakan kepada PIHAK KEDUA, dan PIHAK KEDUA menerima sewa unit apartemen untuk jangka waktu yang telah disepakati bersama.' },
    { judul: 'HAK DAN KEWAJIBAN', isi: 'PIHAK KEDUA berhak menggunakan unit untuk hunian dan wajib mematuhi seluruh peraturan (House Rules) gedung. Segala kerusakan internal akibat kelalaian menjadi tanggung jawab PIHAK KEDUA.' },
    { judul: 'LARANGAN DAN SANKSI (WANPRESTASI)', isi: 'PIHAK KEDUA dilarang mengubah struktur fisik atau memindahtangankan hak sewa. Pelanggaran memberikan hak bagi PIHAK PERTAMA membatalkan perjanjian sepihak.' },
    { judul: 'PENYELESAIAN PERSELISIHAN', isi: 'Perselisihan diselesaikan secara musyawarah mufakat. Apabila gagal, diselesaikan melalui jalur hukum di wilayah Republik Indonesia.' }
  ];
  const [pasalList, setPasalList] = useState(defaultPasal);

  const handlePasalChange = (index, field, value) => {
    const newPasal = [...pasalList];
    newPasal[index][field] = value;
    setPasalList(newPasal);
  };

  const tambahPasal = () => {
    setPasalList([...pasalList, { judul: 'PASAL TAMBAHAN', isi: '' }]);
  };

  const hapusPasal = (index) => {
    if (pasalList.length === 1) return; // Sisakan minimal 1 pasal
    const newPasal = [...pasalList];
    newPasal.splice(index, 1);
    setPasalList(newPasal);
  };

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
      setShowWarning(true);
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
    <div className="space-y-4 max-w-4xl mx-auto">
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
            pasalList={pasalList}
          />
        </div>
      </div>

      {/* ─── FORM TAB ───────────────────────────────────────────────────── */}
        {activeSubTab === 'form' && (
          <div key={jenisSurat} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

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

                {/* Input Nama Properti / Gedung (WAJIB ADA DI SEMUA JENIS DOKUMEN) */}
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

                {jenisSurat !== 'invoice_sewa' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-0.5">
                        Nomor Kontrak<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input 
                        type="text" 
                        autoCapitalize="characters"
                        value={nomorKontrak} 
                        onChange={(e) => setNomorKontrak(e.target.value)} 
                        placeholder={`Contoh: SUNCITY/SEWA/REG/${new Date().getFullYear()}`}
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

            {/* ── Kustomisasi Pasal (Dynamic Clause Editor - HANYA MUNCUL DI PERJANJIAN SEWA) ─────────────── */}
            {jenisSurat === 'sewa' && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Kustomisasi Pasal (Opsional)
                  </h3>
                </div>

                <div className="space-y-4">
                  {pasalList.map((pasal, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-100 p-3 rounded-xl relative group transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 pr-2">
                          <span className="text-[10px] font-extrabold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">PASAL {index + 1}</span>
                          <input 
                            type="text" 
                            value={pasal.judul} 
                            onChange={(e) => handlePasalChange(index, 'judul', e.target.value)}
                            className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 text-xs font-bold text-slate-700 px-1 py-0.5 outline-none transition-colors w-full truncate"
                            placeholder="Ketik Judul Pasal..."
                          />
                        </div>
                        
                        {/* Tombol Hapus Pasal (Hanya muncul jika pasal > 1) */}
                        {pasalList.length > 1 && (
                          <button 
                            onClick={() => hapusPasal(index)}
                            className="text-slate-300 hover:text-rose-500 bg-white hover:bg-rose-50 p-1.5 rounded-lg shadow-sm border border-slate-100 transition-colors active:scale-95 cursor-pointer"
                            title="Hapus Pasal"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        )}
                      </div>
                      
                      <textarea 
                        value={pasal.isi} 
                        onChange={(e) => handlePasalChange(index, 'isi', e.target.value)}
                        rows="3"
                        className="w-full bg-white border border-slate-200 text-slate-600 text-[11px] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none leading-relaxed"
                        placeholder="Ketik isi ketentuan klausa di sini..."
                      />
                    </div>
                  ))}

                  {/* Tombol Tambah Pasal Baru */}
                  <button 
                    onClick={tambahPasal}
                    className="w-full border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-600 py-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Pasal Baru
                  </button>
                </div>
              </div>
            )}

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
                  pasalList={pasalList}
                />
              </div>
            </div>
          </div>
        )}

      {/* Enterprise Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center px-5 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
            
            {/* Icon Peringatan Elegan */}
            <div className="w-16 h-16 rounded-full bg-amber-50 border-[6px] border-white shadow-[0_0_15px_rgba(251,191,36,0.2)] flex items-center justify-center mx-auto mb-4 relative -mt-10">
              <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            {/* Copywriting Profesional */}
            <h3 className="text-lg font-extrabold text-slate-800 text-center mb-2 tracking-tight">Data Belum Lengkap</h3>
            <p className="text-[12px] text-slate-500 text-center mb-6 leading-relaxed font-medium">
              Mohon lengkapi seluruh kolom formulir yang wajib diisi (ditandai dengan bintang merah <span className="text-rose-500 font-bold">*</span>) sebelum melanjutkan proses pratinjau atau cetak dokumen.
            </p>
            
            {/* Tombol Aksi */}
            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[13px] py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-900/20 cursor-pointer"
            >
              Mengerti, Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
