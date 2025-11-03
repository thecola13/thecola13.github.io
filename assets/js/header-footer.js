// Initialize theme immediately (in case DOMContentLoaded already fired)
initThemeFromStorage();

document.addEventListener('DOMContentLoaded', function () {
    // Load header
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').innerHTML = data;
        // Update toggle UI if present after header is injected
        updateThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'dark');
      });
  
    // Load footer
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
        document.getElementById('footer').style.display = 'block';

        createSocials();
      });
  });

// Delegated click handler for theme toggle: robust even if the button is injected later
document.body.addEventListener('click', function (e) {
  // Robust traversal to support browsers that may not implement Element.closest
  let target = e.target;
  while (target && target !== document.body) {
    if (target.id === 'theme-toggle') break;
    target = target.parentNode;
  }
  if (!target || target.id !== 'theme-toggle') return;
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/thecola13', icon: 'bi bi-github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/luca-colaci-438837223/', icon: 'bi bi-linkedin' },
    { name: 'Instagram', url: 'https://www.instagram.com/the.cola/', icon: 'bi bi-instagram' }
];

function createSocials() {
    const socialLinksContainer = document.getElementById('social-links');
    if (!socialLinksContainer) {
        console.log('Social links container not found');
        return 0;
    } else {
        console.log('Social links container found');
    };

    socialLinks.forEach(link => {
        console.log(`Adding ${link.name} link to social links container`);
        socialLinksContainer.innerHTML += `
            <a href="${link.url}" target="_blank" class="text-secondary">
            <i class="${link.icon} fs-4"></i>
            </a>`;
    });
    return 1;
}

/* Theme utilities */
function setTheme(theme) {
  if (!theme) return;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
  updateThemeToggleUI(theme);
}

function initThemeFromStorage() {
  const saved = (() => { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  const initial = saved || 'dark'; // default to dark as requested
  setTheme(initial);
}

function updateThemeToggleUI(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  // Inline SVGs (fill uses currentColor so CSS controls color)
  const SUN_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.04 2.05l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 13h3v-2h-3v2zM12 7a5 5 0 100 10 5 5 0 000-10zm4.24 9.16l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM6.76 19.16l-1.79 1.79 1.79 1.79 1.79-1.79-1.79-1.79zM12 23h2v-3h-2v3z"/></svg>';
  const MOON_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  if (theme === 'dark') {
    btn.innerHTML = SUN_SVG;
    btn.setAttribute('aria-pressed', 'true');
    btn.title = 'Switch to light mode';
  } else {
    btn.innerHTML = MOON_SVG;
    btn.setAttribute('aria-pressed', 'false');
    btn.title = 'Switch to dark mode';
  }
}
  