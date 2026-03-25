// ===================================
// DASHBOARD
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    protectRoute(); // Ensure user is logged in
    await loadUserProfile();
    setupDashboardMenu();
});

async function loadUserProfile() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Update sidebar
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userCollege').textContent = user.college;
        document.getElementById('userEmail').textContent = user.email;

        // Update profile tab
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone;
        document.getElementById('profileCollege').textContent = user.college;
        document.getElementById('memberSince').textContent = new Date(user.createdAt).toLocaleDateString();

        // Load user reviews
        await loadUserReviews(user.id);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadUserReviews(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/user/my-reviews`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const reviews = data.data || [];

            document.getElementById('totalReviewsCount').textContent = reviews.length;

            if (reviews.length > 0) {
                const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
                document.getElementById('avgRating').textContent = avgRating;

                const container = document.getElementById('userReviewsContainer');
                container.innerHTML = reviews.map(review => `
                    <div class="user-review-item">
                        <div class="user-review-header">
                            <span class="user-review-mess">${review.messId.name}</span>
                            <span class="user-review-mess" style="color: var(--accent-color);">★ ${review.rating}/5</span>
                        </div>
                        <div style="margin-bottom: 10px;">${review.review}</div>
                        <div style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 10px;">
                            ${new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        <div class="user-review-actions">
                            <button class="review-btn" onclick="openEditModal('${review._id}', ${review.rating}, '${review.review}')">Edit</button>
                            <button class="review-btn delete" onclick="deleteUserReview('${review._id}')">Delete</button>
                        </div>
                    </div>
                `).join('');
                document.getElementById('noUserReviews').style.display = 'none';
            } else {
                document.getElementById('userReviewsContainer').innerHTML = '';
                document.getElementById('noUserReviews').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading user reviews:', error);
    }
}

function setupDashboardMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tabs = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items and tabs
            menuItems.forEach(m => m.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Show corresponding tab
            const tabId = item.dataset.tab;
            const tab = document.getElementById(`${tabId}Tab`);
            if (tab) {
                tab.classList.add('active');
            }
        });
    });
}

async function deleteUserReview(reviewId) {
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
            const user = JSON.parse(localStorage.getItem('user'));
            await loadUserReviews(user.id);
        } else {
            alert('Failed to delete review');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
    }
}

function openEditModal(reviewId, rating, reviewText) {
    const modal = document.getElementById('editReviewModal');
    if (!modal) return;

    // Store review ID for submission
    modal.dataset.reviewId = reviewId;

    // Set initial values
    document.getElementById('editReviewText').value = reviewText;
    document.getElementById('editRatingInput').value = rating;

    // Update star display
    const stars = document.getElementById('editMainRating').querySelectorAll('.star');
    stars.forEach(s => {
        s.classList.toggle('active', s.dataset.value <= rating);
    });

    modal.style.display = 'block';

    // Setup star rating
    setupEditStarRating();

    // Setup form submission
    document.getElementById('editReviewForm').onsubmit = async (e) => {
        e.preventDefault();
        await updateReview(reviewId);
    };

    // Close modal on X click
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Close modal on outside click
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function setupEditStarRating() {
    const container = document.getElementById('editMainRating');
    const stars = container.querySelectorAll('.star');
    const input = document.getElementById('editRatingInput');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.dataset.value;
            input.value = value;

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
        const currentValue = input.value;
        stars.forEach(s => {
            s.style.color = s.dataset.value <= currentValue ? '#FFD700' : '#ddd';
        });
    });
}

async function updateReview(reviewId) {
    const rating = parseInt(document.getElementById('editRatingInput').value);
    const review = document.getElementById('editReviewText').value.trim();

    if (!rating || !review) {
        document.getElementById('editErrorMessage').textContent = 'Please provide a rating and review';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                rating,
                review
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('editReviewModal').style.display = 'none';
            const user = JSON.parse(localStorage.getItem('user'));
            await loadUserReviews(user.id);
        } else {
            document.getElementById('editErrorMessage').textContent = data.message || 'Failed to update review';
        }
    } catch (error) {
        document.getElementById('editErrorMessage').textContent = 'Error updating review: ' + error.message;
    }
}
