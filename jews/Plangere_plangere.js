document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const colorMap = {
      0: 'red',
      1: 'blue',
      2: 'yellow',
      3: 'purpel',
      4: 'green',
      5: 'black',
      6: 'white',
      7: 'pink',
      8: 'orange'
    };
  
    // 1. Add color class to current user comments if possible
    const currentUsername = localStorage.getItem('userName');
    const selectedColorIndex = localStorage.getItem('selectedColorIndex');
  
    if (currentUsername && selectedColorIndex !== null) {
      const colorClass = colorMap[parseInt(selectedColorIndex)];
      document.querySelectorAll('.comment-user').forEach(userEl => {
        if (userEl.textContent.includes(currentUsername)) {
          userEl.classList.add(`color-${colorClass}`);
        }
      });
    }
  
    // 2. Handle form submission via fetch
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
  
        const content = form.querySelector('textarea[name="content"]').value.trim();
        const username = localStorage.getItem('userName');
        const selectedColorIndex = localStorage.getItem('selectedColorIndex');
  
        if (!content || !username || selectedColorIndex === null) {
          alert("Comentariu invalid sau utilizator necunoscut.");
          return;
        }
  
        const itemId = window.location.pathname.split('/')[3]; // plangere ID
  
        try {
          const response = await fetch(`/crocoanonim/plangeri/${itemId}/comentarii`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content,
              username,
              culoare: parseInt(selectedColorIndex)
            })
          });
  
          if (response.ok) {
            location.reload(); // Show the new comment
          } else {
            const err = await response.text();
            alert("Eroare la trimiterea comentariului:\n" + err);
          }
        } catch (error) {
          console.error("Eroare:", error);
          alert("A apărut o eroare.");
        }
      });
    }
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