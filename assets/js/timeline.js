(async function () {
  const listEl = document.getElementById('timelineList');
  const buttons = document.querySelectorAll('[data-filter]');
  const md = (txt) => DOMPurify.sanitize(marked.parse(txt || ''));
  const toDate = (s) => (s ? new Date(s) : new Date());

  const res = await fetch('data/timeline.json');
  const items = await res.json();
  // sort by descending date
  items.sort((a, b) => toDate(b.date) - toDate(a.date));

  const iconFor = (t) => t === 'academic' ? '<i class="bi bi-mortarboard me-2"></i>' : '<i class="bi bi-stars me-2"></i>';

  listEl.innerHTML = items.map(x => `
    <article class="custom-card timeline-item" data-type="${x.type}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
             <h5 class="card-title mb-1 fw-bold">${iconFor(x.type)}${x.title}</h5>
             <div class="text-body-secondary small">${new Date(x.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</div>
          </div>
        </div>
        <div class="card-text text-body-secondary mb-3">${md(x.descriptionMd || x.description || '')}</div>
        <div class="mt-auto d-flex flex-wrap gap-2">
            ${(x.links || []).map(l => `<a class="btn btn-sm btn-outline-primary" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

  // Filtering
  function applyFilter(f) {
    document.querySelectorAll('#timelineList [data-type]').forEach(el => {
      el.classList.toggle('d-none', f !== 'all' && el.dataset.type !== f);
    });
    buttons.forEach(b => {
      const is = b.dataset.filter === f;
      b.classList.toggle('btn-primary', is);
      b.classList.toggle('btn-outline-primary', !is);
      b.setAttribute('aria-pressed', is ? 'true' : 'false');
    });
  }
  buttons.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  applyFilter('all');
})();
