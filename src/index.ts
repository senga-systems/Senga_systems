/**
 * Senga Systems - Main Entry Point
 * Exports all modules and types for application use
 */

// Export all types
export type * from './types/index';

// Module imports for easier referencing
import Navigation from '@modules/navigation';
import Auth from '@modules/auth';
import PreQualification from '@modules/pre-qualification';
import EmailService from '@modules/email';

// Export modules
export { Navigation, Auth, PreQualification, EmailService };

// Create global namespace
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

// Initialize global namespace
if (typeof window !== 'undefined') {
  (window as any).SengaSystems = {
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
