// ===================================
// MESS DETAILS & REVIEWS
// ===================================

let currentMessId = null;
let currentUserReview = null;
let currentOwnerDetails = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Get mess ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentMessId = urlParams.get('id');

    if (!currentMessId) {
        window.location.href = 'messes.html';
        return;
    }

    await loadMessDetails();
    await loadReviews();
    setupReviewForm();
    setupJoinButton();
});

function getBrowseMode() {
    return localStorage.getItem('browseMode');
}

async function loadMessDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/messes/${currentMessId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const mess = data.data;

            document.getElementById('messName').textContent = mess.name;
            document.getElementById('messLocation').textContent = mess.location;
            document.getElementById('messPrice').textContent = mess.monthlyPrice;
            document.getElementById('messFoodType').textContent = mess.foodType;
            document.getElementById('messDescription').textContent = mess.description || 'No description available';
            document.getElementById('messPhone').textContent = `Phone: ${mess.phoneNumber || 'N/A'}`;
            document.getElementById('messWebsite').textContent = `Website: ${mess.website || 'N/A'}`;

            const schedule = mess.foodSchedule || {};
            const breakfast = schedule.breakfast || {};
            const lunch = schedule.lunch || {};
            const dinner = schedule.dinner || {};
            const snacks = schedule.snacks || {};

            document.getElementById('scheduleBreakfastAvailable').textContent = breakfast.available ? 'Yes' : 'No';
            document.getElementById('scheduleBreakfastTime').textContent = breakfast.time || '-';
            document.getElementById('scheduleBreakfastDesc').textContent = breakfast.description || '-';

            document.getElementById('scheduleLunchAvailable').textContent = lunch.available ? 'Yes' : 'No';
            document.getElementById('scheduleLunchTime').textContent = lunch.time || '-';
            document.getElementById('scheduleLunchDesc').textContent = lunch.description || '-';

            document.getElementById('scheduleDinnerAvailable').textContent = dinner.available ? 'Yes' : 'No';
            document.getElementById('scheduleDinnerTime').textContent = dinner.time || '-';
            document.getElementById('scheduleDinnerDesc').textContent = dinner.description || '-';

            document.getElementById('scheduleSnacksAvailable').textContent = snacks.available ? 'Yes' : 'No';
            document.getElementById('scheduleSnacksTime').textContent = snacks.time || '-';
            document.getElementById('scheduleSnacksDesc').textContent = snacks.description || '-';

            // Update ratings
            document.getElementById('messRating').textContent = `★ ${mess.overallRating.toFixed(1)}/5`;
            document.getElementById('reviewCount').textContent = `${mess.totalReviews} reviews`;

            // Update rating bars
            const foodBar = document.getElementById('foodQualityBar');
            const hygieneBar = document.getElementById('hygieneBar');
            const foodRatingText = document.getElementById('foodQualityRating');
            const hygieneRatingText = document.getElementById('hygieneRating');

            if (foodBar) foodBar.style.width = `${(mess.foodQualityRating / 5) * 100}%`;
            if (hygieneBar) hygieneBar.style.width = `${(mess.hygieneRating / 5) * 100}%`;
            if (foodRatingText) foodRatingText.textContent = `${mess.foodQualityRating.toFixed(1)}/5`;
            if (hygieneRatingText) hygieneRatingText.textContent = `${mess.hygieneRating.toFixed(1)}/5`;
        } else {
            window.location.href = 'messes.html';
        }
    } catch (error) {
        console.error('Error loading mess details:', error);
    }
}

