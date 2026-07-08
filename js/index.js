import Navigation from '@modules/navigation';
import Auth from '@modules/auth';
import PreQualification from '@modules/pre-qualification';
import EmailService from '@modules/email';
export { Navigation, Auth, PreQualification, EmailService };
if (typeof window !== 'undefined') {
    window.SengaSystems = {
        Navigation,
        Auth,
        PreQualification,
        EmailService,
        version: '2.0.0',
    };
}
export const SengaSystems = {
    Navigation,
    Auth,
    PreQualification,
    EmailService,
    version: '2.0.0',
};
//# sourceMappingURL=index.js.map