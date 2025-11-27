document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('projectsGrid');
  const q = document.getElementById('projectSearch');

  if (!grid) {
    // Defensive: if the projects grid is missing, log and abort to avoid uncaught exceptions
    console.error('projects.js: could not find element with id "projectsGrid". Aborting render.');
    return;
  }

  // Ensure markdown + sanitizer are available; fall back to simple text if not
  const md = (txt) => {
    try {
      if (typeof DOMPurify !== 'undefined' && typeof marked !== 'undefined') {
        return DOMPurify.sanitize(marked.parse(txt || ''));
      }
    } catch (e) {
      console.warn('projects.js: markdown sanitization failed, falling back to plain text', e);
    }
    // naive fallback: escape < and >
    return (txt || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  let items = [];
  try {
    const res = await fetch('data/projects.json');
    items = await res.json();
  } catch (err) {
    console.error('projects.js: failed to load data/projects.json', err);
    grid.innerHTML = '<div class="col-12"><p class="text-muted">Could not load projects.</p></div>';
    return;
  }

  function render(list) {
    const renderItem = (p) => `
        <article class="custom-card">
          <div class="ratio ratio-16x9 bg-body-secondary">
            ${p.image ? `<img src="${p.image}" alt="${p.name} thumbnail" class="object-fit-cover">` : ''}
          </div>
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0 fw-bold">${p.name}</h5>
            </div>
            <div class="card-text text-body-secondary small flex-grow-1 mb-3">${md(p.descriptionMd || p.description || '')}</div>
            <div class="mt-auto">
                <div class="mb-3 d-flex flex-wrap gap-1">
                    ${(p.tags || []).map(t => `<span class="badge text-bg-light border">${t}</span>`).join('')}
                </div>
                <div class="d-flex flex-wrap gap-2">
                    ${(p.links || []).map(l => `<a class="btn btn-sm btn-outline-primary" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
                </div>
            </div>
          </div>
        </article>
    `;

    window.renderMasonry(grid, list, renderItem);
  }

  render(items);

  // search filter
  q?.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    if (!term) return render(items);
    const filtered = items.filter(p => [
      p.name,
      (p.tags || []).join(' '),
      p.descriptionMd || p.description || ''
    ].join(' ').toLowerCase().includes(term));
    render(filtered);
  });

  window.addEventListener('masonry-resize', () => render(items)); // Re-render on resize logic needs to handle filtered state ideally, but for now simple re-render of current state is tricky without state tracking.
  // Better: just re-trigger the input event or keep track of current list.
  // For simplicity in this scope, we'll just re-render full list or rely on the user re-searching if needed, 
  // OR we can just let the common.js reload do its thing if we passed the container? 
  // Wait, common.js just dispatches event. We need to call render again.
  // Let's just re-render the *current* list.
  // To do that, we need to track it.

  let currentList = items;
  const originalRender = render;
  render = (list) => {
    currentList = list;
    originalRender(list);
  };

  window.addEventListener('masonry-resize', () => render(currentList));
});