async function loadReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/mess/${currentMessId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const reviews = data.data || [];

            const container = document.getElementById('reviewsContainer');
            const noReviews = document.getElementById('noReviewsMessage');

            if (reviews.length === 0) {
                container.innerHTML = '';
                noReviews.style.display = 'block';
            } else {
                noReviews.style.display = 'none';
                container.innerHTML = reviews.map(review => createReviewHTML(review)).join('');
            }
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function createReviewHTML(review) {
    const quantity = review.quantity ? `<span class="review-quantity">📦 ${review.quantity.charAt(0).toUpperCase() + review.quantity.slice(1)}</span>` : '';
    const foodImage = review.foodImage ? `<img src="${review.foodImage}" alt="Food" class="review-food-image" style="max-width: 300px; max-height: 300px; border-radius: 8px; margin-top: 10px;">` : '';
    const voiceNote = review.voiceNote ? `
        <audio controls style="width: 100%; margin-top: 10px;">
            <source src="${review.voiceNote}">
        </audio>
    ` : '';
    
    return `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <span class="review-user">${review.userId.name}</span>
                    <span class="verified-badge">✓ Verified Student</span>
                </div>
                <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="review-rating">★ ${review.rating}/5 ${quantity}</div>
            <div class="review-text">${review.review}</div>
            ${foodImage}
            ${voiceNote}
            ${isAuthenticated() && review.userId._id === JSON.parse(localStorage.getItem('user') || '{}').id ? `
                <div class="review-actions">
                    <button class="review-btn" onclick="editReview('${review._id}')">Edit</button>
                    <button class="review-btn delete" onclick="deleteReview('${review._id}')">Delete</button>
                </div>
            ` : ''}
        </div>
    `;
}

function setupReviewForm() {
    const token = localStorage.getItem('token');
    const formContainer = document.getElementById('reviewFormContainer');
    const loginPrompt = document.getElementById('loginPrompt');
    const modeNotice = document.getElementById('reviewModeNotice');
    const browseMode = getBrowseMode();

    if (browseMode === 'join') {
        if (formContainer) formContainer.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (modeNotice) modeNotice.style.display = 'block';
        return;
    } else if (modeNotice) {
        modeNotice.style.display = 'none';
    }

    if (token) {
        formContainer.style.display = 'block';
        loginPrompt.style.display = 'none';
        setupStarRatings();
    } else {
        formContainer.style.display = 'none';
        loginPrompt.style.display = 'block';
    }

    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', submitReview);
    }

    const reviewText = document.getElementById('reviewText');
    if (reviewText) {
        reviewText.addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = `${e.target.value.length}/1000 characters`;
        });
    }

    // Add image preview functionality
    const foodImageInput = document.getElementById('foodImage');
    if (foodImageInput) {
        foodImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('imagePreview');
                    const container = document.getElementById('imagePreviewContainer');
                    preview.src = event.target.result;
                    container.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const voiceInput = document.getElementById('voiceNote');
    if (voiceInput) {
        voiceInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('voicePreview');
                    const container = document.getElementById('voicePreviewContainer');
                    preview.src = event.target.result;
                    container.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function setupStarRatings() {
    const ratings = ['mainRating', 'foodRating', 'hygieneRatingForm'];

    ratings.forEach(ratingId => {
        const container = document.getElementById(ratingId);
        if (!container) return;

        const stars = container.querySelectorAll('.star');
        const inputId = ratingId === 'mainRating' ? 'ratingInput' : 
                       ratingId === 'foodRating' ? 'foodRatingInput' : 
                       'hygieneRatingInput';

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                document.getElementById(inputId).value = value;

                stars.forEach(s => {
                    s.classList.toggle('active', s.dataset.value <= value);
                });
            });

            star.addEventListener('mouseover', () => {
                const value = star.dataset.value;
                stars.forEach(s => {
                    s.style.color = s.dataset.value <= value ? '#FFD700' : '#ddd';
                });
            });
        });

        container.addEventListener('mouseout', () => {
            const currentValue = document.getElementById(inputId).value;
            stars.forEach(s => {
                s.style.color = s.dataset.value <= currentValue ? '#FFD700' : '#ddd';
            });
        });
    });
}

