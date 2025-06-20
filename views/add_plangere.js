document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.POST').forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          const itemId = this.getAttribute('data-id');
          if (itemId) {
              window.location.href = `/crocoanonim/Plangere/${itemId}`;
          }
      });
  });
});
document.getElementsByClassName('creaza')[0].addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '/crocoanonim/creazaPlangere';
});

document.querySelectorAll(".nav-links button").forEach(button => {
  button.addEventListener("click", () => {
    const department = button.textContent.trim(); 
    const url = `/crocoanonim/${department}`;
    window.location.href = url; 
  });
});
document.querySelectorAll(".logo").forEach(button => {
  button.addEventListener("click", () => {
    const department = button.textContent.trim(); 
    const url = `/crocoanonim/home`;
    window.location.href = url; 
  });
});