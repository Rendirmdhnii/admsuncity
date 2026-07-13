/**
 * IsiSurat — shared A4 content renderer.
 * Used by both the live preview and the hidden export nodes.
 * Receives a `template` object (from templateBuilder) plus party & style data.
 */
export default function IsiSurat({ template, pihak1, pihak2, logo, namaProperti }) {
  if (!template) return null;

  const propertiLabel = (namaProperti || 'Suncity Residence').toUpperCase();

  const pStyle = {
    textAlign: 'justify',
    textJustify: 'inter-word',
    textIndent: '20px',
    marginBottom: '8px',
    color: '#000000',
    lineHeight: '1.6',
    fontSize: '15px',
  };

  const tableStyle = {
    width: '100%',
    marginBottom: '8px',
    borderCollapse: 'collapse',
    border: 'none',
    color: '#000000',
    lineHeight: '1.6',
    fontSize: '15px',
  };

  const listStyle = {
    paddingLeft: '0',
    marginBottom: '8px',
    listStyleType: 'none',
    color: '#000000',
    lineHeight: '1.6',
    fontSize: '15px',
  };

  const signatureStyle = {
    width: '100%',
    marginTop: '30px',
    borderCollapse: 'collapse',
    border: 'none',
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
    color: '#000000',
    lineHeight: '1.6',
    fontSize: '15px',
  };

  return (
    <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#000000', fontFamily: '"Times New Roman", Times, serif', maxHeight: '297mm', overflow: 'hidden' }}>
      {/* Kop Surat */}
      <div style={{ textAlign: 'center', marginBottom: '12px', width: '100%' }}>
        {logo ? (
          <img
            src={logo}
            alt="Logo Properti"
            style={{ maxHeight: '60px', width: 'auto', display: 'inline-block' }}
          />
        ) : (
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', textTransform: 'uppercase', textAlign: 'center' }}>
            {propertiLabel}
          </h2>
        )}
        <div style={{ borderBottom: '2px solid #000000', marginTop: '6px', marginBottom: '12px', width: '100%' }} />
      </div>

      {/* Judul & Nomor */}
      <div style={{ textAlign: 'center', marginBottom: '12px', width: '100%' }}>
        <h3
          style={{
            textDecoration: 'underline',
            fontWeight: 'bold',
            fontSize: '16px',
            margin: '0 0 2px 0',
            textTransform: 'uppercase',
            color: '#000000',
            textAlign: 'center',
          }}
        >
          {template.judul}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>
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
          <li key={i} style={{ marginBottom: '6px', textAlign: 'justify', textJustify: 'inter-word' }}>
            {item}
          </li>
        ))}
      </ol>

      {/* Penutup */}
      <p style={pStyle}>
        {template.penutup}
      </p>

      {/* Tanda Tangan */}
      <table style={signatureStyle}>
        <tbody>
          <tr>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '50px', color: '#000000' }}>PIHAK PERTAMA,</p>
            </td>
            <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top' }}>
              <p style={{ marginBottom: '50px', color: '#000000' }}>PIHAK KEDUA,</p>
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
          <tr>
            <td style={{ textAlign: 'center', fontSize: '11px', color: '#555555', padding: '1px 0' }}>
              NIK: {pihak1.nik}
            </td>
            <td style={{ textAlign: 'center', fontSize: '11px', color: '#555555', padding: '1px 0' }}>
              NIK: {pihak2.nik}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