async function submitReview(e) {
    e.preventDefault();

    if (getBrowseMode() === 'join') {
        document.getElementById('reviewErrorMessage').textContent = 'Reviews are disabled in search mode.';
        return;
    }

    const rating = parseInt(document.getElementById('ratingInput').value);
    const hygieneRating = parseInt(document.getElementById('hygieneRatingInput').value);
    const foodQualityRating = parseInt(document.getElementById('foodRatingInput').value);
    const review = document.getElementById('reviewText').value.trim();
    const quantity = document.getElementById('quantitySelect').value;
    const foodImageFile = document.getElementById('foodImage').files[0];
    const voiceFile = document.getElementById('voiceNote').files[0];

    if (!rating || !review || !quantity) {
        document.getElementById('reviewErrorMessage').textContent = 'Please provide a rating, review, and select quantity';
        return;
    }

    let foodImage = null;
    if (foodImageFile) {
        // Convert image to base64
        foodImage = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(foodImageFile);
        });
    }

    let voiceNote = null;
    if (voiceFile) {
        voiceNote = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(voiceFile);
        });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                messId: currentMessId,
                rating,
                hygieneRating: hygieneRating || rating,
                foodQualityRating: foodQualityRating || rating,
                review,
                quantity,
                foodImage,
                voiceNote
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('reviewForm').reset();
            document.getElementById('ratingInput').value = '0';
            document.getElementById('hygieneRatingInput').value = '0';
            document.getElementById('foodRatingInput').value = '0';
            document.getElementById('quantitySelect').value = '';
            document.getElementById('reviewErrorMessage').textContent = '';
            document.getElementById('imagePreviewContainer').style.display = 'none';
            document.getElementById('voicePreviewContainer').style.display = 'none';
            
            // Reset star display
            document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            
            await loadReviews();
            await loadMessDetails();
        } else {
            document.getElementById('reviewErrorMessage').textContent = data.message || 'Failed to submit review';
        }
    } catch (error) {
        document.getElementById('reviewErrorMessage').textContent = 'Error submitting review: ' + error.message;
    }
}

async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            await loadReviews();
            await loadMessDetails();
        } else {
            alert('Failed to delete review');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
    }
}

function editReview(reviewId) {
    alert('Edit functionality coming soon!');
}
// ===================================
// JOIN MESS FUNCTIONALITY
// ===================================

async function setupJoinButton() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const joinContainer = document.getElementById('joinMessContainer');
    const joinButton = document.getElementById('joinButton');
    const leaveButton = document.getElementById('leaveButton');
    const ownerDetailsCard = document.getElementById('ownerDetailsCard');
    const browseMode = getBrowseMode();

    if (browseMode === 'review' || browseMode === 'join') {
        if (joinContainer) joinContainer.style.display = 'none';
        if (ownerDetailsCard) ownerDetailsCard.style.display = 'none';
        return;
    }

    // Only show join button for authenticated students
    if (token && userType === 'student') {
        joinContainer.style.display = 'block';

        // Check if student is already part of this mess
        if (user.joinedMessId === currentMessId) {
            joinButton.style.display = 'none';
            leaveButton.style.display = 'block';
            ownerDetailsCard.style.display = 'block';
            leaveButton.addEventListener('click', leaveMess);
            await loadAndDisplayOwnerDetails();
        } else {
            joinButton.style.display = 'block';
            leaveButton.style.display = 'none';
            ownerDetailsCard.style.display = 'none';
            joinButton.addEventListener('click', joinMessDirect);
        }
    } else {
        joinContainer.style.display = 'none';
        ownerDetailsCard.style.display = 'none';
    }
}

async function loadAndDisplayOwnerDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/messes/${currentMessId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const mess = data.data;
            
            if (mess.ownerId) {
                const owner = mess.ownerId;
                document.getElementById('ownerNameDisplay').textContent = owner.name || '-';
                document.getElementById('ownerEmailDisplay').textContent = owner.email || '-';
                document.getElementById('ownerPhoneDisplay').textContent = owner.phone || '-';
                document.getElementById('messNameDisplay').textContent = mess.name || '-';
            }
        }
    } catch (error) {
        console.error('Error loading owner details:', error);
    }
}

