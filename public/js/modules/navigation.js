class Navigation {
    constructor(config = {}) {
        this.navToggle = null;
        this.navMenu = null;
        this.config = {
            activeClass: 'active',
            smoothScroll: true,
            ...config,
        };
        this.init();
    }
    init() {
        this.setupMenuToggle();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }
    setupMenuToggle() {
        this.navToggle = document.querySelector('[data-nav-toggle]');
        this.navMenu = document.querySelector('[data-nav-menu]');
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            document.addEventListener('click', (e) => {
                if (!this.navMenu?.contains(e.target) &&
                    !this.navToggle?.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }
    toggleMenu() {
        if (this.navMenu?.classList.contains('open')) {
            this.closeMenu();
        }
        else {
            this.openMenu();
        }
    }
    openMenu() {
        this.navMenu?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    closeMenu() {
        this.navMenu?.classList.remove('open');
        document.body.style.overflow = '';
    }
    setupSmoothScroll() {
        if (!this.config.smoothScroll)
            return;
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        this.closeMenu();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
    setupActiveLinks() {
        const sections = document.querySelectorAll('[data-section]');
        const links = document.querySelectorAll('[data-nav-link]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-section');
                    links.forEach((link) => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add(this.config.activeClass);
                        }
                        else {
                            link.classList.remove(this.config.activeClass);
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        sections.forEach((section) => observer.observe(section));
    }
    setActiveLink(sectionId) {
        const links = document.querySelectorAll('[data-nav-link]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add(this.config.activeClass);
            }
            else {
                link.classList.remove(this.config.activeClass);
            }
        });
    }
}
export default Navigation;
//# sourceMappingURL=navigation.js.map