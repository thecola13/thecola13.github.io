fetch('data/projects.json')
  .then(response => response.json())
  .then(data => {
    const projects = document.getElementById('projects');

    data.forEach(project => {
      const buttons = project.buttons.map(button => `
        <a href="${button.link}" class="btn btn-success btn-sm" target="_blank">${button.text}</a>`).join('');

      const description = project.description.length > 100 ? 
        `${project.description.substring(0, 100)}<span class="dots">...</span><span class="more" style="display: none;">${project.description.substring(100)}</span><button class="show-more btn btn-link btn-sm">Show more</button>` : 
        project.description;

      projects.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="blur-card p-4 shadow-lg">
            <img src="${project.image}" alt="${project.title}" class="img-fluid mb-3 project-image">
            <h5>${project.title}</h5>
            <p class="project-description">${description}</p>
            <div>${buttons}</div>
          </div>
        </div>`;
    });

    document.querySelectorAll('.show-more').forEach(button => {
      button.addEventListener('click', function() {
        const dots = this.previousElementSibling.previousElementSibling;
        const moreText = this.previousElementSibling;
        if (dots.style.display === "none") {
          dots.style.display = "inline";
          this.innerHTML = "Show more";
          moreText.style.display = "none";
        } else {
          dots.style.display = "none";
          this.innerHTML = "Show less";
          moreText.style.display = "inline";
        }
      });
    });
  });