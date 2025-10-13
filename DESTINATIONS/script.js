/**
 * =====================================
 * DESTINATIONS PAGE - JAVASCRIPT
 * Travel Planner Destination Discovery
 * =====================================
 */

// Sample destination data
const destinationsData = [
    {
        id: 1,
        name: "Goa",
        location: "India",
        region: "asia",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        price: "₹15,000",
        priceLabel: "per person",
        category: "beach",
        budget: "mid-range",
        duration: "3-5 days",
        description: "Beautiful beaches, vibrant nightlife, and Portuguese architecture make Goa a perfect tropical getaway.",
        tags: ["Beach", "Nightlife", "Heritage", "Water Sports"],
        bestTime: "November to March"
    },
    {
        id: 2,
        name: "Manali",
        location: "Himachal Pradesh, India",
        region: "asia",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.6,
        price: "₹12,000",
        priceLabel: "per person",
        category: "mountains",
        budget: "budget",
        region: "asia",
        duration: "4-6 days",
        description: "Snow-capped mountains, adventure sports, and serene valleys perfect for a mountain retreat.",
        tags: ["Mountains", "Adventure", "Trekking", "Snow"],
        bestTime: "April to June, October to February"
    },
    {
        id: 3,
        name: "Rajasthan",
        location: "India",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.7,
        price: "₹20,000",
        priceLabel: "per person",
        category: "cultural",
        budget: "luxury",
        region: "asia",
        duration: "7-10 days",
        description: "Royal palaces, desert safaris, and rich cultural heritage showcase India's majestic history.",
        tags: ["Desert", "Palaces", "Culture", "Heritage"],
        bestTime: "October to March"
    },
    {
        id: 4,
        name: "Kerala Backwaters",
        location: "Kerala, India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.9,
        price: "₹18,000",
        priceLabel: "per person",
        category: "nature",
        budget: "mid-range",
        region: "asia",
        duration: "4-7 days",
        description: "Tranquil backwaters, lush greenery, and traditional houseboats offer a peaceful escape.",
        tags: ["Backwaters", "Houseboat", "Nature", "Ayurveda"],
        bestTime: "September to March"
    },
    {
        id: 5,
        name: "Leh Ladakh",
        location: "Jammu & Kashmir, India",
        image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        price: "₹25,000",
        priceLabel: "per person",
        category: "adventure",
        budget: "mid-range",
        region: "asia",
        duration: "6-8 days",
        description: "High altitude desert, Buddhist monasteries, and breathtaking landscapes for adventure seekers.",
        tags: ["High Altitude", "Monasteries", "Adventure", "Landscape"],
        bestTime: "May to September"
    },
    {
        id: 6,
        name: "Andaman Islands",
        location: "India",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.7,
        price: "₹30,000",
        priceLabel: "per person",
        category: "beach",
        budget: "luxury",
        region: "asia",
        duration: "5-7 days",
        description: "Pristine beaches, crystal clear waters, and exotic marine life perfect for diving and relaxation.",
        tags: ["Beaches", "Diving", "Islands", "Marine Life"],
        bestTime: "October to May"
    },
    {
        id: 7,
        name: "Rishikesh",
        location: "Uttarakhand, India",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.5,
        price: "₹8,000",
        priceLabel: "per person",
        category: "spiritual",
        budget: "budget",
        region: "asia",
        duration: "3-5 days",
        description: "Yoga capital of the world with spiritual retreats, river rafting, and peaceful ashrams.",
        tags: ["Yoga", "Spiritual", "River Rafting", "Ashrams"],
        bestTime: "February to May, September to November"
    },
    {
        id: 8,
        name: "Shimla",
        location: "Himachal Pradesh, India",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        rating: 4.4,
        price: "₹10,000",
        priceLabel: "per person",
        category: "mountains",
        budget: "budget",
        region: "asia",
        duration: "3-5 days",
        description: "Colonial charm, toy train rides, and cool mountain weather make it a popular hill station.",
        tags: ["Hill Station", "Colonial", "Toy Train", "Mountains"],
        bestTime: "April to June, September to November"
    },
    {
        id: 9,
        name: "Darjeeling",
        location: "West Bengal, India",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.3,
        price: "₹9,000",
        priceLabel: "per person",
        category: "mountains",
        budget: "budget",
        region: "asia",
        duration: "3-4 days",
        description: "Famous tea gardens, scenic toy train rides, and stunning views of Kanchenjunga peaks.",
        tags: ["Tea Gardens", "Toy Train", "Hill Station", "Views"],
        bestTime: "April to June, September to November"
    },
    {
        id: 10,
        name: "Mysore",
        location: "Karnataka, India",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.5,
        price: "₹11,000",
        priceLabel: "per person",
        category: "cultural",
        budget: "budget",
        region: "asia",
        duration: "2-3 days",
        description: "Royal heritage, magnificent palaces, and traditional silk weaving showcase South Indian culture.",
        tags: ["Palace", "Heritage", "Silk", "Culture"],
        bestTime: "October to March"
    },
    {
        id: 11,
        name: "Udaipur",
        location: "Rajasthan, India",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        price: "₹22,000",
        priceLabel: "per person",
        category: "cultural",
        budget: "luxury",
        region: "asia",
        duration: "3-4 days",
        description: "City of lakes with stunning palaces, romantic boat rides, and royal Rajasthani architecture.",
        tags: ["Lakes", "Palaces", "Romantic", "Heritage"],
        bestTime: "October to March"
    },
    {
        id: 12,
        name: "Coorg",
        location: "Karnataka, India",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.4,
        price: "₹13,000",
        priceLabel: "per person",
        category: "nature",
        budget: "mid-range",
        region: "asia",
        duration: "3-4 days",
        description: "Coffee plantations, misty hills, and spice gardens offer a refreshing escape in nature.",
        tags: ["Coffee", "Hills", "Nature", "Plantations"],
        bestTime: "September to March"
    },
    {
        id: 13,
        name: "Varanasi",
        location: "Uttar Pradesh, India",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.6,
        price: "₹7,000",
        priceLabel: "per person",
        category: "spiritual",
        budget: "budget",
        region: "asia",
        duration: "2-3 days",
        description: "Ancient spiritual city with sacred ghats, evening aarti ceremonies, and rich cultural traditions.",
        tags: ["Spiritual", "Ghats", "Ancient", "Culture"],
        bestTime: "November to February"
    },
    {
        id: 14,
        name: "Hampi",
        location: "Karnataka, India",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.7,
        price: "₹8,500",
        priceLabel: "per person",
        category: "cultural",
        budget: "budget",
        region: "asia",
        duration: "2-3 days",
        description: "UNESCO World Heritage site with ancient ruins, boulder landscapes, and Vijayanagara Empire history.",
        tags: ["UNESCO", "Ruins", "History", "Boulders"],
        bestTime: "October to March"
    },
    {
        id: 15,
        name: "Spiti Valley",
        location: "Himachal Pradesh, India",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.9,
        price: "₹28,000",
        priceLabel: "per person",
        category: "adventure",
        budget: "mid-range",
        region: "asia",
        duration: "6-8 days",
        description: "Cold desert landscape, ancient monasteries, and dramatic mountain scenery for adventurous souls.",
        tags: ["Cold Desert", "Monasteries", "Remote", "Adventure"],
        bestTime: "May to October"
    },
    {
        id: 16,
        name: "Munnar",
        location: "Kerala, India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.5,
        price: "₹14,000",
        priceLabel: "per person",
        category: "nature",
        budget: "mid-range",
        region: "asia",
        duration: "3-4 days",
        description: "Rolling tea plantations, pristine lakes, and cool climate create a perfect hill station retreat.",
        tags: ["Tea Plantations", "Lakes", "Cool Climate", "Hills"],
        bestTime: "September to March"
    },
    {
        id: 17,
        name: "Jaisalmer",
        location: "Rajasthan, India",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.6,
        price: "₹19,000",
        priceLabel: "per person",
        category: "cultural",
        budget: "mid-range",
        region: "asia",
        duration: "3-4 days",
        description: "Golden city with magnificent fort, desert safaris, and traditional Rajasthani culture.",
        tags: ["Golden Fort", "Desert Safari", "Culture", "Camel Ride"],
        bestTime: "October to March"
    },
    {
        id: 18,
        name: "Agra",
        location: "Uttar Pradesh, India",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.7,
        price: "₹12,000",
        priceLabel: "per person",
        category: "cultural",
        budget: "mid-range",
        region: "asia",
        duration: "2-3 days",
        description: "Home to the iconic Taj Mahal, Agra Fort, and other magnificent Mughal architectural wonders.",
        tags: ["Taj Mahal", "Mughal", "UNESCO", "Architecture"],
        bestTime: "October to March"
    },
    {
        id: 19,
        name: "Ooty",
        location: "Tamil Nadu, India",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.3,
        price: "₹10,000",
        priceLabel: "per person",
        category: "nature",
        budget: "budget",
        region: "asia",
        duration: "3-4 days",
        description: "Queen of hill stations with botanical gardens, toy train, and pleasant weather year-round.",
        tags: ["Hill Station", "Botanical Garden", "Toy Train", "Pleasant Weather"],
        bestTime: "April to June, September to November"
    },
    {
        id: 20,
        name: "Pushkar",
        location: "Rajasthan, India",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.4,
        price: "₹9,500",
        priceLabel: "per person",
        category: "spiritual",
        budget: "budget",
        region: "asia",
        duration: "2-3 days",
        description: "Sacred city with holy lake, annual camel fair, and vibrant markets in desert setting.",
        tags: ["Holy Lake", "Camel Fair", "Markets", "Desert"],
        bestTime: "October to March"
    }
];

