(async function () {
    const container = document.getElementById('notes-container');

    try {
        const res = await fetch('data/notes.json');
        if (!res.ok) throw new Error('Failed to load notes');
        const notes = await res.json();

        // Group notes by category
        const categories = {
            'Bocconi BSc': [],
            'Bocconi MSc': [],
            'Other': []
        };

        notes.forEach(note => {
            if (categories[note.category]) {
                categories[note.category].push(note);
            } else {
                // Fallback for unknown categories, or just add them to 'Other' if preferred
                // For now, let's assume strict categories or create new ones dynamically if needed
                // But based on requirements, we stick to the 3 main ones.
                // If a new category appears, we could add it, but let's stick to the plan.
                if (!categories[note.category]) categories[note.category] = [];
                categories[note.category].push(note);
            }
        });

        // Helper to render a card
        const renderCard = (note) => {
            const iconClass = note.type === 'PDF' ? 'bi-file-earmark-pdf text-danger' : 'bi-journal-text text-body-emphasis';

            // Construct subtitle parts
            const subtitleParts = [];
            if (note.year) subtitleParts.push(note.year);
            if (note.category === 'Other' && note.institution) subtitleParts.push(note.institution);

            const subtitleHtml = subtitleParts.length > 0
                ? `<small class="text-body-secondary">${subtitleParts.join(' · ')}</small>`
                : '';

            return `
        <article class="custom-card h-100">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 class="card-title mb-0">${note.title}</h5>
                        ${subtitleHtml}
                    </div>
                    <i class="bi ${iconClass} fs-4" title="${note.type}"></i>
                </div>
                <p class="card-text text-body-secondary flex-grow-1">${note.description || ''}</p>
                <a href="${note.link}" class="btn btn-sm btn-outline-primary mt-3" target="_blank">View Notes</a>
            </div>
        </article>
        `;
        };

        // Render sections
        // Order: Bocconi BSc, Bocconi MSc, Other
        const order = ['Bocconi BSc', 'Bocconi MSc', 'Other'];

        container.innerHTML = '';

        order.forEach(cat => {
            const catNotes = categories[cat];
            if (catNotes && catNotes.length > 0) {
                const section = document.createElement('section');
                section.className = 'mb-5';
                section.innerHTML = `<h3 class="h4 mb-3 border-bottom pb-2">${cat}</h3><div class="playlist-grid"></div>`;
                container.appendChild(section);

                const grid = section.querySelector('.playlist-grid');

                const renderItem = (note) => {
                    const iconClass = note.type === 'PDF' ? 'bi-file-earmark-pdf text-danger' : 'bi-journal-text text-body-emphasis';
                    const subtitleParts = [];
                    if (note.year) subtitleParts.push(note.year);
                    if (note.category === 'Other' && note.institution) subtitleParts.push(note.institution);
                    const subtitleHtml = subtitleParts.length > 0 ? `<small class="text-body-secondary">${subtitleParts.join(' · ')}</small>` : '';

                    return `
                        <article class="custom-card">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 class="card-title mb-1 fw-bold">${note.title}</h5>
                                        ${subtitleHtml}
                                    </div>
                                    <i class="bi ${iconClass} fs-4" title="${note.type}"></i>
                                </div>
                                <div class="card-text text-body-secondary flex-grow-1 mb-3">${note.description || ''}</div>
                                <div class="mt-auto">
                                    <a href="${note.link}" class="btn btn-sm btn-outline-primary" target="_blank">View Notes</a>
                                </div>
                            </div>
                        </article>
                    `;
                };

                window.renderMasonry(grid, catNotes, renderItem);

                // Add resize listener for this grid
                window.addEventListener('masonry-resize', () => window.renderMasonry(grid, catNotes, renderItem));
            }
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="text-danger">Failed to load notes.</p>';
    }
})();
