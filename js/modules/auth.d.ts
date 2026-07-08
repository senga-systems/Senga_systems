import type { User, AuthState } from '../types/index';
interface AuthConfig {
    storageKey: string;
    apiEndpoint: string;
}
declare class Auth {
    private config;
    private state;
    private listeners;
    constructor(config?: Partial<AuthConfig>);
    private init;
    private loadState;
    private saveState;
    private restoreSession;
    private setupListeners;
    login(email: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
    register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
        password: string;
    }): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    verifyToken(): Promise<boolean>;
    getState(): AuthState;
    isAuthenticated(): boolean;
    getUser(): User | null;
    getToken(): string | null;
    subscribe(listener: (state: AuthState) => void): () => void;
    private setState;
    private notifyListeners;
}
export default Auth;
//# sourceMappingURL=auth.d.ts.map