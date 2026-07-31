import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentView, setCurrentView, jenisSurat } = useApp();

  const isEditorDisabled = !jenisSurat;

  return (
    <div className="fixed bottom-0 left-0 w-full px-5 pb-6 pt-2 z-50 pointer-events-none">
      <nav className="bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 flex justify-around items-center py-2 px-2 pointer-events-auto max-w-md mx-auto">
        
        {/* Beranda */}
        <button 
          onClick={() => setCurrentView('beranda')}
          className={`flex flex-col items-center p-2 px-4 rounded-full transition-all cursor-pointer ${
            currentView === 'beranda' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        
        {/* Editor */}
        <button 
          onClick={() => { if (!isEditorDisabled) setCurrentView('editor_surat'); }}
          disabled={isEditorDisabled}
          className={`flex flex-col items-center p-2 px-4 rounded-full transition-all ${
            isEditorDisabled ? 'opacity-30 cursor-not-allowed text-slate-400' : 'cursor-pointer'
          } ${
            currentView === 'editor_surat' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] font-bold">Editor</span>
        </button>
        
        {/* Kontak */}
        <button 
          onClick={() => setCurrentView('buku_kontak')}
          className={`flex flex-col items-center p-2 px-4 rounded-full transition-all cursor-pointer ${
            currentView === 'buku_kontak' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span className="text-[10px] font-bold">Kontak</span>
        </button>

      </nav>
    </div>
  );
}
