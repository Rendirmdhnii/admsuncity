import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  {
    id: 'beranda',
    label: 'Beranda',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'editor_surat',
    label: 'Editor',
    requiresJenis: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'buku_kontak',
    label: 'Kontak',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { currentView, setCurrentView, jenisSurat } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-center max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          const isDisabled = item.requiresJenis && !jenisSurat;

          return (
            <button
              key={item.id}
              onClick={() => { if (!isDisabled) setCurrentView(item.id); }}
              disabled={isDisabled}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all select-none',
                isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600',
              ].join(' ')}
            >
              <span
                className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] font-bold tracking-wide mt-0.5 ${isActive ? 'text-blue-600' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
