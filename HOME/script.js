// Enhanced Trip Countdown System
class TripCountdown {
    constructor() {
        this.countdownInterval = null;
        this.init();
    }

    init() {
        this.startCountdown();
        // Update countdown every second
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    // Get the next trip from localStorage
    getNextTrip() {
        try {
            // Check for trip data from itinerary page
            const itineraryData = localStorage.getItem('advancedTripItinerary');
            if (itineraryData) {
                const trip = JSON.parse(itineraryData);
                if (trip && trip.startDate) {
                    return {
                        date: new Date(trip.startDate),
                        name: trip.name || 'Your Trip'
                    };
                }
            }

            // Check for other trip storage formats
            const tripData = localStorage.getItem('nextTrip');
            if (tripData) {
                const trip = JSON.parse(tripData);
                return {
                    date: new Date(trip.date),
                    name: trip.name || 'Your Trip'
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting trip data:', error);
            return null;
        }
    }

    // Set a new trip countdown
    setTrip(tripDate, tripName = 'Your Trip') {
        const tripData = {
            date: tripDate.toISOString(),
            name: tripName,
            setAt: new Date().toISOString()
        };
        localStorage.setItem('nextTrip', JSON.stringify(tripData));
        this.updateCountdown();
    }

    // Clear the current trip
    clearTrip() {
        localStorage.removeItem('nextTrip');
        localStorage.removeItem('advancedTripItinerary');
        this.updateCountdown();
    }

    updateCountdown() {
        const nextTrip = this.getNextTrip();
        
        if (!nextTrip) {
            // No trip set - show zeros
            this.displayCountdown(0, 0, 0);
            this.updateTripStatus('No trip planned');
            return;
        }

        const now = new Date();
        const tripDate = nextTrip.date;
        const difference = tripDate - now;

        if (difference <= 0) {
            // Trip date has passed
            this.displayCountdown(0, 0, 0);
            this.updateTripStatus('Trip time has arrived! 🎉');
            return;
        }

        // Calculate time remaining
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        this.displayCountdown(days, hours, minutes);
        this.updateTripStatus(`Next trip: ${nextTrip.name}`);
    }

    displayCountdown(days, hours, minutes) {
        // Update countdown display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');

        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    }

    updateTripStatus(status) {
        const statusElement = document.getElementById('trip-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    startCountdown() {
        this.updateCountdown();
    }

    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}

// Global countdown instance
let tripCountdown;

// Helper functions for trip management
function clearCurrentTrip() {
    if (tripCountdown) {
        tripCountdown.clearTrip();
    }
    document.querySelector('.clear-trip-btn').style.display = 'none';
    showNotification('Trip cleared successfully!', 'success');
}

// Handle Plan a Trip button click with authentication check
function handlePlanTripClick() {
    // Check if user is logged in using auth-shared.js function
    if (typeof isUserLoggedIn === 'function' && isUserLoggedIn()) {
        // User is authenticated, redirect to itinerary
        window.location.href = '../ITINERARY/index.html';
        return;
    }
    
    // Fallback: Check localStorage directly if auth-shared.js functions aren't available yet
    try {
        const authData = localStorage.getItem('travelPlannerAuth');
        if (authData) {
            const session = JSON.parse(authData);
            // Check if session is still valid
            if (Date.now() < session.expiresAt || session.rememberMe) {
                // User is authenticated, redirect to itinerary
                window.location.href = '../ITINERARY/index.html';
                return;
            }
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
    
    // User is not authenticated, show login modal
    showNotification('Please log in to plan your trip', 'info');
    
    // Check if openLoginModal function exists, otherwise redirect to auth page
    if (typeof openLoginModal === 'function') {
        openLoginModal();
    } else {
        window.location.href = '../AUTH/index.html';
    }
}

function setTestTrip() {
    // For testing - set a trip 5 days from now
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 5);
    testDate.setHours(14, 30, 0, 0); // 2:30 PM
    
    if (tripCountdown) {
        tripCountdown.setTrip(testDate, 'Test Trip to Paris');
    }
    document.querySelector('.clear-trip-btn').style.display = 'inline-block';
    showNotification('Test trip set for 5 days from now!', 'success');
}

// Listen for trip updates from other pages
window.addEventListener('storage', function(e) {
    if (e.key === 'advancedTripItinerary' || e.key === 'nextTrip') {
        if (tripCountdown) {
            tripCountdown.updateCountdown();
        }
        // Update clear button visibility
        setTimeout(checkExistingTrip, 100);
    }
});

// Check if there's already a trip and show clear button
function checkExistingTrip() {
    const trip = tripCountdown?.getNextTrip();
    const clearBtn = document.querySelector('.clear-trip-btn');
    if (clearBtn) {
        if (trip) {
            clearBtn.style.display = 'inline-block';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

// Helper notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    // Set color based on type
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        info: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
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

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', () => {
  tripCountdown = new TripCountdown();
  
  // Check for existing trip after a short delay
  setTimeout(checkExistingTrip, 1000);
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