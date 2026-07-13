import { useApp } from '../context/AppContext';
import IsiSurat from './IsiSurat';

/**
 * Hidden A4 export node for Berita Acara Serah Terima Kunci.
 */
export default function SerahTerima() {
  const { exportRef, template, pihak1, pihak2, logo, fontPilihan } = useApp();
  if (!template || !exportRef) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -9999, width: '210mm', backgroundColor: 'white', opacity: 0, pointerEvents: 'none' }}>
      <div
        ref={exportRef}
        className="bg-white text-black"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          backgroundColor: 'white',
          color: 'black',
          fontFamily: `${fontPilihan}, 'Times New Roman', Times, serif`,
        }}
      >
        <IsiSurat template={template} pihak1={pihak1} pihak2={pihak2} logo={logo} />
      </div>
    </div>
  );
}
