/**
 * Pre-Qualification Form Module
 * Evaluates consultation fit and guides users to next step
 */

const PreQualification = {
    init() {
        this.form = document.getElementById('prequalification-form');
        if (!this.form) return;
        
        this.setupForm();
        this.setupFormLogic();
    },
    
    setupForm() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    setupFormLogic() {
        // Update conditional fields based on concern selection
        const concernSelect = this.form.querySelector('select[name="concern"]');
        const budgetField = this.form.querySelector('[data-shows="budget"]');
        
        if (concernSelect) {
            concernSelect.addEventListener('change', (e) => {
                this.updateConditionalFields(e.target.value);
            });
        }
    },
    
    updateConditionalFields(concern) {
        const budgetField = this.form.querySelector('[data-shows="budget"]');
        
        // Show/hide budget field based on concern
        if (concern === 'budget-limited' || concern === 'exploring') {
            budgetField?.classList.add('hidden');
        } else {
            budgetField?.classList.remove('hidden');
        }
    },
    
    calculateFitScore(formData) {
        let score = 0;
        let fitLevel = 'medium';
        
        // Concern scoring (0-40 points)
        const concernScores = {
            'data-breach': 40,        // High urgency
            'compliance': 35,         // High priority
            'access-control': 30,     // Medium-high
            'infrastructure': 25,     // Medium
            'incident-response': 40,  // High urgency
            'general': 15             // Low
        };
        score += concernScores[formData.concern] || 15;
        
        // Company size scoring (0-30 points)
        const sizeScores = {
            'small': 10,        // Harder fit (constrained budget)
            'medium': 25,       // Perfect fit
            'enterprise': 30    // Very strong fit
        };
        score += sizeScores[formData.size] || 15;
        
        // Budget scoring (0-30 points)
        const budgetScores = {
            'under-10k': 5,
            '10k-50k': 20,
            '50k-100k': 25,
            'over-100k': 30,
            'not-sure': 10
        };
        score += budgetScores[formData.budget] || 10;
        
        // Determine fit level
        if (score >= 70) {
            fitLevel = 'high';
        } else if (score >= 40) {
            fitLevel = 'medium';
        } else {
            fitLevel = 'low';
        }
        
        return { score, fitLevel };
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            concern: formData.get('concern'),
            size: formData.get('size'),
            budget: formData.get('budget'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        const { score, fitLevel } = this.calculateFitScore(data);
        
        console.log(`[v0] Pre-qualification score: ${score} (${fitLevel})`);
        
        // Route based on fit level
        this.routeByFitLevel(fitLevel, data);
    },
    
    routeByFitLevel(fitLevel, data) {
        if (fitLevel === 'high') {
            this.showHighFitPath(data);
        } else if (fitLevel === 'medium') {
            this.showMediumFitPath(data);
        } else {
            this.showLowFitPath(data);
        }
    },
    
    showHighFitPath(data) {
        // High fit: show calendar booking + priority message
        this.showModal({
            title: 'Perfect! You\'re a strong fit.',
            subtitle: 'Your use case aligns with our expertise. Let\'s schedule a priority consultation.',
            content: `
                <div class="fit-message fit-message--high">
                    <p>We typically book priority slots for your profile within <strong>24-48 hours</strong>.</p>
                    <p>Available times:</p>
                    <ul>
                        <li>Tomorrow 10:00 AM - 12:00 PM (your timezone)</li>
                        <li>Tomorrow 2:00 PM - 4:00 PM (your timezone)</li>
                        <li>Friday 9:00 AM - 11:00 AM (your timezone)</li>
                    </ul>
                </div>
            `,
            primaryBtn: 'Pick a Time Slot',
            primaryAction: () => this.showCalendarBooking(data),
            secondaryBtn: 'Send me details first',
            secondaryAction: () => this.sendFollowUpEmail(data, 'high')
        });
    },
    
    showMediumFitPath(data) {
        // Medium fit: show info + standard booking
        this.showModal({
            title: 'Let\'s explore your needs.',
            subtitle: 'Your situation is a good match for our services. Schedule a consultation to discuss.',
            content: `
                <div class="fit-message fit-message--medium">
                    <p><strong>What we'll cover:</strong></p>
                    <ul>
                        <li>Assessment of your current security posture</li>
                        <li>Tailored recommendations for your business size</li>
                        <li>Realistic timeline and investment</li>
                    </ul>
                    <p>Available times (typical turnaround: 3-5 business days)</p>
                </div>
            `,
            primaryBtn: 'Schedule Consultation',
            primaryAction: () => this.showCalendarBooking(data),
            secondaryBtn: 'I need more info first',
            secondaryAction: () => this.sendFollowUpEmail(data, 'medium')
        });
    },
    
    showLowFitPath(data) {
        // Low fit: show resources + nurture email
        this.showModal({
            title: 'Let\'s find the right fit for you.',
            subtitle: 'Your situation might benefit from a different approach. Here\'s what we recommend.',
            content: `
                <div class="fit-message fit-message--low">
                    <p><strong>Based on your profile:</strong></p>
                    <ul>
                        <li>For budget-conscious teams: Check out our <a href="/resources/free-security-checklist">free security checklist</a></li>
                        <li>To explore affordable options: We offer flexible engagement models—let\'s discuss</li>
                        <li>For compliance audits: Our dedicated compliance sprint might be the best fit</li>
                    </ul>
                </div>
            `,
            primaryBtn: 'Let\'s Still Talk',
            primaryAction: () => this.showCalendarBooking(data),
            secondaryBtn: 'Send me resources',
            secondaryAction: () => this.sendFollowUpEmail(data, 'low')
        });
    },
    
    showCalendarBooking(data) {
        console.log('[v0] User selected calendar booking');
        // In production, integrate with Calendly or custom booking system
        window.location.href = `https://calendly.com/senga-systems?name=${encodeURIComponent('Prospect')}&email=${encodeURIComponent(data.email)}`;
    },
    
    sendFollowUpEmail(data, fitLevel) {
        console.log(`[v0] Sending ${fitLevel} fit follow-up email to ${data.email}`);
        
        // Call backend email API
        fetch('/api/send-followup-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                fitLevel: fitLevel,
                concern: data.concern,
                size: data.size,
                budget: data.budget
            })
        })
        .then(res => res.json())
        .then(result => {
            this.showNotification(
                'Perfect! Check your email for next steps.',
                'success'
            );
            // Close modal after notification
            setTimeout(() => this.closeModal(), 2000);
        })
        .catch(error => {
            console.error('[Email API Error]', error);
            this.showNotification(
                'Email sending failed. Please try again.',
                'error'
            );
        });
    },
    
    showModal(options) {
        // Remove existing modal
        const existing = document.querySelector('.fit-modal');
        if (existing) existing.remove();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fit-modal-overlay';
        modal.innerHTML = `
            <div class="fit-modal">
                <button class="fit-modal__close" aria-label="Close">&times;</button>
                <div class="fit-modal__content">
                    <h2 class="fit-modal__title">${options.title}</h2>
                    <p class="fit-modal__subtitle">${options.subtitle}</p>
                    <div class="fit-modal__body">
                        ${options.content}
                    </div>
                    <div class="fit-modal__actions">
                        <button class="btn btn--primary fit-modal__primary">
                            ${options.primaryBtn}
                        </button>
                        <button class="btn btn--outline fit-modal__secondary">
                            ${options.secondaryBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.fit-modal__close').addEventListener('click', 
            () => this.closeModal());
        
        modal.querySelector('.fit-modal__primary').addEventListener('click', 
            options.primaryAction);
        
        modal.querySelector('.fit-modal__secondary').addEventListener('click', 
            options.secondaryAction);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        
        // Add CSS if not already present
        this.injectModalStyles();
    },
    
    closeModal() {
        const modal = document.querySelector('.fit-modal-overlay');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === 'success' 
                        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                        : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },
    
    injectModalStyles() {
        // Check if styles already injected
        if (document.querySelector('style[data-modal-styles]')) return;
        
        const style = document.createElement('style');
        style.setAttribute('data-modal-styles', 'true');
        style.textContent = `
            .fit-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
                padding: 20px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .fit-modal {
                background: var(--bg-secondary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: 40px;
                max-width: 500px;
                width: 100%;
                position: relative;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .fit-modal__close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                font-size: 24px;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .fit-modal__close:hover {
                color: var(--text-primary);
            }
            
            .fit-modal__title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 8px;
                color: var(--text-primary);
            }
            
            .fit-modal__subtitle {
                font-size: 1rem;
                color: var(--text-secondary);
                margin-bottom: 24px;
            }
            
            .fit-modal__body {
                margin-bottom: 24px;
            }
            
            .fit-message {
                background: var(--bg-tertiary);
                padding: 16px;
                border-radius: var(--radius-sm);
                border-left: 3px solid var(--accent-cyan);
            }
            
            .fit-message ul {
                list-style-position: inside;
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.8;
            }
            
            .fit-message a {
                color: var(--accent-cyan);
                text-decoration: underline;
            }
            
            .fit-modal__actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            @media (max-width: 640px) {
                .fit-modal {
                    padding: 24px;
                }
                
                .fit-modal__title {
                    font-size: 1.25rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PreQualification.init());
} else {
    PreQualification.init();
}
