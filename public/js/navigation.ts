/**
 * Navigation Module
 * Handles menu toggle, smooth scrolling, and active link highlighting
 */

interface NavigationConfig {
  menuToggleSelector: string;
  navSelector: string;
  smoothScroll: boolean;
}

class Navigation {
  private menuToggle: HTMLElement | null;
  private nav: HTMLElement | null;
  private config: NavigationConfig;

  constructor(config: Partial<NavigationConfig> = {}) {
    this.config = {
      menuToggleSelector: '#menuToggle',
      navSelector: '.nav',
      smoothScroll: true,
      ...config,
    };

    this.menuToggle = document.querySelector(this.config.menuToggleSelector);
    this.nav = document.querySelector(this.config.navSelector);
    this.init();
  }

  private init(): void {
    this.setupMenuToggle();
    this.setupSmoothScroll();
    this.setupActiveLinks();
    this.setupClickOutside();
  }

  private setupMenuToggle(): void {
    if (!this.menuToggle || !this.nav) return;

    this.menuToggle.addEventListener('click', () => {
      this.nav?.classList.toggle('active');
    });
  }

  private setupSmoothScroll(): void {
    if (!this.config.smoothScroll) return;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e: Event) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          this.nav?.classList.remove('active');
        }
      });
    });
  }

  private setupActiveLinks(): void {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    window.addEventListener('scroll', () => {
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          currentSection = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if ((link as HTMLAnchorElement).getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    });
  }

  private setupClickOutside(): void {
    if (!this.nav) return;

    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        this.nav &&
        !this.nav.contains(target) &&
        !this.menuToggle?.contains(target)
      ) {
        this.nav.classList.remove('active');
      }
    });
  }

  public toggleMenu(): void {
    this.nav?.classList.toggle('active');
  }

  public closeMenu(): void {
    this.nav?.classList.remove('active');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
  });
} else {
  new Navigation();
}
