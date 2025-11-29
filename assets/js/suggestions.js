document.addEventListener('DOMContentLoaded', () => {
    const selectedTagsContainer = document.getElementById('selected-tags');
    const searchInput = document.getElementById('tag-search-input');
    const searchResults = document.getElementById('tag-search-results');
    const suggestionsContainer = document.getElementById('suggestions-container');

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
        });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Focus input -> show results
    searchInput.addEventListener('focus', () => {
        renderTagResults(searchInput.value);
        searchResults.style.display = 'block';
    });

    // Input -> filter results
    searchInput.addEventListener('input', (e) => {
        renderTagResults(e.target.value);
        searchResults.style.display = 'block';
    });

    // Enter key -> select first result
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstItem = searchResults.querySelector('.list-group-item-action');
            if (firstItem) {
                firstItem.click();
            }
        }
    });

    function renderTagResults(query) {
        const q = query.toLowerCase();

        // Collect all tags
        const allTags = new Set();
        allSuggestions.forEach(item => {
            if (item.tags) item.tags.forEach(t => allTags.add(t));
        });

        // Filter tags:
        // 1. Must match query
        // 2. Must NOT be already selected
        // 3. Must be "possible" (optional, but good for UX) - let's show all but disable impossible ones? 
        //    Or just hide impossible ones to keep it clean? User said "look among the one available".
        //    Let's hide impossible ones to reduce noise.

        const availableTags = Array.from(allTags).filter(tag => {
            if (activeTags.has(tag)) return false; // Already selected
            if (!tag.toLowerCase().includes(q)) return false; // Doesn't match query

            // Check possibility
            const potentialTags = new Set(activeTags);
            potentialTags.add(tag);
            const matchCount = allSuggestions.filter(item =>
                Array.from(potentialTags).every(t => item.tags && item.tags.includes(t))
            ).length;

            return matchCount > 0;
        }).sort();

        searchResults.innerHTML = '';
        if (availableTags.length === 0) {
            const noItem = document.createElement('div');
            noItem.className = 'list-group-item text-muted small';
            noItem.textContent = 'No matching tags found';
            searchResults.appendChild(noItem);
        } else {
            availableTags.forEach(tag => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'list-group-item list-group-item-action';
                btn.textContent = tag;
                btn.onclick = () => {
                    activeTags.add(tag);
                    searchInput.value = '';
                    searchResults.style.display = 'none';
                    renderPage();
                };
                searchResults.appendChild(btn);
            });
        }
    }

    function renderPage() {
        // 1. Filter suggestions based on activeTags (AND logic)
        const filteredSuggestions = allSuggestions.filter(item => {
            if (activeTags.size === 0) return true;
            return Array.from(activeTags).every(tag => item.tags && item.tags.includes(tag));
        });

        // 2. Render Selected Tags
        selectedTagsContainer.innerHTML = '';
        activeTags.forEach(tag => {
            const badge = document.createElement('span');
            badge.className = 'badge text-bg-primary d-flex align-items-center gap-2';
            badge.innerHTML = `
                ${tag}
                <i class="bi bi-x-lg" style="cursor: pointer; font-size: 0.8em;" role="button"></i>
            `;
            badge.querySelector('i').onclick = () => {
                activeTags.delete(tag);
                renderPage();
            };
            selectedTagsContainer.appendChild(badge);
        });

        // 3. Render Suggestions using Masonry
        const renderItem = (item) => {
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            const tagsHtml = (item.tags || []).map(t => `<span class="badge text-bg-light border">${t}</span>`).join(' ');

            let imageHtml = '';
            if (item.image) {
                imageHtml = `<div class="ratio ratio-16x9 mb-3"><img src="${item.image}" class="object-fit-cover rounded" alt="${item.title}"></div>`;
            }

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
});
