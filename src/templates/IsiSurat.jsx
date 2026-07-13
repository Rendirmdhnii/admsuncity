/**
 * IsiSurat — shared A4 content renderer.
 * Used by both the live preview and the hidden export nodes.
 * Receives a `template` object (from templateBuilder) plus party & style data.
 */
export default function IsiSurat({ template, pihak1, pihak2, logo, namaProperti }) {
  if (!template) return null;

  const propertiLabel = (namaProperti || 'Suncity Residence').toUpperCase();

  return (
    <div className="text-[11pt] leading-snug text-black">
      {/* Kop Surat */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        {logo ? (
          <img
            src={logo}
            alt="Logo Apartemen"
            style={{ maxHeight: '60px', width: 'auto', display: 'inline-block' }}
          />
        ) : (
          <h2 style={{ margin: 0, fontSize: '13pt', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            {propertiLabel}
          </h2>
        )}
        <div style={{ borderBottom: '2.5px solid #000', marginTop: '6px', marginBottom: '8px' }} />
      </div>

      {/* Judul & Nomor */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3
          style={{
            textDecoration: 'underline',
            fontWeight: 'bold',
            fontSize: '11pt',
            margin: '0 0 2px 0',
            textTransform: 'uppercase',
          }}
        >
          {template.judul}
        </h3>
        <p style={{ margin: 0, fontSize: '10pt', fontWeight: 'bold' }}>
          Nomor: {template.nomorKontrak}
        </p>
      </div>

      {/* Pembuka */}
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        {template.pembuka}
      </p>

      {/* Pihak Pertama */}
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '5%', padding: '1px 0' }}>I.</td>
            <td style={{ width: '20%', padding: '1px 0' }}>Nama</td>
            <td style={{ width: '3%', padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', fontWeight: 'bold' }}>{pihak1.nama}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0' }}>NIK</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0' }}>{pihak1.nik}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0' }}>Alamat</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', textAlign: 'justify' }}>{pihak1.alamat}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai{' '}
        <strong>PIHAK PERTAMA</strong>.
      </p>

      {/* Pihak Kedua */}
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '5%', padding: '1px 0' }}>II.</td>
            <td style={{ width: '20%', padding: '1px 0' }}>Nama</td>
            <td style={{ width: '3%', padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', fontWeight: 'bold' }}>{pihak2.nama}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0' }}>NIK</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0' }}>{pihak2.nik}</td>
          </tr>
          <tr>
            <td />
            <td style={{ padding: '1px 0' }}>Alamat</td>
            <td style={{ padding: '1px 0' }}>:</td>
            <td style={{ padding: '1px 0', textAlign: 'justify' }}>{pihak2.alamat}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri, yang selanjutnya disebut sebagai{' '}
        <strong>PIHAK KEDUA</strong>.
      </p>

      {/* Kesepakatan */}
      <p style={{ textAlign: 'justify', marginBottom: '4px', textIndent: '20px' }}>
        {template.kesepakatanUtama}
      </p>

      {/* Klausul */}
      <ol style={{ paddingLeft: 0, margin: '0 0 6px 0', listStyleType: 'none' }}>
        {template.klausul.map((item, i) => (
          <li key={i} style={{ marginBottom: '3px', textAlign: 'justify' }}>
            {item}
          </li>
        ))}
      </ol>

      {/* Penutup */}
      <p style={{ textAlign: 'justify', marginBottom: '10px', textIndent: '20px' }}>
        {template.penutup}
      </p>

      {/* Tanda Tangan */}
      <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '40px' }}>PIHAK PERTAMA,</p>
            </td>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '40px' }}>PIHAK KEDUA,</p>
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
            <td style={{ textAlign: 'center', fontSize: '8.5pt', color: '#555', padding: '1px 0' }}>
              NIK: {pihak1.nik}
            </td>
            <td style={{ textAlign: 'center', fontSize: '8.5pt', color: '#555', padding: '1px 0' }}>
              NIK: {pihak2.nik}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
