import React, { useState, useRef } from 'react';

export default function SuratPerjanjian() {
  // State Management Terpusat
  const [fontPilihan, setFontPilihan] = useState('Times New Roman');
  const [logo, setLogo] = useState(null);

  const [pihak1, setPihak1] = useState({
    nama: 'Dr. Mochammad Rizalul Rosyiadi',
    nik: '3515061703870002',
    alamat: 'KedungBanteng Tanggulangin Sidoarjo'
  });

  const [pihak2, setPihak2] = useState({
    nama: 'Tri Suhartini',
    nik: '3216196008790005',
    alamat: 'Griya Persada Indah Blok C-8 No 11 Kabupaten Bekasi'
  });

  const [konten, setKonten] = useState({
    judul: 'SURAT PERJANJIAN SEWA APARTEMEN',
    nomorKontrak: 'SUNCITY/SEWA/REG/2026',
    pembuka: 'Pada hari ini, Rabu, 20 Mei 2026, telah dibuat dan ditandatangani surat perjanjian sewa unit apartemen oleh dan di antara pihak-pihak di bawah ini:',
    kesepakatanUtama: 'Kedua belah pihak dengan ini menerangkan bahwa Pihak Pertama menyewakan kepada Pihak Kedua, dan Pihak Kedua menyewa dari Pihak Pertama sebuah unit apartemen dengan ketentuan-ketentuan sebagai berikut:',
    penutup: 'Demikian Surat Perjanjian Sewa Apartemen ini dibuat dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama, ditandatangani oleh kedua belah pihak dengan sukarela tanpa paksaan dari pihak mana pun.'
  });

  const [ketentuanSewa, setKetentuanSewa] = useState([
    'PASAL 1 - OBJEK SEWA: Pihak Pertama menyewakan kepada Pihak Kedua unit apartemen Suncity Residence Jl. Pahlawan No. 1 Sidoarjo Lt.16 unit no 25 tipe 2BR untuk tujuan tempat tinggal.',
    'PASAL 2 - JANGKA WAKTU: Sewa berlaku selama 1 TAHUN terhitung dari tanggal Rabu, 20 MEI 2026 sampai dengan Kamis, 20 MEI 2027.',
    'PASAL 3 - BIAYA & PEMBAYARAN: Masa penagihan pembayaran sewa apartemen dimulai sejak Rabu, 22 Mei 2026 hingga Kamis, 22 Mei 2027.'
  ]);

  const [ketentuanUmum, setKetentuanUmum] = useState([
    'Pihak Kedua dilarang keras mengubah struktur bangunan fisik atau memindahtangankan sewa kepada Pihak Ketiga tanpa izin tertulis dari Pihak Pertama.',
    'Pihak Kedua wajib menjaga tata tertib, kebersihan lingkungan, serta mematuhi segala regulasi pengelola gedung apartemen.',
    'Segala kerusakan fasilitas internal unit apartemen akibat kelalaian pemakaian sepenuhnya menjadi tanggung jawab Pihak Kedua.',
    'Penyelesaian perselisihan dilakukan secara kekeluargaan terlebih dahulu sebelum mengajukannya ke pengadilan negeri.'
  ]);

  // Ref untuk area Pratinjau
  const previewRef = useRef(null);

  // Upload Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearLogo = () => {
    setLogo(null);
    const fileInput = document.getElementById('logo-upload-input');
    if (fileInput) fileInput.value = '';
  };

  // Klausul Sewa Handlers
  const handleKetentuanSewaChange = (index, value) => {
    const newArray = [...ketentuanSewa];
    newArray[index] = value;
    setKetentuanSewa(newArray);
  };

  const handleAddKetentuanSewa = () => {
    setKetentuanSewa([...ketentuanSewa, `PASAL ${ketentuanSewa.length + 1} - ...`]);
  };

  const handleRemoveKetentuanSewa = (index) => {
    setKetentuanSewa(ketentuanSewa.filter((_, i) => i !== index));
  };

  // Klausul Umum Handlers
  const handleKetentuanUmumChange = (index, value) => {
    const newArray = [...ketentuanUmum];
    newArray[index] = value;
    setKetentuanUmum(newArray);
  };

  const handleAddKetentuanUmum = () => {
    setKetentuanUmum([...ketentuanUmum, 'Ketentuan umum baru atau peraturan tambahan...']);
  };

  const handleRemoveKetentuanUmum = (index) => {
    setKetentuanUmum(ketentuanUmum.filter((_, i) => i !== index));
  };

  // Ekspor PDF
  const handleExportPDF = async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      let html2pdfInstance = window.html2pdf;
      if (!html2pdfInstance) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        html2pdfInstance = window.html2pdf;
      }

      const namaAman = pihak2.nama.trim().replace(/\s+/g, '_');
      const opt = {
        margin: 10, // Diminimalkan sesuai spesifikasi
        filename: `Surat_Perjanjian_Sewa_${namaAman}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdfInstance().from(element).set(opt).save();
    } catch (error) {
      console.error('Ekspor PDF gagal:', error);
      alert('Gagal mengekspor PDF. Harap periksa koneksi internet Anda untuk memuat pustaka ekspor.');
    }
  };

  // Ekspor Word
  const handleExportWord = () => {
    const element = previewRef.current;
    if (!element) return;

    const htmlContent = element.innerHTML;
    const namaAman = pihak2.nama.trim().replace(/\s+/g, '_');

    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Surat Perjanjian Sewa Apartemen</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            font-family: '${fontPilihan}', 'Times New Roman', Times, serif;
            font-size: 10pt;
            line-height: 1.15;
            text-align: justify;
            margin: 0;
            padding: 0;
            color: #000000;
          }
          h3 {
            text-align: center;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
          }
          td {
            padding: 2px 4px;
            vertical-align: top;
          }
          ol {
            margin-left: 15px;
            padding-left: 0;
          }
          li {
            margin-bottom: 4px;
            text-align: justify;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Surat_Perjanjian_Sewa_${namaAman}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header Utama Navigasi */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-amber-400 p-2.5 rounded-xl font-bold shadow-sm">
            SR
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Suncity Residence</h1>
            <p className="text-xs text-slate-500 font-medium">Sistem Pembuat Perjanjian Sewa Apartemen</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4.5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-xs md:text-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M16.5,13.25C16.5,14.65 15.35,15.8 13.95,15.8H10V8.2H13.95C15.35,8.2 16.5,9.35 16.5,10.75V13.25M14,10.7H11.5V11.5H14V10.7M14,12.5H11.5V13.3H14V12.5Z"/>
            </svg>
            <span>Unduh Word</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4.5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-xs md:text-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M12,17V12H9V10H12V5H14V10H17V12H14V17H12Z" transform="rotate(180 12 12)"/>
            </svg>
            <span>Unduh PDF</span>
          </button>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        
        {/* Panel Form Editor (Kiri) */}
        <section className="w-full lg:w-1/3 flex flex-col gap-6 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          {/* Blok 1: Pengaturan Tampilan */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-4 bg-blue-600 rounded-sm"></span>
              Pengaturan Tampilan
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Jenis Huruf</label>
              <select
                value={fontPilihan}
                onChange={(e) => setFontPilihan(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
              >
                <option value="Times New Roman">Times New Roman (Formal)</option>
                <option value="Arial">Arial (Modern)</option>
                <option value="Calibri">Calibri (Bersih)</option>
                <option value="Georgia">Georgia (Klasik)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Unggah Logo Kop</label>
              {!logo ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500/40 bg-slate-50 rounded-xl p-4 cursor-pointer group transition-all">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-all font-semibold">Pilih file logo gambar</span>
                  <input
                    id="logo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                  <img src={logo} alt="Logo" className="h-10 w-auto object-contain bg-white p-1 rounded border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 font-semibold truncate">Logo Aktif</p>
                  </div>
                  <button
                    onClick={handleClearLogo}
                    className="text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Blok 2: Data Pihak Pertama */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
              Data Pihak Pertama (Pemilik)
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap Pemilik</label>
                <input
                  type="text"
                  value={pihak1.nama}
                  onChange={(e) => setPihak1({ ...pihak1, nama: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  value={pihak1.nik}
                  onChange={(e) => setPihak1({ ...pihak1, nik: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alamat Domisili Lengkap</label>
                <textarea
                  rows="2"
                  value={pihak1.alamat}
                  onChange={(e) => setPihak1({ ...pihak1, alamat: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Blok 3: Data Pihak Kedua */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-4 bg-sky-500 rounded-sm"></span>
              Data Pihak Kedua (Penyewa)
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap Penyewa</label>
                <input
                  type="text"
                  value={pihak2.nama}
                  onChange={(e) => setPihak2({ ...pihak2, nama: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  value={pihak2.nik}
                  onChange={(e) => setPihak2({ ...pihak2, nik: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alamat Lengkap</label>
                <textarea
                  rows="2"
                  value={pihak2.alamat}
                  onChange={(e) => setPihak2({ ...pihak2, alamat: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Blok 4: Isi Perjanjian */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-600 rounded-sm"></span>
              Isi Surat Perjanjian
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Judul Surat Perjanjian</label>
                <input
                  type="text"
                  value={konten.judul}
                  onChange={(e) => setKonten({ ...konten, judul: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nomor Kontrak</label>
                <input
                  type="text"
                  value={konten.nomorKontrak}
                  onChange={(e) => setKonten({ ...konten, nomorKontrak: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paragraf Pembuka Surat</label>
                <textarea
                  rows="3"
                  value={konten.pembuka}
                  onChange={(e) => setKonten({ ...konten, pembuka: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pernyataan Kesepakatan Utama</label>
                <textarea
                  rows="3"
                  value={konten.kesepakatanUtama}
                  onChange={(e) => setKonten({ ...konten, kesepakatanUtama: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Paragraf Penutup Surat</label>
                <textarea
                  rows="3"
                  value={konten.penutup}
                  onChange={(e) => setKonten({ ...konten, penutup: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Blok 5: Klausul Masa Sewa */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-4 bg-indigo-500 rounded-sm"></span>
                Klausul Masa Sewa & Pembayaran
              </h3>
              <button
                onClick={handleAddKetentuanSewa}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded-lg transition-all"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-3">
              {ketentuanSewa.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">Klausul #{index + 1}</span>
                    <textarea
                      rows="2"
                      value={item}
                      onChange={(e) => handleKetentuanSewaChange(index, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveKetentuanSewa(index)}
                    className="text-red-500 hover:text-red-600 p-1.5 self-center"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blok 6: Klausul Ketentuan Umum */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-4 bg-teal-500 rounded-sm"></span>
                Klausul Ketentuan Umum & Aturan
              </h3>
              <button
                onClick={handleAddKetentuanUmum}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded-lg transition-all"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-3">
              {ketentuanUmum.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">Klausul #{index + 1}</span>
                    <textarea
                      rows="2"
                      value={item}
                      onChange={(e) => handleKetentuanUmumChange(index, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveKetentuanUmum(index)}
                    className="text-red-500 hover:text-red-600 p-1.5 self-center"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Panel Pratinjau Kertas A4 (Kanan) */}
        <section className="flex-1 flex flex-col bg-slate-200/60 border border-slate-300/40 rounded-3xl overflow-hidden shadow-inner relative min-h-[500px]">
          <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-3.5 flex items-center justify-between z-10 shrink-0">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pratinjau Surat Perjanjian (A4 - 1 Halaman)
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-mono font-semibold">
              Huruf: {fontPilihan} | Ukuran 10pt (Padat)
            </span>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-100/60 flex justify-center items-start">
            
            {/* Kertas A4 (Sangat Padat) */}
            <div
              ref={previewRef}
              className="bg-white text-black shadow-lg rounded-sm w-full mx-auto print:shadow-none"
              style={{
                maxWidth: '210mm',
                minHeight: '297mm',
                padding: '12mm 12mm 12mm 12mm', // Margin dipersempit
                fontFamily: `${fontPilihan}, 'Times New Roman', Times, serif`,
                fontSize: '10pt', // Font dinonaktifkan dari 12pt menjadi 10pt
                lineHeight: '1.25', // Spasi baris lebih rapat
                boxSizing: 'border-box'
              }}
            >
              {/* Header Kop Surat Dinamis */}
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {logo ? (
                  <img src={logo} alt="Logo Apartemen" style={{ maxHeight: '70px', width: 'auto', display: 'inline-block' }} />
                ) : (
                  <h2 style={{ margin: '0', fontSize: '15pt', fontWeight: 'bold', letterSpacing: '0.05em' }}>SUNCITY RESIDENCE APARTEMENT</h2>
                )}
                <div style={{ borderBottom: '3px solid #000000', marginTop: '10px', marginBottom: '10px' }}></div>
              </div>

              {/* Judul & Nomor Surat Perjanjian */}
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '12pt', margin: '0 0 3px 0', textTransform: 'uppercase' }}>
                  {konten.judul}
                </h3>
                <p style={{ margin: '0', fontSize: '9.5pt', fontWeight: 'bold' }}>
                  Nomor: {konten.nomorKontrak}
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p style={{ textAlign: 'justify', marginBottom: '6px', textIndent: '25px' }}>
                {konten.pembuka}
              </p>

              {/* Tabel Info Pihak Pertama */}
              <table style={{ width: '100%', marginBottom: '6px', borderCollapse: 'collapse', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '5%', padding: '1px 0' }}>I.</td>
                    <td style={{ width: '20%', padding: '1px 0' }}>Nama</td>
                    <td style={{ width: '3%', padding: '1px 0' }}>:</td>
                    <td style={{ padding: '1px 0', fontWeight: 'bold' }}>{pihak1.nama}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ padding: '1px 0' }}>NIK</td>
                    <td style={{ padding: '1px 0' }}>:</td>
                    <td style={{ padding: '1px 0' }}>{pihak1.nik}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ padding: '1px 0' }}>Alamat</td>
                    <td style={{ padding: '1px 0' }}>:</td>
                    <td style={{ padding: '1px 0', textAlign: 'justify' }}>{pihak1.alamat}</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ textAlign: 'justify', marginBottom: '6px', textIndent: '25px' }}>
                Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
              </p>

              {/* Tabel Info Pihak Kedua */}
              <table style={{ width: '100%', marginBottom: '6px', borderCollapse: 'collapse', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '5%', padding: '1px 0' }}>II.</td>
                    <td style={{ width: '20%', padding: '1px 0' }}>Nama</td>
                    <td style={{ width: '3%', padding: '3px 0' }}>:</td>
                    <td style={{ padding: '3px 0', fontWeight: 'bold' }}>{pihak2.nama}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ padding: '3px 0' }}>NIK</td>
                    <td style={{ padding: '3px 0' }}>:</td>
                    <td style={{ padding: '3px 0' }}>{pihak2.nik}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ padding: '3px 0' }}>Alamat</td>
                    <td style={{ padding: '3px 0' }}>:</td>
                    <td style={{ padding: '3px 0', textAlign: 'justify' }}>{pihak2.alamat}</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ textAlign: 'justify', marginBottom: '6px', textIndent: '25px' }}>
                Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
              </p>

              {/* Pernyataan Kesepakatan */}
              <p style={{ textAlign: 'justify', marginBottom: '6px', textIndent: '25px' }}>
                {konten.kesepakatanUtama}
              </p>

              {/* Klausul-Klausul Perjanjian */}
              <ol style={{ paddingLeft: '15px', margin: '0 0 10px 0', listStyleType: 'decimal' }}>
                {ketentuanSewa.map((item, index) => (
                  <li key={`sewa-${index}`} style={{ marginBottom: '4px', textAlign: 'justify', paddingLeft: '3px' }}>
                    {item}
                  </li>
                ))}
                {ketentuanUmum.map((item, index) => (
                  <li key={`umum-${index}`} style={{ marginBottom: '4px', textAlign: 'justify', paddingLeft: '3px' }}>
                    {item}
                  </li>
                ))}
              </ol>

              {/* Paragraf Penutup */}
              <p style={{ textAlign: 'justify', marginBottom: '15px', textIndent: '25px' }}>
                {konten.penutup}
              </p>

              {/* Tanda Tangan */}
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', textAlign: 'center', paddingBottom: '40px', verticalAlign: 'top' }}>
                      PIHAK PERTAMA,
                    </td>
                    <td style={{ width: '50%', textAlign: 'center', paddingBottom: '40px', verticalAlign: 'top' }}>
                      PIHAK KEDUA,
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '1px 0' }}>
                      {pihak1.nama}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '2px 0' }}>
                      {pihak2.nama}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center', fontSize: '8.5pt', color: '#555555', padding: '1px 0' }}>
                      NIK: {pihak1.nik}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '8.5pt', color: '#555555', padding: '1px 0' }}>
                      NIK: {pihak2.nik}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
