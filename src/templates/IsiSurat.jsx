import { formatTanggalPendek, parseTanggal } from '../utils/dateHelper';

/**
 * IsiSurat — shared A4 content renderer.
 * Used by both the live preview and the hidden export nodes.
 * Receives a `template` object (from templateBuilder) plus party & style data.
 */
export default function IsiSurat({ 
  template, 
  pihak1, 
  pihak2, 
  logo, 
  namaProperti, 
  jenisSurat, 
  fotoBukti, 
  tanggalSurat,
  tanggalCheckIn,
  totalSewa,
  nominalDP,
  statusPembayaran,
  teksInclude,
  teksExclude,
  durasi,
  satuanDurasi,
  unitInfo
}) {
  if (!template && jenisSurat !== 'invoice_sewa' && jenisSurat !== 'Invoice Pembayaran Sewa') return null;

  const propertiLabel = (namaProperti || 'Manajemen Properti').toUpperCase();
  const tanggalPrint = tanggalSurat ? formatTanggalPendek(parseTanggal(tanggalSurat)) : '-';

  if (jenisSurat === 'invoice_sewa' || jenisSurat === 'Invoice Pembayaran Sewa') {
    const pihak2Nama = pihak2?.nama || 'Nama Penyewa';
    const pihak2Nik = pihak2?.nik || '';
    const durasiSewaVal = durasi || '0';
    const satuanDurasiVal = satuanDurasi === 'hari' ? 'Hari' : satuanDurasi === 'bulan' ? 'Bulan' : 'Tahun';
    const totalHargaSewaNum = Number(totalSewa || 0);
    const nominalDPNum = Number(nominalDP || 0);
    const sisaPembayaranNum = totalHargaSewaNum - nominalDPNum;
    const tglSuratVal = tanggalSurat ? formatTanggalPendek(parseTanggal(tanggalSurat)) : 'DD MM YYYY';
    const tglCheckInVal = tanggalCheckIn ? formatTanggalPendek(parseTanggal(tanggalCheckIn)) : 'DD MM YYYY';

    return (
      <div style={{ margin: '-75px', display: 'flex', flexDirection: 'column', minHeight: '1123px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
        
        {/* HEADER FULL-BLEED (NAVY) */}
        <div style={{ backgroundColor: '#0f172a', padding: '50px', display: 'flex', justifyContent: 'space-between', borderBottom: '6px solid #f59e0b' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0', color: '#ffffff', letterSpacing: '2px' }}>INVOICE</h1>
            <div style={{ marginTop: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '14px', backgroundColor: '#f59e0b', color: '#0f172a', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
                SEWA UNIT APARTEMEN
              </span>
            </div>
            <p style={{ fontSize: '14px', letterSpacing: '1px', color: '#cbd5e1', margin: '0' }}>{namaProperti ? namaProperti.toUpperCase() : 'MANAJEMEN PROPERTI'}</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 4px 0' }}>Kepada Yth:</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#f59e0b' }}>{pihak2Nama}</p>
            <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0' }}>{pihak2Nik ? `NIK: ${pihak2Nik}` : ''}</p>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div style={{ padding: '40px 50px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* INFO GRID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '25px', marginBottom: '35px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', margin: '0 0 6px 0', letterSpacing: '1px' }}>TANGGAL INVOICE</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0' }}>{tglSuratVal}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', margin: '0 0 6px 0', letterSpacing: '1px' }}>TANGGAL CHECK-IN</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0' }}>{tglCheckInVal}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', margin: '0 0 6px 0', letterSpacing: '1px' }}>DURASI SEWA</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0' }}>{durasiSewaVal} {satuanDurasiVal}</p>
            </div>
          </div>

          {/* MINIMALIST TABLE */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr>
                <th style={{ padding: '0 0 15px 0', textAlign: 'left', fontSize: '13px', color: '#64748b', borderBottom: '2px solid #0f172a' }}>RINCIAN PEMBAYARAN</th>
                <th style={{ padding: '0 0 15px 0', textAlign: 'right', fontSize: '13px', color: '#64748b', borderBottom: '2px solid #0f172a' }}>JUMLAH</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '20px 0', borderBottom: '1px solid #e2e8f0', fontSize: '15px', color: '#334155' }}>
                  <span style={{ fontWeight: '600', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Sewa Unit Apartemen {namaProperti || 'Manajemen Properti'}</span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Durasi: {durasiSewaVal} {satuanDurasiVal}</span>
                </td>
                <td style={{ padding: '20px 0', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                  Rp {totalHargaSewaNum.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '20px 0', borderBottom: '1px solid #e2e8f0', fontSize: '15px', color: '#334155' }}>DP / Telah Dibayarkan</td>
                <td style={{ padding: '20px 0', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>
                  - Rp {nominalDPNum.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '25px 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>SISA PEMBAYARAN</td>
                <td style={{ padding: '25px 0 10px 0', textAlign: 'right', fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                  Rp {sisaPembayaranNum.toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* INCLUDE / EXCLUDE CARDS */}
          <div style={{ display: 'flex', gap: '25px', marginBottom: '40px' }}>
            <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginTop: '0', marginBottom: '12px', display: 'flex', alignItems: 'center', letterSpacing: '1px' }}>
                <span style={{ color: '#10b981', marginRight: '8px', fontSize: '16px' }}>✓</span> INCLUDE
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: '#475569', margin: '0', lineHeight: '1.6' }}>{teksInclude || 'Service Charge'}</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginTop: '0', marginBottom: '12px', display: 'flex', alignItems: 'center', letterSpacing: '1px' }}>
                <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '16px' }}>✕</span> EXCLUDE
              </h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: '#475569', margin: '0', lineHeight: '1.6' }}>{teksExclude || 'Air\nToken Listrik\nInternet / WiFi\nParkir'}</p>
            </div>
          </div>

          {/* STATUS BLOCK */}
          <div style={{ marginTop: 'auto', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857', margin: '0 0 6px 0' }}>✓ {statusPembayaran || 'DP Telah Diterima'}</p>
            <p style={{ fontSize: '13px', color: '#065f46', margin: '0' }}>Terima kasih telah mempercayakan akomodasi Anda kepada kami.</p>
          </div>
        </div>

        {/* FOOTER FULL-BLEED (NAVY) */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '25px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 4px 0', letterSpacing: '1px' }}>WHATSAPP / HUBUNGI KAMI</p>
            <p style={{ fontSize: '15px', fontWeight: '600', margin: '0', color: '#f8fafc' }}>089678449424</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#f59e0b', margin: '0' }}>Nyaman • Aman • Terpercaya</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 4px 0', letterSpacing: '1px' }}>LOKASI</p>
            <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#f8fafc' }}>{namaProperti || 'Manajemen Properti'}</p>
          </div>
        </div>
        
      </div>
    );
  }

  const pStyle = {
    textAlign: 'justify',
    textJustify: 'inter-word',
    textIndent: '20px',
    marginBottom: '5px',
    color: '#000000',
    lineHeight: '1.4',
    fontSize: '13.5px',
  };

  const tableStyle = {
    width: '100%',
    marginBottom: '5px',
    borderCollapse: 'collapse',
    border: 'none',
    color: '#000000',
    lineHeight: '1.4',
    fontSize: '13.5px',
  };

  const signatureStyle = {
    width: '100%',
    marginTop: '15px',
    borderCollapse: 'collapse',
    border: 'none',
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
    color: '#000000',
    lineHeight: '1.4',
    fontSize: '13.5px',
  };

  return (
    <div style={{ fontSize: '13.5px', lineHeight: '1.4', textAlign: 'justify', textJustify: 'inter-word', color: '#000000', fontFamily: '"Times New Roman", Times, serif', maxHeight: '297mm', overflow: 'hidden' }}>
      {/* Kop Surat */}
      <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
        {logo ? (
          <img
            src={logo}
            alt="Logo Properti"
            style={{ maxHeight: '50px', width: 'auto', display: 'inline-block' }}
          />
        ) : (
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', textTransform: 'uppercase', textAlign: 'center' }}>
            {propertiLabel}
          </h2>
        )}
        <div style={{ borderBottom: '2px solid #000000', marginTop: '4px', marginBottom: '8px', width: '100%' }} />
      </div>

      {/* Judul & Nomor */}
      <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
        <h3
          style={{
            textDecoration: 'underline',
            fontWeight: 'bold',
            fontSize: '15px',
            margin: '0 0 2px 0',
            textTransform: 'uppercase',
            color: '#000000',
            textAlign: 'center',
          }}
        >
          {template.judul}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>
          Nomor: {template.nomorKontrak}
        </p>
      </div>

      {/* Pembuka */}
      <p style={pStyle}>
        {template.pembuka}
      </p>

      {/* Pihak Pertama */}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={{ width: '5%', padding: '1px 0', verticalAlign: 'top' }}>I.</td>
            <td style={{ width: '20%', padding: '1px 0', verticalAlign: 'top' }}>Nama</td>
            <td style={{ width: '3%', padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', fontWeight: 'bold', verticalAlign: 'top' }}>{pihak1.nama}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>NIK</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>{pihak1.nik}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>Alamat</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', textAlign: 'justify', verticalAlign: 'top' }}>{pihak1.alamat}</td>
          </tr>
        </tbody>
      </table>
      <p style={pStyle}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
      </p>

      {/* Pihak Kedua */}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={{ width: '5%', padding: '1px 0', verticalAlign: 'top' }}>II.</td>
            <td style={{ width: '20%', padding: '1px 0', verticalAlign: 'top' }}>Nama</td>
            <td style={{ width: '3%', padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', fontWeight: 'bold', verticalAlign: 'top' }}>{pihak2.nama}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>NIK</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>{pihak2.nik}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>Alamat</td>
            <td style={{ padding: '1px 0', verticalAlign: 'top' }}>:</td>
            <td style={{ padding: '1px 0', textAlign: 'justify', verticalAlign: 'top' }}>{pihak2.alamat}</td>
          </tr>
        </tbody>
      </table>
      <p style={pStyle}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
      </p>

      {/* ── 1. SURAT PERJANJIAN SEWA (PASAL-PASAL LEGAL DRAFTING) ── */}
      {jenisSurat === 'sewa' && (
        <div style={{ textAlign: 'justify', textJustify: 'inter-word', marginTop: '15px' }}>
          <p style={{ margin: '0 0 15px 0' }}>Berdasarkan itikad baik, Para Pihak dengan ini sepakat untuk mengikatkan diri dalam Perjanjian Sewa Menyewa Unit Apartemen dengan syarat dan ketentuan yang diatur dalam pasal-pasal berikut:</p>
          
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>PASAL 1: OBJEK DAN JANGKA WAKTU SEWA</p>
          <p style={{ margin: '0 0 10px 0', paddingLeft: '15px' }}>PIHAK PERTAMA dengan ini menyewakan kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan menerima sewa berupa unit apartemen {namaProperti || 'Gedung'} nomor/tipe {unitInfo || 'Unit'} untuk jangka waktu selama {durasi || '1'} {satuanDurasi === 'hari' ? 'Hari' : satuanDurasi === 'bulan' ? 'Bulan' : 'Tahun'} terhitung sejak tanggal kesepakatan ini ditandatangani.</p>

          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>PASAL 2: HAK DAN KEWAJIBAN</p>
          <p style={{ margin: '0 0 10px 0', paddingLeft: '15px' }}>PIHAK KEDUA berhak menggunakan unit tersebut semata-mata untuk keperluan hunian. PIHAK KEDUA wajib mematuhi seluruh peraturan (House Rules) yang ditetapkan oleh Badan Pengelola apartemen, serta bertanggung jawab penuh atas segala kerusakan fasilitas internal yang diakibatkan oleh kelalaian PIHAK KEDUA selama masa sewa berlangsung.</p>

          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>PASAL 3: LARANGAN DAN SANKSI (WANPRESTASI)</p>
          <p style={{ margin: '0 0 10px 0', paddingLeft: '15px' }}>PIHAK KEDUA dilarang keras mengubah struktur fisik bangunan, menjadikan unit sebagai tempat usaha ilegal, maupun memindahtangankan (sub-let) hak sewa kepada Pihak Ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA. Pelanggaran atas pasal ini memberikan hak mutlak bagi PIHAK PERTAMA untuk membatalkan perjanjian secara sepihak tanpa pengembalian dana sewa.</p>

          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>PASAL 4: PENYELESAIAN PERSELISIHAN</p>
          <p style={{ margin: '0 0 15px 0', paddingLeft: '15px' }}>Segala perselisihan yang timbul akibat pelaksanaan Perjanjian ini akan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai mufakat, Para Pihak sepakat untuk menyelesaikannya melalui jalur hukum yang berlaku di wilayah Republik Indonesia.</p>

          <p style={{ margin: '0 0 30px 0' }}>Demikian Perjanjian Sewa ini dibuat dalam keadaan sadar, tanpa paksaan dari pihak manapun, dan memiliki kekuatan hukum yang mengikat sejak ditandatangani oleh Para Pihak.</p>
        </div>
      )}

      {/* ── 2. BERITA ACARA SERAH TERIMA KUNCI (INSPEKSI LEGAL) ── */}
      {jenisSurat === 'serah_terima' && (
        <div style={{ textAlign: 'justify', textJustify: 'inter-word', marginTop: '15px' }}>
          <p style={{ margin: '0 0 10px 0' }}>Melalui Berita Acara ini, Para Pihak menerangkan hal-hal sebagai berikut:</p>
          <ol style={{ margin: '0 0 15px 0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>PIHAK PERTAMA dengan ini menyerahkan hak akses beserta kunci unit {namaProperti || 'Gedung'} tipe {unitInfo || 'Unit'} kepada PIHAK KEDUA.</li>
            <li style={{ marginBottom: '8px' }}>PIHAK KEDUA menyatakan telah melakukan inspeksi menyeluruh (Joint Inspection) dan menerima unit tersebut beserta seluruh inventaris di dalamnya dalam kondisi baik, layak huni, dan sesuai dengan spesifikasi yang disepakati dalam Perjanjian Sewa.</li>
            <li style={{ marginBottom: '8px' }}>Sejak ditandatanganinya Berita Acara ini, segala risiko, tanggung jawab keamanan, dan keutuhan unit beralih sepenuhnya kepada PIHAK KEDUA.</li>
          </ol>
          <p style={{ margin: '0 0 30px 0' }}>Demikian Berita Acara Serah Terima ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>
        </div>
      )}

      {/* ── 3. SURAT TEGURAN (GAYA SOMASI PERINGATAN) ── */}
      {jenisSurat === 'komplain' && (
        <div style={{ textAlign: 'justify', textJustify: 'inter-word', marginTop: '15px' }}>
          <p style={{ margin: '0 0 15px 0' }}>Dengan hormat,</p>
          <p style={{ margin: '0 0 10px 0' }}>Melalui surat ini, kami selaku Manajemen Properti dengan tegas menyampaikan <strong>PERINGATAN DAN TEGURAN</strong> kepada Saudara/i selaku penyewa unit {unitInfo || 'Unit'} di {namaProperti || 'Gedung'}.</p>
          <p style={{ margin: '0 0 10px 0' }}>Berdasarkan hasil pemantauan dan laporan yang kami terima, telah ditemukan adanya pelanggaran tata tertib dan/atau kerusakan fasilitas yang menjadi tanggung jawab Saudara/i. (Rincian pelanggaran/tagihan sebagaimana terlampir atau telah disampaikan sebelumnya).</p>
          <p style={{ margin: '0 0 10px 0' }}>Kami menginstruksikan kepada Saudara/i untuk segera melakukan perbaikan, penghentian pelanggaran, atau pelunasan administrasi selambat-lambatnya <strong>7 (tujuh) hari kerja</strong> sejak diterbitkannya surat ini.</p>
          <p style={{ margin: '0 0 30px 0' }}>Apabila Saudara/i mengabaikan peringatan ini, Manajemen berhak mengambil tindakan tegas sesuai dengan ketentuan hukum yang berlaku, termasuk namun tidak terbatas pada pemutusan sewa secara sepihak dan pengosongan unit. Atas perhatian dan kerja sama Saudara/i, kami ucapkan terima kasih.</p>
        </div>
      )}

      {/* Foto Bukti Serah Terima Kunci */}
      {jenisSurat === 'serah_terima' && fotoBukti && (
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <img
            src={fotoBukti}
            alt="Bukti Kondisi Fisik"
            style={{
              maxHeight: '180px',
              maxWidth: '100%',
              objectFit: 'contain',
              margin: '10px auto',
              display: 'block',
              border: '1px solid #000000',
              padding: '4px'
            }}
          />
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#555555', textAlign: 'center', fontStyle: 'italic' }}>
            Lampiran: Bukti Kondisi Fisik Unit
          </p>
        </div>
      )}

      {/* Tanggal & Lokasi Surat */}
      <div style={{ textAlign: 'right', marginTop: '12px', marginBottom: '6px', fontSize: '13.5px', color: '#000000' }}>
        Sidoarjo, {tanggalPrint}
      </div>

      {/* Tanda Tangan */}
      <table style={signatureStyle}>
        <tbody>
          <tr>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '40px', color: '#000000', margin: '0 0 40px 0' }}>PIHAK PERTAMA,</p>
            </td>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '40px', color: '#000000', margin: '0 0 40px 0' }}>PIHAK KEDUA,</p>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '1px 0', color: '#000000' }}>
              {pihak1.nama}
            </td>
            <td style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', padding: '1px 0', color: '#000000' }}>
              {pihak2.nama}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