// Global variables
let filteredDestinations = [...destinationsData];
let currentView = 'grid';
let isLoading = false;

// DOM elements
const destinationsGrid = document.getElementById('destinations-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const noResults = document.getElementById('no-results');
const heroSearchInput = document.getElementById('hero-search-input');
const regionFilter = document.getElementById('region-filter');
const categoryFilter = document.getElementById('type-filter');
const budgetFilter = document.getElementById('budget-filter');
const clearFiltersBtn = document.getElementById('clear-filters');
const viewToggleButtons = document.querySelectorAll('.view-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const modalOverlay = document.getElementById('destination-modal');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.getElementById('modal-close');

// Initialize page
function initializePage() {
    addToastStyles();
    renderDestinations();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    heroSearchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter functionality
    regionFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    budgetFilter.addEventListener('change', applyFilters);
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // View toggle (only grid view now)
    document.getElementById('grid-view').addEventListener('click', () => toggleView('grid'));
    
    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreDestinations);
    }
    
    // Modal functionality
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Debounce function for search
function debounce(func, wait) {
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

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredDestinations = [...destinationsData];
    } else {
        filteredDestinations = destinationsData.filter(destination => 
            destination.name.toLowerCase().includes(searchTerm) ||
            destination.location.toLowerCase().includes(searchTerm) ||
            destination.description.toLowerCase().includes(searchTerm) ||
            destination.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    applyFilters();
}

// Apply filters
function applyFilters() {
    let filtered = [...filteredDestinations];
    
    // Apply region filter
    const regionValue = regionFilter.value;
    if (regionValue !== '') {
        filtered = filtered.filter(dest => dest.region === regionValue);
    }
    
    // Apply category filter
    const categoryValue = categoryFilter.value;
    if (categoryValue !== '') {
        filtered = filtered.filter(dest => dest.category === categoryValue);
    }
    
    // Apply budget filter
    const budgetValue = budgetFilter.value;
    if (budgetValue !== '') {
        filtered = filtered.filter(dest => dest.budget === budgetValue);
    }
    
    filteredDestinations = filtered;
    renderDestinations();
}

// Clear all filters
function clearFilters() {
    heroSearchInput.value = '';
    regionFilter.value = '';
    categoryFilter.value = '';
    budgetFilter.value = '';
    
    filteredDestinations = [...destinationsData];
    renderDestinations();
}

// Toggle view (only grid view now)
function toggleView(view) {
    currentView = 'grid'; // Always grid view
    
    // Keep grid button active
    document.getElementById('grid-view').classList.add('active');
    
    // Ensure grid layout
    destinationsGrid.className = 'destinations-grid';
}

// Render destinations
function renderDestinations() {
    // Show loading
    showLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
        showLoading(false);
        
        if (filteredDestinations.length === 0) {
            showNoResults(true);
            return;
        }
        
        showNoResults(false);
        
        destinationsGrid.innerHTML = '';
        filteredDestinations.forEach(destination => {
            const card = createDestinationCard(destination);
            destinationsGrid.appendChild(card);
        });
        
        // Hide load more button (since we're showing all destinations)
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }, 500);
}

