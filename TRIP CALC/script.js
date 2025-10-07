/**
 * ====================================
 * TRAVEL PLANNER - TRIP CALCULATOR
 * Advanced Cost Calculation System
 * ====================================
 */

// --- Calculator Class ---
class TripCalculator {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setDefaultValues();
    }

    bindEvents() {
        const calculateBtn = document.getElementById('calculate-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateTripCost());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCalculator());
        }

        // Auto-calculate when inputs change (with debouncing)
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                if (this.hasRequiredValues()) {
                    this.calculateTripCost();
                }
            }, 500));
        });

        // Sync days with accommodation nights
        const daysInput = document.getElementById('days');
        const nightsInput = document.getElementById('nights');
        
        if (daysInput && nightsInput) {
            daysInput.addEventListener('input', () => {
                const days = parseInt(daysInput.value) || 0;
                nightsInput.value = Math.max(0, days - 1);
            });
        }
    }

    setDefaultValues() {
        // Set some sensible defaults for Indian currency and units
        const defaults = {
            'distance': 500,
            'fuelEfficiency': 15,
            'fuelPrice': 100,
            'nights': 2,
            'accommodation-cost': 5000,
            'daily-food': 2000,
            'activities': 10000,
            'people': 4,
            'days': 3
        };

        Object.entries(defaults).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input && !input.value) {
                input.value = value;
            }
        });
    }

    hasRequiredValues() {
        const requiredFields = ['distance', 'fuelEfficiency', 'fuelPrice', 'people', 'days'];
        return requiredFields.every(id => {
            const input = document.getElementById(id);
            return input && input.value && parseFloat(input.value) > 0;
        });
    }

    calculateTripCost() {
        try {
            // Show loading state
            this.setLoadingState(true);

            // Get all input values
            const inputs = this.getInputValues();
            
            // Validate inputs
            if (!this.validateInputs(inputs)) {
                this.showNotification('Please fill in all required fields with valid values', 'error');
                this.setLoadingState(false);
                return;
            }

            // Calculate costs
            const costs = this.performCalculations(inputs);

            // Display results with animation
            setTimeout(() => {
                this.displayResults(costs);
                this.setLoadingState(false);
                this.showNotification('Trip cost calculated successfully!', 'success');
            }, 1000);

        } catch (error) {
            console.error('Calculation error:', error);
            this.showNotification('An error occurred during calculation', 'error');
            this.setLoadingState(false);
        }
    }

    getInputValues() {
        return {
            // Transportation
            distance: parseFloat(document.getElementById('distance')?.value) || 0,
            fuelEfficiency: parseFloat(document.getElementById('fuelEfficiency')?.value) || 0,
            fuelPrice: parseFloat(document.getElementById('fuelPrice')?.value) || 0,
            distanceUnit: document.getElementById('distance-unit')?.value || 'km',
            fuelUnit: document.getElementById('fuel-unit')?.value || 'kmpl',
            priceUnit: document.getElementById('price-unit')?.value || 'liter',

            // Accommodation
            nights: parseInt(document.getElementById('nights')?.value) || 0,
            accommodationCost: parseFloat(document.getElementById('accommodation-cost')?.value) || 0,

            // Food & Activities
            dailyFood: parseFloat(document.getElementById('daily-food')?.value) || 0,
            activities: parseFloat(document.getElementById('activities')?.value) || 0,

            // Group details
            people: parseInt(document.getElementById('people')?.value) || 1,
            days: parseInt(document.getElementById('days')?.value) || 1
        };
    }

    validateInputs(inputs) {
        // Check required fields
        if (inputs.distance <= 0 || inputs.fuelEfficiency <= 0 || inputs.fuelPrice <= 0) {
            return false;
        }
        if (inputs.people <= 0 || inputs.days <= 0) {
            return false;
        }
        return true;
    }

    performCalculations(inputs) {
        // Transportation cost calculation
        let fuelNeeded;
        if (inputs.fuelUnit === 'kmpl') {
            fuelNeeded = inputs.distance / inputs.fuelEfficiency;
        } else { // mpg
            // Convert miles to km if needed
            const distanceInKm = inputs.distanceUnit === 'miles' ? inputs.distance * 1.60934 : inputs.distance;
            // Convert mpg to km/L (1 mpg ≈ 0.425 km/L)
            const efficiencyInKmpl = inputs.fuelEfficiency * 0.425144;
            fuelNeeded = distanceInKm / efficiencyInKmpl;
        }

        let fuelCostMultiplier = 1;
        if ((inputs.fuelUnit === 'kmpl' && inputs.priceUnit === 'gallon') ||
            (inputs.fuelUnit === 'mpg' && inputs.priceUnit === 'liter')) {
            fuelCostMultiplier = inputs.priceUnit === 'gallon' ? 3.78541 : 0.264172; // Convert between gallons and liters
        }

        const transportationCost = fuelNeeded * inputs.fuelPrice * fuelCostMultiplier;

        // Accommodation cost
        const accommodationTotal = inputs.nights * inputs.accommodationCost;

        // Food cost
        const foodTotal = inputs.days * inputs.dailyFood * inputs.people;

        // Activities cost (usually shared, but can be per person)
        const activitiesTotal = inputs.activities;

        // Total cost
        const totalCost = transportationCost + accommodationTotal + foodTotal + activitiesTotal;
        const costPerPerson = totalCost / inputs.people;

        return {
            transportation: transportationCost,
            accommodation: accommodationTotal,
            food: foodTotal,
            activities: activitiesTotal,
            total: totalCost,
            perPerson: costPerPerson,
            breakdown: {
                fuelNeeded: fuelNeeded,
                nights: inputs.nights,
                dailyFoodCost: inputs.dailyFood * inputs.people
            }
        };
    }

    displayResults(costs) {
        // Update individual cost displays
        document.getElementById('transport-cost').textContent = this.formatCurrency(costs.transportation);
        document.getElementById('accommodation-total').textContent = this.formatCurrency(costs.accommodation);
        document.getElementById('food-total').textContent = this.formatCurrency(costs.food);
        document.getElementById('activities-total').textContent = this.formatCurrency(costs.activities);

        // Update totals
        document.getElementById('total-cost').textContent = this.formatCurrency(costs.total);
        document.getElementById('cost-per-person').textContent = this.formatCurrency(costs.perPerson);

        // Show results section with animation
        const resultSection = document.getElementById('result');
        if (resultSection) {
            resultSection.style.display = 'block';
            resultSection.classList.add('fade-in');
            
            // Scroll to results
            resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    resetCalculator() {
        // Reset all input fields
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });

        // Reset selects to default
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Hide results
        const resultSection = document.getElementById('result');
        if (resultSection) {
            resultSection.style.display = 'none';
            resultSection.classList.remove('fade-in');
        }

        // Set defaults again
        this.setDefaultValues();

        this.showNotification('Calculator reset successfully', 'info');
    }

    setLoadingState(loading) {
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            if (loading) {
                calculateBtn.classList.add('loading');
                calculateBtn.disabled = true;
            } else {
                calculateBtn.classList.remove('loading');
                calculateBtn.disabled = false;
            }
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 4000);

        // Manual close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
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

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// --- Animation Styles ---
const animationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 0.5rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// --- Initialize Calculator ---
let tripCalculator;

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

document.addEventListener('DOMContentLoaded', () => {
    try {
        tripCalculator = new TripCalculator();
        initializeAuth();
        console.log('✅ Trip Calculator initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Trip Calculator:', error);
    }
});

// --- Global Error Handling ---
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                tripCalculator?.calculateTripCost();
                break;
            case 'r':
                e.preventDefault();
                tripCalculator?.resetCalculator();
                break;
        }
    }
});