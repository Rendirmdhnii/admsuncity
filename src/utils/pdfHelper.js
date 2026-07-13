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
      scale: 2, // Ketajaman
      useCORS: true,
      windowWidth: 794, // Paksa lebar jendela kanvas menjadi A4 pixel
      width: 794,       // Paksa lebar render menjadi A4 pixel
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('kertas-surat-final');
        if (el) {
          // HAPUS SEMUA BATASAN MOBILE DI CLONE DOM
          let parent = el.parentElement;
          while(parent) {
             parent.style.overflow = 'visible';
             parent.style.transform = 'none';
             parent = parent.parentElement;
          }
          
          // KUNCI UKURAN KERTAS DALAM PIXEL MUTLAK (A4)
          el.style.width = '794px';
          el.style.minHeight = '1123px';
          el.style.padding = '75px'; // Setara dengan 20mm
          el.style.margin = '0';
          el.style.transform = 'none';
          el.style.position = 'absolute';
          el.style.top = '0';
          el.style.left = '0';
          el.style.boxSizing = 'border-box';
          
          // Paksa font dan spasi agar justify rapi
          el.style.fontSize = '14.5px'; // Setara 11pt
          el.style.lineHeight = '1.5';
          el.style.textAlign = 'justify';
          const paragraphs = el.getElementsByTagName('p');
          for(let i=0; i<paragraphs.length; i++) {
             paragraphs[i].style.textAlign = 'justify';
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
