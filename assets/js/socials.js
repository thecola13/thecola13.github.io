const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/thecola13', icon: 'bi bi-github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/luca-colaci-438837223/', icon: 'bi bi-linkedin' },
    { name: 'Instagram', url: 'https://www.instagram.com/the.cola/', icon: 'bi bi-instagram' }
];
  
const socialLinksContainer = document.getElementById('social-links');
if (!socialLinksContainer) {
    console.error('Social links container not found');
    return;
};

socialLinks.forEach(link => {
    socialLinksContainer.innerHTML += `
        <a href="${link.url}" target="_blank" class="text-secondary">
        <i class="${link.icon} fs-4"></i>
        </a>`;
});