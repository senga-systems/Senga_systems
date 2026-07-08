/* ============================================
   SENGA SYSTEMS - Dashboard JavaScript
   ============================================ */

/* ============================================
   THEME PERSISTENCE - RUNS IMMEDIATELY
   ============================================ */
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    // Default is dark mode (no data-theme attribute needed)
})();

/* ============================================
   SUPABASE CONFIGURATION
   ============================================ */
const SUPABASE_URL = 'https://dumkawghavjsiwyosqqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bWthd2doYXZqc2l3eW9zcXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.placeholder';

// Initialize Supabase if not already initialized
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================
   SQL SCRIPT FOR CONSULTATIONS TABLE
   ============================================
   
   Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query):
   
   -- Create consultations table
   CREATE TABLE IF NOT EXISTS consultations (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       user_email VARCHAR(255),
       topic VARCHAR(100) NOT NULL,
       preferred_date DATE NOT NULL,
       preferred_time TIME NOT NULL,
       notes TEXT,
       status VARCHAR(20) DEFAULT 'pending',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
   
   -- Create policy: Users can insert their own consultations
   CREATE POLICY "Users can insert own consultations" ON consultations
       FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   -- Create policy: Users can view their own consultations
   CREATE POLICY "Users can view own consultations" ON consultations
       FOR SELECT USING (auth.uid() = user_id);
   
   -- Create policy: Users can update their own consultations
   CREATE POLICY "Users can update own consultations" ON consultations
       FOR UPDATE USING (auth.uid() = user_id);
   
   -- Create indexes for better performance
   CREATE INDEX idx_consultations_user_id ON consultations(user_id);
   CREATE INDEX idx_consultations_status ON consultations(status);
   
   ============================================ */

/* ============================================
   USER DATA LOADING
   ============================================ */
async function loadUserData() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
            window.location.href = 'login.html';
            return;
        }
        
        const user = session.user;
        const metadata = user.user_metadata || {};
        
        // Get user initials
        const firstName = metadata.first_name || '';
        const lastName = metadata.last_name || '';
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email.substring(0, 2).toUpperCase();
        
        // Update UI elements
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const welcomeName = document.getElementById('welcome-name');
        
        if (userAvatar) userAvatar.textContent = initials;
        if (userName) userName.textContent = firstName ? `${firstName} ${lastName}` : user.email;
        if (userEmail) userEmail.textContent = user.email;
        if (welcomeName) welcomeName.textContent = firstName || 'there';
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

/* ============================================
   CONSULTATION FORM HANDLER
   ============================================ */
const consultationForm = document.getElementById('consultation-form');

if (consultationForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('consultation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    consultationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        const topic = document.getElementById('consultation-topic').value;
        const date = document.getElementById('consultation-date').value;
        const time = document.getElementById('consultation-time').value;
        const notes = document.getElementById('consultation-notes').value;
        
        // Add loading state
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;
        
        try {
            // Get current user
            const { data: { session } } = await supabaseClient.auth.getSession();
            
            if (session) {
                // Save consultation request to Supabase
                const { data, error } = await supabaseClient
                    .from('consultations')
                    .insert([{
                        user_id: session.user.id,
                        user_email: session.user.email,
                        topic: topic,
                        preferred_date: date,
                        preferred_time: time,
                        notes: notes,
                        status: 'pending'
                    }]);
                
                if (error) throw error;
            }
            
            // Show success message
            showNotification('Consultation request submitted! We will contact you shortly.', 'success');
            
            // Reset form
            consultationForm.reset();
            
            // Also send WhatsApp notification option
            const whatsappMessage = encodeURIComponent(
                `Hi, I'd like to schedule a consultation.\n\n` +
                `Topic: ${topic}\n` +
                `Preferred Date: ${date}\n` +
                `Preferred Time: ${time}\n` +
                `Notes: ${notes || 'None'}`
            );
            
            // Offer to send via WhatsApp
            if (confirm('Would you like to also notify us via WhatsApp for faster response?')) {
                window.open(`https://wa.me/265986076400?text=${whatsappMessage}`, '_blank');
            }
            
        } catch (error) {
            console.error('Error submitting consultation:', error);
            showNotification('Request submitted! We will contact you via email.', 'success');
            consultationForm.reset();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification--success {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid rgba(0, 255, 136, 0.3);
                color: #00ff88;
            }
            .notification--error {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }
            .notification--info {
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid rgba(0, 212, 255, 0.3);
                color: #00d4ff;
            }
            .notification button {
                background: none;
                border: none;
                color: inherit;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification button:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ============================================
   THEME TOGGLE BUTTON (if present on page)
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ============================================
   INITIALIZE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});
