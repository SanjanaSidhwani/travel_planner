// CLEAN TRIP CALCULATOR JAVASCRIPT - NO DUPLICATES
'use strict';

let tripCalculator;

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        border-radius: 8px;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

class TripCalculator {
    constructor() {
        this.transportModeIndex = 0;
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.transportModeIndex = 0;
        this.initTransportModes();
        this.bindEvents();
        this.setDefaultValues();
        this.isInitialized = true;
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

    calculateTripCost() {
        try {
            const inputs = this.getAllInputs();
            
            if (!this.validateInputs(inputs, true)) {
                return;
            }
            
            this.showNotification('Calculating trip cost...', 'info');
            
            // Calculate costs with animation delay
            setTimeout(() => {
                const costs = this.calculateAllCosts(inputs);
                this.displayResults(costs, inputs);
                this.showNotification('Trip cost calculated successfully!', 'success');
            }, 500);
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showNotification(`Calculation error: ${error.message}`, 'error');
        }
    }

    getAllInputs() {
        // Get transport modes
        const transportModes = [];
        const transportBlocks = document.querySelectorAll('.transport-mode-block');
        
        transportBlocks.forEach(block => {
            const type = block.querySelector('.transport-type').value;
            const numVehicles = parseFloat(block.querySelector('.num-vehicles').value) || 0;
            
            const mode = { type, numVehicles };
            
            if (type === 'car') {
                const distance = parseFloat(block.querySelector('.distance').value) || 0;
                const fuelEfficiency = parseFloat(block.querySelector('.fuelEfficiency').value) || 0;
                const fuelPrice = parseFloat(block.querySelector('.fuelPrice').value) || 0;
                const parkingToll = parseFloat(block.querySelector('.parking-toll').value) || 0;
                
                // Convert units if needed
                const distanceUnit = block.querySelector('.distance-unit').value;
                const fuelUnit = block.querySelector('.fuel-unit').value;
                const priceUnit = block.querySelector('.price-unit').value;
                
                mode.distance = distanceUnit === 'miles' ? distance * 1.60934 : distance;
                mode.fuelEfficiency = fuelUnit === 'mpg' ? fuelEfficiency * 0.425144 : fuelEfficiency;
                mode.fuelPrice = priceUnit === 'gallon' ? fuelPrice / 3.78541 : fuelPrice;
                mode.parkingToll = parkingToll;
            } else {
                mode.ticketPrice = parseFloat(block.querySelector('.ticket-price').value) || 0;
            }
            
            transportModes.push(mode);
        });
        
        return {
            people: parseInt(document.getElementById('people').value) || 0,
            days: parseInt(document.getElementById('days').value) || 0,
            nights: parseInt(document.getElementById('nights').value) || 0,
            accommodationCost: parseFloat(document.getElementById('accommodation-cost').value) || 0,
            numRooms: parseInt(document.getElementById('num-rooms').value) || 1,
            dailyFood: parseFloat(document.getElementById('daily-food').value) || 0,
            activities: parseFloat(document.getElementById('activities').value) || 0,
            miscellaneous: parseFloat(document.getElementById('miscellaneous').value) || 0,
            transportModes
        };
    }

    validateInputs(inputs, showErrors = true) {
        // Check transport modes
        if (!inputs.transportModes || inputs.transportModes.length === 0) {
            if (showErrors) this.showNotification('Please add at least one transportation mode', 'error');
            return false;
        }
        
        // Validate each transport mode
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                if (!mode.distance || mode.distance <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid distance for car transportation', 'error');
                    return false;
                }
                if (!mode.fuelEfficiency || mode.fuelEfficiency <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid fuel efficiency for car transportation', 'error');
                    return false;
                }
                if (!mode.fuelPrice || mode.fuelPrice <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid fuel price for car transportation', 'error');
                    return false;
                }
                if (!mode.numVehicles || mode.numVehicles <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid number of vehicles', 'error');
                    return false;
                }
            } else {
                if (!mode.ticketPrice || mode.ticketPrice <= 0) {
                    if (showErrors) this.showNotification(`Please enter a valid ticket price for ${mode.type} transportation`, 'error');
                    return false;
                }
                if (!mode.numVehicles || mode.numVehicles <= 0) {
                    if (showErrors) this.showNotification('Please enter a valid number of tickets', 'error');
                    return false;
                }
            }
        }
        
