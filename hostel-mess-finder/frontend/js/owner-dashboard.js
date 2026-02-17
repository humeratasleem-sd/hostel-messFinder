// ===================================
// HOSTEL OWNER DASHBOARD
// ===================================

let ownerMess = null;

document.addEventListener('DOMContentLoaded', async () => {
    protectRoute(); // Protect this page for logged-in users
    await loadOwnerData();
    setupEventListeners();
});

async function loadOwnerData() {
    try {
        const user = await getCurrentUser();
        document.getElementById('ownerName').textContent = user.name;

        // Check if owner has a mess
        const messResponse = await fetch(`${API_BASE_URL}/messes/owner/my-mess`, {
            headers: getAuthHeaders()
        });

        if (messResponse.ok) {
            const messData = await messResponse.json();
            if (messData.success && messData.data) {
                ownerMess = messData.data;
                document.getElementById('noListing').style.display = 'none';
                document.getElementById('listingDetails').style.display = 'block';
                displayListingDetails();
                populateSettingsForm();
            } else {
                // No mess yet
                document.getElementById('noListing').style.display = 'block';
                document.getElementById('listingDetails').style.display = 'none';
            }
        } else {
            // No mess yet
            document.getElementById('noListing').style.display = 'block';
                document.getElementById('listingDetails').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading owner data:', error);
        document.getElementById('noListing').style.display = 'block';
    }
}

function displayListingDetails() {
    if (!ownerMess) return;

    const container = document.getElementById('listingDetails');
    const schedule = ownerMess.foodSchedule || {};
    const scheduleRows = [
        { label: 'Breakfast', key: 'breakfast' },
        { label: 'Lunch', key: 'lunch' },
        { label: 'Dinner', key: 'dinner' },
        { label: 'Snacks', key: 'snacks' }
    ].map(({ label, key }) => {
        const item = schedule[key] || {};
        const availableText = item.available ? 'Yes' : 'No';
        const timeText = item.time || '-';
        const descText = item.description || '-';
        return `
            <tr>
                <td>${label}</td>
                <td>${availableText}</td>
                <td>${timeText}</td>
                <td>${descText}</td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div>
            <h3>${ownerMess.name}</h3>
            <p><strong>📍 Location:</strong> ${ownerMess.location}</p>
            <p><strong>💰 Price:</strong> ₹${ownerMess.monthlyPrice}/month</p>
            <p><strong>🍽️ Food Type:</strong> ${ownerMess.foodType}</p>
            <p><strong>📞 Phone:</strong> ${ownerMess.phoneNumber || 'Not set'}</p>
            <p><strong>🌐 Website:</strong> ${ownerMess.website || 'Not set'}</p>
            <p><strong>📝 Description:</strong> ${ownerMess.description || 'Not set'}</p>
            <h4 style="margin-top: 15px;">🍽️ Meal Schedule</h4>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Meal</th>
                        <th>Available</th>
                        <th>Time</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${scheduleRows}
                </tbody>
            </table>
        </div>
    `;
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function editListing() {
    if (!ownerMess) return;

    document.getElementById('settingsName').value = ownerMess.name;
    document.getElementById('settingsPhone').value = ownerMess.phoneNumber || '';
    document.getElementById('settingsWebsite').value = ownerMess.website || '';
    document.getElementById('settingsDescription').value = ownerMess.description || '';

    document.querySelectorAll('.tab-btn')[1].click(); // Switch to settings tab
}

function setupEventListeners() {
    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Add mess form submission
    const messForm = document.getElementById('messForm');
    if (messForm) {
        messForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate required fields
            const messName = document.getElementById('messName').value.trim();
            const messAddress = document.getElementById('messAddress').value.trim();
            const messLocation = document.getElementById('messLocation').value.trim();
            const messContact = document.getElementById('messContact').value.trim();
            const messPrice = document.getElementById('messPrice').value;
            const messFoodType = document.getElementById('messFoodType').value;
            const messDescription = document.getElementById('messDescription').value.trim();
            
            if (!messName || !messAddress || !messLocation || !messContact || !messPrice || !messFoodType || !messDescription) {
                alert('❌ Please fill in all required fields (marked with *)');
                return;
            }
            
            // Validate phone number (10 digits)
            if (!/^\d{10}$/.test(messContact.replace(/\D/g, ''))) {
                alert('❌ Please enter a valid 10-digit phone number');
                return;
            }
            
            // Validate price is positive
            if (parseInt(messPrice) <= 0) {
                alert('❌ Monthly price must be greater than 0');
                return;
            }
            
            const messData = {
                name: messName,
                address: messAddress,
                location: messLocation,
                phoneNumber: messContact,
                monthlyPrice: parseInt(messPrice),
                foodType: messFoodType,
                capacity: document.getElementById('messCapacity').value ? parseInt(document.getElementById('messCapacity').value) : undefined,
                description: messDescription,
                facilities: document.getElementById('messFacilities').value.split(',').map(f => f.trim()).filter(f => f),
                foodSchedule: {
                    breakfast: {
                        available: document.getElementById('breakfastAvailable').checked,
                        time: document.getElementById('breakfastTime').value,
                        description: document.getElementById('breakfastDesc').value
                    },
                    lunch: {
                        available: document.getElementById('lunchAvailable').checked,
                        time: document.getElementById('lunchTime').value,
                        description: document.getElementById('lunchDesc').value
                    },
                    dinner: {
                        available: document.getElementById('dinnerAvailable').checked,
                        time: document.getElementById('dinnerTime').value,
                        description: document.getElementById('dinnerDesc').value
                    },
                    snacks: {
                        available: document.getElementById('snacksAvailable').checked,
                        time: document.getElementById('snacksTime').value,
                        description: document.getElementById('snacksDesc').value
                    }
                }
            };

            try {
                // Show loading state
                const submitBtn = messForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '⏳ Saving...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_BASE_URL}/messes`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(messData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Mess details added successfully!');
                    messForm.reset();
                    location.reload();
                } else {
                    alert('❌ Error: ' + (data.message || 'Failed to add mess'));
                }
                
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                console.error('Error adding mess:', error);
                alert('❌ Error adding mess: ' + error.message);
                
                // Restore button state
                const submitBtn = messForm.querySelector('button[type="submit"]');
                submitBtn.textContent = '💾 Save Mess Details';
                submitBtn.disabled = false;
            }
        });
    }

    document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const settingsName = document.getElementById('settingsName').value.trim();
        const settingsPhone = document.getElementById('settingsPhone').value.trim();
        const settingsWebsite = document.getElementById('settingsWebsite').value.trim();
        const settingsDescription = document.getElementById('settingsDescription').value.trim();
        
        // Validate phone if provided
        if (settingsPhone && !/^\d{10}$/.test(settingsPhone.replace(/\D/g, ''))) {
            alert('❌ Please enter a valid 10-digit phone number');
            return;
        }
        
        const updates = {
            name: settingsName,
            phoneNumber: settingsPhone,
            website: settingsWebsite,
            description: settingsDescription,
            foodSchedule: {
                breakfast: {
                    available: document.getElementById('settingsBreakfastAvailable').checked,
                    time: document.getElementById('settingsBreakfastTime').value,
                    description: document.getElementById('settingsBreakfastDesc').value
                },
                lunch: {
                    available: document.getElementById('settingsLunchAvailable').checked,
                    time: document.getElementById('settingsLunchTime').value,
                    description: document.getElementById('settingsLunchDesc').value
                },
                dinner: {
                    available: document.getElementById('settingsDinnerAvailable').checked,
                    time: document.getElementById('settingsDinnerTime').value,
                    description: document.getElementById('settingsDinnerDesc').value
                },
                snacks: {
                    available: document.getElementById('settingsSnacksAvailable').checked,
                    time: document.getElementById('settingsSnacksTime').value,
                    description: document.getElementById('settingsSnacksDesc').value
                }
            }
        };

        try {
            // Show loading state
            const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⏳ Updating...';
            submitBtn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/messes/${ownerMess._id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                alert('✅ Listing updated successfully!');
                await loadOwnerData();
                
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } else {
                alert('❌ Error updating listing');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            alert('❌ Error updating listing: ' + error.message);
            
            // Restore button state
            const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
            submitBtn.textContent = '💾 Save Changes';
            submitBtn.disabled = false;
        }
    });
}