// Create destination card
function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.onclick = () => showDestinationDetails(destination);
    
    card.innerHTML = `
        <div class="destination-image">
            <img src="${destination.image}" alt="${destination.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x300/4a90e2/ffffff?text=${encodeURIComponent(destination.name)}'">
            <div class="destination-rating">
                <i class="fas fa-star"></i>
                ${destination.rating}
            </div>
        </div>
        <div class="destination-content">
            <div class="destination-header">
                <h3 class="destination-title">${destination.name}</h3>
                <p class="destination-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${destination.location}
                </p>
            </div>
            <p class="destination-description">${destination.description}</p>
            <div class="destination-tags">
                ${destination.tags.map(tag => `<span class="destination-tag">${tag}</span>`).join('')}
            </div>
            <div class="destination-footer">
                <div class="destination-price">
                    ${destination.price}
                    <span class="price-label">${destination.priceLabel}</span>
                </div>
                <button class="plan-trip-btn" onclick="event.stopPropagation(); planTrip(${destination.id})">
                    <i class="fas fa-route"></i>
                    Plan Trip
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show destination details in modal
function showDestinationDetails(destination) {
    const modalBody = modalContent.querySelector('.modal-body') || createModalBody();
    
    modalBody.innerHTML = `
        <div class="modal-destination-header">
            <img src="${destination.image}" alt="${destination.name}" class="modal-destination-image">
            <div class="modal-destination-info">
                <h2>${destination.name}</h2>
                <p class="modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${destination.location}
                </p>
                <div class="modal-rating">
                    <i class="fas fa-star"></i>
                    ${destination.rating} / 5.0
                </div>
                <div class="modal-price">
                    ${destination.price} <span>${destination.priceLabel}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-destination-details">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> About</h4>
                <p>${destination.description}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-calendar-alt"></i> Best Time to Visit</h4>
                <p>${destination.bestTime}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-clock"></i> Recommended Duration</h4>
                <p>${destination.duration}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-wallet"></i> Budget Category</h4>
                <p class="budget-${destination.budget}">${destination.budget.charAt(0).toUpperCase() + destination.budget.slice(1)}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-tags"></i> Highlights</h4>
                <div class="modal-tags">
                    ${destination.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary large" onclick="planTrip(${destination.id})">
                    <i class="fas fa-route"></i>
                    Start Planning Your Trip
                </button>
            </div>
        </div>
    `;
    
    modalOverlay.style.display = 'flex';
    setTimeout(() => modalOverlay.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

// Create modal body if it doesn't exist
function createModalBody() {
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalContent.appendChild(modalBody);
    return modalBody;
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Plan trip functionality
function planTrip(destinationId) {
    // Check both authentication systems
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authData = localStorage.getItem('travelPlannerAuth');
    
    let isAuthenticated = false;
    
    // Check new auth system first
    if (authData) {
        try {
            const session = JSON.parse(authData);
            if (Date.now() < session.expiresAt || session.rememberMe) {
                isAuthenticated = true;
            }
        } catch (error) {
            console.error('Error parsing auth data:', error);
        }
    }
    
    // Fallback to old auth system
    if (!isAuthenticated && user) {
        isAuthenticated = true;
    }
    
    if (!isAuthenticated) {
        alert('Please login to plan your trip!');
        window.location.href = '../AUTH/index.html';
        return;
    }
    
    // Store selected destination for trip planning
    const destination = destinationsData.find(dest => dest.id === destinationId);
    localStorage.setItem('selectedDestination', JSON.stringify(destination));
    
    // Redirect to itinerary builder
    window.location.href = '../ITINERARY/index.html';
}

// Add to wishlist functionality
function addToWishlist(destinationId) {
    // Check both authentication systems
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authData = localStorage.getItem('travelPlannerAuth');
    
    let isAuthenticated = false;
    let userEmail = null;
    
    // Check new auth system first
    if (authData) {
        try {
            const session = JSON.parse(authData);
            if (Date.now() < session.expiresAt || session.rememberMe) {
                isAuthenticated = true;
                userEmail = session.user.email;
            }
        } catch (error) {
            console.error('Error parsing auth data:', error);
        }
    }
    
    // Fallback to old auth system
    if (!isAuthenticated && user) {
        isAuthenticated = true;
        userEmail = user.email;
    }
    
    if (!isAuthenticated) {
        alert('Please login to add to wishlist!');
        return;
    }
    
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`)) || [];
    
    if (!wishlist.includes(destinationId)) {
        wishlist.push(destinationId);
        localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(wishlist));
        
        // Show success message
        showToast('Added to wishlist!', 'success');
    } else {
        showToast('Already in wishlist!', 'info');
    }
}

// Load more destinations (placeholder for pagination)
function loadMoreDestinations() {
    // This would typically load more data from a server
    showToast('All destinations loaded!', 'info');
    loadMoreBtn.style.display = 'none';
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    destinationsGrid.style.display = show ? 'none' : 'grid';
}

// Show/hide no results message
function showNoResults(show) {
    noResults.style.display = show ? 'block' : 'none';
    destinationsGrid.style.display = show ? 'none' : 'grid';
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast styles dynamically
function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success { background: #10b981; }
        .toast-error { background: #ef4444; }
        .toast-info { background: #3b82f6; }
        
        .toast i {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
}

// Handle page visibility change (for performance)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
    } else {
        // Page is visible, resume operations
    }
});

// Export functions for global access
window.planTrip = planTrip;
window.addToWishlist = addToWishlist;