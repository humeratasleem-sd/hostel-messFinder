const getApiBaseUrl = () => {
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    return isLocal
        ? "http://localhost:5000/api"   // Local development
        : `${window.location.origin}/api`; // Production (Render)
};

const API_BASE_URL = getApiBaseUrl();
function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
}

function getDashboardPath(userType) {
    if (userType === 'admin') return 'admin-dashboard.html';
    if (userType === 'owner') return 'owner-dashboard.html';
    return 'dashboard.html';
}

function refreshRevealElements() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((reveal) => {
        if (reveal.getBoundingClientRect().top < window.innerHeight - 100) {
            reveal.classList.add('active');
        }
    });
}

function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
}

function ensureThemeToggle() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks || document.getElementById('themeToggle')) return;

    const toggleItem = document.createElement('li');
    toggleItem.innerHTML = '<button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle dark mode">Dark</button>';
    navLinks.appendChild(toggleItem);

    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(storedTheme);
    themeToggle.textContent = storedTheme === 'dark' ? 'Light' : 'Dark';

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
        themeToggle.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
    });
}

// Check if user is logged in and update navigation
function updateNavigation() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');

    const dashboardPath = getDashboardPath(userType);

    if (token) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.href = dashboardPath;
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('userType');
    updateNavigation();
    window.location.href = 'index.html';
}

// Get auth headers for API requests
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// Get current user
async function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        }
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
    return null;
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Protect route - redirect to login if not authenticated
function protectRoute() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    ensureThemeToggle();
    updateNavigation();
    updateNavbarState();
    refreshRevealElements();

    const storedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(storedTheme);

    window.addEventListener('scroll', () => {
        updateNavbarState();
        refreshRevealElements();
    });

    window.refreshRevealElements = refreshRevealElements;

    // Add logout event listener
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
