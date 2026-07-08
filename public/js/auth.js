/* ============================================
   SENGA SYSTEMS - Authentication JavaScript
   Supabase Integration
   ============================================ */

// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase credentials from your dashboard
const SUPABASE_URL = 'https://dumkawghavjsiwyosqqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bWthd2doYXZqc2l3eW9zcXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.placeholder';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');

/* ============================================
   THEME PERSISTENCE ACROSS ALL PAGES
   ============================================ */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    // Default is dark mode via CSS
}

// Initialize theme immediately on all pages
initTheme();

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

/* ============================================
   ERROR HANDLING
   ============================================ */
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'flex';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function showSuccess(message) {
    if (errorMessage) {
        errorMessage.className = 'success-message';
        errorMessage.textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/* ============================================
   PASSWORD TOGGLE
   ============================================ */
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const eyeOpen = this.querySelector('.eye-open');
        const eyeClosed = this.querySelector('.eye-closed');
        
        if (input.type === 'password') {
            input.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            input.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    });
});

/* ============================================
   PASSWORD STRENGTH METER
   ============================================ */
const passwordInput = document.getElementById('password');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

if (passwordInput && strengthFill && strengthText) {
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthFill.style.width = '0';
            strengthText.textContent = 'Enter a password';
        } else if (strength < 2) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (strength < 4) {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Medium strength';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

/* ============================================
   LOGIN FORM HANDLER
   ============================================ */
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Successfully logged in
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            showError(error.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

/* ============================================
   SIGNUP FORM HANDLER
   ============================================ */
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company')?.value || '';
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('terms').checked;
        const newsletter = document.getElementById('newsletter')?.checked || false;
        
        // Validation
        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long.');
            return;
        }
        
        if (!termsAccepted) {
            showError('Please accept the Terms of Service and Privacy Policy.');
            return;
        }
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        company: company,
                        newsletter: newsletter
                    }
                }
            });
            
            if (error) throw error;
            
            // Successfully signed up
            showSuccess('Account created successfully! Please check your email to verify your account.');
            
            // Clear form
            signupForm.reset();
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'login.html?verified=pending';
            }, 3000);
            
        } catch (error) {
            showError(error.message || 'Failed to create account. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

/* ============================================
   SOCIAL LOGIN HANDLERS (Google & GitHub OAuth)
   ============================================ */
/*
 * SETUP INSTRUCTIONS FOR OAUTH PROVIDERS:
 * 
 * 1. GOOGLE OAUTH:
 *    a. Go to Google Cloud Console: https://console.cloud.google.com/
 *    b. Create a new project or select existing one
 *    c. Go to "APIs & Services" > "Credentials"
 *    d. Click "Create Credentials" > "OAuth client ID"
 *    e. Select "Web application"
 *    f. Add authorized redirect URI: https://dumkawghavjsiwyosqqw.supabase.co/auth/v1/callback
 *    g. Copy Client ID and Client Secret
 *    h. In Supabase Dashboard > Authentication > Providers > Google
 *    i. Enable Google and paste Client ID & Client Secret
 * 
 * 2. GITHUB OAUTH:
 *    a. Go to GitHub: Settings > Developer settings > OAuth Apps
 *    b. Click "New OAuth App"
 *    c. Set Homepage URL: https://your-domain.com
 *    d. Set Authorization callback URL: https://dumkawghavjsiwyosqqw.supabase.co/auth/v1/callback
 *    e. Copy Client ID and generate Client Secret
 *    f. In Supabase Dashboard > Authentication > Providers > GitHub
 *    g. Enable GitHub and paste Client ID & Client Secret
 */

const googleLoginBtn = document.getElementById('google-login') || document.getElementById('google-signup');
const githubLoginBtn = document.getElementById('github-login') || document.getElementById('github-signup');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async function() {
        this.disabled = true;
        this.innerHTML = '<span class="loading-spinner"></span> Connecting...';
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/dashboard.html',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });
            
            if (error) throw error;
        } catch (error) {
            showError('Failed to sign in with Google. Please ensure Google OAuth is configured in Supabase.');
            this.disabled = false;
            this.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Google`;
        }
    });
}

if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', async function() {
        this.disabled = true;
        this.innerHTML = '<span class="loading-spinner"></span> Connecting...';
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin + '/auth/dashboard.html'
                }
            });
            
            if (error) throw error;
        } catch (error) {
            showError('Failed to sign in with GitHub. Please ensure GitHub OAuth is configured in Supabase.');
            this.disabled = false;
            this.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub`;
        }
    });
}

/* ============================================
   AUTH STATE LISTENER
   ============================================ */
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        // User is signed in, redirect if on login/signup page
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html')) {
            window.location.href = 'dashboard.html';
        }
    }
    
    if (event === 'SIGNED_OUT') {
        // User is signed out, redirect if on protected page
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

/* ============================================
   CHECK AUTH ON PAGE LOAD
   ============================================ */
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If on dashboard and not authenticated, redirect to login
    if (window.location.pathname.includes('dashboard.html') && !session) {
        window.location.href = 'login.html';
    }
    
    // If on login/signup and authenticated, redirect to dashboard
    if ((window.location.pathname.includes('login.html') || 
         window.location.pathname.includes('signup.html')) && session) {
        window.location.href = 'dashboard.html';
    }
    
    return session;
}

// Run auth check
checkAuth();

/* ============================================
   LOGOUT FUNCTION
   ============================================ */
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Make logout available globally
window.logout = logout;
