import type { EmailMessage } from '../types/index';
interface EmailServiceConfig {
    apiEndpoint: string;
    retryAttempts: number;
    retryDelay: number;
    timeout: number;
}
interface EmailQueueItem {
    message: EmailMessage;
    retryCount: number;
    nextRetryTime: Date;
}
declare class EmailService {
    private config;
    private queue;
    private isProcessing;
    constructor(config?: Partial<EmailServiceConfig>);
    private init;
    sendEmail(message: EmailMessage): Promise<boolean>;
    sendPasswordReset(to: string, resetLink: string): Promise<boolean>;
    sendConsultationConfirmation(to: string, consultantName: string, consultationDate: Date, consultationTime: string): Promise<boolean>;
    sendWelcomeEmail(to: string, firstName: string): Promise<boolean>;
    sendWeeklyDigest(to: string, threats: any[], resources: any[]): Promise<boolean>;
    private addToQueue;
    private calculateNextRetryTime;
    private processQueue;
    private retryEmail;
    private makeRequest;
    getQueueLength(): number;
    getQueueStatus(): EmailQueueItem[];
    clearQueue(): void;
}
export default EmailService;
//# sourceMappingURL=email.d.ts.map