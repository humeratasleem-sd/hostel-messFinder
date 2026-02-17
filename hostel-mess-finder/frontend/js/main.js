// ===================================
// HOMEPAGE FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadHomepageStats();
});

async function loadHomepageStats() {
    try {
        // Fetch all messes
        const messesResponse = await fetch(`${API_BASE_URL}/messes`, {
            headers: getAuthHeaders()
        });

        // Fetch all reviews
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews`, {
            headers: getAuthHeaders()
        });

        if (messesResponse.ok) {
            const messesData = await messesResponse.json();
            document.getElementById('messCount').textContent = messesData.count || 0;
        }

        // Get review count from messes
        if (messesResponse.ok) {
            const messes = (await messesResponse.json()).data || [];
            const totalReviews = messes.reduce((sum, mess) => sum + (mess.totalReviews || 0), 0);
            document.getElementById('reviewCount').textContent = totalReviews;
        }

        // Count unique users (approximate from localStorage)
        // In production, this would be fetched from backend
        const userCount = localStorage.getItem('userCount') || '0';
        document.getElementById('userCount').textContent = userCount;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}
