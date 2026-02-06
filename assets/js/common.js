// Mark active nav link based on current path
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if ((here === '' && href === 'index.html') || here === href) a.classList.add('active');
    if (here === '' && href === 'index.html') a.setAttribute('aria-current', 'page');
    if (here === href) a.setAttribute('aria-current', 'page');
  });
});

/**
 * Renders items in a masonry layout.
 * @param {HTMLElement} container - The container element to render into.
 * @param {Array} items - Array of data items.
 * @param {Function} renderItemFn - Function that takes an item and returns an HTML string for the card.
 */
window.renderMasonry = function (container, items, renderItemFn) {
  if (!container) return;
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="col-12"><p class="text-muted">No items found.</p></div>';
    return;
  }

  // Determine columns based on window width (Bootstrap breakpoints)
  const width = window.innerWidth;
  let colCount = 1;
  if (width >= 992) colCount = 3; // lg
  else if (width >= 768) colCount = 2; // md

  // Create column arrays
  const columns = Array.from({ length: colCount }, () => []);

  items.forEach((item, i) => {
    columns[i % colCount].push(item);
  });

  // Create HTML for columns
  // We need a wrapper row, and then cols inside.
  container.className = 'row g-4'; // Ensure row class

  // We'll render N columns, each containing a stack of cards
  const columnHtmls = columns.map(colItems => {
    return `
      <div class="col-12 ${colCount === 3 ? 'col-lg-4' : ''} ${colCount === 2 ? 'col-md-6' : ''} d-flex flex-column gap-4">
        ${colItems.map(item => renderItemFn(item)).join('')}
      </div>
    `;
  });

  container.innerHTML = columnHtmls.join('');
};

// Re-render on resize to adjust columns
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Trigger a custom event that pages can listen to if they need to re-render
    window.dispatchEvent(new CustomEvent('masonry-resize'));
  }, 200);
});
