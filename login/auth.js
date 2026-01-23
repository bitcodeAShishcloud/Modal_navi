// Navi AI - Authentication System
// Created by Ashish Gupta - January 2026

// ====================
// UTILITY FUNCTIONS
// ====================

function generateUserId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `user_${timestamp}_${random}`;
}

function getCurrentDateTime() {
    const now = new Date();
    return {
        timestamp: now.toISOString(),
        formatted: now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ====================
// ENCRYPTION
// ====================

const ENCRYPTION_KEY = 'NaviAI_SecureAuth_2026';

function encryptData(data) {
    try {
        const text = JSON.stringify(data);
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            encrypted += String.fromCharCode(
                text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
            );
        }
        return btoa(encrypted);
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

function decryptData(encrypted) {
    try {
        const text = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < text.length; i++) {
            decrypted += String.fromCharCode(
                text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
            );
        }
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

// ====================
// USER MANAGEMENT
// ====================

function saveUserData(userData) {
    try {
        // Encrypt and save to localStorage
        const encrypted = encryptData(userData);
        localStorage.setItem('naviAI_user', encrypted);
        sessionStorage.setItem('naviAI_session', JSON.stringify(userData));
        
        // Clear manual logout flag on new login
        localStorage.removeItem('naviAI_manualLogout');
        
        console.log('✅ User authenticated:', userData.username);
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
}

function checkExistingUser() {
    // Check if user manually logged out
    const manualLogout = localStorage.getItem('naviAI_manualLogout');
    if (manualLogout === 'true') {
        console.log('🚫 Manual logout detected - skipping auto-login');
        return null;
    }
    
    const encrypted = localStorage.getItem('naviAI_user');
    if (encrypted) {
        const userData = decryptData(encrypted);
        if (userData) {
            console.log('✅ Existing user found:', userData.username);
            return userData;
        }
    }
    return null;
}

// ====================
// UI FUNCTIONS
// ====================

function showAlert(message, type = 'error') {
    const alertElement = document.getElementById('alertMessage');
    alertElement.textContent = message;
    alertElement.className = `alert ${type}`;
    
    setTimeout(() => {
        alertElement.className = 'alert';
    }, 4000);
}

function setLoading(button, isLoading, text = '') {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<span class="btn-icon">⏳</span>${text || 'Loading...'}`;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || text;
    }
}

// ====================
// EVENT HANDLERS
// ====================

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const loginBtn = document.getElementById('loginBtn');
    
    // Validation
    if (username.length < 3) {
        showAlert('Username must be at least 3 characters long', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Set loading state
    setLoading(loginBtn, true, 'Signing in...');
    
    // Simulate async operation
    setTimeout(() => {
        const dateTime = getCurrentDateTime();
        const userData = {
            userId: generateUserId(),
            username: username,
            email: email,
            isGuest: false,
            loginDate: dateTime,
            createdAt: dateTime.formatted,
            lastLogin: dateTime.timestamp
        };
        
        if (saveUserData(userData)) {
            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            setLoading(loginBtn, false);
            showAlert('Failed to save user data. Please try again.', 'error');
        }
    }, 800);
}

function handleGuestLogin() {
    const guestBtn = document.getElementById('guestBtn');
    setLoading(guestBtn, true, 'Loading...');
    
    setTimeout(() => {
        const dateTime = getCurrentDateTime();
        const userData = {
            userId: `guest_${Date.now()}`,
            username: 'Guest User',
            email: 'guest@naviai.local',
            isGuest: true,
            loginDate: dateTime,
            createdAt: dateTime.formatted,
            lastLogin: dateTime.timestamp
        };
        
        if (saveUserData(userData)) {
            showAlert('Welcome, Guest! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } else {
            setLoading(guestBtn, false);
            showAlert('Failed to login as guest. Please try again.', 'error');
        }
    }, 500);
}

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user already logged in
    const existingUser = checkExistingUser();
    if (existingUser) {
        showAlert('Already logged in! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        return;
    }
    
    // Attach event listeners
    const loginForm = document.getElementById('loginForm');
    const guestBtn = document.getElementById('guestBtn');
    
    loginForm.addEventListener('submit', handleLogin);
    guestBtn.addEventListener('click', handleGuestLogin);
    
    // Focus username input
    document.getElementById('username').focus();
    
    console.log('🔐 Navi AI Login System Ready');
});
