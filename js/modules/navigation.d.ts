interface NavigationConfig {
    activeClass: string;
    smoothScroll: boolean;
}
declare class Navigation {
    private config;
    private navToggle;
    private navMenu;
    constructor(config?: Partial<NavigationConfig>);
    private init;
    private setupMenuToggle;
    private toggleMenu;
    private openMenu;
    private closeMenu;
    private setupSmoothScroll;
    private setupActiveLinks;
    setActiveLink(sectionId: string): void;
}
export default Navigation;
//# sourceMappingURL=navigation.d.ts.map