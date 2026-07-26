/**
 * Lazy-loads html2pdf.js from CDN and triggers a PDF download.
 *
 * @param {HTMLElement} element  The DOM node to export
 * @param {string}      filename Desired filename (no need for .pdf suffix)
 * @returns {Promise<Blob>}
 */
export async function downloadPDF(element, filename) {
  if (!element) throw new Error('Export element is not mounted');

  // Lazy-load html2pdf only once
  if (!window.html2pdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const opt = {
    margin: 0,
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      windowWidth: 1024, // Paksa ukuran window render besar
      x: 0, // Paksa mulai dari titik X 0 mutlak
      y: 0, // Paksa mulai dari titik Y 0 mutlak
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        // PERBAIKAN FATAL CLIPPING: Lebarkan body virtual agar sisi kiri tidak terpotong
        clonedDoc.body.style.width = '1200px'; 
        clonedDoc.body.style.padding = '0';
        clonedDoc.body.style.margin = '0';
        
        const el = clonedDoc.getElementById('kertas-surat-final');
        if (el) {
          el.style.transform = 'none'; // Matikan efek zoom out
          el.style.position = 'absolute';
          el.style.left = '0';
          el.style.top = '0';
          el.style.width = '794px';
          el.style.minHeight = '1123px';
          el.style.margin = '0';
        }
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return window.html2pdf().set(opt).from(element).output('blob');
}

/**
 * Open WhatsApp chat for a given phone number.
 * @param {string} rawNumber  Phone number, any format (digits extracted automatically)
 */
export function openWhatsApp(rawNumber) {
  const digits = rawNumber.replace(/\D/g, '');
  if (digits) {
    window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer');
  }
}

