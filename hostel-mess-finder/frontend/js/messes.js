// ===================================
// MESS LISTING & FILTERING & COMPARISON
// ===================================

let allMesses = [];
let filteredMesses = [];
let comparedMesses = [];

document.addEventListener('DOMContentLoaded', async () => {
    setupBrowseIntentGate();
    await loadMesses();
    setupFilterListeners();
    loadComparisonFromStorage();
});

function setupBrowseIntentGate() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'student') return;

    const browseMode = localStorage.getItem('browseMode');
    const modal = document.getElementById('browseIntentModal');
    const reviewBtn = document.getElementById('chooseReviewMode');
    const joinBtn = document.getElementById('chooseJoinMode');

    if (!modal || !reviewBtn || !joinBtn) return;

    const showModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (!browseMode) {
        showModal();
    }

    reviewBtn.addEventListener('click', () => {
        localStorage.setItem('browseMode', 'review');
        hideModal();
    });

    joinBtn.addEventListener('click', () => {
        localStorage.setItem('browseMode', 'join');
        hideModal();
    });
}

async function loadMesses() {
    try {
        const response = await fetch(`${API_BASE_URL}/messes`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            allMesses = data.data || [];
            filteredMesses = [...allMesses];
            renderMesses();
        } else {
            showErrorMessage('Failed to load messes');
        }
    } catch (error) {
        console.error('Error loading messes:', error);
        showErrorMessage('Error loading messes: ' + error.message);
    }
}

