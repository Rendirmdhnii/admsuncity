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
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      windowWidth: 794,
      width: 794,
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('kertas-surat-final');
        if (el) {
          let parent = el.parentElement;
          while (parent) {
            parent.style.overflow = 'visible';
            parent.style.transform = 'none';
            parent = parent.parentElement;
          }
          
          el.style.transform = 'none';
          el.style.position = 'absolute';
          el.style.left = '0';
          el.style.top = '0';
          el.style.width = '794px';
          el.style.minHeight = '1123px';
          el.style.padding = '75px';
          el.style.boxSizing = 'border-box';
          
          const imgs = el.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            imgs[i].style.maxWidth = '100%';
            imgs[i].style.objectFit = 'contain';
          }
        }
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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

