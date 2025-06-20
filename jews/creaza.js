document.addEventListener('DOMContentLoaded', function() {
  const descriere = document.getElementById('descriere');
  const descriereCounter = document.getElementById('descriereCounter');
  const privateCheckbox = document.getElementById('private');

  descriere.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    descriereCounter.textContent = this.value.length;
  });

  document.getElementById('titlu').addEventListener('input', function() {
    document.getElementById('titluCounter').textContent = this.value.length;
  });

  document.getElementById('scurta_descriere').addEventListener('input', function() {
    document.getElementById('scurtaCounter').textContent = this.value.length;
  });

  if (privateCheckbox) {
    privateCheckbox.addEventListener('change', function() {
      if (this.checked) {
        alert(
          "Dacă selectezi ca plângerea ta să fie privată, doar directorul poate să o vadă, " +
          "iar ca și tu să poți să o mai găsești trebuie să salvezi URL-ul. " +
          "După ce te loghezi îl vei putea accesa."
        );
      }
    });
  }

  document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const titlu = document.getElementById('titlu').value.trim();
    const scurta_descriere = document.getElementById('scurta_descriere').value.trim();
    const descriere = document.getElementById('descriere').value.trim();
    const isPrivate = privateCheckbox ? privateCheckbox.checked : false;

    try {
      const response = await fetch('/crocoanonim/creazaplangere', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          titlu,
          scurta_descriere,
          descriere,
          isPrivate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la trimiterea datelor');
      }

      const data = await response.json();

      if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        alert('Eroare: ' + data.message);
      }
    } catch (error) {
      alert('Eroare: ' + (error.message || 'A apărut o eroare'));
      console.error(error);
    }
  });
});
