// ===================================
// HOMEPAGE FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadHomepageStats();
});

async function loadHomepageStats() {
    try {
        const messesResponse = await fetch(`${API_BASE_URL}/messes`, {
            headers: getAuthHeaders()
        });
        if (!messesResponse.ok) {
            return;
        }

        const messesData = await messesResponse.json();
        const messes = messesData.data || [];
        const totalReviews = messes.reduce((sum, mess) => sum + (mess.totalReviews || 0), 0);
        const connectedStudents = messes.reduce((sum, mess) => sum + ((mess.joinedStudents || []).length), 0);
        const ownerCount = new Set(messes.map((mess) => mess.ownerId?._id).filter(Boolean)).size;

        document.getElementById('messCount').textContent = messesData.count || 0;
        document.getElementById('reviewCount').textContent = totalReviews;
        document.getElementById('studentCount').textContent = connectedStudents + ownerCount;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}
