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
  satuanDurasi
}) {
  if (!template && jenisSurat !== 'invoice_sewa' && jenisSurat !== 'Invoice Pembayaran Sewa') return null;

  const propertiLabel = (namaProperti || 'Suncity Residence').toUpperCase();
  const tanggalPrint = tanggalSurat ? formatTanggalPendek(parseTanggal(tanggalSurat)) : '-';

  if (jenisSurat === 'invoice_sewa' || jenisSurat === 'Invoice Pembayaran Sewa') {
    const pihak2Nama = pihak2?.nama || 'Nama Penyewa';
    const pihak2Nik = pihak2?.nik || '';
    const durasiSewa = durasi || '0';
    const totalHargaSewaNum = Number(totalSewa || 0);
    const nominalDPNum = Number(nominalDP || 0);
    const sisaPembayaranNum = totalHargaSewaNum - nominalDPNum;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', color: '#0f172a', margin: '-50px', padding: '0', boxSizing: 'border-box' }}>
        
        {/* HEADER NAVY & GOLD */}
        <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '40px', color: 'white', borderBottom: '10px solid #d97706' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0', color: 'white', letterSpacing: '2px' }}>INVOICE</h1>
            <h2 style={{ fontSize: '20px', backgroundColor: '#d97706', display: 'inline-block', padding: '5px 15px', margin: '10px 0', borderRadius: '5px', color: '#0f172a', fontWeight: 'bold' }}>SEWA UNIT APARTEMEN</h2>
            <p style={{ fontSize: '14px', letterSpacing: '1px', marginTop: '10px' }}>{namaProperti ? namaProperti.toUpperCase() : 'SUNCITY RESIDENCE'} - SIDOARJO</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p style={{ fontSize: '18px', margin: '0' }}>Kepada Yth:</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#d97706' }}>{pihak2Nama}</p>
            <p style={{ fontSize: '16px', margin: '0' }}>{pihak2Nik ? `NIK: ${pihak2Nik}` : ''}</p>
          </div>
        </div>

        <div style={{ padding: '40px', flex: 1 }}>
          {/* INFO BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 5px 0' }}>TANGGAL INVOICE</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{tanggalSurat ? formatTanggalPendek(parseTanggal(tanggalSurat)) : 'DD MM YYYY'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 5px 0' }}>TANGGAL CHECK-IN</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{tanggalCheckIn ? formatTanggalPendek(parseTanggal(tanggalCheckIn)) : 'DD MM YYYY'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 5px 0' }}>DURASI SEWA</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{durasiSewa} {satuanDurasi === 'hari' ? 'Hari' : satuanDurasi === 'bulan' ? 'Bulan' : 'Tahun'}</p>
            </div>
          </div>

          {/* TABEL PEMBAYARAN */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>RINCIAN PEMBAYARAN</th>
                <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px' }}>JUMLAH</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontSize: '16px' }}>Sewa Unit Apartemen {namaProperti || 'Suncity'} ({durasiSewa} {satuanDurasi === 'hari' ? 'Hari' : satuanDurasi === 'bulan' ? 'Bulan' : 'Tahun'})</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px', fontWeight: 'bold' }}>Rp {totalHargaSewaNum.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontSize: '16px' }}>DP / Telah Dibayarkan</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>- Rp {nominalDPNum.toLocaleString('id-ID')}</td>
              </tr>
              <tr style={{ backgroundColor: '#fef3c7' }}>
                <td style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>SISA PEMBAYARAN</td>
                <td style={{ padding: '15px', textAlign: 'right', fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>Rp {sisaPembayaranNum.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>

          {/* INCLUDE & EXCLUDE */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, border: '2px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginTop: '0', display: 'flex', alignItems: 'center' }}><span style={{ color: '#10b981', marginRight: '10px' }}>✓</span> INCLUDE</h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px', margin: '0' }}>{teksInclude || 'Service Charge'}</p>
            </div>
            <div style={{ flex: 1, border: '2px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginTop: '0', display: 'flex', alignItems: 'center' }}><span style={{ color: '#ef4444', marginRight: '10px' }}>✕</span> EXCLUDE</h3>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px', margin: '0' }}>{teksExclude || 'Air\nToken Listrik\nInternet / WiFi\nParkir'}</p>
            </div>
          </div>

          {/* STATUS */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', margin: '0 0 10px 0' }}>✓ {statusPembayaran || 'STATUS PEMBAYARAN'}</p>
            <p style={{ fontSize: '14px', margin: '0', fontStyle: 'italic' }}>Terima kasih telah melakukan pemesanan di Suncity Residence.</p>
          </div>
        </div>

        {/* FOOTER NAVY */}
        <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0' }}>WHATSAPP</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>089678449424</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#d97706', margin: '0' }}>Nyaman • Aman • Terpercaya</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0' }}>LOKASI</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>Suncity Apartment Sidoarjo</p>
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

  const listStyle = {
    paddingLeft: '0',
    marginBottom: '5px',
    listStyleType: 'none',
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

      {/* Kesepakatan */}
      <p style={pStyle}>
        {template.kesepakatanUtama}
      </p>

      {/* Klausul */}
      <ol style={listStyle}>
        {template.klausul.map((item, i) => (
          <li key={i} style={{ marginBottom: '4px', textAlign: 'justify', textJustify: 'inter-word' }}>
            {item}
          </li>
        ))}
      </ol>

      {/* Penutup */}
      <p style={pStyle}>
        {template.penutup}
      </p>

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

