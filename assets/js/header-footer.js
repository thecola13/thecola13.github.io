// header-footer injection script
// Fetch header.html and footer.html and replace placeholders so the header/footer are single shared files.
// Works when served over HTTP (local server). Includes small fallbacks and cache-busting for local development.

(async function () {
	'use strict';

	// Helper: try multiple URLs and return first success
	async function fetchAny(urls) {
		for (const u of urls) {
			try {
				const res = await fetch(u, { cache: 'no-store' });
				if (res.ok) return await res.text();
				console.warn('fetch failed', u, res.status);
			} catch (err) {
				console.warn('fetch error', u, err && err.message);
			}
		}
		throw new Error('All fetch attempts failed');
	}

	const bust = '?_=' + Date.now();

	const headerCandidates = [
		new URL('header.html', location.href).href + bust,
		new URL('/header.html', location.origin).href + bust,
		'header.html' + bust
	];

	const footerCandidates = [
		new URL('footer.html', location.href).href + bust,
		new URL('/footer.html', location.origin).href + bust,
		'footer.html' + bust
	];

	// inject header
	try {
		const html = await fetchAny(headerCandidates);
		const ph = document.getElementById('header');
		if (ph) ph.outerHTML = html;

		// sync icon/switch after injection
		if (window.__refreshThemeIcon) window.__refreshThemeIcon();

		const sw = document.getElementById('themeSwitch');
		if (sw && !sw._hf_bound) {
			// if theme.js hasn't bound (because it ran earlier), bind now
			sw.checked = (document.documentElement.getAttribute('data-bs-theme') === 'dark');
			sw.addEventListener('change', () => {
				const next = sw.checked ? 'dark' : 'light';
				if (window.__setTheme) window.__setTheme(next);
			});
			sw._hf_bound = true;
		}

		// Highlight the current page's nav link (adds visual emphasis for active page)
		(function setActiveNav() {
			try {
				const links = document.querySelectorAll('.navbar .nav-link');
				// Determine current file name (fallback to index.html for root)
				const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
				links.forEach(a => {
					const href = a.getAttribute('href');
					if (!href) return;
					const target = href.split('/').pop().toLowerCase();
					if (target === current) {
						a.classList.add('active', 'text-primary', 'fw-semibold');
					}
				});
			} catch (e) {
				// non-fatal
				console.warn('setActiveNav failed', e && e.message);
			}
		})();
	} catch (err) {
		console.error('Could not inject header:', err && err.message);
	}

	// inject footer
	try {
		const html = await fetchAny(footerCandidates);
		const ph = document.getElementById('footer');
		if (ph) ph.outerHTML = html;

		// populate social links if present
		const socialLinks = [
			{ name: 'GitHub', url: 'https://github.com/thecola13', icon: 'bi bi-github' },
			{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/luca-colaci-438837223/', icon: 'bi bi-linkedin' },
			{ name: 'Instagram', url: 'https://www.instagram.com/the.cola/', icon: 'bi bi-instagram' }
		];
		const container = document.getElementById('social-links');
		if (container) {
			for (const l of socialLinks) {
				const a = document.createElement('a');
				a.href = l.url; a.target = '_blank'; a.className = 'text-secondary';
				a.innerHTML = `<i class="${l.icon} fs-4"></i>`;
				container.appendChild(a);
			}
		}
	} catch (err) {
		console.error('Could not inject footer:', err && err.message);
	}

})();
  