// ===================================
// MESS COMPARISON
// ===================================

let allMesses = [];
let selectedMess1 = null;
let selectedMess2 = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllMesses();
    setupCompareListeners();
});

async function loadAllMesses() {
    try {
        const response = await fetch(`${API_BASE_URL}/messes`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            allMesses = data.data || [];
            populateSelectors();
        }
    } catch (error) {
        console.error('Error loading messes:', error);
    }
}

function populateSelectors() {
    const select1 = document.getElementById('mess1Select');
    const select2 = document.getElementById('mess2Select');

    const options = allMesses.map(mess => 
        `<option value="${mess._id}">${mess.name} - ${mess.location}</option>`
    ).join('');

    select1.innerHTML += options;
    select2.innerHTML += options;
}

function setupCompareListeners() {
    document.getElementById('mess1Select').addEventListener('change', async (e) => {
        selectedMess1 = allMesses.find(m => m._id === e.target.value);
        if (selectedMess1) displayMess1Details();
        updateComparison();
    });

    document.getElementById('mess2Select').addEventListener('change', async (e) => {
        selectedMess2 = allMesses.find(m => m._id === e.target.value);
        if (selectedMess2) displayMess2Details();
        updateComparison();
    });
}

function displayMess1Details() {
    const container = document.getElementById('mess1Details');
    container.style.display = 'block';
    container.innerHTML = getMessDetailsHTML(selectedMess1);
}

function displayMess2Details() {
    const container = document.getElementById('mess2Details');
    container.style.display = 'block';
    container.innerHTML = getMessDetailsHTML(selectedMess2);
}

function getMessDetailsHTML(mess) {
    if (!mess) return '';

    return `
        <div class="mess-card-detailed">
            <h3>${mess.name}</h3>
            <div class="mess-info">
                <p><strong>Location:</strong> ${mess.location}</p>
                <p><strong>Price:</strong> ₹${mess.monthlyPrice}/month</p>
                <p><strong>Food Type:</strong> ${mess.foodType}</p>
                <p><strong>Phone:</strong> ${mess.phoneNumber || 'N/A'}</p>
                <p><strong>Website:</strong> ${mess.website ? `<a href="${mess.website}" target="_blank">${mess.website}</a>` : 'N/A'}</p>
            </div>
            <div class="ratings">
                <div class="rating-item">
                    <strong>Food Quality:</strong>
                    <div class="stars">
                        ${'⭐'.repeat(Math.round(mess.foodQualityRating))}
                        <span>${mess.foodQualityRating.toFixed(1)}/5</span>
                    </div>
                </div>
                <div class="rating-item">
                    <strong>Hygiene:</strong>
                    <div class="stars">
                        ${'⭐'.repeat(Math.round(mess.hygieneRating))}
                        <span>${mess.hygieneRating.toFixed(1)}/5</span>
                    </div>
                </div>
                <div class="rating-item">
                    <strong>Overall:</strong>
                    <div class="stars">
                        ${'⭐'.repeat(Math.round(mess.overallRating))}
                        <span>${mess.overallRating.toFixed(1)}/5</span>
                    </div>
                </div>
            </div>
            <p class="review-count">Reviews: ${mess.reviews || 0}</p>
            <a href="mess-details.html?id=${mess._id}" class="btn btn-primary" style="display: inline-block; margin-top: 10px;">
                View Details & Reviews
            </a>
        </div>
    `;
}

function updateComparison() {
    if (!selectedMess1 || !selectedMess2) {
        document.getElementById('comparisonTable').style.display = 'none';
        return;
    }

    // Update table headers
    document.getElementById('comp-mess1-name').textContent = selectedMess1.name;
    document.getElementById('comp-mess2-name').textContent = selectedMess2.name;

    // Update comparison data
    updateComparisonRow('location', selectedMess1.location, selectedMess2.location);
    updateComparisonRow('price', `₹${selectedMess1.monthlyPrice}`, `₹${selectedMess2.monthlyPrice}`);
    updateComparisonRow('foodType', selectedMess1.foodType, selectedMess2.foodType);
    updateComparisonRow('foodRating', 
        `${selectedMess1.foodQualityRating.toFixed(1)}/5`, 
        `${selectedMess2.foodQualityRating.toFixed(1)}/5`
    );
    updateComparisonRow('hygieneRating', 
        `${selectedMess1.hygieneRating.toFixed(1)}/5`, 
        `${selectedMess2.hygieneRating.toFixed(1)}/5`
    );
    updateComparisonRow('overallRating', 
        `${selectedMess1.overallRating.toFixed(1)}/5`, 
        `${selectedMess2.overallRating.toFixed(1)}/5`
    );
    updateComparisonRow('reviews', 
        selectedMess1.totalReviews || 0, 
        selectedMess2.totalReviews || 0
    );
    updateComparisonRow('phone', 
        selectedMess1.phoneNumber || 'N/A', 
        selectedMess2.phoneNumber || 'N/A'
    );

    document.getElementById('comparisonTable').style.display = 'block';
}

function updateComparisonRow(id, value1, value2) {
    const elem1 = document.getElementById(`comp-mess1-${id}`);
    const elem2 = document.getElementById(`comp-mess2-${id}`);

    if (elem1) elem1.textContent = value1;
    if (elem2) elem2.textContent = value2;
}
