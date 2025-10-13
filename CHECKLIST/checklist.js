const STORAGE_KEY = 'travelChecklistData';
const gridContainer = document.getElementById('checklist-grid');
const form = document.getElementById('add-item-form');
const input = document.getElementById('item-input');
const categorySelector = document.getElementById('category-selector');
const addCategoryBtn = document.getElementById('add-category-btn');
const addItemBtn = document.getElementById('add-item-btn');

// --- Data Structure ---
const initialChecklist = {
    'Documents & Security': [
        { text: 'Passport (Valid for 6+ months past return date)', checked: false },
        { text: 'Visa or Entry Permits', checked: false },
        { text: 'Physical Tickets/Boarding Passes (Printed copies)', checked: false },
        { text: 'Digital Copies (Passport, tickets, insurance saved to cloud)', checked: false },
        { text: 'Travel Insurance Policy (Paper copy and app access)', checked: false },
        { text: 'Hotel/Accommodation Confirmation', checked: false },
        { text: 'Local Currency/Foreign Cash', checked: false },
        { text: 'Credit Cards (Notifying bank of travel dates)', checked: false },
    ],
    'Health & Hygiene': [
        { text: 'Prescription Medication (with copy of prescription)', checked: false },
        { text: 'Basic First Aid Kit (Band-Aids, pain relievers)', checked: false },
        { text: 'Sanitizer and Wipes', checked: false },
        { text: 'Sunscreen and Insect Repellent', checked: false },
        { text: 'Shampoo, Conditioner, Soap (Travel size)', checked: false },
        { text: 'Toothbrush and Toothpaste', checked: false },
        { text: 'Emergency Contact List (Written down)', checked: false },
    ],
    'Clothing & Comfort': [
        { text: 'Underwear and Socks (1 pair per day + extras)', checked: false },
        { text: 'Outerwear (Jacket/Sweater appropriate for climate)', checked: false },
        { text: 'Shoes (Comfortable walking shoes + sandals/dress shoes)', checked: false },
        { text: 'Swimsuit/Beachwear (If applicable)', checked: false },
        { text: 'Universal Adapter (for electronics)', checked: false },
        { text: 'Small Backpack/Day Bag', checked: false },
        { text: 'Laundry Bag', checked: false },
    ],
    'Tech & Extras': [
        { text: 'Phone and Charger', checked: false },
        { text: 'Portable Power Bank', checked: false },
        { text: 'Headphones', checked: false },
        { text: 'Camera and Extra SD Cards', checked: false },
        { text: 'E-reader or Book (for flights/downtime)', checked: false },
        { text: 'Locks (for luggage/hostel locker)', checked: false },
        { text: 'Reusable Water Bottle', checked: false },
        { text: 'Snacks (for the journey)', checked: false },
    ],
    'Safety & Emergency': [
        { text: 'Whistle / Pepper Spray', checked: false },
        { text: 'ID Copies', checked: false },
        { text: 'Emergency Cash', checked: false },
        { text: 'Emergency Numbers', checked: false },
        { text: 'Luggage Locks', checked: false },
        { text: 'First Aid / Health Kit', checked: false },
        { text: 'Flashlight / Torch', checked: false },
        { text: 'Travel Documents Backup', checked: false },
        { text: 'Safety App / Tracker', checked: false },
    ],
    'Food & Snacks': [
        { text: 'Non-perishable Snacks', checked: false },
        { text: 'Special Dietary Items', checked: false },
        { text: 'Reusable Utensils', checked: false },
        { text: 'Tea / Coffee Sachets', checked: false },
        { text: 'Protein Bars / Nuts', checked: false },
        { text: 'Instant Meals / Soups', checked: false },
        { text: 'Water Bottle / Flask', checked: false },
        { text: 'Candy / Chocolates', checked: false },
    ],
};

let checklistData;

// --- Data Management (localStorage) ---

/**
 * Loads checklist data from localStorage or uses the initial list.
 */
function loadChecklist() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const stored = JSON.parse(storedData);
            
            // Start with current initial pre-defined categories
            checklistData = JSON.parse(JSON.stringify(initialChecklist));

            // Merge stored check statuses into predefined categories, or add new custom categories
            for (const category in stored) {
                if (checklistData[category]) {
                    // If the category is predefined, merge the check status
                    checklistData[category].forEach(item => {
                       const storedItem = stored[category].find(s => s.text === item.text);
                       if (storedItem) {
                           item.checked = storedItem.checked;
                       }
                    });
                    // Find any custom items added to predefined categories and re-add them
                    stored[category].filter(s => !initialChecklist[category].some(i => i.text === s.text))
                        .forEach(customItem => {
                            checklistData[category].push(customItem);
                        });
                    
                } else {
                    // If category is not predefined, it must be a custom user-created category.
                    // Add the entire custom category to the checklistData.
                    checklistData[category] = stored[category];
                }
            }
        } else {
            // First time load
            checklistData = JSON.parse(JSON.stringify(initialChecklist));
        }
    } catch (error) {
        console.error('Error loading checklist from localStorage:', error);
        console.warn('Using default checklist due to loading error');
        checklistData = JSON.parse(JSON.stringify(initialChecklist));
    }
    populateCategorySelector();
}

/**
 * Saves the current checklist state to localStorage.
 */
function saveChecklist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistData));
    } catch (error) {
        console.error('Error saving checklist to localStorage:', error);
        alert('Unable to save checklist. Please check if your browser supports localStorage.');
    }
}

// --- Utility Functions ---

/**
 * Populates the dropdown selector with all current categories.
 */
function populateCategorySelector() {
    categorySelector.innerHTML = '';
    const categories = Object.keys(checklistData).sort();

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelector.appendChild(option);
    });
}


// --- Rendering ---

