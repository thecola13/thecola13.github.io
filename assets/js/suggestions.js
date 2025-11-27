document.addEventListener('DOMContentLoaded', () => {
    const suggestionsContainer = document.getElementById('suggestions-container');
    const tagsContainer = document.getElementById('tags-container');

    let allSuggestions = [];
    let activeTags = new Set();

    // Fetch data
    fetch('data/suggestions.json')
        .then(response => response.json())
        .then(data => {
            allSuggestions = data;
            renderPage();
        })
        .catch(error => {
            console.error('Error loading suggestions:', error);
            suggestionsContainer.innerHTML = '<div class="col-12 text-center text-danger">Failed to load suggestions.</div>';
            tagsContainer.innerHTML = '';
        });

    function renderPage() {
        // 1. Filter suggestions based on activeTags (AND logic)
        const filteredSuggestions = allSuggestions.filter(item => {
            if (activeTags.size === 0) return true;
            // Check if item has ALL active tags
            return Array.from(activeTags).every(tag => item.tags && item.tags.includes(tag));
        });

        // 2. Collect all available tags logic (unchanged)
        const allTags = new Set();
        allSuggestions.forEach(item => {
            if (item.tags) item.tags.forEach(t => allTags.add(t));
        });
        const sortedTags = Array.from(allTags).sort();

        // Render Tags
        tagsContainer.innerHTML = '';
        if (sortedTags.length === 0) {
            tagsContainer.innerHTML = '<span class="text-muted">No tags found.</span>';
        } else {
            sortedTags.forEach(tag => {
                const isActive = activeTags.has(tag);
                let isPossible = true;
                if (!isActive) {
                    const potentialTags = new Set(activeTags);
                    potentialTags.add(tag);
                    const matchCount = allSuggestions.filter(item =>
                        Array.from(potentialTags).every(t => item.tags && item.tags.includes(t))
                    ).length;
                    if (matchCount === 0) isPossible = false;
                }

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'} ${!isPossible ? 'disabled opacity-25' : ''}`;
                btn.textContent = tag;
                if (!isPossible) {
                    btn.disabled = true;
                } else {
                    btn.onclick = () => toggleTag(tag);
                }
                tagsContainer.appendChild(btn);
            });

            // Add a "Clear all" button if there are active tags
            if (activeTags.size > 0) {
                const clearBtn = document.createElement('button');
                clearBtn.type = 'button';
                clearBtn.className = 'btn btn-sm btn-link text-decoration-none';
                clearBtn.textContent = 'Clear filters';
                clearBtn.onclick = () => {
                    activeTags.clear();
                    renderPage();
                };
                tagsContainer.appendChild(clearBtn);
            }
        }

        // Render Suggestions using Masonry
        // We define the renderItem function
        const renderItem = (item) => {
            // Format date
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

            // Tags HTML
            const tagsHtml = (item.tags || []).map(t => `<span class="badge text-bg-light border">${t}</span>`).join(' ');

            // Image HTML (if exists)
            let imageHtml = '';
            if (item.image) {
                imageHtml = `<div class="ratio ratio-16x9 mb-3"><img src="${item.image}" class="object-fit-cover rounded" alt="${item.title}"></div>`;
            }

            // Link button
            let actionHtml = '';
            if (item.link) {
                actionHtml = `<a href="${item.link}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary mt-3">View</a>`;
            }

            return `
                <div class="custom-card">
                    <div class="card-body d-flex flex-column">
                        ${imageHtml}
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h5 class="card-title mb-1 fw-bold">${item.title}</h5>
                                <div class="text-body-secondary small">${dateStr}</div>
                            </div>
                        </div>
                        <div class="card-text text-body-secondary flex-grow-1 mb-3">${item.comment}</div>
                        <div class="mt-auto pt-2">
                            <div class="mb-3 d-flex flex-wrap gap-1">
                                ${tagsHtml}
                            </div>
                            ${actionHtml}
                        </div>
                    </div>
                </div>
            `;
        };

        window.renderMasonry(suggestionsContainer, filteredSuggestions, renderItem);
    }

    // Listen for resize to re-render masonry
    window.addEventListener('masonry-resize', renderPage);

    function toggleTag(tag) {
        if (activeTags.has(tag)) {
            activeTags.delete(tag);
        } else {
            activeTags.add(tag);
        }
        renderPage();
    }
});
