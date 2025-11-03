(async function () {
  const grid = document.getElementById('projectsGrid');
  const q = document.getElementById('projectSearch');
  const md = (txt) => DOMPurify.sanitize(marked.parse(txt || ''));

  const res = await fetch('data/projects.json');
  const items = await res.json();

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
})();
