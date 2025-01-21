fetch('data/timeline.json')
    .then(response => response.json())
    .then(data => {
        const timeline = document.getElementById('timeline');
        data.forEach((event, index) => {
            const container = document.createElement('div');
            container.className = `timeline-container ${index % 2 === 0 ? 'container-left' : 'container-right'}`;
            const content = document.createElement('div');
            content.className = 'content shadow-lg blur-card';
            content.innerHTML = `<h5>${event.date}</h5><h2>${event.title}</h2><p>${event.description}</p>`;
            container.appendChild(content);
            timeline.appendChild(container);
        });
    })
    .catch(error => console.error('Error fetching timeline data:', error));