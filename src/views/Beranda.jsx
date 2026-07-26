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
    <div className="fixed inset-0 h-[100dvh] w-full bg-slate-50 flex flex-col overflow-hidden font-sans max-w-lg mx-auto">
      
      {/* HEADER NAVBAR (GENERIC WHITE-LABEL) */}
      <div className="flex-none bg-white px-6 pt-8 pb-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold shadow-md">
            MP
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-none text-lg">Manajemen Properti</h1>
            <p className="text-[10px] text-slate-500 mt-1">Sistem Administrasi Digital</p>
          </div>
        </div>
      </div>

      {/* GREETING SECTION */}
      <div className="flex-none bg-white px-6 pb-6 rounded-b-[2rem] shadow-sm z-0 relative">
        <p className="text-slate-500 text-xs font-medium tracking-wide">{sapaan},</p>
        <div className="flex justify-between items-center mt-1">
          <h2 className="text-xl font-extrabold text-slate-800">Mochammad Febrian</h2>
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-md">MF</div>
        </div>
      </div>

      {/* MENU GRID (FLEX-1 MENGISI RUANG KOSONG SECARA OTOMATIS TANPA SCROLL) */}
      <div className="flex-1 px-6 py-4 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4 h-full max-h-[340px]">
          
          {/* Menu 1 */}
          <button 
            onClick={() => pilihJenis('sewa')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-start text-left active:scale-95 transition-transform h-full w-full cursor-pointer hover:shadow-md"
          >
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl mb-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">Perjanjian Sewa</h3>
            <p className="text-[10px] text-slate-400 leading-tight">Kontrak resmi apartemen</p>
          </button>

          {/* Menu 2 */}
          <button 
            onClick={() => pilihJenis('serah_terima')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-start text-left active:scale-95 transition-transform h-full w-full cursor-pointer hover:shadow-md"
          >
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl mb-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">Serah Terima</h3>
            <p className="text-[10px] text-slate-400 leading-tight">Berita acara & kunci</p>
          </button>

          {/* Menu 3 */}
          <button 
            onClick={() => pilihJenis('invoice_sewa')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-start text-left active:scale-95 transition-transform h-full w-full cursor-pointer hover:shadow-md"
          >
            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl mb-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">Invoice Sewa</h3>
            <p className="text-[10px] text-slate-400 leading-tight">Cetak struk tagihan</p>
          </button>

          {/* Menu 4 */}
          <button 
            onClick={() => pilihJenis('komplain')}
            className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-start text-left active:scale-95 transition-transform h-full w-full cursor-pointer hover:shadow-md"
          >
            <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl mb-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">Surat Teguran</h3>
            <p className="text-[10px] text-slate-400 leading-tight">Komplain & tagihan rugi</p>
          </button>

        </div>
      </div>

      {/* DEVELOPER PROMO BANNER (FLEX-NONE DI BAWAH) */}
      <div className="flex-none px-6 pb-[90px]">
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden flex items-center gap-4">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500 rounded-full opacity-30 blur-2xl"></div>
          <div className="flex-none bg-emerald-500 p-2.5 rounded-xl shadow-inner z-10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </div>
          <div className="z-10 w-full">
            <p className="text-[9px] text-slate-300 leading-snug mb-1">Jika butuh aplikasi, sistem perusahaan, atau teknologi IoT lainnya:</p>
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-bold text-emerald-400">Hubungi Rendi</p>
              <p className="text-[11px] font-bold text-emerald-400 tracking-wider">0895-1510-6561</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
