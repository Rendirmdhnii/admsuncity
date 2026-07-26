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
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#f8fafc] flex flex-col overflow-hidden font-sans relative z-0 max-w-lg mx-auto">
      
      {/* A. MESH GRADIENT BLOBS (Dekorasi Latar Belakang) */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>

      {/* B. KONTEN UTAMA (Harus menggunakan relative z-10 agar berada di atas blobs) */}
      <div className="relative z-10 flex flex-col h-full w-full">
        
        {/* HEADER NAVBAR (GENERIC WHITE-LABEL) */}
        <div className="flex-none bg-white/80 backdrop-blur-md px-6 pt-8 pb-4 flex items-center justify-between z-10 border-b border-slate-100">
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

        {/* GREETING SECTION */}
        <div className="flex-none bg-white/80 backdrop-blur-md px-6 pb-6 rounded-b-[2rem] shadow-sm z-0 relative border-b border-slate-100">
          <p className="text-slate-500 text-xs font-medium tracking-wide">{sapaan},</p>
          <div className="flex justify-between items-center mt-1">
            <h2 className="text-xl font-extrabold text-slate-800">Mochammad Febrian</h2>
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-md">MF</div>
          </div>
        </div>

        {/* MENU GRID (FLEX-1 MENGISI RUANG KOSONG SECARA OTOMATIS TANPA SCROLL) */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 h-full max-h-[340px]">
            
            {/* Tombol 1: Perjanjian Sewa */}
            <button 
              onClick={() => pilihJenis('sewa')}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col justify-center items-start text-left active:scale-95 transition-all h-full w-full cursor-pointer hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3.5 rounded-2xl mb-auto shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm mt-3 mb-0.5">Perjanjian Sewa</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Kontrak resmi apartemen</p>
            </button>

            {/* Tombol 2: Serah Terima */}
            <button 
              onClick={() => pilihJenis('serah_terima')}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col justify-center items-start text-left active:scale-95 transition-all h-full w-full cursor-pointer hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-3.5 rounded-2xl mb-auto shadow-lg shadow-emerald-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm mt-3 mb-0.5">Serah Terima</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Berita acara & kunci</p>
            </button>

            {/* Tombol 3: Invoice Sewa */}
            <button 
              onClick={() => pilihJenis('invoice_sewa')}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col justify-center items-start text-left active:scale-95 transition-all h-full w-full cursor-pointer hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-3.5 rounded-2xl mb-auto shadow-lg shadow-amber-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm mt-3 mb-0.5">Invoice Sewa</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Cetak struk tagihan</p>
            </button>

            {/* Tombol 4: Surat Teguran */}
            <button 
              onClick={() => pilihJenis('komplain')}
              className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col justify-center items-start text-left active:scale-95 transition-all h-full w-full cursor-pointer hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-3.5 rounded-2xl mb-auto shadow-lg shadow-rose-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm mt-3 mb-0.5">Surat Teguran</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Komplain & tagihan rugi</p>
            </button>

          </div>
        </div>

        {/* MEGA PROMO BANNER - DIRECT WHATSAPP */}
        <div className="px-5 pb-24 mt-auto z-50 relative">
          <a 
            href="https://wa.me/6289515106561?text=Halo%20Rendi,%20saya%20tertarik%20dengan%20jasa%20pembuatan%20Aplikasi/Sistem/Teknologi%20Anda." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block bg-slate-900 rounded-2xl p-4 text-white shadow-2xl relative overflow-hidden active:scale-95 transition-transform cursor-pointer border border-slate-700"
          >
            {/* Efek Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="flex-none bg-emerald-500 p-2.5 rounded-xl shadow-inner">
                {/* Ikon Petir / Teknologi */}
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-medium text-slate-300 leading-snug mb-1.5">
                  Butuh <strong className="text-white">Aplikasi, Sistem Enterprise, AI, Robotik,</strong> atau <strong className="text-white">IoT</strong>? Kami rancang semuanya dari nol!
                </p>
                <div className="flex justify-between items-center mt-1 border-t border-slate-700 pt-1.5">
                  <p className="text-[11px] font-bold text-emerald-400">Hubungi Rendi</p>
                  <div className="flex items-center gap-1 bg-emerald-900/50 px-2 py-0.5 rounded-md">
                    <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider">0895-1510-6561</span>
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

      </div>

    </div>
  );
}