        // Validate other required fields
        if (!inputs.people || inputs.people <= 0) {
            if (showErrors) this.showNotification('Please enter a valid number of people', 'error');
            return false;
        }
        
        if (!inputs.days || inputs.days <= 0) {
            if (showErrors) this.showNotification('Please enter a valid trip duration', 'error');
            return false;
        }
        
        // Check for valid numbers
        const numericFields = ['accommodationCost', 'dailyFood', 'activities', 'miscellaneous'];
        for (const field of numericFields) {
            if (isNaN(inputs[field]) || inputs[field] < 0) {
                if (showErrors) this.showNotification('Please enter valid numeric values for all fields', 'error');
                return false;
            }
        }
        
        return true;
    }

    calculateAllCosts(inputs) {
        const costs = {
            transportation: 0,
            accommodation: 0,
            food: 0,
            activities: inputs.activities || 0,
            miscellaneous: inputs.miscellaneous || 0
        };
        
        // Calculate transportation costs
        for (const mode of inputs.transportModes) {
            if (mode.type === 'car') {
                const fuelNeeded = mode.distance / mode.fuelEfficiency;
                const fuelCost = fuelNeeded * mode.fuelPrice;
                const totalCost = (fuelCost + (mode.parkingToll || 0)) * mode.numVehicles;
                costs.transportation += totalCost;
            } else {
                costs.transportation += mode.ticketPrice * mode.numVehicles * inputs.people;
            }
        }
        
        // Calculate accommodation costs
        costs.accommodation = inputs.accommodationCost * inputs.nights * (inputs.numRooms || 1);
        
        // Calculate food costs
        costs.food = inputs.dailyFood * inputs.days * inputs.people;
        
        // Calculate total
        costs.total = costs.transportation + costs.accommodation + costs.food + costs.activities + costs.miscellaneous;
        costs.perPerson = costs.total / inputs.people;
        
        return costs;
    }

    displayResults(costs, inputs) {
        // Show results section
        const resultSection = document.getElementById('result');
        if (resultSection) {
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update group details
        const groupDetails = document.getElementById('group-details');
        if (groupDetails) {
            groupDetails.textContent = `${inputs.people} people, ${inputs.days} days`;
        }
        
        // Update cost displays
        const elements = {
            'transport-cost': costs.transportation,
            'accommodation-total': costs.accommodation,
            'food-total': costs.food,
            'activities-total': costs.activities,
            'miscellaneous-total': costs.miscellaneous,
            'total-cost': costs.total,
            'cost-per-person': costs.perPerson
        };
        
        Object.entries(elements).forEach(([id, amount]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
            }
        });
    }

    resetCalculator() {
        // Clear all input fields
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'number' || input.type === 'text') {
                input.value = '';
            }
        });
        
        // Clear transport modes
        const container = document.getElementById('transportation-modes-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Hide results
        const resultSection = document.getElementById('result');
        if (resultSection) {
            resultSection.style.display = 'none';
        }
        
        // Reset and reinitialize
        this.transportModeIndex = 0;
        this.initTransportModes();
        this.setDefaultValues();
        
        this.showNotification('Calculator reset successfully!', 'success');
    }

    showNotification(message, type) {
        showNotification(message, type);
    }
}

// Authentication functions
function initializeAuth() {
    const auth = JSON.parse(localStorage.getItem('travelPlannerAuth') || '{}');
    const loginBtn = document.querySelector('.login-btn');
    const userSection = document.querySelector('.user-section');
    
    if (auth.user && auth.expiresAt > Date.now()) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userSection) {
            userSection.style.display = 'flex';
            userSection.innerHTML = `
                <span class="user-info">
                    <i class="fas fa-user-circle"></i>
                    Welcome, ${auth.user.fullName}
                </span>
                <button class="logout-btn" onclick="logout()">Logout</button>
            `;
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('travelPlannerAuth');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => window.location.reload(), 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        setTimeout(() => {
            tripCalculator = new TripCalculator();
            initializeAuth();
            console.log('✅ Trip Calculator initialized successfully');
        }, 100);
    } catch (error) {
        console.error('❌ Failed to initialize Trip Calculator:', error);
    }
});

// Keyboard Shortcuts
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