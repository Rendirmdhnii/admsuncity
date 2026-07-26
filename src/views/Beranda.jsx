import { useApp } from '../context/AppContext';

const JENIS_OPTIONS = [
  {
    id: 'sewa',
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Buat Perjanjian Sewa',
    desc: 'Kontrak sewa unit apartemen antara pemilik dan penyewa',
  },
  {
    id: 'serah_terima',
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m-3-3a3 3 0 00-3 3m3-3a3 3 0 003 3m0 0V16.5a3 3 0 01-3 3h-6a3 3 0 01-3-3V8.25a3 3 0 013-3h3M9 19.5h6m-6-15h6" />
      </svg>
    ),
    title: 'Buat Serah Terima Kunci',
    desc: 'Berita acara penyerahan kunci unit kepada penyewa',
  },
  {
    id: 'komplain',
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9 3.037c0 1.53 1.157 2.766 2.656 2.898 3.513.31 7.175.31 10.688 0 1.499-.132 2.656-1.368 2.656-2.898V11.25c0-1.53-1.157-2.766-2.656-2.898-3.513-.31-7.175-.31-10.688 0C4.157 8.484 3 9.72 3 11.25v4.537z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Buat Surat Teguran & Invoice Tagihan',
    desc: 'Surat teguran resmi dan invoice tagihan pembayaran ganti rugi',
  },
];

export default function Beranda() {
  const { pilihJenis } = useApp();

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 max-w-lg mx-auto w-full">
      {/* Greeting */}
      <div className="pt-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
          Full Property Administration System
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          Selamat Datang, Admin
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih jenis surat yang ingin dibuat hari ini.
        </p>
      </div>

      {/* Pilihan Dokumen */}
      <div className="flex flex-col gap-3">
        {JENIS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => pilihJenis(opt.id)}
            className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all cursor-pointer text-left shadow-sm group"
          >
            {/* Icon Wrapper */}
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:bg-slate-100 transition-colors">
              {opt.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-base leading-tight">{opt.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
            </div>

            {/* Chevron */}
            <svg
              className="w-5 h-5 text-slate-300 flex-shrink-0 group-hover:text-slate-500 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}
      </div>

      {/* Info System Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sistem Administrasi Properti
          </span>
        </div>
        <p className="text-sm font-semibold">Kendali Penuh Atas Seluruh Dokumen</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Tanggal surat dan jangka waktu sewa/tagihan dapat disesuaikan secara bebas oleh admin.
        </p>
      </div>
    </div>
  );
}

