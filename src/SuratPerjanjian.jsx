/**
 * SuratPerjanjian.jsx — Root orchestrator with Strict Flexbox Column Mobile Shell
 */

import { useApp, AppProvider } from './context/AppContext';

// Views
import Beranda from './views/Beranda';
import Editor from './views/Editor';
import Kontak from './views/Kontak';

// Shared components
import SuccessModal from './components/SuccessModal';

const JENIS_OPTIONS = [
  { id: 'sewa', title: 'Perjanjian Sewa' },
  { id: 'serah_terima', title: 'Serah Terima Kunci' },
  { id: 'komplain', title: 'Surat Teguran & Invoice Tagihan' },
  { id: 'invoice_sewa', title: 'Invoice Pembayaran Sewa' },
];

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

function AppShell() {
  const { 
    currentView, setCurrentView, 
    jenisSurat, gantiJenis,
    showModalSukses, setShowModalSukses, 
    pihak2, contacts,
    handleUnduhPDF, isExporting,
    activeSubTab, setActiveSubTab, isFormValid
  } = useApp();

  const jenisOpt = JENIS_OPTIONS.find((o) => o.id === jenisSurat);

  return (
    <div className="h-[100dvh] w-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans select-none">
      
      {/* BLOK 1: HEADER (TETAP DI ATAS) */}
      <header className="flex-none bg-white/95 backdrop-blur-md border-b border-slate-200 z-20" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <div className="px-4 pb-3 max-w-4xl mx-auto w-full">
          {currentView === 'beranda' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  MP
                </div>
                <div>
                  <h1 className="font-bold text-slate-800 leading-none text-lg">Manajemen Properti</h1>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Sistem Administrasi Digital</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'buku_kontak' && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Buku Kontak
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {contacts.length} kontak tersimpan
              </p>
            </div>
          )}

          {currentView === 'editor_surat' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Dokumen Aktif</p>
                    <h2 className="text-xs font-extrabold text-slate-800 truncate">{jenisOpt?.title || 'Perjanjian Sewa'}</h2>
                  </div>
                </div>
                <button 
                  onClick={gantiJenis}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 border border-slate-200 shadow-sm shrink-0 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  <span>Ganti Dokumen</span>
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
          )}
        </div>
      </header>

      {/* BLOK 2: AREA SCROLL KONTEN (MENGISI RUANG KOSONG) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative z-10">
        <div className="pb-8 max-w-4xl mx-auto">
          {currentView === 'beranda' && <Beranda />}
          {currentView === 'editor_surat' && jenisSurat && <Editor />}
          {currentView === 'buku_kontak' && <Kontak />}
        </div>
      </main>

      {/* BLOK 3: WADAH BAWAH TERPADU (TOMBOL CETAK + NAVIGASI BAWAH) */}
      <footer className="flex-none bg-white rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-30 border-t border-slate-100 max-w-4xl w-full mx-auto" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        
        {/* Render Tombol Aksi HANYA jika sedang di halaman Editor */}
        {currentView === 'editor_surat' && (
          <div className="px-5 pt-4 pb-2">
            <button 
              onClick={handleUnduhPDF} 
              disabled={isExporting}
              className="w-full bg-slate-900 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex justify-center items-center gap-2 cursor-pointer disabled:opacity-80 disabled:scale-100"
            >
              {isExporting ? (
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
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigasi Bawah (Beranda, Editor, Kontak) */}
        <nav className="flex justify-around items-center px-2 py-2">
          <button 
            onClick={() => setCurrentView('beranda')} 
            className={`flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer ${currentView === 'beranda' ? 'text-slate-900 scale-110' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-extrabold">Beranda</span>
          </button>
          
          <button 
            onClick={() => { if (jenisSurat) setCurrentView('editor_surat'); }} 
            disabled={!jenisSurat}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all ${!jenisSurat ? 'opacity-30 cursor-not-allowed text-slate-400' : 'cursor-pointer'} ${currentView === 'editor_surat' ? 'text-slate-900 scale-110' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="text-[10px] font-extrabold">Editor</span>
          </button>

          <button 
            onClick={() => setCurrentView('buku_kontak')} 
            className={`flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer ${currentView === 'buku_kontak' ? 'text-slate-900 scale-110' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
            <span className="text-[10px] font-extrabold">Kontak</span>
          </button>
        </nav>
      </footer>

      {/* Success Modal */}
      {showModalSukses && (
        <SuccessModal
          nomorWa={pihak2.noWa || ''}
          onClose={() => setShowModalSukses(false)}
        />
      )}
    </div>
  );
}

export default function SuratPerjanjian() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
