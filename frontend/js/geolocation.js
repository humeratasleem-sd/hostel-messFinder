// ===================================
// GEOLOCATION & NEARBY HOSTELS
// ===================================

let userLocation = null;
let nearbyMesses = [];

// Get user's location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                console.log('📍 Location found:', userLocation);
                resolve(userLocation);
            },
            (error) => {
                console.error('📍 Location error:', error);
                reject(error);
            }
        );
    });
}

// Load nearby messes
async function loadNearbyMesses(distance = 5) {
    try {
        if (!userLocation) {
            await getUserLocation();
        }

        const response = await fetch(
            `${API_BASE_URL}/messes/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&distance=${distance}`,
            {
                headers: getAuthHeaders()
            }
        );

        if (response.ok) {
            const data = await response.json();
            nearbyMesses = data.data || [];
            console.log('🏠 Nearby messes loaded:', nearbyMesses.length);
            return nearbyMesses;
        }
    } catch (error) {
        console.error('Error loading nearby messes:', error);
        return [];
    }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Display location on map (requires map library)
function displayLocationOnMap(mapElementId) {
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement || !userLocation) return;

    mapElement.innerHTML = `
        <div class="location-info">
            <p>📍 Your Location:</p>
            <p>Latitude: ${userLocation.latitude.toFixed(4)}</p>
            <p>Longitude: ${userLocation.longitude.toFixed(4)}</p>
            <p>Accuracy: ${Math.round(userLocation.accuracy)}m</p>
        </div>
    `;
}
