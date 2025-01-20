document.addEventListener('DOMContentLoaded', function () {
    function updateTimeline() {
      const delayIncrement = 50;
      let delay = 0;
  
      fetch("data/timeline.json")
        .then(response => response.json())
        .then(data => {
          const timelineContainer = document.getElementById('timeline');
  
          timelineContainer.innerHTML = '';
  
          const chronologicalEvents = data['timeline'];
  
          chronologicalEvents.forEach((event, index) => {
            const { date, title, description } = event;
  
            const timelineHTML = `
              <div class="timeline-event" data-aos="fade-in" data-aos-delay="${delay}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-date">${date}</div>
                  <div class="timeline-title">${title}</div>
                  <div class="timeline-description">${description}</div>
                </div>
              </div>
            `;
  
            timelineContainer.innerHTML += timelineHTML;
  
            delay += delayIncrement;
          });
  
          // Adjust timeline bar height dynamically
          const timeline = document.getElementById('timeline');
          const lastEvent = document.querySelector('.timeline-event:last-child');
          const timelineBar = timeline.querySelector(':before');
  
          if (lastEvent && timelineBar) {
            const timelineTop = timeline.getBoundingClientRect().top;
            const lastEventBottom = lastEvent.getBoundingClientRect().bottom;
            timeline.style.setProperty('--timeline-height', `${lastEventBottom - timelineTop}px`);
          }
  
          console.log('Timeline updated successfully');
        })
        .catch(error => console.error('Error fetching timeline data:', error));
    }
  
    updateTimeline();
  });
  