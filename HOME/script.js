// Simple countdown for Next Trip
const countdownElement = document.getElementById("countdown");

// Set next trip date (example: 20 days from now)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 20);

function updateCountdown() {
  // Set the target date (example: 7 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  // Update countdown every second
  setInterval(() => {
    const currentDate = new Date();
    const difference = targetDate - currentDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  }, 1000);
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', updateCountdown);
