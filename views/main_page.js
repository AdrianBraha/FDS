document.querySelectorAll(".nav-links button").forEach(button => {
    button.addEventListener("click", () => {
      const department = button.textContent.trim(); 
      const url = `/crocoanonim/${department}`;
      window.location.href = url; 
    });
  });
  const colorIds = [
    "red_label",
    "blue_label",
    "yellow_label",
    "purpel_label",
    "green_label",
    "black_label",
    "white_label",
    "pink_label",
    "orange_label"
  ];

  window.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("username");

    let userName = localStorage.getItem("userName");
    let selectedColorIndex = localStorage.getItem("selectedColorIndex");

    // If no data, generate
    if (!userName) {
      const randomNumber = Math.floor(Math.random() * 10000) + 1;
      userName = `SiSCot_Anonim_${randomNumber}`;
      localStorage.setItem("userName", userName);
    }

    if (selectedColorIndex === null) {
      selectedColorIndex = Math.floor(Math.random() * colorIds.length);
      localStorage.setItem("selectedColorIndex", selectedColorIndex);
    }

    // Set values in DOM
    nameInput.value = userName;
    const colorId = colorIds[parseInt(selectedColorIndex)];
    const input = document.getElementById(colorId);
    if (input) input.checked = true;
  });

  document.getElementById("save").addEventListener("click", () => {
    const name = document.getElementById("username").value.trim();
    let selectedColorIndex = -1;

    colorIds.forEach((id, index) => {
      const input = document.getElementById(id);
      if (input && input.checked) {
        selectedColorIndex = index;
      }
    });

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (selectedColorIndex === -1) {
      alert("Please select a color.");
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("selectedColorIndex", selectedColorIndex);
    alert("Preferences saved!");
  });