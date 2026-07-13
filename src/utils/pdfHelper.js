/**
 * Lazy-loads html2pdf.js from CDN and triggers a PDF download.
 *
 * @param {HTMLElement} element  The DOM node to export
 * @param {string}      filename Desired filename (no need for .pdf suffix)
 * @returns {Promise<void>}
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
      scale: 3, // Resolusi tinggi anti pecah
      useCORS: true,
      windowWidth: 1200, // PAKSA render di ukuran layar monitor 1200px
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('kertas-surat-final');
        if (el) {
          // Cabut elemen dari kungkungan CSS mobile
          el.style.position = 'fixed';
          el.style.top = '0';
          el.style.left = '0';
          el.style.width = '210mm';
          el.style.height = '297mm'; // Kunci mati tinggi A4
          el.style.transform = 'none'; // MATIKAN efek scale(0.45) khusus saat ekspor
          el.style.margin = '0';
          el.style.maxWidth = 'none'; // Buang batasan mobile
        }
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  return window.html2pdf().set(opt).from(element).save();
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
