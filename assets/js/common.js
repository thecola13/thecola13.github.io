// Mark active nav link based on current path
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if ((here === '' && href === 'index.html') || here === href) a.classList.add('active');
    if (here === '' && href === 'index.html') a.setAttribute('aria-current', 'page');
    if (here === href) a.setAttribute('aria-current', 'page');
  });
});
