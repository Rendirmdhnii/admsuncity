import { useApp } from '../context/AppContext';

export default function Beranda() {
  const { pilihJenis } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };
  const sapaan = getGreeting();

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans max-w-lg mx-auto w-full">
      {/* HEADER SECTION (APP STYLE) */}
      <div className="bg-white px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-slate-500 text-sm font-medium tracking-wide">{sapaan},</p>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">Mochammad Febrian</h1>
          </div>
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold shadow-md">
            MF
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-4">Mau buat dokumen apa hari ini?</p>
      </div>

      {/* MENU GRID (BENTO STYLE) */}
      <div className="px-6 grid grid-cols-2 gap-4">
        
        {/* Menu 1: Perjanjian Sewa */}
        <button 
          onClick={() => pilihJenis('sewa')} 
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start text-left active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Perjanjian Sewa</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Kontrak resmi apartemen</p>
        </button>

        {/* Menu 2: Serah Terima */}
        <button 
          onClick={() => pilihJenis('serah_terima')} 
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start text-left active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Serah Terima</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Berita acara & kunci</p>
        </button>

        {/* Menu 3: Invoice Pembayaran */}
        <button 
          onClick={() => pilihJenis('invoice_sewa')} 
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start text-left active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Invoice Sewa</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Cetak struk tagihan</p>
        </button>

        {/* Menu 4: Surat Teguran */}
        <button 
          onClick={() => pilihJenis('komplain')} 
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start text-left active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">Surat Teguran</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Komplain & tagihan rugi</p>
        </button>

      </div>

      {/* SYSTEM INFO BANNER */}
      <div className="px-6 mt-6">
        <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-700 rounded-full opacity-50 blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-xs font-bold tracking-widest text-slate-300">SISTEM AKTIF</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Kendali Penuh Administrasi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Semua dokumen dicetak dengan standar resolusi tinggi dan terhubung ke WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
