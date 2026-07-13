import { openWhatsApp } from '../utils/pdfHelper';

/**
 * Success modal shown after a PDF has been downloaded.
 * Provides a 1-tap WhatsApp button and a dismiss action.
 */
export default function SuccessModal({ nomorWa, onClose }) {
  const hasWa = nomorWa && nomorWa.replace(/\D/g, '').length > 6;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl"
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        <div className="flex flex-col items-center text-center gap-5">
          {/* Checkmark icon */}
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Copy */}
          <div>
            <h3 className="text-xl font-bold text-slate-900">PDF Berhasil Diunduh</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              File tersimpan di folder unduhan HP Anda. Sekarang kirim ke penyewa via WhatsApp.
            </p>
          </div>

          {/* WhatsApp CTA */}
          {hasWa ? (
            <button
              onClick={() => { openWhatsApp(nomorWa); onClose(); }}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-green-100 cursor-pointer"
            >
              {/* WhatsApp SVG */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.035.507 3.953 1.397 5.63L0 24l6.545-1.37A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.03-1.375l-.361-.214-3.734.978.997-3.648-.235-.374A9.853 9.853 0 012.118 12C2.118 6.534 6.534 2.118 12 2.118S21.882 6.534 21.882 12 17.466 21.882 12 21.882z"/>
              </svg>
              Buka WhatsApp Penyewa
            </button>
          ) : (
            <div className="w-full text-left text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Nomor WhatsApp penyewa belum diisi. Tambahkan nomor WA di form Data Pihak Kedua agar tombol ini aktif.</span>
            </div>
          )}

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-sm cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