function renderMesses() {
    const grid = document.getElementById('messesGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');
    const loadingMessage = document.getElementById('loadingMessage');

    if (!grid) return;

    loadingMessage.style.display = 'none';

    if (filteredMesses.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        resultCount.textContent = '0 messes found';
        return;
    }

    noResults.style.display = 'none';
    resultCount.textContent = `${filteredMesses.length} mess${filteredMesses.length !== 1 ? 'es' : ''} found`;

    grid.innerHTML = filteredMesses.map(mess => {
        const isInComparison = comparedMesses.some(m => m._id === mess._id);
        return `
        <div class="mess-card">
            <div class="mess-card-header">
                <div class="mess-card-title">${mess.name}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">📍 ${mess.location}</div>
            </div>
            <div class="mess-card-body">
                <div class="mess-card-location">
                    ${mess.foodType}
                </div>
                <div class="mess-card-info">
                    <p><strong>₹${mess.monthlyPrice}/month</strong></p>
                    <p>Reviews: ${mess.totalReviews || 0}</p>
                </div>
                <div class="mess-card-footer">
                    <span class="mess-rating">★ ${(mess.overallRating || 0).toFixed(1)}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="btn btn-small" onclick="viewMessDetails('${mess._id}')">View Details</button>
                    <button class="btn btn-small ${isInComparison ? 'btn-danger' : 'btn-secondary'}" onclick="toggleComparison('${mess._id}')" id="compare-btn-${mess._id}">
                        ${isInComparison ? '✓ Comparing' : '📊 Compare'}
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    // Update compare button styling
    updateCompareButtonStyles();
}


function viewMessDetails(messId) {
    const userType = localStorage.getItem('userType');
    const browseMode = localStorage.getItem('browseMode');
    const modal = document.getElementById('browseIntentModal');

    if (userType === 'student' && !browseMode && modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    window.location.href = `mess-details.html?id=${messId}`;
}

function setupFilterListeners() {
    const searchInput = document.getElementById('searchInput');
    const foodTypeFilter = document.getElementById('foodTypeFilter');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const ratingFilter = document.getElementById('ratingFilter');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');

    if (applyFilters) {
        applyFilters.addEventListener('click', applyFiltersClick);
    }

    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (foodTypeFilter) foodTypeFilter.value = '';
            if (priceMin) priceMin.value = '';
            if (priceMax) priceMax.value = '';
            if (ratingFilter) ratingFilter.value = '';
            filteredMesses = [...allMesses];
            renderMesses();
        });
    }

    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersClick);
    }
}

function applyFiltersClick() {
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const foodType = document.getElementById('foodTypeFilter')?.value || '';
    const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    const ratingMin = parseFloat(document.getElementById('ratingFilter')?.value) || 0;

    filteredMesses = allMesses.filter(mess => {
        const matchesSearch = !searchInput || 
            mess.name.toLowerCase().includes(searchInput) || 
            mess.location.toLowerCase().includes(searchInput);
        
        const matchesFood = !foodType || mess.foodType === foodType;
        const matchesPrice = mess.monthlyPrice >= priceMin && mess.monthlyPrice <= priceMax;
        const matchesRating = mess.overallRating >= ratingMin;

        return matchesSearch && matchesFood && matchesPrice && matchesRating;
    });

    renderMesses();
}

function showErrorMessage(message) {
    const grid = document.getElementById('messesGrid');
    if (grid) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: red; padding: 40px;">${message}</div>`;
    }
}

// ===== COMPARISON FUNCTIONS =====
function toggleComparison(messId) {
    const messToToggle = allMesses.find(m => m._id === messId);
    
    if (!messToToggle) return;

    const isAlreadyCompared = comparedMesses.some(m => m._id === messId);

    if (isAlreadyCompared) {
        comparedMesses = comparedMesses.filter(m => m._id !== messId);
    } else {
        if (comparedMesses.length >= 5) {
            showNotification('You can compare maximum 5 messes at a time', 'info');
            return;
        }
        comparedMesses.push(messToToggle);
    }

    saveComparisonToStorage();
    renderMesses();
    updateCompareButtonStyles();
    updateComparisonBar();
}

function saveComparisonToStorage() {
    sessionStorage.setItem('comparedMesses', JSON.stringify(comparedMesses.map(m => m._id)));
}

function loadComparisonFromStorage() {
    try {
        const messIds = JSON.parse(sessionStorage.getItem('comparedMesses') || '[]');
        comparedMesses = messIds.map(id => allMesses.find(m => m._id === id)).filter(m => m);
        updateComparisonBar();
    } catch (e) {
        console.error('Error loading comparison:', e);
    }
}

function updateCompareButtonStyles() {
    // Add styling for small buttons if not already in CSS
    if (!document.getElementById('compare-style')) {
        const style = document.createElement('style');
        style.id = 'compare-style';
        style.innerHTML = `
            .btn-small {
                padding: 8px 12px;
                font-size: 0.85rem;
                flex: 1;
                min-width: 100px;
            }
            .btn-danger {
                background-color: #ff6b6b !important;
                color: white !important;
                border: none !important;
            }
            .btn-secondary {
                background-color: #6c757d !important;
                color: white !important;
                border: none !important;
            }
            .comparison-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 2px solid #667eea;
                padding: 15px;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                display: none;
                z-index: 1000;
            }
            .comparison-bar.active {
                display: block;
            }
            .comparison-bar-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            .comparison-mess-list {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                flex: 1;
            }
            .comparison-badge {
                background: #667eea;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 150px;
            }
            .comparison-badge button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 10px;
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function updateComparisonBar() {
    let bar = document.getElementById('comparisonBar');
    
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'comparisonBar';
        bar.className = 'comparison-bar';
        document.body.appendChild(bar);
    }

    if (comparedMesses.length === 0) {
        bar.classList.remove('active');
        return;
    }

    bar.classList.add('active');
    const messesHtml = comparedMesses.map(mess => `
        <div class="comparison-badge">
            ${mess.name.substring(0, 15)}... 
            <button onclick="toggleComparison('${mess._id}')">✕</button>
        </div>
    `).join('');

    bar.innerHTML = `
        <div class="comparison-bar-content">
            <div class="comparison-mess-list">${messesHtml}</div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="goToComparison()">View Comparison (${comparedMesses.length})</button>
                <button class="btn btn-secondary" onclick="clearComparison()">Clear All</button>
            </div>
        </div>
    `;
}

function goToComparison() {
    if (comparedMesses.length < 2) {
        showNotification('Select at least 2 messes to compare', 'info');
        return;
    }
    window.location.href = `compare.html`;
}

function clearComparison() {
    comparedMesses = [];
    saveComparisonToStorage();
    renderMesses();
    updateComparisonBar();
}

function showNotification(message, type = 'success') {
    // Using the notification system from notifications.js if available
    if (typeof showSuccessMessage === 'function') {
        if (type === 'error') {
            showErrorMessage(message);
        } else if (type === 'info') {
            showInfoMessage(message);
        } else {
            showSuccessMessage(message);
        }
    } else {
        alert(message);
    }
}

