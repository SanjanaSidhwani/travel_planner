/**
 * ====================================
 * TRAVEL PLANNER - ADVANCED ITINERARY BUILDER
 * Full-Screen Multi-Day Planning System
 * ====================================
 */

// --- Configuration and Constants ---
const CONFIG = {
    STORAGE_KEY: 'advancedTripItinerary',
    MAX_DAYS: 30,
    MAX_ACTIVITIES_PER_DAY: 20,
    DAY_COLORS: [
        '#0E3B43', '#7D7461', '#EF767A', '#F2CC8F', '#BBDEF0'
    ]
};

// --- Advanced Trip State Management ---
class TripPlannerState {
    constructor() {
        this.currentTrip = null;
        this.currentEditingActivity = null;
        this.init();
    }

    init() {
        this.loadTrip();
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Trip setup events
        document.getElementById('create-trip-btn')?.addEventListener('click', () => this.createTrip());
        document.getElementById('reset-trip-btn')?.addEventListener('click', () => this.resetTrip());
        document.getElementById('add-day-btn')?.addEventListener('click', () => this.addDay());

        // Global action events
        document.getElementById('export-trip-btn')?.addEventListener('click', () => this.exportTrip());
        document.getElementById('clear-all-btn')?.addEventListener('click', () => this.clearAll());

        // Modal events
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-activity')?.addEventListener('click', () => this.closeModal());
        document.getElementById('activity-form')?.addEventListener('submit', (e) => this.saveActivity(e));

        // Close modal on outside click
        document.getElementById('activity-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'activity-modal') this.closeModal();
        });

