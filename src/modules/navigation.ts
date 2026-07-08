/**
 * Navigation Module
 * Handles menu navigation, smooth scrolling, and active link management
 */

interface NavigationConfig {
  activeClass: string;
  smoothScroll: boolean;
}

class Navigation {
  private config: NavigationConfig;
  private navToggle: HTMLElement | null = null;
  private navMenu: HTMLElement | null = null;

  constructor(config: Partial<NavigationConfig> = {}) {
    this.config = {
      activeClass: 'active',
      smoothScroll: true,
      ...config,
    };

    this.init();
  }

  private init(): void {
    this.setupMenuToggle();
    this.setupSmoothScroll();
    this.setupActiveLinks();
  }

  private setupMenuToggle(): void {
    this.navToggle = document.querySelector('[data-nav-toggle]');
    this.navMenu = document.querySelector('[data-nav-menu]');

    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
      document.addEventListener('click', (e) => {
        if (
          !this.navMenu?.contains(e.target as Node) &&
          !this.navToggle?.contains(e.target as Node)
        ) {
          this.closeMenu();
        }
      });
    }
  }

  private toggleMenu(): void {
    if (this.navMenu?.classList.contains('open')) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.navMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  private closeMenu(): void {
    this.navMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  private setupSmoothScroll(): void {
    if (!this.config.smoothScroll) return;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
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

  private setupActiveLinks(): void {
    const sections = document.querySelectorAll('[data-section]');
    const links = document.querySelectorAll('[data-nav-link]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            links.forEach((link) => {
              const href = (link as HTMLAnchorElement).getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add(this.config.activeClass);
              } else {
                link.classList.remove(this.config.activeClass);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  public setActiveLink(sectionId: string): void {
    const links = document.querySelectorAll('[data-nav-link]');
    links.forEach((link) => {
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add(this.config.activeClass);
      } else {
        link.classList.remove(this.config.activeClass);
      }
    });
  }
}

export default Navigation;
