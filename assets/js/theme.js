(function () {
  const KEY = 'theme';
  const getSystem = () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const saved = localStorage.getItem(KEY);
  const theme = saved || getSystem();
  document.documentElement.setAttribute('data-bs-theme', theme);

  // keep browser UIs in sync
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
  meta.content = theme === 'dark' ? '#0b0f14' : '#ffffff';

  // Expose setter
  window.__setTheme = (next) => {
    document.documentElement.setAttribute('data-bs-theme', next);
    localStorage.setItem(KEY, next);
    meta.content = next === 'dark' ? '#0b0f14' : '#ffffff';
    const sw = document.getElementById('themeSwitch');
    if (sw) sw.checked = (next === 'dark');

    // Update the single theme icon (if present)
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.classList.remove('bi-sun', 'bi-moon-stars');
      icon.classList.add(next === 'dark' ? 'bi-moon-stars' : 'bi-sun');
    }
  };

  // Allow external scripts to refresh the icon based on current theme
  window.__refreshThemeIcon = () => {
    const cur = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.classList.remove('bi-sun', 'bi-moon-stars');
      icon.classList.add(cur === 'dark' ? 'bi-moon-stars' : 'bi-sun');
    }
  };

  // Wire the switch when DOM is ready
  addEventListener('DOMContentLoaded', () => {
    const sw = document.getElementById('themeSwitch');
    if (sw) {
      sw.checked = (document.documentElement.getAttribute('data-bs-theme') === 'dark');
      sw.addEventListener('change', () => {
        const next = sw.checked ? 'dark' : 'light';
        window.__setTheme(next);
      });
      // ensure the icon is correct on load
      if (window.__refreshThemeIcon) window.__refreshThemeIcon();
    }
  });
})();
