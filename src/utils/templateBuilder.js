import { formatTanggalID, formatTanggalPendek, hitungTanggalAkhir, today } from './dateHelper';

/**
 * Build the template content object for a given document type.
 * Returns: { judul, nomorKontrak, pembuka, kesepakatanUtama, klausul[], penutup }
 */
export function buildTemplate({ jenis, pihak1, pihak2, durasi, satuanDurasi, nomorKontrak, unitInfo, namaProperti }) {
  const tglMulai = formatTanggalPendek(today);
  const tglAkhir = formatTanggalPendek(hitungTanggalAkhir(durasi, satuanDurasi));
  const durasiLabel = `${durasi} ${satuanDurasi === 'hari' ? 'Hari' : satuanDurasi === 'bulan' ? 'Bulan' : 'Tahun'}`;
  const properti = namaProperti || 'Suncity Residence';

  if (jenis === 'sewa') {
    return {
      judul: 'SURAT PERJANJIAN SEWA APARTEMEN',
      nomorKontrak,
      pembuka: `Pada hari ini, ${formatTanggalID(today)}, telah dibuat dan ditandatangani surat perjanjian sewa unit apartemen oleh dan di antara pihak-pihak di bawah ini:`,
      kesepakatanUtama: `Kedua belah pihak dengan ini menerangkan bahwa Pihak Pertama menyewakan kepada Pihak Kedua sebuah unit apartemen ${properti} ${unitInfo} dengan ketentuan-ketentuan sebagai berikut:`,
      klausul: [
        `1. OBJEK & JANGKA WAKTU: Pihak Pertama menyewakan unit apartemen ${properti} ${unitInfo} kepada Pihak Kedua selama ${durasiLabel} (${tglMulai} - ${tglAkhir}) untuk tujuan tempat tinggal.`,
        `2. LARANGAN: Pihak Kedua dilarang keras mengubah struktur bangunan fisik atau memindahtangankan hak sewa kepada Pihak Ketiga tanpa izin tertulis dari Pihak Pertama.`,
        `3. TATA TERTIB & TANGGUNG JAWAB: Pihak Kedua wajib mematuhi regulasi gedung. Segala kerusakan fasilitas internal akibat kelalaian pemakaian menjadi tanggung jawab Pihak Kedua.`,
        `4. PERSELISIHAN: Penyelesaian perselisihan dilakukan secara kekeluargaan terlebih dahulu sebelum mengajukannya ke jalur hukum yang berlaku.`,
      ],
      penutup: `Demikian Surat Perjanjian Sewa Apartemen ini dibuat dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama, ditandatangani oleh kedua belah pihak dengan sukarela tanpa paksaan dari pihak mana pun.`,
    };
  }

  if (jenis === 'serah_terima') {
    return {
      judul: 'BERITA ACARA SERAH TERIMA KUNCI',
      nomorKontrak,
      pembuka: `Pada hari ini, ${formatTanggalID(today)}, bertempat di kantor ${properti}, telah dilakukan serah terima kunci unit apartemen oleh dan di antara pihak-pihak di bawah ini:`,
      kesepakatanUtama: `Dengan ini menerangkan bahwa Pihak Pertama selaku pengelola/pemilik telah menyerahkan kunci unit apartemen kepada Pihak Kedua selaku penyewa, dengan kondisi dan ketentuan sebagai berikut:`,
      klausul: [
        `1. OBJEK SERAH TERIMA: Unit apartemen ${properti} ${unitInfo} diserahkan dalam kondisi baik dan bersih sesuai inventaris terlampir.`,
        `2. KUNCI YANG DISERAHKAN: 1 (satu) unit kunci pintu utama dan 1 (satu) kartu akses lift/parkir.`,
        `3. KONDISI UNIT: Pihak Kedua menyatakan telah memeriksa kondisi unit dan menerima dalam keadaan baik tanpa keberatan pada tanggal serah terima ini.`,
        `4. TANGGUNG JAWAB: Terhitung sejak tanggal serah terima ini, seluruh tanggung jawab atas kondisi unit beralih kepada Pihak Kedua.`,
      ],
      penutup: `Demikian Berita Acara Serah Terima Kunci ini dibuat dengan sebenarnya, dan ditandatangani oleh kedua belah pihak sebagai bukti yang sah.`,
    };
  }

  // komplain
  return {
    judul: 'SURAT PERMOHONAN PERBAIKAN / KOMPLAIN',
    nomorKontrak,
    pembuka: `Pada hari ini, ${formatTanggalID(today)}, Pihak Kedua selaku penghuni unit apartemen ${properti} ${unitInfo} mengajukan permohonan perbaikan/komplain kepada Pihak Pertama selaku pengelola/pemilik dengan perincian sebagai berikut:`,
    kesepakatanUtama: `Pihak Kedua dengan hormat melaporkan adanya permasalahan/kerusakan pada unit huniannya dengan rincian sebagai berikut:`,
    klausul: [
      `1. UNIT YANG DILAPORKAN: Unit apartemen ${properti} ${unitInfo} atas nama Pihak Kedua.`,
      `2. JENIS PERMASALAHAN: [Deskripsikan permasalahan secara detail, misalnya: kebocoran atap, kerusakan AC, masalah listrik, dll.]`,
      `3. KRONOLOGI: Permasalahan diketahui pertama kali pada tanggal ${tglMulai} dan telah berdampak pada kenyamanan penghunian.`,
      `4. HARAPAN: Pihak Kedua memohon agar Pihak Pertama segera menindaklanjuti dan melakukan perbaikan dalam waktu yang tidak terlalu lama.`,
    ],
    penutup: `Demikian surat permohonan perbaikan ini dibuat. Atas perhatian dan tindaklanjut yang diberikan, Pihak Kedua mengucapkan terima kasih.`,
  };
}
