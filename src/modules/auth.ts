/**
 * Authentication Module
 * Handles user authentication state and session management
 */

import type { User, AuthState } from '../types/index';

interface AuthConfig {
  storageKey: string;
  apiEndpoint: string;
}

class Auth {
  private config: AuthConfig;
  private state: AuthState;
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = {
      storageKey: 'senga_auth_state',
      apiEndpoint: '/api/auth',
      ...config,
    };

    this.state = this.loadState();
    this.init();
  }

  private init(): void {
    this.restoreSession();
    this.setupListeners();
  }

  private loadState(): AuthState {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
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

  private saveState(): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('[v0] Failed to save auth state:', error);
    }
  }

  private restoreSession(): void {
    if (this.state.token) {
      this.verifyToken();
    }
  }

  private setupListeners(): void {
    // Listen for storage changes (other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === this.config.storageKey) {
        this.state = this.loadState();
        this.notifyListeners();
      }
    });
  }

  public async login(email: string, password: string): Promise<boolean> {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.setState({
        loading: false,
        error: errorMessage,
      });
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.state.token}`,
        },
      });
    } catch (error) {
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

  public async register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<boolean> {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      this.setState({
        loading: false,
        error: errorMessage,
      });
      return false;
    }
  }

  public async resetPassword(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      return response.ok;
    } catch (error) {
      console.error('[v0] Password reset error:', error);
      return false;
    }
  }

  public async verifyToken(): Promise<boolean> {
    if (!this.state.token) return false;

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
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('[v0] Token verification error:', error);
      this.logout();
      return false;
    }
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public getUser(): User | null {
    return this.state.user || null;
  }

  public getToken(): string | null {
    return this.state.token || null;
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export default Auth;
