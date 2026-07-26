// ── Date Helpers ─────────────────────────────────────────────────────────────

export const HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/**
 * Parse string YYYY-MM-DD to local Date object safely
 */
export function parseTanggal(dateInput) {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }
  return new Date(dateInput);
}

export function formatTanggalID(dateInput) {
  const date = parseTanggal(dateInput);
  return `${HARI_ID[date.getDay()]}, ${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTanggalPendek(dateInput) {
  const date = parseTanggal(dateInput);
  return `${date.getDate()} ${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function hitungTanggalAkhir(startDateInput, durasi, satuan) {
  const result = parseTanggal(startDateInput);
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

export function getTodayFormatted() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatRupiah(val) {
  if (!val) return '0';
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('id-ID');
}

/** Singleton fallback date */
export const today = new Date();

