import { useApp } from '../context/AppContext';
import IsiSurat from './IsiSurat';

/**
 * Hidden A4 export node for Berita Acara Serah Terima Kunci.
 */
export default function SerahTerima() {
  const { exportRef, template, pihak1, pihak2, logo, fontPilihan } = useApp();
  if (!template || !exportRef) return null;

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
      <div
        ref={exportRef}
        className="bg-white text-black"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          fontFamily: `${fontPilihan}, 'Times New Roman', Times, serif`,
        }}
      >
        <IsiSurat template={template} pihak1={pihak1} pihak2={pihak2} logo={logo} />
      </div>
    </div>
  );
}
