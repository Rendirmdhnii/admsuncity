// ── Date Helpers ─────────────────────────────────────────────────────────────

export const HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalID(date) {
  return `${HARI_ID[date.getDay()]}, ${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTanggalPendek(date) {
  return `${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function hitungTanggalAkhir(durasi, satuan) {
  const result = new Date();
  const d = parseInt(durasi, 10) || 0;
  if (satuan === 'hari') {
    result.setDate(result.getDate() + d);
  } else if (satuan === 'bulan') {
    result.setMonth(result.getMonth() + d);
  } else {
    result.setFullYear(result.getFullYear() + d);
  }
  return result;
}

/** Singleton: hari ini dipakai di semua komponen */
export const today = new Date();
