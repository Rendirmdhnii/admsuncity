import { useApp } from '../context/AppContext';
import { formatTanggalID, today } from '../utils/dateHelper';

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Buat Surat Komplain',
    desc: 'Surat permohonan perbaikan atau komplain dari penyewa',
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

      {/* Kalender Pintar Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
