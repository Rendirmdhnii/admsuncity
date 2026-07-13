import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';
import { loadContacts, persistContacts, upsertContact } from '../utils/contactStorage';
import { buildTemplate } from '../utils/templateBuilder';
import { downloadPDF } from '../utils/pdfHelper';
import { today } from '../utils/dateHelper';

// ── Context Definition ────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // ─ Navigation ─
  const [currentView, setCurrentView] = useState('beranda');
  const [jenisSurat, setJenisSurat] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('form');

  // ─ Form Data ─
  const [namaProperti, setNamaProperti] = useState('');
  const [pihak1, setPihak1] = useState({ nama: '', nik: '', alamat: '', noWa: '' });
  const [pihak2, setPihak2] = useState({ nama: '', nik: '', alamat: '', noWa: '' });
  const [durasi, setDurasi] = useState('');
  const [satuanDurasi, setSatuanDurasi] = useState('tahun');
  const [nomorKontrak, setNomorKontrak] = useState('');
  const [unitInfo, setUnitInfo] = useState('');
  const [fontPilihan, setFontPilihan] = useState('Times New Roman');
  const [logo, setLogo] = useState(null);

  // ─ Contacts ─
  const [contacts, setContacts] = useState(() => loadContacts());

  // ─ UI State ─
  const [showModalSukses, setShowModalSukses] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ─ Refs ─
  const exportRef = useRef(null);

  // ── Computed: template object ─────────────────────────────────────────────

  const template = useMemo(() => {
    if (!jenisSurat) return null;
    return buildTemplate({ jenis: jenisSurat, pihak1, pihak2, durasi, satuanDurasi, nomorKontrak, unitInfo, namaProperti });
  }, [jenisSurat, pihak1, pihak2, durasi, satuanDurasi, nomorKontrak, unitInfo, namaProperti]);

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
      const safeName = pihak2.nama
        ? `Surat_${jenisSurat}_${pihak2.nama.replace(/\s+/g, '_')}`
        : `Surat_${jenisSurat}_${today.toLocaleDateString('id-ID').replace(/\//g, '-')}`;
      
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

  // ── Context Value ─────────────────────────────────────────────────────────

  const value = {
    // navigation
    currentView, setCurrentView,
    jenisSurat, pilihJenis, gantiJenis,
    activeSubTab, setActiveSubTab,
    // form data
    namaProperti, setNamaProperti,
    pihak1, setPihak1,
    pihak2, setPihak2,
    durasi, setDurasi,
    satuanDurasi, setSatuanDurasi,
    nomorKontrak, setNomorKontrak,
    unitInfo, setUnitInfo,
    fontPilihan, setFontPilihan,
    logo, handleLogoUpload, handleClearLogo,
    // contacts
    contacts, saveContact, deleteContact,
    // computed
    template,
    // export
    exportRef, handleDownloadPDF, isExporting,
    // modals
    showModalSukses, setShowModalSukses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
