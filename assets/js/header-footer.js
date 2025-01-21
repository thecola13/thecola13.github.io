document.addEventListener('DOMContentLoaded', function () {
    // Load header
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').innerHTML = data;
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
  