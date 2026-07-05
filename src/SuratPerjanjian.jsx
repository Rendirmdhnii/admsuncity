import { useState, useRef } from 'react';

export default function SuratPerjanjian() {
  // Manajemen State Terpusat
  const [activeTab, setActiveTab] = useState('form');
  const [fontPilihan, setFontPilihan] = useState('Times New Roman');
  const [logo, setLogo] = useState(null);
  const [nomorWa, setNomorWa] = useState(''); // Default kosong

  const [pihak1, setPihak1] = useState({
    nama: 'Nama Pemilik (Contoh)',
    nik: '3500000000000001',
    alamat: 'Jl. Contoh Alamat Pemilik No. 1, Kota, Provinsi'
  });

  const [pihak2, setPihak2] = useState({
    nama: 'Nama Penyewa (Contoh)',
    nik: '3500000000000002',
    alamat: 'Jl. Contoh Alamat Penyewa No. 2, Kota, Provinsi'
  });

  const [konten, setKonten] = useState({
    judul: 'SURAT PERJANJIAN SEWA APARTEMEN',
    nomorKontrak: 'SUNCITY/SEWA/REG/2026',
    pembuka: 'Pada hari ini, Rabu, 20 Mei 2026, telah dibuat dan ditandatangani surat perjanjian sewa unit apartemen oleh dan di antara pihak-pihak di bawah ini:',
    kesepakatanUtama: 'Kedua belah pihak dengan ini menerangkan bahwa Pihak Pertama menyewakan kepada Pihak Kedua, dan Pihak Kedua menyewa dari Pihak Pertama sebuah unit apartemen dengan ketentuan-ketentuan sebagai berikut:',
    penutup: 'Demikian Surat Perjanjian Sewa Apartemen ini dibuat dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama, ditandatangani oleh kedua belah pihak dengan sukarela tanpa paksaan dari pihak mana pun.'
  });

  const [ketentuanSewa, setKetentuanSewa] = useState([
    '1. OBJEK & JANGKA WAKTU: Pihak Pertama menyewakan unit apartemen Suncity Residence tipe 2BR kepada Pihak Kedua selama 1 TAHUN (20 Mei 2026 - 20 Mei 2027) untuk tujuan tempat tinggal. Masa penagihan dimulai sejak 22 Mei 2026.',
    '2. LARANGAN: Pihak Kedua dilarang keras mengubah struktur bangunan fisik atau memindahtangankan hak sewa kepada Pihak Ketiga tanpa izin tertulis.',
    '3. TATA TERTIB & TANGGUNG JAWAB: Pihak Kedua wajib mematuhi regulasi gedung. Segala kerusakan fasilitas internal akibat kelalaian pemakaian sepenuhnya menjadi tanggung jawab Pihak Kedua.',
    '4. PERSELISIHAN: Penyelesaian perselisihan dilakukan secara kekeluargaan terlebih dahulu sebelum mengajukannya ke pengadilan negeri.'
  ]);

  const [ketentuanUmum, setKetentuanUmum] = useState([]);

  // Referensi untuk area Pratinjau
  const suratRef = useRef(null);

  // Fungsi Pembantu untuk Redirect ke WhatsApp
  const redirectToWhatsApp = () => {
    if (nomorWa && nomorWa.trim() !== '') {
      // Hanya membuka ruang obrolan kosong tanpa parameter ?text=
      window.open(`https://wa.me/${nomorWa.replace(/\D/g, '')}`, '_blank');
    }
  };

  // Unggah Logo
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

  // Penanganan Klausul Sewa
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

  // Penanganan Klausul Umum
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

  // Fungsi Komponen IsiSurat (Tipografi Padat & Profesional)
  const IsiSurat = () => (
    <div className="text-[10pt] leading-snug text-black">
      {/* Header Kop Surat Dinamis */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        {logo ? (
          <img src={logo} alt="Logo Apartemen" style={{ maxHeight: '60px', width: 'auto', display: 'inline-block' }} />
        ) : (
          <h2 style={{ margin: '0', fontSize: '13pt', fontWeight: 'bold', letterSpacing: '0.05em' }}>SUNCITY RESIDENCE APARTEMENT</h2>
        )}
        <div style={{ borderBottom: '2.5px solid #000000', marginTop: '6px', marginBottom: '8px' }}></div>
      </div>

      {/* Judul & Nomor Surat Perjanjian */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '11pt', margin: '0 0 2px 0', textTransform: 'uppercase' }}>
          {konten.judul}
        </h3>
        <p style={{ margin: '0', fontSize: '10pt', fontWeight: 'bold' }}>
          Nomor: {konten.nomorKontrak}
        </p>
      </div>

      {/* Paragraf Pembuka */}
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        {konten.pembuka}
      </p>

      {/* Tabel Info Pihak Pertama */}
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', border: 'none' }}>
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

      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
      </p>

      {/* Tabel Info Pihak Kedua */}
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '5%', padding: '1px 0' }}>II.</td>
            <td style={{ width: '20%', padding: '1px 0' }}>Nama</td>
            <td style={{ width: '3%', padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', fontWeight: 'bold' }}>{pihak2.nama}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ padding: '1px 0' }}>NIK</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0' }}>{pihak2.nik}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ padding: '1px 0' }}>Alamat</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', textAlign: 'justify' }}>{pihak2.alamat}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
      </p>

      {/* Pernyataan Kesepakatan */}
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        {konten.kesepakatanUtama}
      </p>

      {/* Klausul-Klausul Perjanjian (Dikompres Maksimal 4 Poin Utama) */}
      <ol style={{ paddingLeft: '0', margin: '0 0 6px 0', listStyleType: 'none' }}>
        {ketentuanSewa.map((item, index) => (
          <li key={`sewa-${index}`} style={{ marginBottom: '3px', textAlign: 'justify' }}>
            {item}
          </li>
        ))}
        {ketentuanUmum.map((item, index) => (
          <li key={`umum-${index}`} style={{ marginBottom: '3px', textAlign: 'justify' }}>
            {item}
          </li>
        ))}
      </ol>

      {/* Paragraf Penutup */}
      <p style={{ textAlign: 'justify', marginBottom: '10px', textIndent: '20px' }}>
        {konten.penutup}
      </p>

      {/* Tanda Tangan */}
      <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '30px' }}>PIHAK PERTAMA,</p>
            </td>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '30px' }}>PIHAK KEDUA,</p>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '1px 0' }}>
              {pihak1.nama}
            </td>
            <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '1px 0' }}>
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
  );

  // Ekspor PDF (Sederhana dengan Hidden Export Node)
  const downloadPDF = async () => {
    const element = suratRef.current;
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

      const opt = {
        margin:       0,
        filename:     `Surat_Sewa_${pihak2.nama.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdfInstance().set(opt).from(element).save().then(() => {
        redirectToWhatsApp();
      });
    } catch (error) {
      console.error('Ekspor PDF gagal:', error);
      alert('Gagal mengekspor PDF. Harap periksa koneksi internet Anda untuk memuat pustaka ekspor.');
    }
  };

  // Ekspor Word (Sederhana dengan Hidden Export Node)
  const handleExportWord = () => {
    const element = suratRef.current;
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

    redirectToWhatsApp();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header Utama (Sticky Top) */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-3">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl font-bold shadow-sm tracking-wider">
              SR
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 leading-tight">Suncity Residence</h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">Sistem Pembuat Perjanjian Sewa</p>
            </div>
          </div>

          {/* Tombol Navigasi Tab Mobile terintegrasi di Header */}
          <div className="lg:hidden flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📝 Isi Data</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📄 Lihat Surat</span>
            </button>
          </div>
        </div>

        {/* Tombol Ekspor Desktop */}
        <div className="hidden lg:flex gap-3">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-4.5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M16.5,13.25C16.5,14.65 15.35,15.8 13.95,15.8H10V8.2H13.95C15.35,8.2 16.5,9.35 16.5,10.75V13.25M14,10.7H11.5V11.5H14V10.7M14,12.5H11.5V13.3H14V12.5Z"/>
            </svg>
            <span>Unduh Word</span>
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4.5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-sm cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M12,17V12H9V10H12V5H14V10H17V12H14V17H12Z" transform="rotate(180 12 12)"/>
            </svg>
            <span>Unduh PDF</span>
          </button>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 pb-28 lg:pb-6 lg:p-6 overflow-hidden items-start">
        
        {/* Panel Form Editor (Kiri) - Lebar Desktop: w-2/5 */}
        <section className={`w-full lg:w-2/5 flex flex-col gap-6 max-h-[calc(100vh-145px)] lg:max-h-[calc(100vh-120px)] overflow-y-auto pr-1 pb-20 lg:pb-0 ${
          activeTab === 'form' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Kartu 1: Pengaturan & Tampilan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-blue-700 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
              Pengaturan & Tampilan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Jenis Huruf</label>
                <select
                  value={fontPilihan}
                  onChange={(e) => setFontPilihan(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
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
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/10 bg-white rounded-xl p-4 cursor-pointer group transition-all shadow-sm">
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-slate-500 group-hover:text-blue-600 transition-all font-semibold">Pilih file logo gambar</span>
                    <input
                      id="logo-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
                    <img src={logo} alt="Logo" className="h-10 w-auto object-contain bg-white p-1 rounded border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 font-semibold truncate">Logo Aktif</p>
                    </div>
                    <button
                      onClick={handleClearLogo}
                      className="text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 transition-all cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kartu 2: Data Pihak Pertama */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-blue-700 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
              Data Pihak Pertama (Pemilik)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap Pemilik</label>
                <input
                  type="text"
                  value={pihak1.nama}
                  onChange={(e) => setPihak1({ ...pihak1, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  value={pihak1.nik}
                  onChange={(e) => setPihak1({ ...pihak1, nik: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Domisili Lengkap</label>
                <textarea
                  rows="2"
                  value={pihak1.alamat}
                  onChange={(e) => setPihak1({ ...pihak1, alamat: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Kartu 3: Data Pihak Kedua */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-blue-700 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
              Data Pihak Kedua (Penyewa)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap Penyewa</label>
                <input
                  type="text"
                  value={pihak2.nama}
                  onChange={(e) => setPihak2({ ...pihak2, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  value={pihak2.nik}
                  onChange={(e) => setPihak2({ ...pihak2, nik: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                <textarea
                  rows="2"
                  value={pihak2.alamat}
                  onChange={(e) => setPihak2({ ...pihak2, alamat: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nomor WhatsApp Tujuan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Masukkan nomor WhatsApp, cth: 628123456789"
                  value={nomorWa}
                  onChange={(e) => setNomorWa(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Kartu 4: Isi Perjanjian */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-blue-700 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
              Isi Surat Perjanjian
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Judul Surat Perjanjian</label>
                <input
                  type="text"
                  value={konten.judul}
                  onChange={(e) => setKonten({ ...konten, judul: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Kontrak</label>
                <input
                  type="text"
                  value={konten.nomorKontrak}
                  onChange={(e) => setKonten({ ...konten, nomorKontrak: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Paragraf Pembuka Surat</label>
                <textarea
                  rows="3"
                  value={konten.pembuka}
                  onChange={(e) => setKonten({ ...konten, pembuka: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pernyataan Kesepakatan Utama</label>
                <textarea
                  rows="3"
                  value={konten.kesepakatanUtama}
                  onChange={(e) => setKonten({ ...konten, kesepakatanUtama: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Paragraf Penutup Surat</label>
                <textarea
                  rows="3"
                  value={konten.penutup}
                  onChange={(e) => setKonten({ ...konten, penutup: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Kartu 5: Klausul Masa Sewa */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
                Klausul Masa Sewa & Pembayaran
              </h3>
              <button
                onClick={handleAddKetentuanSewa}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-100 transition-all active:scale-95 cursor-pointer"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-4">
              {ketentuanSewa.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">Klausul #{index + 1}</span>
                    <textarea
                      rows="2"
                      value={item}
                      onChange={(e) => handleKetentuanSewaChange(index, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveKetentuanSewa(index)}
                    className="text-red-500 hover:text-red-600 p-1.5 self-center text-xs font-semibold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kartu 6: Klausul Ketentuan Umum */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                <span className="w-2.5 h-4 bg-blue-600 rounded-sm"></span>
                Klausul Ketentuan Umum & Aturan
              </h3>
              <button
                onClick={handleAddKetentuanUmum}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-100 transition-all active:scale-95 cursor-pointer"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-4">
              {ketentuanUmum.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">Klausul #{index + 1}</span>
                    <textarea
                      rows="2"
                      value={item}
                      onChange={(e) => handleKetentuanUmumChange(index, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveKetentuanUmum(index)}
                    className="text-red-500 hover:text-red-600 p-1.5 self-center text-xs font-semibold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Panel Pratinjau Kertas A4 (Kanan) - Lebar Desktop: w-3/5 */}
        <section className={`w-full lg:w-3/5 bg-slate-200 p-4 lg:p-8 rounded-xl overflow-y-auto overflow-x-hidden shadow-inner h-fit max-h-[calc(100vh-145px)] lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-24 ${
          activeTab === 'preview' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 px-5 py-3.5 flex items-center justify-between z-10 shrink-0 mb-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pratinjau Surat Perjanjian (A4 - 1 Halaman)
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-mono font-semibold">
              Huruf: {fontPilihan} | Ukuran 10pt (Padat)
            </span>
          </div>

          {/* Kertas A4 responsif yang teksnya membungkus tanpa scrollbar mendatar */}
          <div
            id="dokumen-surat"
            className="bg-white p-6 md:p-8 shadow-2xl mx-auto w-full break-words"
            style={{
              fontFamily: `${fontPilihan}, 'Times New Roman', Times, serif`
            }}
          >
            <IsiSurat />
          </div>
        </section>

      </main>

      {/* Tombol Aksi Melayang (Sticky/Fixed) di Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 pb-safe flex gap-3 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={handleExportWord}
          className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 font-semibold py-3.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all text-sm shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M16.5,13.25C16.5,14.65 15.35,15.8 13.95,15.8H10V8.2H13.95C15.35,8.2 16.5,9.35 16.5,10.75V13.25M14,10.7H11.5V11.5H14V10.7M14,12.5H11.5V13.3H14V12.5Z"/>
          </svg>
          <span>Unduh Word</span>
        </button>
        <button
          onClick={downloadPDF}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M12,17V12H9V10H12V5H14V10H17V12H14V17H12Z" transform="rotate(180 12 12)"/>
          </svg>
          <span>Unduh PDF</span>
        </button>
      </div>

      {/* Kertas 2 (Untuk Ekspor PDF/Word Tersembunyi) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={suratRef} className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', fontFamily: fontPilihan }}>
          <IsiSurat />
        </div>
      </div>

    </div>
  );
}