/**
 * Renders a single checklist item element.
 */
function createItemElement(item, category) {
    const itemId = `${category.replace(/\s/g, '_')}-${item.text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'checklist-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = itemId;
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => toggleCheck(category, item.text));

    const label = document.createElement('label');
    label.htmlFor = itemId;
    label.textContent = item.text;

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);

    // Add delete button for ALL items (both predefined and custom)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Delete item';
    deleteBtn.addEventListener('click', () => deleteItem(category, item.text));
    itemDiv.appendChild(deleteBtn);

    return itemDiv;
}

/**
 * Renders the entire checklist grid.
 */
function renderChecklist() {
    gridContainer.innerHTML = ''; // Clear the grid

    // Iterate through each category in the data structure
    for (const category in checklistData) {
        const categoryBox = document.createElement('div');
        categoryBox.className = 'category-box';

        const title = document.createElement('h3');
        title.textContent = category;
        categoryBox.appendChild(title);

        const listDiv = document.createElement('div');

        // Iterate through items in the category
        checklistData[category].forEach(item => {
            const itemElement = createItemElement(item, category);
            listDiv.appendChild(itemElement);
        });

        categoryBox.appendChild(listDiv);
        gridContainer.appendChild(categoryBox);
    }
}

// --- Interaction Logic ---

/**
 * Toggles the 'checked' status of a list item.
 */
function toggleCheck(category, itemText) {
    const categoryList = checklistData[category];
    const item = categoryList.find(i => i.text === itemText);

    if (item) {
        item.checked = !item.checked;
        saveChecklist();
        renderChecklist();
    }
}

/**
 * Deletes a custom item from the list.
 */
function deleteItem(category, itemText) {
    const categoryList = checklistData[category];
    const index = categoryList.findIndex(item => item.text === itemText);

    if (index !== -1) {
        // Remove item
        categoryList.splice(index, 1);
        
        // If the category is now empty AND it is a custom category (not in initialChecklist), delete the category entirely.
        const isPredefined = Object.keys(initialChecklist).includes(category);
        if (categoryList.length === 0 && !isPredefined) {
            delete checklistData[category];
            populateCategorySelector();
        }
        
        saveChecklist();
        renderChecklist();
    }
}

/**
 * Handles adding a new custom item via the form.
 */
function handleAddItem(event) {
    event.preventDefault(); 
    const itemText = input.value.trim();
    const selectedCategory = categorySelector.value;

    if (itemText && selectedCategory) {
        let categoryList = checklistData[selectedCategory];

        // Ensure category list exists (it should, since it came from selector)
        if (!categoryList) {
             console.error(`Category ${selectedCategory} not found.`);
             return;
        }

        const isDuplicate = categoryList.some(item => item.text.toLowerCase() === itemText.toLowerCase());

        if (!isDuplicate) {
            categoryList.push({ text: itemText, checked: false });
            saveChecklist();
            renderChecklist();
            input.value = ''; // Clear input field
            
            // Success feedback
            input.style.border = '2px solid #28a745';
            setTimeout(() => {
                input.style.border = '2px solid var(--columbia-blue)';
            }, 1000);
        } else {
            // Better duplicate feedback
            alert(`"${itemText}" already exists in the ${selectedCategory} category!`);
            input.style.border = '2px solid var(--light-coral)';
            input.focus();
            setTimeout(() => {
                input.style.border = '2px solid var(--columbia-blue)';
            }, 2000);
        }
    }
}

/**
 * Handles adding a new custom category.
 */
function handleAddCategory() {
    const categoryName = prompt("Enter the name for the new custom category:");
    if (categoryName && categoryName.trim()) {
        const cleanName = categoryName.trim();
        
        // Additional validation
        if (cleanName.length < 2) {
            alert("Category name must be at least 2 characters long.");
            return;
        }
        
        if (cleanName.length > 50) {
            alert("Category name must be less than 50 characters long.");
            return;
        }
        
        if (checklistData[cleanName]) {
            alert(`Category "${cleanName}" already exists.`);
            return;
        }
        
        // Add new empty category
        checklistData[cleanName] = [];
        saveChecklist();
        
        // Update UI
        populateCategorySelector();
        renderChecklist();
        
        // Optionally select the newly created category
        categorySelector.value = cleanName;
        
        // Success feedback
        alert(`Category "${cleanName}" has been created successfully!`);
    } else {
        alert("Please enter a valid category name.");
    }
}

/**
 * Resets the checklist to initial state with enhanced confirmation
 */
function resetChecklist() {
    // Create a more elegant confirmation dialog
    const confirmReset = confirm(
        "🔄 Reset Travel Checklist\n\n" +
        "This will:\n" +
        "• Remove all custom items and categories\n" +
        "• Uncheck all completed items\n" +
        "• Restore original checklist items\n\n" +
        "Are you sure you want to continue?"
    );
    
    if (confirmReset) {
        // Show loading state
        const resetBtn = document.getElementById('reset-checklist-btn');
        const originalHTML = resetBtn.innerHTML;
        resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
        resetBtn.disabled = true;
        
        // Simulate brief loading for better UX
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEY);
            checklistData = JSON.parse(JSON.stringify(initialChecklist));
            populateCategorySelector();
            renderChecklist();
            
            // Restore button
            resetBtn.innerHTML = originalHTML;
            resetBtn.disabled = false;
            
            // Show success message
            showNotification("✅ Checklist reset successfully!", "success");
        }, 1000);
    }
}

/**
 * Shows a notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
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

// --- Event Listeners ---
form.addEventListener('submit', handleAddItem);
addCategoryBtn.addEventListener('click', handleAddCategory);
document.getElementById('reset-checklist-btn').addEventListener('click', resetChecklist);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    loadChecklist();
    renderChecklist();
});
