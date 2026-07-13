import { useApp } from '../context/AppContext';
import { formatTanggalID, today } from '../utils/dateHelper';

const JENIS_OPTIONS = [
  {
    id: 'sewa',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Buat Perjanjian Sewa',
    desc: 'Kontrak sewa unit apartemen antara pemilik dan penyewa',
    border: 'border-blue-200 hover:border-blue-400',
    grad: 'from-blue-600 to-blue-500',
  },
  {
    id: 'serah_terima',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2a2 2 0 002 2m0 0V9a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Buat Serah Terima Kunci',
    desc: 'Berita acara penyerahan kunci unit kepada penyewa',
    border: 'border-violet-200 hover:border-violet-400',
    grad: 'from-violet-600 to-violet-500',
  },
  {
    id: 'komplain',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Buat Surat Komplain',
    desc: 'Surat permohonan perbaikan atau komplain dari penyewa',
    border: 'border-amber-200 hover:border-amber-400',
    grad: 'from-amber-500 to-amber-400',
  },
];

export default function Beranda() {
  const { pilihJenis } = useApp();

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 max-w-lg mx-auto w-full">
      {/* Greeting */}
      <div className="pt-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
          {formatTanggalID(today)}
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          Selamat Datang, Admin
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih jenis surat yang ingin dibuat hari ini.
        </p>
      </div>

      {/* 3 Pilihan Dokumen */}
      <div className="flex flex-col gap-3">
        {JENIS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => pilihJenis(opt.id)}
            className={[
              'flex items-center gap-4 p-5 rounded-2xl border-2 bg-white',
              'hover:scale-[1.02] active:scale-[0.98] transition-all',
              'cursor-pointer text-left shadow-sm group',
              opt.border,
            ].join(' ')}
          >
            {/* Icon */}
            <div
              className={[
                'w-14 h-14 flex items-center justify-center rounded-2xl',
                'bg-gradient-to-br shadow-md flex-shrink-0',
                'group-hover:scale-110 transition-transform duration-150',
                opt.grad,
              ].join(' ')}
            >
              {opt.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-base leading-tight">{opt.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
            </div>

            {/* Chevron */}
            <svg
              className="w-5 h-5 text-slate-300 flex-shrink-0 group-hover:text-slate-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Kalender Pintar Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Kalender Pintar Aktif
          </span>
        </div>
        <p className="text-sm font-semibold">Tanggal surat otomatis terisi ke hari ini</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Durasi sewa = tanggal akhir otomatis terhitung
        </p>
      </div>
    </div>
  );
}
