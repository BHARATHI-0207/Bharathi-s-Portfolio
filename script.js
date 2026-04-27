// ====== Theme Management ======
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Load preferred theme from localStorage
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = htmlEl.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ====== Mobile Menu ======
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navLinks.addEventListener('click', (e) => {
    if(e.target.tagName === 'A') {
        navLinks.classList.remove('active');
    }
});

// ====== Form Validation & Submission ======
const contactForm = document.getElementById('contact-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const formSuccess = document.getElementById('form-success');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset states
    emailError.style.display = 'none';
    formSuccess.classList.add('hidden');

    const name = document.getElementById('name').value.trim();
    const email = emailInput.value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate email
    if (!emailRegex.test(email)) {
        emailError.style.display = 'block';
        return; // Prevent submission
    }

    // Prepare message object
    const newMsg = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        name,
        email,
        message
    };

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    messages.push(newMsg);
    localStorage.setItem('contact_messages', JSON.stringify(messages));

    // Show success & reset form
    formSuccess.classList.remove('hidden');
    contactForm.reset();
    
    setTimeout(() => {
        formSuccess.classList.add('hidden');
    }, 4000);
});

// ====== Admin Login Logic ======
const mainApp = document.getElementById('main-app');
const adminLoginView = document.getElementById('admin-login-view');
const adminDashboardView = document.getElementById('admin-dashboard-view');

const openAdminLink = document.getElementById('open-admin-link');
const closeAdminBtn = document.getElementById('close-admin-login');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const adminLoginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const messagesList = document.getElementById('messages-list');

// Open Admin Login
openAdminLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainApp.classList.add('hidden');
    adminLoginView.classList.remove('hidden');
});

// Close Admin Login
closeAdminBtn.addEventListener('click', () => {
    adminLoginView.classList.add('hidden');
    mainApp.classList.remove('hidden');
});

// Make login logic
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    if (user === 'admin' && pass === 'admin123') {
        // Success
        loginError.classList.add('hidden');
        adminLoginView.classList.add('hidden');
        adminDashboardView.classList.remove('hidden');
        adminLoginForm.reset();
        renderAdminMessages();
    } else {
        // Failure
        loginError.classList.remove('hidden');
    }
});

// Logout logic
adminLogoutBtn.addEventListener('click', () => {
    adminDashboardView.classList.add('hidden');
    mainApp.classList.remove('hidden');
});

// ====== Admin Dashboard Rendering ======
function renderAdminMessages() {
    messagesList.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p style="color:var(--text-muted)">No messages found.</p>';
        return;
    }
    
    // Reverse to show newest first
    messages.reverse().forEach(msg => {
        const div = document.createElement('div');
        div.className = 'msg-card glass-card';
        
        let sanitizedMessage = msg.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let sanitizedName = msg.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        div.innerHTML = `
            <div class="msg-date">${msg.timestamp}</div>
            <div class="msg-name">${sanitizedName}</div>
            <div class="msg-email"><a href="mailto:${msg.email}">${msg.email}</a></div>
            <div class="msg-content">${sanitizedMessage}</div>
        `;
        messagesList.appendChild(div);
    });
}
