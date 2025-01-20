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
      });
  });
  