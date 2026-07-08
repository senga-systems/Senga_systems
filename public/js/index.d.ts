export type * from './types/index';
import Navigation from '@modules/navigation';
import Auth from '@modules/auth';
import PreQualification from '@modules/pre-qualification';
import EmailService from '@modules/email';
export { Navigation, Auth, PreQualification, EmailService };
declare global {
    interface Window {
        SengaSystems: {
            Navigation: typeof Navigation;
            Auth: typeof Auth;
            PreQualification: typeof PreQualification;
            EmailService: typeof EmailService;
            version: string;
        };
    }
}
export declare const SengaSystems: {
    Navigation: typeof Navigation;
    Auth: typeof Auth;
    PreQualification: typeof PreQualification;
    EmailService: typeof EmailService;
    version: string;
};
//# sourceMappingURL=index.d.ts.map