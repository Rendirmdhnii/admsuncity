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
      windowWidth: 794,
      x: 0,
      y: 0,
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('kertas-surat-final');
        if (el) {
          // Matikan semua pengaruh layar HP
          el.style.transform = 'none';
          el.style.width = '794px';
          el.style.minHeight = '1123px';
          el.style.margin = '0';
          el.style.padding = '50px'; // Ruang bernapas yang rapi
          el.style.position = 'absolute';
          el.style.top = '0';
          el.style.left = '0';
          el.style.boxSizing = 'border-box';
        }
      }
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
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

