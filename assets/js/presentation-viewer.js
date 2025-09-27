// PDF Presentation Viewer
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');

// Get the PDF URL from the page data
const pdfUrl = document.querySelector('article.presentation-page').dataset.pdfFile || 
               document.querySelector('a[href*=".pdf"]')?.href;

if (pdfUrl || window.pdfFile) {
  const url = pdfUrl || window.pdfFile;
  
  // Load the PDF
  pdfjsLib.getDocument(url).promise.then(function(pdf) {
    pdfDoc = pdf;
    document.getElementById('page-count').textContent = pdf.numPages;
    
    // Initial page rendering
    renderPage(pageNum);
  }).catch(function(error) {
    console.error('Error loading PDF:', error);
    canvas.style.display = 'none';
    document.querySelector('.pdf-controls').innerHTML = '<p>Greška pri učitavanju PDF-a</p>';
  });
}

/**
 * Render a page in the canvas
 */
function renderPage(num) {
  pageRendering = true;
  
  pdfDoc.getPage(num).then(function(page) {
    const viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    
    const renderTask = page.render(renderContext);
    
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
  
  document.getElementById('page-num').textContent = num;
}

/**
 * Queue page rendering
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Go to previous page
 */
function prevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

/**
 * Go to next page
 */
function nextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

/**
 * Zoom in
 */
function zoomIn() {
  scale += 0.25;
  updateZoomDisplay();
  queueRenderPage(pageNum);
}

/**
 * Zoom out
 */
function zoomOut() {
  if (scale <= 0.5) {
    return;
  }
  scale -= 0.25;
  updateZoomDisplay();
  queueRenderPage(pageNum);
}

/**
 * Update zoom level display
 */
function updateZoomDisplay() {
  document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
}

// Event listeners
document.getElementById('prev-page')?.addEventListener('click', prevPage);
document.getElementById('next-page')?.addEventListener('click', nextPage);
document.getElementById('zoom-in')?.addEventListener('click', zoomIn);
document.getElementById('zoom-out')?.addEventListener('click', zoomOut);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  // Only handle keys when viewing a presentation
  if (!document.querySelector('.presentation-viewer')) return;
  
  switch(e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      prevPage();
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ': // Spacebar
      nextPage();
      e.preventDefault();
      break;
    case '+':
    case '=':
      zoomIn();
      e.preventDefault();
      break;
    case '-':
      zoomOut();
      e.preventDefault();
      break;
  }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas?.addEventListener('touchstart', function(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas?.addEventListener('touchend', function(e) {
  if (!touchStartX || !touchStartY) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Minimum swipe distance
  if (Math.abs(diffX) < 50 && Math.abs(diffY) < 50) return;
  
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
      nextPage(); // Swipe left = next page
    } else {
      prevPage(); // Swipe right = previous page
    }
  }
  
  touchStartX = 0;
  touchStartY = 0;
}, { passive: true });