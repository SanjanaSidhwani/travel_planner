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

// Modal functionality
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Ensure modal is properly centered
    setTimeout(() => {
        const modalContainer = modal.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.style.margin = 'auto';
        }
    }, 10);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginModal();
            }
        });
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLoginModal();
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput && toggleBtn) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleBtn.className = 'fas fa-eye';
        }
    }
}

// Show signup message
function showSignupMessage() {
    // Create a beautiful notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-user-plus"></i>
            <span>Signup feature coming soon! 🚀</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Get stored users
            const users = JSON.parse(localStorage.getItem('travelPlannerUsers') || '[]');
            
            // Find user with matching credentials
            const user = users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );
            
            if (user) {
                // Create session
                const session = {
                    user: {
                        id: user.id,
                        fullName: user.fullName || (user.firstName + ' ' + (user.lastName || '')),
                        email: user.email
                    },
                    loginTime: Date.now(),
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                    rememberMe: rememberMe
                };
                
                localStorage.setItem('travelPlannerAuth', JSON.stringify(session));
                
                // Close modal and show success
                closeLoginModal();
                
                // Show success message using auth-shared notification
                if (typeof showNotification === 'function') {
                    showNotification('Login successful! Welcome back!', 'success');
                } else {
                    // Fallback notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                        padding: 1rem 1.5rem;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
                        z-index: 10001;
                        animation: slideInRight 0.3s ease;
                        font-weight: 500;
                        max-width: 300px;
                    `;
                    
                    notification.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-check-circle"></i>
                            <span>Welcome back! Login successful 🎉</span>
                        </div>
                    `;
                    
                    document.body.appendChild(notification);
                    
                    // Remove notification
                    setTimeout(() => {
                        notification.style.animation = 'slideOutRight 0.3s ease';
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                document.body.removeChild(notification);
                            }
                        }, 300);
                    }, 3000);
                }
                
                // Reset form
                loginForm.reset();
                
                // Reload page to update navbar
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                // Show error message
                if (typeof showNotification === 'function') {
                    showNotification('Invalid email or password. Please try again.', 'error');
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            }
        });
    }
});