/**
 * SIGNUP FUNCTIONALITY FOR TRAVEL PLANNER
 * =======================================
 * This script handles user registration with the following features:
 * - Form validation for name, email, and password
 * - Email format validation and duplicate checking
 * - Data storage in localStorage
 * - Success/error messaging
 * - Automatic redirect to login page
 */

// ==========================================
// GLOBAL VARIABLES AND DOM ELEMENTS
// ==========================================

// Get form elements
const signupForm = document.getElementById('signup-form');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const termsCheckbox = document.getElementById('terms');
const signupButton = document.getElementById('signup-btn');

// Get message elements
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// Get error hint elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const termsError = document.getElementById('terms-error');

// LocalStorage key for storing user data
const USERS_STORAGE_KEY = 'travelPlannerUsers';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Validates email format using a comprehensive regex pattern
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

/**
 * Validates full name (at least 2 characters, letters and spaces only)
 * @param {string} name - The full name to validate
 * @returns {boolean} - True if name is valid
 */
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

/**
 * Validates password (minimum 6 characters)
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password meets requirements
 */
function isValidPassword(password) {
    return password.length >= 6;
}

/**
 * Gets all registered users from localStorage
 * @returns {Array} - Array of user objects
 */
function getStoredUsers() {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
}

/**
 * Saves user data to localStorage
 * @param {Array} users - Array of user objects to save
 * @returns {boolean} - True if save was successful
 */
function saveUsers(users) {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
        showError('Unable to save user data. Please check your browser settings.');
        return false;
    }
}

/**
 * Checks if an email already exists in the user database
 * @param {string} email - Email to check
 * @returns {boolean} - True if email already exists
 */
function emailExists(email) {
    const users = getStoredUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// ==========================================
// UI FEEDBACK FUNCTIONS
// ==========================================

/**
 * Shows success message to the user
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    hideError();
    successMessage.querySelector('span').textContent = message;
    successMessage.classList.remove('hidden');
    
    // Scroll to top to ensure message is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Shows error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideSuccess();
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    
    // Scroll to top to ensure message is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Hides success message
 */
function hideSuccess() {
    successMessage.classList.add('hidden');
}

/**
 * Hides error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
}

/**
 * Shows field-specific error message
 * @param {HTMLElement} errorElement - Error element to show
 * @param {string} message - Error message
 */
function showFieldError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

/**
 * Hides field-specific error message
 * @param {HTMLElement} errorElement - Error element to hide
 */
function hideFieldError(errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/**
 * Sets input field styling based on validation state
 * @param {HTMLElement} input - Input element
 * @param {boolean} isValid - Whether the input is valid
 */
function setInputState(input, isValid) {
    input.classList.remove('error', 'success');
    if (isValid === true) {
        input.classList.add('success');
    } else if (isValid === false) {
        input.classList.add('error');
    }
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validates the full name field
 * @returns {boolean} - True if valid
 */
function validateName() {
    const name = fullNameInput.value.trim();
    
    if (!name) {
        showFieldError(nameError, 'Full name is required');
        setInputState(fullNameInput, false);
        return false;
    }
    
    if (!isValidName(name)) {
        showFieldError(nameError, 'Please enter a valid name (2-50 characters, letters only)');
        setInputState(fullNameInput, false);
        return false;
    }
    
    hideFieldError(nameError);
    setInputState(fullNameInput, true);
    return true;
}

/**
 * Validates the email field
 * @param {boolean} checkDuplicate - Whether to check for duplicate emails
 * @returns {boolean} - True if valid
 */
function validateEmail(checkDuplicate = false) {
    const email = emailInput.value.trim();
    
    if (!email) {
        showFieldError(emailError, 'Email address is required');
        setInputState(emailInput, false);
        return false;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(emailError, 'Please enter a valid email address');
        setInputState(emailInput, false);
        return false;
    }
    
    if (checkDuplicate && emailExists(email)) {
        showFieldError(emailError, 'This email is already registered. Please use a different email.');
        setInputState(emailInput, false);
        return false;
    }
    
    hideFieldError(emailError);
    setInputState(emailInput, true);
    return true;
}

/**
 * Validates the password field
 * @returns {boolean} - True if valid
 */
function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordError, 'Password is required');
        setInputState(passwordInput, false);
        return false;
    }
    
    if (!isValidPassword(password)) {
        showFieldError(passwordError, 'Password must be at least 6 characters long');
        setInputState(passwordInput, false);
        return false;
    }
    
    hideFieldError(passwordError);
    setInputState(passwordInput, true);
    return true;
}

/**
 * Validates the terms checkbox
 * @returns {boolean} - True if checked
 */
function validateTerms() {
    if (!termsCheckbox.checked) {
        showFieldError(termsError, 'You must agree to the Terms of Service and Privacy Policy');
        return false;
    }
    
    hideFieldError(termsError);
    return true;
}