async function joinMessDirect() {
    try {
        const response = await fetch(`${API_BASE_URL}/messes/${currentMessId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const mess = data.data;
            
            if (mess.ownerId) {
                const owner = mess.ownerId;
                
                // Store owner details for confirmation
                currentOwnerDetails = {
                    messId: currentMessId,
                    messName: mess.name,
                    ownerId: owner._id || owner,
                    ownerName: owner.name || 'Not Available',
                    ownerEmail: owner.email || 'Not Available',
                    ownerPhone: owner.phone || 'Not Available'
                };

                // Populate confirmation modal
                document.getElementById('confirmOwnerName').textContent = currentOwnerDetails.ownerName;
                document.getElementById('confirmOwnerEmail').textContent = currentOwnerDetails.ownerEmail;
                document.getElementById('confirmOwnerPhone').textContent = currentOwnerDetails.ownerPhone;
                document.getElementById('confirmMessName').textContent = currentOwnerDetails.messName;

                // Show confirmation modal
                const modal = document.getElementById('joinConfirmationModal');
                modal.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error loading owner details:', error);
        alert('Error loading owner details');
    }
}

function cancelJoin() {
    document.getElementById('joinConfirmationModal').style.display = 'none';
}

async function confirmJoinNow() {
    if (!currentOwnerDetails) return;

    try {
        // Show loading state
        const confirmBtn = document.getElementById('confirmJoinButton');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = '⏳ Joining...';
        confirmBtn.disabled = true;

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/messes/${currentMessId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.joinedMessId = currentMessId;
            localStorage.setItem('user', JSON.stringify(user));

            // Close modal
            document.getElementById('joinConfirmationModal').style.display = 'none';

            // Show success alert
            alert(`✅ Successfully joined ${currentOwnerDetails.messName}!\n\nOwner Contact:\n📱 ${currentOwnerDetails.ownerPhone}\n📧 ${currentOwnerDetails.ownerEmail}`);
            
            // Show owner details card
            document.getElementById('ownerDetailsCard').style.display = 'block';
            document.getElementById('joinButton').style.display = 'none';
            document.getElementById('leaveButton').style.display = 'block';
            
            // Display owner details
            document.getElementById('ownerNameDisplay').textContent = currentOwnerDetails.ownerName;
            document.getElementById('ownerEmailDisplay').textContent = currentOwnerDetails.ownerEmail;
            document.getElementById('ownerPhoneDisplay').textContent = currentOwnerDetails.ownerPhone;
            document.getElementById('messNameDisplay').textContent = currentOwnerDetails.messName;

            // Add leave event listener
            document.getElementById('leaveButton').addEventListener('click', leaveMess);
            
            // Restore button state
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        } else {
            alert('❌ Error: ' + (data.message || 'Could not join mess'));
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error joining mess:', error);
        alert('❌ Error joining mess. Please try again.');
        
        // Restore button state
        const confirmBtn = document.getElementById('confirmJoinButton');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.disabled = false;
    }
}

async function leaveMess() {
    if (!confirm('⚠️ Are you sure you want to leave this mess? You can join again anytime.')) {
        return;
    }

    try {
        // Show loading state
        const leaveBtn = document.getElementById('leaveButton');
        const originalText = leaveBtn.textContent;
        leaveBtn.textContent = '⏳ Leaving...';
        leaveBtn.disabled = true;

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/messes/${currentMessId}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.joinedMessId = null;
            localStorage.setItem('user', JSON.stringify(user));

            // Show success message
            alert('✅ You have left the mess');
            
            // Hide owner details and show join button
            document.getElementById('ownerDetailsCard').style.display = 'none';
            document.getElementById('leaveButton').style.display = 'none';
            document.getElementById('joinButton').style.display = 'block';
            
            // Restore button state
            leaveBtn.textContent = originalText;
            leaveBtn.disabled = false;
        } else {
            alert('❌ Error: ' + (data.message || 'Could not leave mess'));
            leaveBtn.textContent = originalText;
            leaveBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error leaving mess:', error);
        alert('❌ Error leaving mess. Please try again.');
        
        // Restore button state
        const leaveBtn = document.getElementById('leaveButton');
        leaveBtn.textContent = '❌ Leave Mess';
        leaveBtn.disabled = false;
    }
}