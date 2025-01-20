fetch('data/projects.json')
  .then(response => response.json())
  .then(data => {
    const projects = document.getElementById('projects');

    data.forEach(project => {
      const buttons = project.buttons.map(button => `
        <a href="${button.link}" class="btn btn-success btn-sm" target="_blank">${button.text}</a>`).join('');

      projects.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="blur-card p-4 shadow-lg">
            <img src="${project.image}" alt="${project.title}" class="img-fluid mb-3">
            <h5>${project.title}</h5>
            <p>${project.description}</p>
            <div>${buttons}</div>
          </div>
        </div>`;
    });
  });