// Function to create and animate a flashing dot with a ripple effect
function createFlashingDot() {
    // Define possible colors
    const colors = ['blue', 'yellow', 'green', 'purple', 'red'];

    // Create a new dot element
    const dot = document.createElement('div');
    dot.classList.add('flashing-dot');

    // Assign a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    dot.style.backgroundColor = randomColor;

    // Randomize position within the viewport
    const randomX = Math.random() * (window.innerWidth - 40); // Ensure dot stays within the viewport
    const randomY = Math.random() * (window.innerHeight - 40); // Ensure dot stays within the viewport
    dot.style.left = `${randomX}px`;
    dot.style.top = `${randomY}px`;

    // Append the dot to the body
    document.body.appendChild(dot);

    // Create ripple effects
    createRipple(dot, randomColor);
    createRipple(dot, randomColor, true); // Second ripple with stronger glow

    // Remove the dot after the animation ends (4 seconds)
    setTimeout(() => {
        dot.remove();
    }, 4000);
}

// Function to create a ripple effect
function createRipple(dot, color, isSecondRipple = false) {
    // Create a ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.borderColor = color;

    // If it's the second ripple, make it larger and glow more
    if (isSecondRipple) {
        ripple.classList.add('ripple-strong');
    }

    // Position the ripple at the center of the dot
    const dotRect = dot.getBoundingClientRect();
    ripple.style.left = `${dotRect.left + dotRect.width / 2}px`;
    ripple.style.top = `${dotRect.top + dotRect.height / 2}px`;

    // Append the ripple to the body
    document.body.appendChild(ripple);

    // Remove the ripple after the animation ends (4 seconds)
    setTimeout(() => {
        ripple.remove();
    }, 4000);
}

// Function to trigger dots at random intervals (~1 second)
function startFlashingDots() {
    setInterval(() => {
        createFlashingDot();
    }, Math.random() * 1000 + 1000); // Random interval between 1-2 seconds
}

// Start the flashing dots
startFlashingDots();

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try { 
        const response = await fetch('http://localhost:3000/login', {
            method : 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        console.log('Response data:', data); //scoate ma ten gura
        if (response.ok) {
            window.location.href = `http://localhost:3000${data.redirect}`;
        } else {
            alert('YA LA MUIE')
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});