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
        console.log('loadMesses - Fetching messes from:', `${API_BASE_URL}/messes`);
        const response = await fetch(`${API_BASE_URL}/messes`, {
            headers: getAuthHeaders()
        });

        console.log('loadMesses - Response status:', response.status);

        if (!response.ok) {
            console.error('loadMesses - Failed to load messes:', response.statusText);
            showErrorMessage('Failed to load messes: ' + response.statusText);
            return;
        }

        const data = await response.json();
        console.log('loadMesses - Received data:', data);
        
        allMesses = data.data || [];
        console.log('loadMesses - Total messes loaded:', allMesses.length);
        
        filteredMesses = [...allMesses];
        renderMesses();
    } catch (error) {
        console.error('loadMesses - Error:', error);
        showErrorMessage('Error loading messes: ' + error.message);
    }
}

function getMessCardImage(mess) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
            <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop stop-color="#ff6b35" offset="0%"/>
                    <stop stop-color="#ff9f1c" offset="45%"/>
                    <stop stop-color="#1e90ff" offset="100%"/>
                </linearGradient>
            </defs>
            <rect width="800" height="500" fill="url(#g)"/>
            <circle cx="660" cy="90" r="110" fill="rgba(255,255,255,0.14)"/>
            <circle cx="130" cy="420" r="150" fill="rgba(255,255,255,0.12)"/>
            <text x="60" y="230" fill="white" font-size="48" font-family="Poppins, Arial, sans-serif" font-weight="700">${String(mess.name).replace(/&/g, '&amp;')}</text>
            <text x="60" y="285" fill="rgba(255,255,255,0.88)" font-size="28" font-family="Poppins, Arial, sans-serif">${String(mess.location).replace(/&/g, '&amp;')}</text>
        </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderMesses() {
    const grid = document.getElementById('messesGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');
    const loadingMessage = document.getElementById('loadingMessage');

    if (!grid) return;

    if (loadingMessage) loadingMessage.style.display = 'none';

    if (filteredMesses.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        if (resultCount) resultCount.textContent = '0 messes found';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    if (resultCount) {
        resultCount.textContent = `${filteredMesses.length} mess${filteredMesses.length !== 1 ? 'es' : ''} found`;
    }

    grid.innerHTML = filteredMesses.map((mess) => {
        const isInComparison = comparedMesses.some((m) => m._id === mess._id);
        const rating = (mess.overallRating || 0).toFixed(1);

        return `
        <div class="mess-card reveal active">
            <div class="mess-card-media">
                <img src="${getMessCardImage(mess)}" alt="${mess.name}">
                <div class="mess-card-overlay"></div>
                <div class="rating-badge">Rating ${rating}</div>
                <div class="mess-card-header">
                    <div class="mess-card-title">${mess.name}</div>
                    <div class="mess-card-subtitle">Location: ${mess.location}</div>
                </div>
            </div>
            <div class="mess-card-body">
                <div class="mess-card-location">
                    <span class="mess-card-chip">${mess.foodType}</span>
                    <span class="mess-card-chip">${mess.totalReviews || 0} reviews</span>
                </div>
                <div class="mess-card-info" style="font-size: 0.9em; margin: 10px 0;">
                    <p><strong>Rs ${mess.monthlyPrice}/month</strong></p>
                    <p style="margin-top: 8px;"><strong>Owner:</strong> ${mess.ownerId?.name || 'N/A'}</p>
                    <p><strong>Contact:</strong> ${mess.ownerId?.phone || mess.phoneNumber || 'N/A'}</p>
                    ${mess.ownerId?.email ? `<p><strong>Email:</strong> ${mess.ownerId.email}</p>` : ''}
                </div>
                <div class="mess-card-footer">
                    <span class="mess-rating">Quality | Hygiene | Value</span>
                </div>
                <div class="mess-card-actions">
                    <button class="btn btn-small" onclick="viewMessDetails('${mess._id}')">View Details</button>
                    <button class="btn btn-small ${isInComparison ? 'btn-danger' : 'btn-secondary'}" onclick="toggleComparison('${mess._id}')" id="compare-btn-${mess._id}">
                        ${isInComparison ? 'Comparing' : 'Compare'}
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    updateCompareButtonStyles();
    if (typeof window.refreshRevealElements === 'function') {
        window.refreshRevealElements();
    }
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

    if (applyFilters) applyFilters.addEventListener('click', applyFiltersClick);

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

    if (searchInput) searchInput.addEventListener('input', applyFiltersClick);
}

function applyFiltersClick() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const foodType = document.getElementById('foodTypeFilter')?.value || '';
    const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    const ratingMin = parseFloat(document.getElementById('ratingFilter')?.value) || 0;

    filteredMesses = allMesses.filter((mess) => {
        const matchesSearch = !searchTerm
            || mess.name.toLowerCase().includes(searchTerm)
            || mess.location.toLowerCase().includes(searchTerm);
        const matchesFood = !foodType || mess.foodType === foodType;
        const matchesPrice = mess.monthlyPrice >= priceMin && mess.monthlyPrice <= priceMax;
        const matchesRating = (mess.overallRating || 0) >= ratingMin;
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
    const messToToggle = allMesses.find((mess) => mess._id === messId);
    if (!messToToggle) return;

    const isAlreadyCompared = comparedMesses.some((mess) => mess._id === messId);
    if (isAlreadyCompared) {
        comparedMesses = comparedMesses.filter((mess) => mess._id !== messId);
    } else {
        if (comparedMesses.length >= 5) {
            showNotification('You can compare maximum 5 messes at a time', 'info');
            return;
        }
        comparedMesses.push(messToToggle);
    }

    saveComparisonToStorage();
    renderMesses();
    updateComparisonBar();
}

function saveComparisonToStorage() {
    sessionStorage.setItem('comparedMesses', JSON.stringify(comparedMesses.map((mess) => mess._id)));
}

function loadComparisonFromStorage() {
    try {
        const messIds = JSON.parse(sessionStorage.getItem('comparedMesses') || '[]');
        comparedMesses = messIds.map((id) => allMesses.find((mess) => mess._id === id)).filter(Boolean);
        updateComparisonBar();
    } catch (e) {
        console.error('Error loading comparison:', e);
    }
}

function updateCompareButtonStyles() {
    if (document.getElementById('compare-style')) return;

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
        .comparison-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(16px);
            border-top: 2px solid #667eea;
            padding: 15px;
            box-shadow: 0 -2px 18px rgba(0,0,0,0.12);
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
            border-radius: 999px;
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
    const messesHtml = comparedMesses.map((mess) => `
        <div class="comparison-badge">
            ${mess.name.substring(0, 15)}...
            <button onclick="toggleComparison('${mess._id}')">x</button>
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
    window.location.href = 'compare.html';
}

function clearComparison() {
    comparedMesses = [];
    saveComparisonToStorage();
    renderMesses();
    updateComparisonBar();
}

function showNotification(message, type = 'success') {
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
