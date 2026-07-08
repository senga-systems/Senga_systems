class Auth {
    constructor(config = {}) {
        this.listeners = new Set();
        this.config = {
            storageKey: 'senga_auth_state',
            apiEndpoint: '/api/auth',
            ...config,
        };
        this.state = this.loadState();
        this.init();
    }
    init() {
        this.restoreSession();
        this.setupListeners();
    }
    loadState() {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
            console.error('[v0] Failed to load auth state:', error);
        }
        return {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
        };
    }
    saveState() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
        }
        catch (error) {
            console.error('[v0] Failed to save auth state:', error);
        }
    }
    restoreSession() {
        if (this.state.token) {
            this.verifyToken();
        }
    }
    setupListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.config.storageKey) {
                this.state = this.loadState();
                this.notifyListeners();
            }
        });
    }
    async login(email, password) {
        this.setState({ loading: true, error: null });
        try {
            const response = await fetch(`${this.config.apiEndpoint}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const { user, token } = await response.json();
            this.setState({
                isAuthenticated: true,
                user,
                token,
                loading: false,
                error: null,
            });
            this.saveState();
            return true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            this.setState({
                loading: false,
                error: errorMessage,
            });
            return false;
        }
    }
    async logout() {
        try {
            await fetch(`${this.config.apiEndpoint}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.state.token}`,
                },
            });
        }
        catch (error) {
            console.error('[v0] Logout error:', error);
        }
        this.setState({
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
        });
        localStorage.removeItem(this.config.storageKey);
    }
    async register(user) {
        this.setState({ loading: true, error: null });
        try {
            const response = await fetch(`${this.config.apiEndpoint}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const { user: newUser, token } = await response.json();
            this.setState({
                isAuthenticated: true,
                user: newUser,
                token,
                loading: false,
                error: null,
            });
            this.saveState();
            return true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            this.setState({
                loading: false,
                error: errorMessage,
            });
            return false;
        }
    }
    async resetPassword(email) {
        try {
            const response = await fetch(`${this.config.apiEndpoint}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            return response.ok;
        }
        catch (error) {
            console.error('[v0] Password reset error:', error);
            return false;
        }
    }
    async verifyToken() {
        if (!this.state.token)
            return false;
        try {
            const response = await fetch(`${this.config.apiEndpoint}/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.state.token}`,
                },
            });
            if (response.ok) {
                const { user } = await response.json();
                this.setState({ user, isAuthenticated: true });
                return true;
            }
            else {
                this.logout();
                return false;
            }
        }
        catch (error) {
            console.error('[v0] Token verification error:', error);
            this.logout();
            return false;
        }
    }
    getState() {
        return { ...this.state };
    }
    isAuthenticated() {
        return this.state.isAuthenticated;
    }
    getUser() {
        return this.state.user || null;
    }
    getToken() {
        return this.state.token || null;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }
    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.state));
    }
}
export default Auth;
//# sourceMappingURL=auth.js.map