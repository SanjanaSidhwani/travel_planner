/**
 * SHARED AUTHENTICATION SCRIPT
 * ============================
 * This script handles user authentication state across all pages
 * - Checks if user is logged in
 * - Updates navbar to show username instead of login button
 * - Handles logout functionality
 */

// Authentication configuration
const AUTH_CONFIG = {
    STORAGE_KEY: 'travelPlannerAuth',
    SESSION_DURATION: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Gets the current user session from localStorage
 * @returns {Object|null} - User session object or null if not logged in
 */
function getCurrentSession() {
    try {
        const sessionData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        if (!sessionData) return null;
        
        const session = JSON.parse(sessionData);
        
        // Check if session is expired (unless remember me is true)
        if (Date.now() > session.expiresAt && !session.rememberMe) {
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Error reading session data:', error);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        return null;
    }
}

/**
 * Checks if user is currently logged in
 * @returns {boolean} - True if user is logged in
 */
function isUserLoggedIn() {
    const session = getCurrentSession();
    return session !== null;
}

/**
 * Gets the current user's information
 * @returns {Object|null} - User object or null if not logged in
 */
function getCurrentUser() {
    const session = getCurrentSession();
    return session ? session.user : null;
}

/**
 * Logs out the current user
 */
function logout() {
    // Remove session data
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    
    // Clear trip data when logging out
    localStorage.removeItem('nextTrip');
    localStorage.removeItem('advancedTripItinerary');
    
    // Clear trip countdown directly if the function exists (for HOME page)
    if (typeof clearTripOnLogout === 'function') {
        try {
            clearTripOnLogout();
        } catch (error) {
            console.log('Trip clearing function not available on this page');
        }
    }
    
    // Show logout message
    showNotification('You have been logged out successfully', 'info');
    
    // Update UI immediately
    updateNavbarForLoggedOutUser();
    
    // Trigger storage events to notify other components about trip data clearing
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'nextTrip',
        newValue: null,
        storageArea: localStorage
    }));
    
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'advancedTripItinerary',
        newValue: null,
        storageArea: localStorage
    }));
    
    // Trigger auth storage event to notify components about logout
    window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_CONFIG.STORAGE_KEY,
        newValue: null,
        storageArea: localStorage
    }));
    
    // Optional: Redirect to home page after a short delay
    setTimeout(() => {
        if (window.location.pathname.includes('/AUTH/')) {
            // If on auth page, redirect to home
            window.location.href = '../HOME/index.html';
        } else {
            // Just reload the current page to reset state
            window.location.reload();
        }
    }, 1500);
}

/**
 * Updates the navbar to show the logged-in user's name
 * @param {Object} user - User object
 */
function updateNavbarForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    
    if (loginBtn) {
        // Create user menu container
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <button class="user-menu-btn" onclick="toggleUserDropdown()">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${user.fullName || user.firstName || 'User'}</span>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            <div class="user-dropdown hidden" id="user-dropdown">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <p class="user-fullname">${user.fullName || (user.firstName + ' ' + (user.lastName || ''))}</p>
                        <p class="user-email">${user.email}</p>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="dropdown-item" onclick="viewProfile()">
                        <i class="fas fa-user"></i>
                        Profile
                    </button>
                    <button class="dropdown-item" onclick="viewTrips()">
                        <i class="fas fa-suitcase"></i>
                        My Trips
                    </button>
                    <button class="dropdown-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        `;
        
        // Replace login button with user menu
        loginBtn.parentNode.replaceChild(userMenu, loginBtn);
        
        console.log('Navbar updated for logged-in user:', user.fullName || user.firstName);
    }
}

/**
 * Updates the navbar to show the login button (logged out state)
 */
function updateNavbarForLoggedOutUser() {
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu) {
        // Create login button
        const loginBtn = document.createElement('button');
        loginBtn.className = 'login-btn';
        if (typeof openLoginModal === 'function') {
            loginBtn.onclick = openLoginModal;
        } else {
            loginBtn.onclick = () => window.location.href = '../AUTH/index.html';
        }
        loginBtn.innerHTML = 'LOGIN';
        
        // Replace user menu with login button
        userMenu.parentNode.replaceChild(loginBtn, userMenu);
        
        console.log('Navbar updated for logged-out user');
    }
}

/**
 * Toggles the user dropdown menu
 */
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

/**
 * Placeholder function for profile view
 */
function viewProfile() {
    showNotification('Profile page coming soon!', 'info');
    toggleUserDropdown();
}

/**
 * Placeholder function for trips view
 */
function viewTrips() {
    showNotification('My Trips page coming soon!', 'info');
    toggleUserDropdown();
}

/**
 * Shows a notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

/**
 * Closes a notification
 * @param {HTMLElement} button - Close button element
 */
function closeNotification(button) {
    const notification = button.closest('.auth-notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

/**
 * Gets the appropriate icon for notification type
 * @param {string} type - Notification type
 * @returns {string} - FontAwesome icon class
 */
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

/**
 * Gets the appropriate color for notification type
 * @param {string} type - Notification type
 * @returns {string} - CSS color value
 */
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

/**
 * Closes user dropdown when clicking outside
 */
function setupDropdownCloseOnClickOutside() {
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.getElementById('user-dropdown');
        
        if (userMenu && dropdown && !userMenu.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

/**
 * Handles login form submission across all pages
 */
function setupLoginFormHandler() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        // Remove any existing event listeners to prevent duplicates
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * Handles the login form submission
 */
function handleLogin(e) {
    e.preventDefault();
    
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
        
        // Close modal if closeLoginModal function exists
        if (typeof closeLoginModal === 'function') {
            closeLoginModal();
        }
        
        // Show success message
        showNotification('Login successful! Welcome back!', 'success');
        
        // Reload page to update navbar
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } else {
        // Show error message
        showNotification('Invalid email or password. Please try again.', 'error');
    }
}

/**
 * Initialize authentication and form handlers
 */
function initializeAuth() {
    const session = getCurrentSession();
    
    if (session && session.user) {
        // User is logged in - update navbar
        updateNavbarForLoggedInUser(session.user);
        console.log('User authenticated:', session.user.fullName || session.user.firstName);
    } else {
        // User is not logged in - ensure login button is shown
        updateNavbarForLoggedOutUser();
        console.log('User not authenticated');
    }
    
    // Setup login form handler
    setupLoginFormHandler();
    
    // Setup dropdown close functionality
    setupDropdownCloseOnClickOutside();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts have loaded
    setTimeout(initializeAuth, 100);
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    // DOM is already loaded
    setTimeout(initializeAuth, 100);
}

// Make functions globally available
window.logout = logout;
window.toggleUserDropdown = toggleUserDropdown;
window.viewProfile = viewProfile;
window.viewTrips = viewTrips;
window.closeNotification = closeNotification;
window.isUserLoggedIn = isUserLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getCurrentSession = getCurrentSession;