function showAddMessForm() {
    document.getElementById('noListing').style.display = 'none';
    document.getElementById('addMessForm').style.display = 'block';
}

function cancelAddMess() {
    document.getElementById('addMessForm').style.display = 'none';
    document.getElementById('noListing').style.display = 'block';
}

function populateSettingsForm() {
    if (!ownerMess) return;

    document.getElementById('settingsName').value = ownerMess.name || '';
    document.getElementById('settingsPhone').value = ownerMess.phoneNumber || '';
    document.getElementById('settingsWebsite').value = ownerMess.website || '';
    document.getElementById('settingsDescription').value = ownerMess.description || '';

    const schedule = ownerMess.foodSchedule || {};
    const breakfast = schedule.breakfast || {};
    const lunch = schedule.lunch || {};
    const dinner = schedule.dinner || {};
    const snacks = schedule.snacks || {};

    document.getElementById('settingsBreakfastAvailable').checked = Boolean(breakfast.available);
    document.getElementById('settingsBreakfastTime').value = breakfast.time || '';
    document.getElementById('settingsBreakfastDesc').value = breakfast.description || '';

    document.getElementById('settingsLunchAvailable').checked = Boolean(lunch.available);
    document.getElementById('settingsLunchTime').value = lunch.time || '';
    document.getElementById('settingsLunchDesc').value = lunch.description || '';

    document.getElementById('settingsDinnerAvailable').checked = Boolean(dinner.available);
    document.getElementById('settingsDinnerTime').value = dinner.time || '';
    document.getElementById('settingsDinnerDesc').value = dinner.description || '';

    document.getElementById('settingsSnacksAvailable').checked = Boolean(snacks.available);
    document.getElementById('settingsSnacksTime').value = snacks.time || '';
    document.getElementById('settingsSnacksDesc').value = snacks.description || '';
}
