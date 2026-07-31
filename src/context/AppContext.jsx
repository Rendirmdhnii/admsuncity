import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';
import { loadContacts, persistContacts, upsertContact } from '../utils/contactStorage';
import { buildTemplate } from '../utils/templateBuilder';
import { downloadPDF } from '../utils/pdfHelper';
import { today, getTodayFormatted } from '../utils/dateHelper';

// ── Context Definition ────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // ─ Navigation ─
  const [currentView, setCurrentView] = useState('beranda');
  const [jenisSurat, setJenisSurat] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('form');

  // ─ Form Data ─
  const [tanggalSurat, setTanggalSurat] = useState(() => getTodayFormatted());
  const [namaProperti, setNamaProperti] = useState('');
  const [pihak1, setPihak1] = useState({ nama: '', nik: '', alamat: '', noWa: '' });
  const [pihak2, setPihak2] = useState({ nama: '', nik: '', alamat: '', noWa: '' });
  const [durasi, setDurasi] = useState('');
  const [satuanDurasi, setSatuanDurasi] = useState('tahun');
  const [nomorKontrak, setNomorKontrak] = useState('');
  const [unitInfo, setUnitInfo] = useState('');
  const [fontPilihan, setFontPilihan] = useState('Times New Roman');
  const [logo, setLogo] = useState(null);
  const [fotoBukti, setFotoBukti] = useState(null);
  const [detailKerusakan, setDetailKerusakan] = useState('');
  const [nominalTagihan, setNominalTagihan] = useState('');
  const [batasWaktuPembayaran, setBatasWaktuPembayaran] = useState('');
  // ─ State Khusus Invoice ─
  const [tanggalCheckIn, setTanggalCheckIn] = useState(() => getTodayFormatted());
  const [totalSewa, setTotalSewa] = useState('');
  const [nominalDP, setNominalDP] = useState('');
  const [statusPembayaran, setStatusPembayaran] = useState('DP Telah Diterima');
  const [teksInclude, setTeksInclude] = useState('Service Charge');
  const [teksExclude, setTeksExclude] = useState('Air, Token Listrik, Internet / WiFi, Parkir');

  // ─ Contacts ─
  const [contacts, setContacts] = useState(() => loadContacts());

  // ─ UI State ─
  const [showModalSukses, setShowModalSukses] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ─ Refs ─
  const exportRef = useRef(null);

  // ── Computed: template object ─────────────────────────────────────────────

  const template = useMemo(() => {
    if (!jenisSurat) return null;
    return buildTemplate({ 
      jenis: jenisSurat, 
      pihak1, 
      pihak2, 
      tanggalSurat,
      durasi, 
      satuanDurasi, 
      nomorKontrak, 
      unitInfo, 
      namaProperti, 
      detailKerusakan,
      nominalTagihan,
      batasWaktuPembayaran
    });
  }, [jenisSurat, pihak1, pihak2, tanggalSurat, durasi, satuanDurasi, nomorKontrak, unitInfo, namaProperti, detailKerusakan, nominalTagihan, batasWaktuPembayaran]);

  // ── Navigation helpers ────────────────────────────────────────────────────

  const pilihJenis = useCallback((jenis) => {
    setJenisSurat(jenis);
    setActiveSubTab('form');
    setCurrentView('editor_surat');
  }, []);

  const gantiJenis = useCallback(() => {
    setJenisSurat(null);
    setCurrentView('beranda');
  }, []);

  // ── Logo helpers ──────────────────────────────────────────────────────────

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleClearLogo = useCallback(() => {
    setLogo(null);
    const input = document.getElementById('logo-upload-input');
    if (input) input.value = '';
  }, []);

  // ── Contact helpers ───────────────────────────────────────────────────────

  const saveContact = useCallback((contact) => {
    setContacts((prev) => {
      const next = upsertContact(prev, contact);
      persistContacts(next);
      return next;
    });
  }, []);

  const deleteContact = useCallback((index) => {
    setContacts((prev) => {
      const next = prev.filter((_, i) => i !== index);
      persistContacts(next);
      return next;
    });
  }, []);

  // ── PDF Export ────────────────────────────────────────────────────────────

  const handleDownloadPDF = useCallback(async () => {
    if (!exportRef.current || !template || isExporting) return false;
    setIsExporting(true);
    try {
      const amanPihak2 = pihak2.nama ? pihak2.nama.trim() : 'Penyewa';
      const amanJenis = jenisSurat === 'sewa' 
        ? 'Perjanjian Sewa' 
        : jenisSurat === 'serah_terima' 
        ? 'Serah Terima Kunci' 
        : jenisSurat === 'komplain'
        ? 'Surat Teguran dan Invoice Tagihan'
        : 'Invoice Pembayaran Sewa';
      const safeName = `Suncity - ${amanJenis} - ${amanPihak2}.pdf`;
      
      const blob = await downloadPDF(exportRef.current, safeName);
      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return true;
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Gagal mengekspor PDF. Periksa koneksi internet Anda dan coba lagi.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, template, isExporting, pihak2.nama, jenisSurat]);

  const isFormValid = useCallback(() => {
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
  }, [jenisSurat, tanggalSurat, pihak1, pihak2, namaProperti, nomorKontrak, unitInfo, durasi, detailKerusakan, nominalTagihan, batasWaktuPembayaran, fotoBukti, tanggalCheckIn, totalSewa]);

  const handleUnduhPDF = useCallback(async () => {
    if (!isFormValid()) {
      setShowWarning(true);
      return;
    }

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

        window.open(`https://wa.me/6289678449424?text=${encodeURIComponent(pesanWA)}`, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  }, [isFormValid, handleDownloadPDF, pihak2.nama, jenisSurat]);

  // ── Context Value ─────────────────────────────────────────────────────────

  const value = {
    // navigation
    currentView, setCurrentView,
    jenisSurat, pilihJenis, gantiJenis,
    activeSubTab, setActiveSubTab,
    // form data
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
    fotoBukti, setFotoBukti,
    detailKerusakan, setDetailKerusakan,
    nominalTagihan, setNominalTagihan,
    batasWaktuPembayaran, setBatasWaktuPembayaran,
    // invoice fields
    tanggalCheckIn, setTanggalCheckIn,
    totalSewa, setTotalSewa,
    nominalDP, setNominalDP,
    statusPembayaran, setStatusPembayaran,
    teksInclude, setTeksInclude,
    teksExclude, setTeksExclude,
    // contacts
    contacts, saveContact, deleteContact,
    // computed
    template,
    // export & validation
    exportRef, handleDownloadPDF, isExporting, isFormValid, handleUnduhPDF,
    // modals
    showModalSukses, setShowModalSukses,
    showWarning, setShowWarning,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
