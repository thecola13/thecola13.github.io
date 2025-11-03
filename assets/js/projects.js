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
    grid.innerHTML = list.map(p => `
      <div class="col">
        <article class="card h-100 shadow-sm">
          <div class="ratio ratio-16x9 bg-body-secondary">
            ${p.image ? `<img src="${p.image}" alt="${p.name} thumbnail" class="object-fit-cover">` : ''}
          </div>
          <div class="card-body d-flex flex-column">
            <h3 class="h5 card-title">${p.name}</h3>
            <div class="mb-2">${(p.tags||[]).map(t=>`<span class="badge text-bg-secondary">${t}</span>`).join(' ')}</div>
            <div class="card-text small flex-grow-1">${md(p.descriptionMd || p.description || '')}</div>
            <div class="mt-3 d-flex flex-wrap gap-2">
              ${(p.links||[]).map(l => `<a class="btn btn-sm btn-primary" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
            </div>
          </div>
        </article>
      </div>
    `).join('');

    if (!list.length) {
      grid.innerHTML = '<div class="col-12"><p class="text-muted">No projects found.</p></div>';
    }
  }

  render(items);

  // search filter
  q?.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    if (!term) return render(items);
    const filtered = items.filter(p => [
      p.name,
      (p.tags||[]).join(' '),
      p.descriptionMd || p.description || ''
    ].join(' ').toLowerCase().includes(term));
    render(filtered);
  });
});
