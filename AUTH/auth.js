/**
 * ====================================
 * TRAVEL PLANNER - AUTHENTICATION SYSTEM
 * Modern Login & Signup with Local Storage
 * ====================================
 */

// --- Configuration ---
const AUTH_CONFIG = {
    STORAGE_KEY: 'travelPlannerAuth',
    USERS_KEY: 'travelPlannerUsers',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    MIN_PASSWORD_LENGTH: 8
};

// --- Authentication Manager Class ---
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initPasswordStrength();
        this.initPasswordMatch();
    }

    // --- Event Binding ---
    bindEvents() {
        // Form submissions
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form')?.addEventListener('submit', (e) => this.handleSignup(e));
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
        
        // Password strength checking
        const signupPassword = document.getElementById('signup-password');
        if (signupPassword) {
            signupPassword.addEventListener('input', () => this.updatePasswordStrength());
        }
        
        // Password matching
        const confirmPassword = document.getElementById('signup-confirm-password');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.checkPasswordMatch());
        }
    }

    // --- Form Switching ---
    switchToSignup() {
        const loginContainer = document.getElementById('login-container');
        const signupContainer = document.getElementById('signup-container');
        
        if (loginContainer && signupContainer) {
            loginContainer.classList.add('hidden');
            signupContainer.classList.remove('hidden');
            
            // Clear any existing animations
            signupContainer.classList.remove('slide-in');
            
            // Trigger animation after a small delay
            setTimeout(() => {
                signupContainer.classList.add('slide-in');
            }, 10);
        }
    }

    switchToLogin() {
        const loginContainer = document.getElementById('login-container');
        const signupContainer = document.getElementById('signup-container');
        
        if (loginContainer && signupContainer) {
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            
            // Clear any existing animations
            loginContainer.classList.remove('slide-in');
            
            // Trigger animation after a small delay
            setTimeout(() => {
                loginContainer.classList.add('slide-in');
            }, 10);
        }
    }

    // --- Password Utilities ---
    initPasswordStrength() {
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        }
    }

    updatePasswordStrength() {
        const password = document.getElementById('signup-password').value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);
        
        // Remove existing classes
        strengthBar.classList.remove('weak', 'medium', 'strong');
        
        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
            return;
        }

        switch (strength.level) {
            case 1:
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
                strengthText.style.color = 'var(--error-color)';
                break;
            case 2:
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium password';
                strengthText.style.color = 'var(--warning-color)';
                break;
            case 3:
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
                strengthText.style.color = 'var(--success-color)';
                break;
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= AUTH_CONFIG.MIN_PASSWORD_LENGTH,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.values(checks).forEach(check => {
            if (check) score++;
        });

        let level = 1;
        if (score >= 3) level = 2;
        if (score >= 4) level = 3;

        return { score, level, checks };
    }

    initPasswordMatch() {
        const confirmInput = document.getElementById('signup-confirm-password');
        if (confirmInput) {
            confirmInput.addEventListener('input', () => this.checkPasswordMatch());
        }
    }

    checkPasswordMatch() {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const icon = document.getElementById('password-match-icon');
        
        if (!icon || !confirmPassword) return;

        if (password === confirmPassword && confirmPassword.length > 0) {
            icon.classList.remove('invalid');
            icon.classList.add('valid');
        } else if (confirmPassword.length > 0) {
            icon.classList.remove('valid');
            icon.classList.add('invalid');
        } else {
            icon.classList.remove('valid', 'invalid');
        }
    }

    // --- Authentication Logic ---
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API delay
            await this.delay(1000);
            
            const user = this.validateUser(email, password);
            
            if (user) {
                this.loginUser(user, rememberMe);
                this.showNotification('Welcome back! Redirecting...', 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = '../HOME/index.html';
                }, 1500);
            } else {
                throw new Error('Invalid email or password');
            }
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleSignup(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validation
        const validation = this.validateSignupData(userData);
        if (!validation.isValid) {
            this.showNotification(validation.message, 'error');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API delay
            await this.delay(1500);
            
            const newUser = this.createUser(userData);
            this.loginUser(newUser, false);
            
            this.showNotification('Account created successfully! Welcome aboard!', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '../HOME/index.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    handleSocialLogin(event) {
        const provider = event.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
        
        this.showNotification(`${provider} login will be available soon!`, 'info');
        
        // In a real app, this would redirect to OAuth provider
        console.log(`Social login with ${provider} clicked`);
    }

    // --- User Management ---
    validateUser(email, password) {
        const users = this.getStoredUsers();
        return users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    validateSignupData(userData) {
        // Check required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            return { isValid: false, message: 'All fields are required' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }

        // Password validation
        const passwordStrength = this.calculatePasswordStrength(userData.password);
        if (passwordStrength.level < 2) {
            return { isValid: false, message: 'Password is too weak. Please choose a stronger password.' };
        }

        // Password confirmation
        if (userData.password !== userData.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }

        // Check if user already exists
        const existingUser = this.getStoredUsers().find(user => 
            user.email.toLowerCase() === userData.email.toLowerCase()
        );
        
        if (existingUser) {
            return { isValid: false, message: 'An account with this email already exists' };
        }

        return { isValid: true };
    }

    createUser(userData) {
        const users = this.getStoredUsers();
        
        const newUser = {
            id: this.generateUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            password: userData.password, // In production, this should be hashed
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(users));
        
        return newUser;
    }

    loginUser(user, rememberMe = false) {
        // Update last login
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(users));
        }

        // Create session
        const session = {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            loginTime: Date.now(),
            expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION,
            rememberMe: rememberMe
        };

        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(session));
        this.currentUser = session.user;
    }

    logout() {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        this.currentUser = null;
        window.location.href = '../AUTH/index.html';
    }

    checkAuthStatus() {
        const session = this.getStoredSession();
        
        if (session) {
            if (Date.now() > session.expiresAt && !session.rememberMe) {
                this.logout();
                return false;
            }
            
            this.currentUser = session.user;
            return true;
        }
        
        return false;
    }

    // --- Storage Utilities ---
    getStoredUsers() {
        try {
            const users = localStorage.getItem(AUTH_CONFIG.USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    getStoredSession() {
        try {
            const session = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error('Error loading session:', error);
            return null;
        }
    }

    // --- Utility Methods ---
    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setLoadingState(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
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
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
}

// --- Global Functions (for onclick handlers) ---
function switchToSignup() {
    authManager.switchToSignup();
}

function switchToLogin() {
    authManager.switchToLogin();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// --- Animation Styles ---
const notificationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// --- Initialize Authentication Manager ---
let authManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        authManager = new AuthManager();
        console.log('✅ Authentication system initialized');
    } catch (error) {
        console.error('❌ Failed to initialize authentication:', error);
    }
});

// --- Export for global access ---
window.AuthManager = AuthManager;