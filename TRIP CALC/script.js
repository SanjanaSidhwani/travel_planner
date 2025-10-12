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
        this.transportModeIndex = 0;
        this.bindEvents();
        this.setDefaultValues();
        this.initTransportModes();
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
        // Sync days with accommodation nights
        const daysInput = document.getElementById('days');
        const nightsInput = document.getElementById('nights');
        if (daysInput && nightsInput) {
            daysInput.addEventListener('input', () => {
                const days = parseInt(daysInput.value) || 0;
                nightsInput.value = Math.max(0, days - 1);
            });
        }
        // Add transport mode button
        const addTransportBtn = document.getElementById('add-transport-mode');
        if (addTransportBtn) {
            addTransportBtn.addEventListener('click', () => this.addTransportMode());
        }
    }

    initTransportModes() {
        // Add one default mode
        this.addTransportMode();
    }

    addTransportMode(defaults = {}) {
        const container = document.getElementById('transportation-modes-container');
        if (!container) return;
        // If no modes exist, reset index to 0
        if (container.children.length === 0) {
            this.transportModeIndex = 0;
        }
        const idx = this.transportModeIndex++;
        const modeDiv = document.createElement('div');
        modeDiv.className = 'transport-mode-block';
        modeDiv.dataset.idx = idx;
        modeDiv.innerHTML = `
            <div class="transport-mode-header">
                <span>Mode #${idx + 1}</span>
                <button type="button" class="remove-transport-btn" title="Remove Mode">&times;</button>
            </div>
            <div class="input-group">
                <label>Transport Type</label>
                <select class="transport-type">
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="flight">Flight</option>
                </select>
            </div>
            <div class="input-group">
                <label>Number of Vehicles/Tickets</label>
                <input type="number" class="num-vehicles" placeholder="1" min="1" value="${defaults.numVehicles || 1}" autocomplete="off">
            </div>
            <div class="input-group car-fields">
                <label>Total Distance</label>
                <div class="input-with-unit">
                    <input type="number" class="distance" placeholder="500" min="0" value="${defaults.distance || ''}" autocomplete="off">
                    <select class="distance-unit">
                        <option value="km">Kilometers</option>
                        <option value="miles">Miles</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Fuel Efficiency</label>
                <div class="input-with-unit">
                    <input type="number" class="fuelEfficiency" placeholder="25" min="0" step="0.1" value="${defaults.fuelEfficiency || ''}" autocomplete="off">
                    <select class="fuel-unit">
                        <option value="kmpl">km/L</option>
                        <option value="mpg">MPG</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Fuel Price</label>
                <div class="input-with-unit">
                    <input type="number" class="fuelPrice" placeholder="100" min="0" step="0.01" value="${defaults.fuelPrice || ''}" autocomplete="off">
                    <select class="price-unit">
                        <option value="liter">per Liter</option>
                        <option value="gallon">per Gallon</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Parking/Toll Costs</label>
                <input type="number" class="parking-toll" placeholder="0" min="0" step="0.01" value="${defaults.parkingToll || ''}" autocomplete="off">
            </div>
            <div class="input-group ticket-fields" style="display:none">
                <label>Ticket Price</label>
                <input type="number" class="ticket-price" placeholder="0" min="0" step="0.01" value="${defaults.ticketPrice || ''}" autocomplete="off">
            </div>
        `;
        container.appendChild(modeDiv);
        // Remove button
        modeDiv.querySelector('.remove-transport-btn').onclick = () => {
            modeDiv.remove();
            // If all modes are removed, reset index so next mode is #1
            if (container.children.length === 0) {
                this.transportModeIndex = 0;
            }
        };
        // Show/hide fields based on type
        const typeSelect = modeDiv.querySelector('.transport-type');
        const carFields = modeDiv.querySelectorAll('.car-fields');
        const ticketFields = modeDiv.querySelectorAll('.ticket-fields');
        function updateFields() {
            if (typeSelect.value === 'car') {
                carFields.forEach(f => f.style.display = 'block');
                ticketFields.forEach(f => f.style.display = 'none');
            } else {
                carFields.forEach(f => f.style.display = 'none');
                ticketFields.forEach(f => f.style.display = 'block');
            }
        }
        typeSelect.addEventListener('change', updateFields);
        updateFields();
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
        // Gather all transport modes
        const transportModes = [];
        document.querySelectorAll('#transportation-modes-container .transport-mode-block').forEach(modeDiv => {
            const type = modeDiv.querySelector('.transport-type').value;
            const numVehicles = parseInt(modeDiv.querySelector('.num-vehicles').value) || 1;
            if (type === 'car') {
                const distance = parseFloat(modeDiv.querySelector('.distance').value) || 0;
                const distanceUnit = modeDiv.querySelector('.distance-unit').value;
                const fuelEfficiency = parseFloat(modeDiv.querySelector('.fuelEfficiency').value) || 0;
                const fuelUnit = modeDiv.querySelector('.fuel-unit').value;
                const fuelPrice = parseFloat(modeDiv.querySelector('.fuelPrice').value) || 0;
                const priceUnit = modeDiv.querySelector('.price-unit').value;
                const parkingToll = parseFloat(modeDiv.querySelector('.parking-toll').value) || 0;
                transportModes.push({ type, numVehicles, distance, distanceUnit, fuelEfficiency, fuelUnit, fuelPrice, priceUnit, parkingToll });
            } else {
                const ticketPrice = parseFloat(modeDiv.querySelector('.ticket-price').value) || 0;
                transportModes.push({ type, numVehicles, ticketPrice });
            }
        });
        return {
            transportModes,
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
        // At least one transport mode
        if (!inputs.transportModes.length) return false;
        // Validate each mode
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                if (mode.distance <= 0 || mode.fuelEfficiency <= 0 || mode.fuelPrice <= 0 || mode.numVehicles <= 0) return false;
            } else {
                if (mode.ticketPrice <= 0 || mode.numVehicles <= 0) return false;
            }
        }
        if (inputs.people <= 0 || inputs.days <= 0) {
            return false;
        }
        return true;
    }

    performCalculations(inputs) {
        // Sum all transport modes
        let transportationCost = 0;
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                let fuelNeeded;
                if (mode.fuelUnit === 'kmpl') {
                    fuelNeeded = (mode.distance / mode.fuelEfficiency) * mode.numVehicles;
                } else { // mpg
                    const distanceInKm = mode.distanceUnit === 'miles' ? mode.distance * 1.60934 : mode.distance;
                    const efficiencyInKmpl = mode.fuelEfficiency * 0.425144;
                    fuelNeeded = (distanceInKm / efficiencyInKmpl) * mode.numVehicles;
                }
                let fuelCostMultiplier = 1;
                if ((mode.fuelUnit === 'kmpl' && mode.priceUnit === 'gallon') ||
                    (mode.fuelUnit === 'mpg' && mode.priceUnit === 'liter')) {
                    fuelCostMultiplier = mode.priceUnit === 'gallon' ? 3.78541 : 0.264172;
                }
                const fuelCost = fuelNeeded * mode.fuelPrice * fuelCostMultiplier;
                transportationCost += fuelCost + (mode.parkingToll || 0);
            } else {
                transportationCost += mode.ticketPrice * mode.numVehicles;
            }
        }
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
            perPerson: costPerPerson
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
        // Remove all transport modes
        const container = document.getElementById('transportation-modes-container');
        if (container) container.innerHTML = '';
        this.transportModeIndex = 0;
        this.initTransportModes();
        // Reset all input fields except transport modes
        const inputs = document.querySelectorAll('.calculator-section input[type="number"]:not(.num-vehicles):not(.distance):not(.fuelEfficiency):not(.fuelPrice):not(.parking-toll):not(.flight-price)');
        inputs.forEach(input => {
            input.value = '';
        });
        // Reset selects to default except transport modes
        const selects = document.querySelectorAll('.calculator-section select:not(.transport-type):not(.distance-unit):not(.fuel-unit):not(.price-unit)');
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