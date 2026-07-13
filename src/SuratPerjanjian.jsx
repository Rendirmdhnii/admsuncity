/**
 * SuratPerjanjian.jsx — Root orchestrator (~70 lines)
 *
 * Responsibilities (only):
 *   1. Wrap everything in AppProvider (Context)
 *   2. Render the shared app shell (header + main + bottom nav)
 *   3. Switch between views based on currentView
 *   4. Mount the correct hidden A4 export node
 *   5. Show the SuccessModal when PDF download completes
 *
 * All business logic lives in AppContext.
 * All UI lives in views/ and components/.
 */

import { useApp, AppProvider } from './context/AppContext';

// Views
import Beranda from './views/Beranda';
import Editor from './views/Editor';
import Kontak from './views/Kontak';

// Shared components
import BottomNav from './components/BottomNav';
import SuccessModal from './components/SuccessModal';

// Hidden A4 export nodes (one per document type, mutually exclusive)
import SuratSewa from './templates/SuratSewa';
import SerahTerima from './templates/SerahTerima';
import SuratKomplain from './templates/SuratKomplain';

// ── App Shell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const { currentView, jenisSurat, showModalSukses, setShowModalSukses, pihak2 } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-extrabold text-sm shadow-sm tracking-wider select-none">
          SR
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
            Suncity Residence
          </h1>
          <p className="text-[10px] text-slate-500 font-medium">Sistem Pembuat Surat Digital</p>
        </div>
      </header>

      {/* ── Main Content (view routing) ────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'beranda' && (
          <div className="flex-1 overflow-y-auto">
            <Beranda />
          </div>
        )}

        {currentView === 'editor_surat' && jenisSurat && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <Editor />
          </div>
        )}

        {currentView === 'buku_kontak' && (
          <div className="flex-1 overflow-y-auto">
            <Kontak />
          </div>
        )}
      </main>

      {/* ── Bottom Navigation ──────────────────────────────────────────────── */}
      <BottomNav />

      {/* ── Hidden A4 Export Nodes (only the active document type) ────────── */}
      {jenisSurat === 'sewa' && <SuratSewa />}
      {jenisSurat === 'serah_terima' && <SerahTerima />}
      {jenisSurat === 'komplain' && <SuratKomplain />}

      {/* ── Success Modal ──────────────────────────────────────────────────── */}
      {showModalSukses && (
        <SuccessModal
          nomorWa={pihak2.noWa || ''}
          onClose={() => setShowModalSukses(false)}
        />
      )}
    </div>
  );
}

// ── Default Export: wrap AppShell with Provider ───────────────────────────────

export default function SuratPerjanjian() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
