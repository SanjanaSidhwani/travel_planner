// Simple countdown for Next Trip
const countdownElement = document.getElementById("countdown");

// Set next trip date (example: 20 days from now)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 20);

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownElement.textContent = "Trip Started!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  countdownElement.textContent = days + " days left";
}

updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60); // update hourly
