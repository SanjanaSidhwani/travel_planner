/**
 * ====================================
 * TRAVEL PLANNER - TRIP CALCULATOR
 * Advanced Cost Calculation System
 * ====================================
 */

// --- Calculator Class ---
class TripCalculator {
    constructor() {
        this.isInitializing = true;
        this.init();
        // Set initialization complete after a short delay and clear any existing notifications
        setTimeout(() => {
            this.isInitializing = false;
            this.clearAllNotifications();
        }, 1000);
    }

    init() {
        this.transportModeIndex = 0;
        this.initTransportModes();
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
        
        // Set proper default values
        const transportDefaults = {
            numVehicles: defaults.numVehicles || 1,
            distance: defaults.distance || 500,
            fuelEfficiency: defaults.fuelEfficiency || 15,
            fuelPrice: defaults.fuelPrice || 100,
            parkingToll: defaults.parkingToll || 0,
            ticketPrice: defaults.ticketPrice || 0
        };
        
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
                <input type="number" class="num-vehicles" placeholder="1" min="1" value="${transportDefaults.numVehicles}" autocomplete="off">
            </div>
            <div class="input-group car-fields">
                <label>Total Distance</label>
                <div class="input-with-unit">
                    <input type="number" class="distance" placeholder="500" min="0" value="${transportDefaults.distance}" autocomplete="off">
                    <select class="distance-unit">
                        <option value="km">Kilometers</option>
                        <option value="miles">Miles</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Fuel Efficiency</label>
                <div class="input-with-unit">
                    <input type="number" class="fuelEfficiency" placeholder="25" min="0" step="0.1" value="${transportDefaults.fuelEfficiency}" autocomplete="off">
                    <select class="fuel-unit">
                        <option value="kmpl">km/L</option>
                        <option value="mpg">MPG</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Fuel Price</label>
                <div class="input-with-unit">
                    <input type="number" class="fuelPrice" placeholder="100" min="0" step="0.01" value="${transportDefaults.fuelPrice}" autocomplete="off">
                    <select class="price-unit">
                        <option value="liter">per Liter</option>
                        <option value="gallon">per Gallon</option>
                    </select>
                </div>
            </div>
            <div class="input-group car-fields">
                <label>Parking/Toll Costs</label>
                <input type="number" class="parking-toll" placeholder="0" min="0" step="0.01" value="${transportDefaults.parkingToll}" autocomplete="off">
            </div>
            <div class="input-group ticket-fields" style="display:none">
                <label>Ticket Price</label>
                <input type="number" class="ticket-price" placeholder="0" min="0" step="0.01" value="${transportDefaults.ticketPrice}" autocomplete="off">
            </div>
        `;
        container.appendChild(modeDiv);
        
        // Add debug event listeners to input fields
        const debugInputs = modeDiv.querySelectorAll('input[type="number"]');
        debugInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                console.log('Input clicked:', input.className, e);
            });
            input.addEventListener('focus', (e) => {
                console.log('Input focused:', input.className, e);
            });
            input.addEventListener('input', (e) => {
                console.log('Input changed:', input.className, 'value:', input.value);
            });
        });
        
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
        // Set some sensible defaults for Indian currency and units - only for static form fields with IDs
        const defaults = {
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
        
        // Note: Transport mode defaults are handled in addTransportMode() method
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
            console.log('Starting trip cost calculation...');
            
            // Ensure initialization is complete
            this.isInitializing = false;
            
            // Show loading state
            this.setLoadingState(true);

            // Get all input values
            const inputs = this.getInputValues();
            console.log('Input values:', inputs);
            
            // Validate inputs (now allowing error messages)
            if (!this.validateInputs(inputs, true)) {
                this.setLoadingState(false);
                return;
            }

            // Calculate costs
            const costs = this.performCalculations(inputs);
            console.log('Calculated costs:', costs);

            // Display results with animation
            setTimeout(() => {
                this.displayResults(costs);
                this.setLoadingState(false);
                this.showNotification('Trip cost calculated successfully!', 'success');
            }, 1000);

        } catch (error) {
            console.error('Calculation error:', error);
            console.error('Error stack:', error);
            this.showNotification(`Calculation error: ${error.message}`, 'error');
            this.setLoadingState(false);
        }
    }

    getInputValues() {
        // Gather all transport modes
        const transportModes = [];
        document.querySelectorAll('#transportation-modes-container .transport-mode-block').forEach(modeDiv => {
            const type = modeDiv.querySelector('.transport-type').value;
            const numVehicles = this.safeParseInt(modeDiv.querySelector('.num-vehicles').value, 1);
            if (type === 'car') {
                const distance = this.safeParseFloat(modeDiv.querySelector('.distance').value);
                const distanceUnit = modeDiv.querySelector('.distance-unit').value;
                const fuelEfficiency = this.safeParseFloat(modeDiv.querySelector('.fuelEfficiency').value);
                const fuelUnit = modeDiv.querySelector('.fuel-unit').value;
                const fuelPrice = this.safeParseFloat(modeDiv.querySelector('.fuelPrice').value);
                const priceUnit = modeDiv.querySelector('.price-unit').value;
                const parkingToll = this.safeParseFloat(modeDiv.querySelector('.parking-toll').value);
                transportModes.push({ type, numVehicles, distance, distanceUnit, fuelEfficiency, fuelUnit, fuelPrice, priceUnit, parkingToll });
            } else {
                const ticketPrice = this.safeParseFloat(modeDiv.querySelector('.ticket-price').value);
                transportModes.push({ type, numVehicles, ticketPrice });
            }
        });
        return {
            transportModes,
            // Accommodation
            nights: this.safeParseInt(document.getElementById('nights')?.value),
            accommodationCost: this.safeParseFloat(document.getElementById('accommodation-cost')?.value),
            // Food & Activities
            dailyFood: this.safeParseFloat(document.getElementById('daily-food')?.value),
            activities: this.safeParseFloat(document.getElementById('activities')?.value),
            // Miscellaneous expenses
            emergencyFund: this.safeParseFloat(document.getElementById('emergency-fund')?.value),
            insurance: this.safeParseFloat(document.getElementById('insurance')?.value),
            tips: this.safeParseFloat(document.getElementById('tips')?.value),
            shopping: this.safeParseFloat(document.getElementById('shopping')?.value),
            miscellaneous: this.safeParseFloat(document.getElementById('miscellaneous')?.value),
            // Group details
            people: this.safeParseInt(document.getElementById('people')?.value, 1),
            days: this.safeParseInt(document.getElementById('days')?.value, 1)
        };
    }

    validateInputs(inputs, showErrors = true) {
        // At least one transport mode
        if (!inputs.transportModes.length) {
            if (showErrors) this.showNotification('Please add at least one transportation mode', 'error');
            return false;
        }
        
        // Validate each mode
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                if (mode.distance <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid distance for car transportation', 'error');
                    return false;
                }
                if (mode.fuelEfficiency <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid fuel efficiency for car transportation', 'error');
                    return false;
                }
                if (mode.fuelPrice <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid fuel price for car transportation', 'error');
                    return false;
                }
                if (mode.numVehicles <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid number of vehicles', 'error');
                    return false;
                }
            } else {
                if (mode.ticketPrice <= 0) {
                    if (showErrors) this.showNotification(`Please enter a valid ticket price for ${mode.type} transportation`, 'error');
                    return false;
                }
                if (mode.numVehicles <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid number of tickets', 'error');
                    return false;
                }
            }
        }
        
        if (inputs.people <= 0) {
            if (showErrors) this.showNotification('Please enter a valid number of people', 'error');
            return false;
        }
        
        if (inputs.days <= 0) {
            if (showErrors) this.showNotification('Please enter a valid trip duration', 'error');
            return false;
        }
        
        // Check for NaN values
        const numericInputs = [
            inputs.accommodationCost, inputs.dailyFood, inputs.activities,
            inputs.emergencyFund, inputs.insurance, inputs.tips, inputs.shopping, inputs.miscellaneous
        ];
        
        if (numericInputs.some(value => isNaN(value))) {
            if (showErrors) this.showNotification('Please enter valid numeric values for all fields', 'error');
            return false;
        }
        
        return true;
    }

    performCalculations(inputs) {
        // Sum all transport modes
        let transportationCost = 0;
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                let fuelNeeded = 0;
                try {
                    if (mode.fuelUnit === 'kmpl') {
                        if (mode.fuelEfficiency > 0) {
                            fuelNeeded = (mode.distance / mode.fuelEfficiency) * mode.numVehicles;
                        }
                    } else { // mpg
                        const distanceInKm = mode.distanceUnit === 'miles' ? mode.distance * 1.60934 : mode.distance;
                        const efficiencyInKmpl = mode.fuelEfficiency * 0.425144;
                        if (efficiencyInKmpl > 0) {
                            fuelNeeded = (distanceInKm / efficiencyInKmpl) * mode.numVehicles;
                        }
                    }
                    
                    let fuelCostMultiplier = 1;
                    if ((mode.fuelUnit === 'kmpl' && mode.priceUnit === 'gallon') ||
                        (mode.fuelUnit === 'mpg' && mode.priceUnit === 'liter')) {
                        fuelCostMultiplier = mode.priceUnit === 'gallon' ? 3.78541 : 0.264172;
                    }
                    
                    const fuelCost = fuelNeeded * mode.fuelPrice * fuelCostMultiplier;
                    
                    if (!isNaN(fuelCost) && isFinite(fuelCost)) {
                        transportationCost += fuelCost + (mode.parkingToll || 0);
                    }
                } catch (error) {
                    console.error('Error calculating car transportation cost:', error);
                }
            } else {
                const ticketCost = mode.ticketPrice * mode.numVehicles;
                if (!isNaN(ticketCost) && isFinite(ticketCost)) {
                    transportationCost += ticketCost;
                }
            }
        }
        // Accommodation cost
        const accommodationTotal = inputs.nights * inputs.accommodationCost;
        // Food cost
        const foodTotal = inputs.days * inputs.dailyFood * inputs.people;
        // Activities cost (usually shared, but can be per person)
        const activitiesTotal = inputs.activities;
        // Miscellaneous costs
        const miscellaneousTotal = inputs.emergencyFund + inputs.insurance + inputs.tips + inputs.shopping + inputs.miscellaneous;
        // Total cost
        const totalCost = transportationCost + accommodationTotal + foodTotal + activitiesTotal + miscellaneousTotal;
        const costPerPerson = inputs.people > 0 ? totalCost / inputs.people : 0;
        return {
            transportation: transportationCost,
            accommodation: accommodationTotal,
            food: foodTotal,
            activities: activitiesTotal,
            miscellaneous: miscellaneousTotal,
            total: totalCost,
            perPerson: costPerPerson
        };
    }

    displayResults(costs) {
        // Update individual cost displays
        const elements = {
            'transport-cost': costs.transportation,
            'accommodation-total': costs.accommodation,
            'food-total': costs.food,
            'activities-total': costs.activities,
            'miscellaneous-total': costs.miscellaneous,
            'total-cost': costs.total,
            'cost-per-person': costs.perPerson
        };

        // Safely update each element
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.formatCurrency(value);
            } else {
                console.warn(`Element with ID '${id}' not found`);
            }
        });

        // Update group details if element exists
        const groupDetailsElement = document.getElementById('group-details');
        if (groupDetailsElement) {
            const people = document.getElementById('people')?.value || 0;
            const days = document.getElementById('days')?.value || 0;
            groupDetailsElement.textContent = `${people} people for ${days} days`;
        }

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
        // Don't show notifications during initialization
        if (this.isInitializing) return;
        
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

    clearAllNotifications() {
        // Remove any existing notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.removeNotification(notification);
        });
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

    // Utility function for safely parsing numbers
    safeParseFloat(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') return defaultValue;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    safeParseInt(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') return defaultValue;
        const parsed = parseInt(value);
        return isNaN(parsed) ? defaultValue : parsed;
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

// Debug function for input testing
function debugInputs() {
    const inputs = document.querySelectorAll('.transport-mode-block input[type="number"]');
    console.log('Found transport input fields:', inputs.length);
    
    inputs.forEach((input, index) => {
        console.log(`Input ${index}:`, {
            className: input.className,
            value: input.value,
            disabled: input.disabled,
            readOnly: input.readOnly,
            pointerEvents: window.getComputedStyle(input).pointerEvents,
            display: window.getComputedStyle(input).display,
            visibility: window.getComputedStyle(input).visibility
        });
        
        // Try to set a test value
        const testValue = '999';
        input.value = testValue;
        console.log(`After setting ${testValue}, value is:`, input.value);
    });
}

// Force inputs to be functional
function forceInputsWorking() {
    const inputs = document.querySelectorAll('.transport-mode-block input[type="number"]');
    console.log('🔧 Forcing inputs to work:', inputs.length);
    
    inputs.forEach(input => {
        // Remove any blocking attributes
        input.removeAttribute('disabled');
        input.removeAttribute('readonly');
        input.style.pointerEvents = 'auto';
        input.style.userSelect = 'text';
        input.style.webkitUserSelect = 'text';
        
        // Make sure it's focusable
        input.tabIndex = 0;
        
        // Add click listener to force focus
        input.addEventListener('click', function(e) {
            e.stopPropagation();
            this.focus();
            console.log('🎯 Force focused input:', this.className);
        });
        
        console.log('✅ Fixed input:', input.className);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add a small delay to ensure all elements are properly loaded
        setTimeout(() => {
            tripCalculator = new TripCalculator();
            initializeAuth();
            console.log('✅ Trip Calculator initialized successfully');
            
            // Add debug function to window for testing
            window.debugInputs = debugInputs;
            window.forceInputsWorking = forceInputsWorking;
            console.log('🔧 Debug functions added: debugInputs() and forceInputsWorking()');
            
            // Automatically run debug and force fix after a short delay
            setTimeout(() => {
                debugInputs();
                forceInputsWorking();
            }, 500);
        }, 100);
    } catch (error) {
        console.error('❌ Failed to initialize Trip Calculator:', error);
    }
});

// --- Global Error Handling ---
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show notifications for minor script errors
    if (e.error && !e.error.message.includes('Script error')) {
        console.warn('Script error detected but not showing notification to user');
    }
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