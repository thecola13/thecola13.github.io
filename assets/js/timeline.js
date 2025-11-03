(async function () {
  const listEl = document.getElementById('timelineList');
  const buttons = document.querySelectorAll('[data-filter]');
  const md = (txt) => DOMPurify.sanitize(marked.parse(txt || ''));
  const toDate = (s) => (s ? new Date(s) : new Date());

  const res = await fetch('data/timeline.json');
  const items = await res.json();
  // sort by descending date
  items.sort((a,b) => toDate(b.date) - toDate(a.date));

  const iconFor = (t) => t === 'academic' ? '<i class="bi bi-mortarboard me-2"></i>' : '<i class="bi bi-stars me-2"></i>';

  listEl.innerHTML = items.map(x => `
    <article class="card shadow-sm timeline-item" data-type="${x.type}">
      <div class="card-body">
        <div class="d-flex align-items-start justify-content-between gap-3">
          <h3 class="h6 mb-0">${iconFor(x.type)}${x.title}</h3>
          <time class="small text-body-secondary">${new Date(x.date).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'2-digit' })}</time>
        </div>
        <div class="mt-2">${md(x.descriptionMd || x.description || '')}</div>
        ${(x.links||[]).map(l=>`<a class="btn btn-sm btn-link px-0 me-3" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
      </div>
    </article>
  `).join('');

  // Filtering
  function applyFilter(f){
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
