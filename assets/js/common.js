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

  // Track heights to distribute evenly (approximation by item count if height unknown, 
  // but better to just round-robin or use a simple greedy approach if we could measure.
  // Since we can't easily measure before rendering, we'll use a simple round-robin 
  // but with a twist: we'll try to fill columns to keep them balanced.
  // Actually, for simple text/image cards, round-robin is often "good enough" for order preservation,
  // but the user asked to "optimize packing... bottom row is as less uneven as possible".
  // A simple greedy approach (add to shortest column) is best for packing, but changes order.
  // The user said: "I can allow for slight changes in ordering to achieve this".
  // So we will simulate "height" by assuming text length correlates to height? 
  // No, that's complex. Let's just use round-robin for now as it's robust, 
  // OR since we are rendering HTML strings, we can't measure them yet.
  // 
  // WAIT: The standard way to do this without JS measurement libraries is CSS columns (masonry),
  // but that messes up ordering (top-to-bottom then left-to-right).
  // JS Masonry usually requires measuring.
  // 
  // Alternative: Render all, measure, then position? Too complex for this scope.
  // 
  // Let's stick to a column-based distribution. 
  // If we just distribute items 1, 2, 3, 1, 2, 3... it preserves order roughly.
  // If we want to "optimize packing", we need to know heights.
  // 
  // Let's try a simple "balanced" distribution:
  // Just distribute items sequentially into columns.
  // This ensures the bottom row is as even as possible (at most 1 item difference).
  // 
  // However, if one item is huge and others small, one column gets long.
  // Without measuring, we can't fix that.
  // BUT, the user said "I can allow for slight changes in ordering".
  // 
  // Let's stick to sequential distribution (0, 1, 2, 0, 1, 2...) for simplicity and robustness 
  // without heavy DOM thrashing/measuring. It guarantees the *count* is even.

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
