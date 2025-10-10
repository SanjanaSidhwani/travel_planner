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
        
        if (userNameElement && session.user) {
          userNameElement.textContent = session.user.firstName || 'User';
        }
        
        // Add logout functionality
        if (logoutBtn) {
          logoutBtn.addEventListener('click', logout);
        }
      } else {
        // Session expired, clear storage
        localStorage.removeItem('travelPlannerAuth');
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      localStorage.removeItem('travelPlannerAuth');
    }
  }
}

function logout() {
  localStorage.removeItem('travelPlannerAuth');
  window.location.href = '../AUTH/index.html';
}

// Start countdown and check auth when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  initializeAuth();
  initializeParallaxEffect();
});

// Optimized parallax scrolling effect
function initializeParallaxEffect() {
  const shapes = document.querySelectorAll('.floating-shape');
  const destinations = document.querySelector('.destinations');
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const scrollPercent = Math.min(1, scrolled / window.innerHeight);
    
    // Simple parallax for floating shapes (reduce frequency)
    if (scrolled % 5 === 0) { // Only update every 5px of scroll
      shapes.forEach((shape, index) => {
        const speed = 0.05 + (index * 0.02); // Much slower speeds
        const yPos = scrolled * speed;
        
        shape.style.transform = `translateY(${yPos}px) translateZ(0)`;
      });
    }

    // Dynamic opacity for destinations overlay
    if (destinations) {
      const opacity = Math.max(0.7, 1 - (scrollPercent * 0.2));
      destinations.style.setProperty('--bg-opacity', opacity);
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Passive scroll event with reduced frequency
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(requestTick, 16); // ~60fps limit
  }, { passive: true });

  // Simplified mouse movement (only on mousemove, not combined with scroll)
  let mouseTimeout;
  document.addEventListener('mousemove', (e) => {
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach((shape, index) => {
        const speed = 2 + index; // Very subtle movement
        const x = mouseX * speed;
        const y = mouseY * speed;
        
        shape.style.setProperty('--mouse-x', `${x}px`);
        shape.style.setProperty('--mouse-y', `${y}px`);
      });
    }, 32); // Limit to ~30fps for mouse
  }, { passive: true });
}
