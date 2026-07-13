import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  {
    id: 'beranda',
    label: 'Beranda',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'editor_surat',
    label: 'Editor',
    requiresJenis: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'buku_kontak',
    label: 'Kontak',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
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
                isActive ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-600',
              ].join(' ')}
            >
              <span
                className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'text-slate-900' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-slate-900 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
