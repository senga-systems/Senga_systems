/* ============================================
   SENGA SYSTEMS - Main JavaScript
   Securing the Digital Future
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    ScrollEffects.init();
    CounterAnimation.init();
    PortfolioFilter.init();
    FormHandler.init();
    ParticleSystem.init();
    ThemeToggle.init();
});

/* ============================================
   THEME TOGGLE
   ============================================ */
const ThemeToggle = {
    init() {
        this.toggle = document.getElementById('theme-toggle');
        if (!this.toggle) return;
        
        // Check for saved theme preference or system preference
        this.loadTheme();
        this.setupToggle();
    },
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (!prefersDark) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        // If prefersDark and no saved theme, dark mode is already default via CSS
    },
    
    setupToggle() {
        this.toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
    },
    
    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add scrolled class for background
            if (currentScroll > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    },
    
    setupMobileMenu() {
        // Toggle menu
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.add('active');
            this.navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close menu
        this.navClose.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Close on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close on outside click
        this.navMenu.addEventListener('click', (e) => {
            if (e.target === this.navMenu) {
                this.closeMenu();
            }
        });
    },
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = 'visible';
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                
                if (navLink) {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        this.navLinks.forEach(link => link.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        });
    }
};

/* ============================================
   SCROLL EFFECTS
   ============================================ */
const ScrollEffects = {
    init() {
        this.setupScrollReveal();
        this.setupParallax();
        this.setupScrollProgress();
    },
    
    setupScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.section__header, .service-card, .portfolio-card, .founder-card, ' +
            '.advantage-card, .cert-card, .protocol-card, .value-card, ' +
            '.about__content, .about__visual, .shield__visual, .shield__protocols, ' +
            '.audit__content, .audit__form-wrapper, .contact__info, .contact__form-wrapper'
        );
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
        
        // Add CSS for reveal animation
        const style = document.createElement('style');
        style.textContent = `
            .reveal-element {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .reveal-element.revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    },
    
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.hero__glow, .shield-3d');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    },
    
    setupScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    }
};

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat__number[data-count]');
        this.setupObserver();
    },
    
    setupObserver() {
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
};

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
const PortfolioFilter = {
    init() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.portfolioCards = document.querySelectorAll('.portfolio-card');
        
        this.setupFilter();
    },
    
    setupFilter() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                // Filter cards
                this.portfolioCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
};

/* ============================================
   FORM HANDLER
   ============================================ */
const FormHandler = {
    init() {
        this.auditForm = document.getElementById('audit-form');
        this.contactForm = document.getElementById('contact-form');
        
        this.setupForms();
    },
    
    setupForms() {
        if (this.auditForm) {
            this.auditForm.addEventListener('submit', (e) => this.handleSubmit(e, 'audit'));
        }
        
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e, 'contact'));
        }
    },
    
    handleSubmit(e, formType) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <span class="btn__icon">
                <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
            </span>
            Processing...
        `;
        submitBtn.disabled = true;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            this.showNotification(
                formType === 'audit' 
                    ? 'Perfect! Our team will call you by EOD tomorrow. <a href="#" style="color: var(--accent-cyan); text-decoration: underline;">Learn what to expect →</a>'
                    : 'Great! We&apos;ve got your request. Someone will reach out within 24 hours.',
                'success'
            );
            
            // Reset form
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    },
    
    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
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
            <button class="notification__close">&times;</button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 16px 24px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                box-shadow: var(--shadow-lg);
            }
            .notification--success {
                border-color: var(--accent-green);
            }
            .notification--error {
                border-color: #ef4444;
            }
            .notification__content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: var(--text-primary);
            }
            .notification--success .notification__content svg {
                color: var(--accent-green);
            }
            .notification--error .notification__content svg {
                color: #ef4444;
            }
            .notification__close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 24px;
                cursor: pointer;
                padding: 0 0 0 16px;
                line-height: 1;
            }
            .notification__close:hover {
                color: var(--text-primary);
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
};

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
const ParticleSystem = {
    init() {
        this.container = document.getElementById('particles');
        if (!this.container) return;
        
        this.createParticles();
    },
    
    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-green)'};
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            this.container.appendChild(particle);
        }
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   BUTTON RIPPLE EFFECT
   ============================================ */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x - 50}px;
            top: ${y - 50}px;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn--primary').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

/* ============================================
   SERVICE CARD TILT EFFECT
   ============================================ */
document.querySelectorAll('.service-card, .portfolio-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ============================================
   TYPING EFFECT FOR HERO
   ============================================ */
const TypingEffect = {
    init(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    },
    
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
};

/* ============================================
   LAZY LOADING FOR IMAGES
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
document.addEventListener('keydown', function(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            Navigation.closeMenu();
        }
    }
});

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log(`
%c███████╗███████╗███╗   ██╗ ██████╗  █████╗ 
%c██╔════╝██╔════╝████╗  ██║██╔════╝ ██╔══██╗
%c███████╗█████╗  ██╔██╗ ██║██║  ███╗███████║
%c╚════██║██╔══╝  ██║╚██╗██║██║   ██║██╔══██║
%c███████║███████╗██║ ╚████║╚██████╔╝██║  ██║
%c╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
                                            
%c🛡️ Securing the Digital Future
%c💻 senga.systems
`,
'color: #00d4ff',
'color: #00d4ff',
'color: #00e5a0',
'color: #00e5a0',
'color: #00ff88',
'color: #00ff88',
'color: #ffffff; font-size: 14px; font-weight: bold',
'color: #a1a1aa; font-size: 12px'
);
