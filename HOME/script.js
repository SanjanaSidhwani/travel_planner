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

    if (document.getElementById('days')) {
      document.getElementById('days').textContent = String(days).padStart(2, '0');
    }
    if (document.getElementById('hours')) {
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    }
    if (document.getElementById('minutes')) {
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    }
  }, 1000);
}

// Authentication check and UI update
function initializeAuth() {
  const authData = localStorage.getItem('travelPlannerAuth');
  const authSection = document.getElementById('auth-section');
  const userSection = document.getElementById('user-section');
  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');

  if (authData) {
    try {
      const session = JSON.parse(authData);
      
      // Check if session is still valid
      if (Date.now() < session.expiresAt || session.rememberMe) {
        // Show user section, hide auth section
        if (authSection) authSection.classList.add('hidden');
        if (userSection) userSection.classList.remove('hidden');
        
        // Update user name display
        if (userNameElement) {
          userNameElement.textContent = session.userName || 'User';
        }
        
        console.log('User session restored:', session.userName);
      } else {
        // Session expired, clean up
        localStorage.removeItem('travelPlannerAuth');
        console.log('Session expired, cleared');
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      localStorage.removeItem('travelPlannerAuth');
    }
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('travelPlannerAuth');
      if (authSection) authSection.classList.remove('hidden');
      if (userSection) userSection.classList.add('hidden');
      console.log('User logged out');
      
      // Redirect to auth page
      window.location.href = '../AUTH/index.html';
    });
  }
}

// Start countdown and check auth when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  initializeAuth();
});