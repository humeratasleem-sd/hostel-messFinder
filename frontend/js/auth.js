const getApiBaseUrl = () => {
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

    return isLocal
        ? "http://localhost:5000/api"   // Local development
        : `${window.location.origin}/api`; // Production
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
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const path = window.location.pathname;

    // Clear and rebuild navbar
    navLinks.innerHTML = `<li><a href="index.html" ${path.includes('index.html') || path === '/' ? 'class="active"' : ''}>Home</a></li>`;

    // Show "Browse Messes" only for students, not owners/admin
    if (userType === 'student') {
        navLinks.innerHTML += `<li><a href="browse.html" ${path.includes('browse.html') ? 'class="active"' : ''}>Browse Messes</a></li>`;
    }

    if (token) {
        const dashboardPath = getDashboardPath(userType);
        const onDashboard = path.includes('dashboard.html');
        navLinks.innerHTML += `<li><a href="${dashboardPath}" id="dashboardLink" ${onDashboard ? 'class="active"' : ''}>Dashboard</a></li>`;
        navLinks.innerHTML += '<li><a href="#" id="logoutLink">Logout</a></li>';
        
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        navLinks.innerHTML += `<li><a href="login.html" id="loginLink" ${path.includes('login.html') ? 'class="active"' : ''}>Login</a></li>`;
        navLinks.innerHTML += `<li><a href="register.html" id="registerLink" ${path.includes('register.html') ? 'class="active"' : ''}>Register</a></li>`;
    }

    ensureThemeToggle();
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
            if (data.success && data.user) {
                // Update localStorage with fresh user data
                localStorage.setItem('user', JSON.stringify(data.user));
                const studentId = data.user.id || data.user._id;
                if (studentId) localStorage.setItem('studentId', studentId);
            }
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

    // Redirect logged-in users away from login/register pages
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');
    
    if (isAuthenticated() && isAuthPage) {
        const userType = localStorage.getItem('userType');
        window.location.href = getDashboardPath(userType);
        return;
    }

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