/**
 * Validates the entire form
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail(true); // Check for duplicates
    const isPasswordValid = validatePassword();
    const areTermsValid = validateTerms();
    
    return isNameValid && isEmailValid && isPasswordValid && areTermsValid;
}

// ==========================================
// USER REGISTRATION FUNCTIONS
// ==========================================

/**
 * Creates a new user object
 * @param {string} fullName - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - User object
 */
function createUser(fullName, email, password) {
    return {
        id: Date.now(), // Simple ID generation
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: password, // In a real app, this should be hashed
        registrationDate: new Date().toISOString(),
        isActive: true
    };
}

/**
 * Registers a new user and automatically logs them in
 * @param {string} fullName - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {boolean} - True if registration was successful
 */
function registerUser(fullName, email, password) {
    try {
        const users = getStoredUsers();
        const newUser = createUser(fullName, email, password);
        
        users.push(newUser);
        
        if (saveUsers(users)) {
            // Automatically log in the user after successful registration
            createUserSession(newUser);
            
            console.log('User registered and logged in successfully:', { 
                id: newUser.id, 
                name: newUser.fullName, 
                email: newUser.email 
            });
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error during user registration:', error);
        showError('Registration failed. Please try again.');
        return false;
    }
}

/**
 * Creates a user session after successful signup
 * @param {Object} user - User object
 */
function createUserSession(user) {
    const session = {
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        },
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        rememberMe: false
    };
    
    try {
        localStorage.setItem('travelPlannerAuth', JSON.stringify(session));
        console.log('User session created successfully');
    } catch (error) {
        console.error('Error creating user session:', error);
    }
}

// ==========================================
// FORM HANDLING FUNCTIONS
// ==========================================

/**
 * Handles form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Hide any existing messages
    hideSuccess();
    hideError();
    
    // Validate the form
    if (!validateForm()) {
        showError('Please fix the errors below and try again.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Get form values
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Simulate network delay for better UX (optional)
    setTimeout(() => {
        // Attempt to register the user
        if (registerUser(fullName, email, password)) {
            // Registration successful
            showSuccess('Account created successfully! Redirecting to login...');
            
            // Clear the form
            signupForm.reset();
            clearAllValidationStates();
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '../HOME/index.html';
            }, 2000);
        } else {
            // Registration failed
            showError('Registration failed. Please try again.');
        }
        
        // Remove loading state
        setLoadingState(false);
    }, 1000);
}

/**
 * Sets loading state for the submit button
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        signupButton.disabled = true;
        signupButton.classList.add('loading');
        signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    } else {
        signupButton.disabled = false;
        signupButton.classList.remove('loading');
        signupButton.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

/**
 * Clears all validation states from inputs
 */
function clearAllValidationStates() {
    [fullNameInput, emailInput, passwordInput].forEach(input => {
        setInputState(input, null);
    });
    
    [nameError, emailError, passwordError, termsError].forEach(error => {
        hideFieldError(error);
    });
}

// ==========================================
// PASSWORD VISIBILITY TOGGLE
// ==========================================

/**
 * Toggles password visibility
 */
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Initialize all event listeners when the page loads
 */
function initializeEventListeners() {
    // Form submission
    signupForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation on input blur (when user leaves field)
    fullNameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', () => validateEmail(false)); // Don't check duplicates on blur
    passwordInput.addEventListener('blur', validatePassword);
    termsCheckbox.addEventListener('change', validateTerms);
    
    // Clear error states when user starts typing
    fullNameInput.addEventListener('input', () => {
        if (fullNameInput.classList.contains('error')) {
            setInputState(fullNameInput, null);
            hideFieldError(nameError);
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            setInputState(emailInput, null);
            hideFieldError(emailError);
        }
    });
    
    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('error')) {
            setInputState(passwordInput, null);
            hideFieldError(passwordError);
        }
    });
    
    termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
            hideFieldError(termsError);
        }
    });
    
    // Hide messages when user starts interacting with form
    [fullNameInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            hideError();
            hideSuccess();
        });
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the signup page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup page initialized');
    
    // Set up event listeners
    initializeEventListeners();
    
    // Focus on first input
    fullNameInput.focus();
    
    // Log current user count for debugging
    const existingUsers = getStoredUsers();
    console.log(`Current registered users: ${existingUsers.length}`);
});

// ==========================================
// GLOBAL FUNCTIONS (accessible from HTML)
// ==========================================

// Make togglePassword available globally for the HTML onclick handler
window.togglePassword = togglePassword;

// ==========================================
// DEBUG HELPERS (for development)
// ==========================================

/**
 * Debug function to view all registered users (for development only)
 */
function debugViewUsers() {
    const users = getStoredUsers();
    console.table(users.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        registrationDate: new Date(user.registrationDate).toLocaleDateString()
    })));
}

/**
 * Debug function to clear all users (for development only)
 */
function debugClearUsers() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    console.log('All users cleared from localStorage');
}

// Make debug functions available in console
window.debugViewUsers = debugViewUsers;
window.debugClearUsers = debugClearUsers;