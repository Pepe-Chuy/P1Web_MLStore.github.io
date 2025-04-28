class AuthAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store token and user info in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(name, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// Create an instance pointing to the users API endpoint
const authAPI = new AuthAPI('http://localhost:3000/api/users');

// DOM interactions for login page
document.addEventListener('DOMContentLoaded', () => {
    // Toggle between login and register forms
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginSection = document.querySelector('.row:not(#register-section)');
    const registerSection = document.getElementById('register-section');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageElement = document.getElementById('login-message');
            
            try {
                await authAPI.login(email, password);
                window.location.href = '/index.html';
            } catch (error) {
                messageElement.textContent = error.message;
                messageElement.classList.remove('d-none');
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const messageElement = document.getElementById('register-message');
            
            if (password !== confirmPassword) {
                messageElement.textContent = 'Passwords do not match';
                messageElement.classList.remove('d-none');
                return;
            }
            
            try {
                await authAPI.register(name, email, password);
                alert('Registration successful! Please login.');
                
                // Switch back to login form
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
            } catch (error) {
                messageElement.textContent = error.message;
                messageElement.classList.remove('d-none');
            }
        });
    }

    // Check if user is already logged in
    if (authAPI.isLoggedIn()) {
        // If we're on the login page, redirect to home
        if (window.location.pathname.includes('login.html')) {
            window.location.href = '/index.html';
        }
    }
});

export { authAPI };