        // Set default start date to today
        const startDateInput = document.getElementById('start-date');
        if (startDateInput) {
            startDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    createTrip() {
        const tripName = document.getElementById('trip-name')?.value?.trim();
        const tripDays = parseInt(document.getElementById('trip-days')?.value) || 3;
        const startDate = document.getElementById('start-date')?.value;

        if (!tripName) {
            this.showNotification('Please enter a trip name', 'error');
            return;
        }

        if (tripDays < 1 || tripDays > CONFIG.MAX_DAYS) {
            this.showNotification(`Number of days must be between 1 and ${CONFIG.MAX_DAYS}`, 'error');
            return;
        }

        if (!startDate) {
            this.showNotification('Please select a start date', 'error');
            return;
        }

        this.currentTrip = {
            id: this.generateId(),
            name: tripName,
            startDate: startDate,
            days: this.generateDays(tripDays, startDate),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveTrip();
        this.updateUI();
        this.showNotification(`Trip "${tripName}" created successfully!`, 'success');
    }

    generateDays(numDays, startDate) {
        const days = [];
        const start = new Date(startDate);

        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            days.push({
                id: this.generateId(),
                dayNumber: i + 1,
                date: currentDate.toISOString().split('T')[0],
                activities: []
            });
        }

        return days;
    }

    addDay() {
        if (!this.currentTrip) return;

        const lastDay = this.currentTrip.days[this.currentTrip.days.length - 1];
        const nextDate = new Date(lastDay.date);
        nextDate.setDate(nextDate.getDate() + 1);

        const newDay = {
            id: this.generateId(),
            dayNumber: this.currentTrip.days.length + 1,
            date: nextDate.toISOString().split('T')[0],
            activities: []
        };

        this.currentTrip.days.push(newDay);
        this.currentTrip.updatedAt = new Date().toISOString();
        this.saveTrip();
        this.renderDays();
        this.showNotification('New day added!', 'success');
    }

    removeDay(dayId) {
        if (!this.currentTrip) return;

        const dayIndex = this.currentTrip.days.findIndex(day => day.id === dayId);
        if (dayIndex === -1) return;

        if (this.currentTrip.days.length <= 1) {
            this.showNotification('Cannot remove the last day', 'error');
            return;
        }

        const day = this.currentTrip.days[dayIndex];
        if (day.activities.length > 0) {
            if (!confirm(`Day ${day.dayNumber} has ${day.activities.length} activities. Are you sure you want to remove it?`)) {
                return;
            }
        }

        this.currentTrip.days.splice(dayIndex, 1);
        
        // Renumber remaining days
        this.currentTrip.days.forEach((day, index) => {
            day.dayNumber = index + 1;
        });

        this.currentTrip.updatedAt = new Date().toISOString();
        this.saveTrip();
        this.renderDays();
        this.showNotification('Day removed successfully', 'success');
    }

    addActivity(dayId) {
        this.currentEditingActivity = { dayId, activityId: null };
        this.openModal('Add Activity');
    }

    editActivity(dayId, activityId) {
        const day = this.currentTrip?.days.find(d => d.id === dayId);
        const activity = day?.activities.find(a => a.id === activityId);
        
        if (!activity) return;

        this.currentEditingActivity = { dayId, activityId };
        this.populateModal(activity);
        this.openModal('Edit Activity');
    }

    saveActivity(e) {
        e.preventDefault();
        
        if (!this.currentEditingActivity || !this.currentTrip) return;

        // Get form data using getElementById for better compatibility
        const activityData = {
            title: document.getElementById('activity-title')?.value?.trim() || '',
            time: document.getElementById('activity-time')?.value || '',
            duration: parseFloat(document.getElementById('activity-duration')?.value) || 2,
            description: document.getElementById('activity-description')?.value?.trim() || '',
            location: document.getElementById('activity-location')?.value?.trim() || ''
        };

        if (!activityData.title) {
            this.showNotification('Activity title is required', 'error');
            return;
        }

        const day = this.currentTrip.days.find(d => d.id === this.currentEditingActivity.dayId);
        if (!day) return;

        if (this.currentEditingActivity.activityId) {
            // Edit existing activity
            const activity = day.activities.find(a => a.id === this.currentEditingActivity.activityId);
            if (activity) {
                Object.assign(activity, activityData, { updatedAt: new Date().toISOString() });
                this.showNotification('Activity updated successfully!', 'success');
            }
        } else {
            // Add new activity
            if (day.activities.length >= CONFIG.MAX_ACTIVITIES_PER_DAY) {
                this.showNotification(`Maximum ${CONFIG.MAX_ACTIVITIES_PER_DAY} activities per day`, 'error');
                return;
            }

            const newActivity = {
                id: this.generateId(),
                ...activityData,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            day.activities.push(newActivity);
            this.showNotification('Activity added successfully!', 'success');
        }

        this.currentTrip.updatedAt = new Date().toISOString();
        this.saveTrip();
        this.renderDays();
        this.closeModal();
    }

    removeActivity(dayId, activityId) {
        if (!confirm('Are you sure you want to remove this activity?')) return;

        const day = this.currentTrip?.days.find(d => d.id === dayId);
        if (!day) return;

        const activityIndex = day.activities.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
            day.activities.splice(activityIndex, 1);
            this.currentTrip.updatedAt = new Date().toISOString();
            this.saveTrip();
            this.renderDays();
            this.showNotification('Activity removed successfully', 'success');
        }
    }

    toggleActivityCompletion(dayId, activityId) {
        const day = this.currentTrip?.days.find(d => d.id === dayId);
        const activity = day?.activities.find(a => a.id === activityId);
        
        if (activity) {
            activity.completed = !activity.completed;
            activity.updatedAt = new Date().toISOString();
            this.currentTrip.updatedAt = new Date().toISOString();
            this.saveTrip();
            this.renderDays();
        }
    }

    resetTrip() {
        if (this.currentTrip && !confirm('Are you sure you want to start a new trip? All current data will be lost.')) {
            return;
        }

        this.currentTrip = null;
        this.saveTrip();
        this.clearHomeCountdown();
        this.updateUI();
        this.showNotification('Ready to create a new trip!', 'info');
    }

    clearAll() {
        if (!this.currentTrip) return;

        const totalActivities = this.currentTrip.days.reduce((sum, day) => sum + day.activities.length, 0);
        if (totalActivities === 0) {
            this.showNotification('No activities to clear', 'info');
            return;
        }

        if (!confirm(`This will remove all ${totalActivities} activities from your trip. Continue?`)) {
            return;
        }

        this.currentTrip.days.forEach(day => day.activities = []);
        this.currentTrip.updatedAt = new Date().toISOString();
        this.saveTrip();
        this.updateUI();
        this.showNotification('All activities cleared!', 'success');
    }

    clearHomeCountdown() {
        // Clear the home page countdown
        localStorage.removeItem('nextTrip');
        localStorage.removeItem('advancedTripItinerary');
        
        // Trigger storage event for any listening pages
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'nextTrip',
            newValue: null,
            storageArea: localStorage
        }));
        
        // Also trigger event for advancedTripItinerary
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'advancedTripItinerary',
            newValue: null,
            storageArea: localStorage
        }));
    }

    exportTrip() {
        if (!this.currentTrip) {
            this.showNotification('No trip to export', 'error');
            return;
        }

        // Show export options modal
        this.showExportOptions();
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'export-modal-overlay';
        modal.innerHTML = `
            <div class="export-modal-content">
                <div class="export-modal-header">
                    <h3>Export Itinerary</h3>
                    <button class="export-modal-close">&times;</button>
                </div>
                <div class="export-modal-body">
                    <p>Choose your preferred export format:</p>
                    <div class="export-options">
                        <button class="export-option-btn" data-format="pdf">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF Document</span>
                            <small>Formatted for printing</small>
                        </button>
                        <button class="export-option-btn" data-format="txt">
                            <i class="fas fa-file-alt"></i>
                            <span>Text File</span>
                            <small>Simple text format</small>
                        </button>
                        <button class="export-option-btn" data-format="csv">
                            <i class="fas fa-file-csv"></i>
                            <span>CSV Spreadsheet</span>
                            <small>For Excel/Google Sheets</small>
                        </button>
                        <button class="export-option-btn" data-format="json">
                            <i class="fas fa-code"></i>
                            <span>JSON Data</span>
                            <small>For backup/import</small>
                        </button>
                        <button class="export-option-btn" data-format="html">
                            <i class="fas fa-globe"></i>
                            <span>Web Page</span>
                            <small>Viewable in browser</small>
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Event listeners
        modal.querySelector('.export-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }
        });

        modal.querySelectorAll('.export-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.downloadItinerary(format);
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
        });
    }

    downloadItinerary(format) {
        const fileName = `${this.currentTrip.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary`;
        
        switch (format) {
            case 'pdf':
                this.downloadAsPDF(fileName);
                break;
            case 'txt':
                this.downloadAsText(fileName);
                break;
            case 'csv':
                this.downloadAsCSV(fileName);
                break;
            case 'json':
                this.downloadAsJSON(fileName);
                break;
            case 'html':
                this.downloadAsHTML(fileName);
                break;
            default:
                this.showNotification('Export format not supported', 'error');
        }
    }

    downloadAsText(fileName) {
        let content = `${this.currentTrip.name.toUpperCase()}\n`;
        content += `${'='.repeat(this.currentTrip.name.length)}\n\n`;
        content += `Start Date: ${new Date(this.currentTrip.startDate).toLocaleDateString()}\n`;
        content += `Duration: ${this.currentTrip.days.length} days\n\n`;

        this.currentTrip.days.forEach(day => {
            content += `DAY ${day.dayNumber} - ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
            content += `${'-'.repeat(50)}\n`;
            
            if (day.activities.length === 0) {
                content += `No activities planned\n\n`;
            } else {
                day.activities.forEach(activity => {
                    content += `${activity.completed ? '✓' : '○'} ${activity.title}\n`;
                    if (activity.time) content += `   Time: ${activity.time}\n`;
                    if (activity.duration) content += `   Duration: ${activity.duration} hours\n`;
                    if (activity.location) content += `   Location: ${activity.location}\n`;
                    if (activity.description) content += `   Notes: ${activity.description}\n`;
                    content += `\n`;
                });
            }
            content += `\n`;
        });

        this.downloadFile(content, `${fileName}.txt`, 'text/plain');
        this.showNotification('Text file downloaded!', 'success');
    }

    downloadAsCSV(fileName) {
        let csv = 'Day,Date,Activity,Time,Duration (hours),Location,Description,Completed\n';
        
        this.currentTrip.days.forEach(day => {
            if (day.activities.length === 0) {
                csv += `${day.dayNumber},"${new Date(day.date).toLocaleDateString()}","No activities planned","","","","",false\n`;
            } else {
                day.activities.forEach(activity => {
                    csv += `${day.dayNumber},"${new Date(day.date).toLocaleDateString()}","${this.escapeCSV(activity.title)}","${activity.time || ''}","${activity.duration || ''}","${this.escapeCSV(activity.location)}","${this.escapeCSV(activity.description)}",${activity.completed}\n`;
                });
            }
        });

        this.downloadFile(csv, `${fileName}.csv`, 'text/csv');
        this.showNotification('CSV file downloaded!', 'success');
    }

    downloadAsJSON(fileName) {
        const exportData = {
            ...this.currentTrip,
            exportedAt: new Date().toISOString(),
            summary: {
                totalDays: this.currentTrip.days.length,
                totalActivities: this.currentTrip.days.reduce((sum, day) => sum + day.activities.length, 0),
                completedActivities: this.currentTrip.days.reduce((sum, day) => 
                    sum + day.activities.filter(a => a.completed).length, 0)
            }
        };

        this.downloadFile(JSON.stringify(exportData, null, 2), `${fileName}.json`, 'application/json');
        this.showNotification('JSON file downloaded!', 'success');
    }

    downloadAsHTML(fileName) {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(this.currentTrip.name)} - Travel Itinerary</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { text-align: center; margin-bottom: 30px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .trip-title { color: #0E3B43; margin: 0; font-size: 2.5em; font-weight: 300; }
        .trip-info { color: #666; margin-top: 10px; }
        .day-card { background: white; margin: 20px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .day-header { background: #0E3B43; color: white; padding: 15px 20px; }
        .day-title { margin: 0; font-size: 1.3em; }
        .day-date { opacity: 0.9; margin-top: 5px; }
        .activities { padding: 20px; }
        .activity { margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #EF767A; }
        .activity.completed { opacity: 0.7; text-decoration: line-through; border-left-color: #28a745; }
        .activity-title { font-weight: 600; color: #333; margin-bottom: 8px; }
        .activity-meta { font-size: 0.9em; color: #666; margin-bottom: 8px; }
        .activity-meta span { margin-right: 15px; }
        .activity-description { color: #555; font-style: italic; }
        .no-activities { text-align: center; color: #999; padding: 40px; }
        .summary { background: white; padding: 20px; border-radius: 10px; margin-top: 30px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .print-btn { background: #0E3B43; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
        .print-btn:hover { background: #1a5a63; }
        @media print { .print-btn { display: none; } body { background: white; } }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="trip-title">${this.escapeHtml(this.currentTrip.name)}</h1>
        <div class="trip-info">
            ${new Date(this.currentTrip.startDate).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            })} - ${new Date(this.currentTrip.days[this.currentTrip.days.length - 1].date).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            })}
            <br>${this.currentTrip.days.length} days
        </div>
        <button class="print-btn" onclick="window.print()">🖨️ Print Itinerary</button>
    </div>

    ${this.currentTrip.days.map(day => `
        <div class="day-card">
            <div class="day-header">
                <div class="day-title">Day ${day.dayNumber}</div>
                <div class="day-date">${new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}</div>
            </div>
            <div class="activities">
                ${day.activities.length === 0 ? 
                    '<div class="no-activities">No activities planned for this day</div>' :
                    day.activities.map(activity => `
                        <div class="activity ${activity.completed ? 'completed' : ''}">
                            <div class="activity-title">${this.escapeHtml(activity.title)}</div>
                            ${(activity.time || activity.duration || activity.location) ? `
                                <div class="activity-meta">
                                    ${activity.time ? `<span>⏰ ${activity.time}</span>` : ''}
                                    ${activity.duration ? `<span>⏱️ ${activity.duration} hours</span>` : ''}
                                    ${activity.location ? `<span>📍 ${this.escapeHtml(activity.location)}</span>` : ''}
                                </div>
                            ` : ''}
                            ${activity.description ? `<div class="activity-description">${this.escapeHtml(activity.description)}</div>` : ''}
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `).join('')}

    <div class="summary">
        <h3>Trip Summary</h3>
        <p>
            <strong>${this.currentTrip.days.length}</strong> days • 
            <strong>${this.currentTrip.days.reduce((sum, day) => sum + day.activities.length, 0)}</strong> activities • 
            <strong>${this.currentTrip.days.reduce((sum, day) => sum + day.activities.filter(a => a.completed).length, 0)}</strong> completed
        </p>
        <small>Generated on ${new Date().toLocaleDateString()}</small>
    </div>
</body>
</html>`;

        this.downloadFile(html, `${fileName}.html`, 'text/html');
        this.showNotification('HTML file downloaded!', 'success');
    }

    downloadAsPDF(fileName) {
        // For PDF, we'll create an HTML version and instruct user to print as PDF
        const printWindow = window.open('', '_blank');
        const html = this.generatePrintableHTML();
        
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);

        this.showNotification('Print dialog opened - select "Save as PDF" in your browser!', 'info');
    }

    generatePrintableHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHtml(this.currentTrip.name)} - Travel Itinerary</title>
    <style>
        @page { margin: 1in; }
        body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; }
        h1 { color: #0E3B43; text-align: center; margin-bottom: 10px; }
        .trip-info { text-align: center; margin-bottom: 30px; color: #666; }
        .day { page-break-inside: avoid; margin-bottom: 25px; }
        .day-header { background: #0E3B43; color: white; padding: 10px; margin-bottom: 10px; }
        .activity { margin: 8px 0; padding: 8px; border-left: 3px solid #EF767A; background: #f9f9f9; }
        .activity.completed { opacity: 0.7; text-decoration: line-through; }
        .activity-title { font-weight: bold; margin-bottom: 5px; }
        .activity-meta { font-size: 10pt; color: #666; margin-bottom: 5px; }
        .activity-description { font-style: italic; color: #555; }
        .no-activities { text-align: center; color: #999; font-style: italic; }
    </style>
</head>
<body>
    <h1>${this.escapeHtml(this.currentTrip.name)}</h1>
    <div class="trip-info">
        ${new Date(this.currentTrip.startDate).toLocaleDateString()} - 
        ${new Date(this.currentTrip.days[this.currentTrip.days.length - 1].date).toLocaleDateString()}
        (${this.currentTrip.days.length} days)
    </div>

    ${this.currentTrip.days.map(day => `
        <div class="day">
            <div class="day-header">
                <strong>Day ${day.dayNumber} - ${new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric' 
                })}</strong>
            </div>
            ${day.activities.length === 0 ? 
                '<div class="no-activities">No activities planned</div>' :
                day.activities.map(activity => `
                    <div class="activity ${activity.completed ? 'completed' : ''}">
                        <div class="activity-title">${this.escapeHtml(activity.title)}</div>
                        ${(activity.time || activity.duration || activity.location) ? `
                            <div class="activity-meta">
                                ${activity.time ? `Time: ${activity.time} ` : ''}
                                ${activity.duration ? `Duration: ${activity.duration}h ` : ''}
                                ${activity.location ? `Location: ${this.escapeHtml(activity.location)}` : ''}
                            </div>
                        ` : ''}
                        ${activity.description ? `<div class="activity-description">${this.escapeHtml(activity.description)}</div>` : ''}
                    </div>
                `).join('')
            }
        </div>
    `).join('')}
</body>
</html>`;
    }

    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    escapeCSV(str) {
        if (!str) return '';
        return `"${str.replace(/"/g, '""')}"`;
    }

    // --- UI Management ---
    updateUI() {
        const setupSection = document.getElementById('trip-setup');
        const planningSection = document.getElementById('itinerary-planning');

        if (!setupSection || !planningSection) return;

        if (this.currentTrip) {
            setupSection.style.display = 'none';
            planningSection.style.display = 'block';
            this.renderTripInfo();
            this.renderDays();
        } else {
            setupSection.style.display = 'flex';
            planningSection.style.display = 'none';
        }
    }

    renderTripInfo() {
        const tripNameEl = document.getElementById('current-trip-name');
        const tripDurationEl = document.getElementById('trip-duration');

        if (tripNameEl && this.currentTrip) {
            tripNameEl.textContent = this.currentTrip.name;
        }

        if (tripDurationEl && this.currentTrip) {
            const startDate = new Date(this.currentTrip.startDate);
            const endDate = new Date(this.currentTrip.days[this.currentTrip.days.length - 1].date);
            tripDurationEl.textContent = `${this.formatDate(startDate)} - ${this.formatDate(endDate)} (${this.currentTrip.days.length} days)`;
        }
    }

    renderDays() {
        const container = document.getElementById('days-container');
        if (!container || !this.currentTrip) return;

        container.innerHTML = '';

        this.currentTrip.days.forEach((day, index) => {
            const dayCard = this.createDayCard(day, index);
            container.appendChild(dayCard);
        });
    }

    createDayCard(day, index) {
        const dayColor = CONFIG.DAY_COLORS[index % CONFIG.DAY_COLORS.length];
        const dayDate = new Date(day.date);
        
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `
            <div class="day-header">
                <div>
                    <h3>Day ${day.dayNumber}</h3>
                    <div class="day-date">${this.formatDate(dayDate)}</div>
                </div>
                <button class="action-btn tertiary" onclick="tripPlanner.removeDay('${day.id}')" title="Remove Day">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="day-content">
                <ul class="activities-list">
                    ${day.activities.length > 0 ? 
                        day.activities.map(activity => this.createActivityHTML(activity, day.id, dayColor)).join('') :
                        '<li class="empty-day"><i class="fas fa-calendar-alt"></i><p>No activities planned for this day</p></li>'
                    }
                </ul>
                <button class="add-activity-btn" onclick="tripPlanner.addActivity('${day.id}')">
                    <i class="fas fa-plus"></i>
                    Add Activity
                </button>
            </div>
        `;

        return card;
    }

    createActivityHTML(activity, dayId, dayColor) {
        return `
            <li class="activity-item ${activity.completed ? 'completed' : ''}">
                <div class="activity-info">
                    <div class="activity-title">${this.escapeHtml(activity.title)}</div>
                    <div class="activity-meta">
                        ${activity.time ? `<span><i class="fas fa-clock"></i> ${activity.time}</span>` : ''}
                        ${activity.duration ? `<span><i class="fas fa-hourglass-half"></i> ${activity.duration}h</span>` : ''}
                        ${activity.location ? `<span><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(activity.location)}</span>` : ''}
                    </div>
                    ${activity.description ? `<div class="activity-description">${this.escapeHtml(activity.description)}</div>` : ''}
                </div>
                <div class="activity-actions">
                    <button onclick="tripPlanner.toggleActivityCompletion('${dayId}', '${activity.id}')" title="${activity.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class="fas fa-${activity.completed ? 'undo' : 'check'}"></i>
                    </button>
                    <button class="edit-btn" onclick="tripPlanner.editActivity('${dayId}', '${activity.id}')" title="Edit activity">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="tripPlanner.removeActivity('${dayId}', '${activity.id}')" title="Delete activity">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }

    openModal(title) {
        const modal = document.getElementById('activity-modal');
        const modalTitle = document.getElementById('modal-title');
        
        if (modal && modalTitle) {
            modalTitle.textContent = title;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeModal() {
        const modal = document.getElementById('activity-modal');
        const form = document.getElementById('activity-form');
        
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        if (form) {
            form.reset();
        }
        
        this.currentEditingActivity = null;
    }

    populateModal(activity) {
        document.getElementById('activity-title').value = activity.title || '';
        document.getElementById('activity-time').value = activity.time || '';
        document.getElementById('activity-duration').value = activity.duration || 2;
        document.getElementById('activity-description').value = activity.description || '';
        document.getElementById('activity-location').value = activity.location || '';
    }

    // --- Utility Methods ---
    loadTrip() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            this.currentTrip = stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to load trip:', error);
            this.currentTrip = null;
        }
    }

    saveTrip() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.currentTrip));
            // Update home page countdown when trip is saved
            this.updateHomeCountdown();
        } catch (error) {
            console.error('Failed to save trip:', error);
            this.showNotification('Failed to save trip data', 'error');
        }
    }

    updateHomeCountdown() {
        // Update the home page countdown data when trip changes
        if (this.currentTrip && this.currentTrip.startDate) {
            const tripData = {
                date: this.currentTrip.startDate,
                name: this.currentTrip.name || 'Your Trip',
                setAt: new Date().toISOString()
            };
            localStorage.setItem('nextTrip', JSON.stringify(tripData));
            
            // Trigger storage event for any listening pages
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'nextTrip',
                newValue: JSON.stringify(tripData),
                storageArea: localStorage
            }));
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    adjustColor(color, amount) {
        const usePound = color[0] === '#';
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = (num >> 8 & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create and show toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
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
    
    .activity-item.completed {
        opacity: 0.6;
    }
    
    .activity-item.completed .activity-title {
        text-decoration: line-through;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// --- Global Instance ---
let tripPlanner;

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

// --- Initialize Application ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        tripPlanner = new TripPlannerState();
        initializeAuth();
        console.log('✅ Advanced Trip Planner initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Trip Planner:', error);
    }
});

// --- Global Error Handling ---
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'e':
                e.preventDefault();
                tripPlanner?.exportTrip();
                break;
            case 's':
                e.preventDefault();
                tripPlanner?.saveTrip();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        tripPlanner?.closeModal();
    }
});