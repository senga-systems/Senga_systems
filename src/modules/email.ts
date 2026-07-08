/**
 * Email Service Module
 * Handles email sending via SendGrid with retry logic
 */

import type { EmailMessage, ApiResponse } from '../types/index';

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

class EmailService {
  private config: EmailServiceConfig;
  private queue: EmailQueueItem[] = [];
  private isProcessing: boolean = false;

  constructor(config: Partial<EmailServiceConfig> = {}) {
    this.config = {
      apiEndpoint: '/api/email',
      retryAttempts: 3,
      retryDelay: 5000,
      timeout: 10000,
      ...config,
    };

    this.init();
  }

  private init(): void {
    // Start processing queue every 30 seconds
    setInterval(() => this.processQueue(), 30000);
  }

  public async sendEmail(message: EmailMessage): Promise<boolean> {
    try {
      const response = await this.makeRequest(message);

      if (response.success) {
        console.log('[v0] Email sent successfully to:', message.to);
        return true;
      } else {
        // Add to retry queue
        this.addToQueue(message);
        return false;
      }
    } catch (error) {
      console.error('[v0] Email send error:', error);
      this.addToQueue(message);
      return false;
    }
  }

  public async sendPasswordReset(to: string, resetLink: string): Promise<boolean> {
    return this.sendEmail({
      to,
      from: 'noreply@senga.systems',
      subject: 'Reset Your Senga Systems Password',
      templateId: 'password_reset',
      dynamicData: {
        resetLink,
        expiryTime: '1 hour',
      },
    });
  }

  public async sendConsultationConfirmation(
    to: string,
    consultantName: string,
    consultationDate: Date,
    consultationTime: string
  ): Promise<boolean> {
    return this.sendEmail({
      to,
      from: 'noreply@senga.systems',
      subject: 'Your Consultation is Confirmed',
      templateId: 'consultation_confirmation',
      dynamicData: {
        consultantName,
        consultationDate: consultationDate.toLocaleDateString(),
        consultationTime,
        preCallChecklistLink: 'https://senga.systems/prepare',
      },
    });
  }

  public async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    return this.sendEmail({
      to,
      from: 'noreply@senga.systems',
      subject: 'Welcome to Senga Systems',
      templateId: 'welcome',
      dynamicData: {
        firstName,
        dashboardLink: 'https://senga.systems/dashboard',
      },
    });
  }

  public async sendWeeklyDigest(to: string, threats: any[], resources: any[]): Promise<boolean> {
    return this.sendEmail({
      to,
      from: 'noreply@senga.systems',
      subject: 'Senga Security Brief - This Week\'s Threats & Resources',
      templateId: 'weekly_digest',
      dynamicData: {
        threats: threats.map(t => ({ headline: t.headline, link: t.link })),
        resources: resources.map(r => ({ title: r.title, link: r.link })),
      },
    });
  }

  private addToQueue(message: EmailMessage): void {
    const queueItem: EmailQueueItem = {
      message,
      retryCount: message.retryCount || 0,
      nextRetryTime: this.calculateNextRetryTime(message.retryCount || 0),
    };

    this.queue.push(queueItem);
    console.log('[v0] Email added to retry queue. Total queued:', this.queue.length);
  }

  private calculateNextRetryTime(retryCount: number): Date {
    // Exponential backoff: 5min, 30min, 2 hours
    const delays = [5 * 60 * 1000, 30 * 60 * 1000, 2 * 60 * 60 * 1000];
    const delay = delays[Math.min(retryCount, delays.length - 1)];
    return new Date(Date.now() + delay);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    const now = new Date();
    const itemsToRetry = this.queue.filter(item => item.nextRetryTime <= now);

    for (const item of itemsToRetry) {
      try {
        const success = await this.retryEmail(item);

        if (success) {
          // Remove from queue
          this.queue = this.queue.filter(i => i !== item);
        } else if (item.retryCount >= this.config.retryAttempts) {
          // Remove after max retries
          console.error('[v0] Email failed after max retries:', item.message.to);
          this.queue = this.queue.filter(i => i !== item);
        } else {
          // Update retry count and next retry time
          item.retryCount++;
          item.nextRetryTime = this.calculateNextRetryTime(item.retryCount);
        }
      } catch (error) {
        console.error('[v0] Error processing queue item:', error);
      }
    }

    this.isProcessing = false;
  }

  private async retryEmail(queueItem: EmailQueueItem): Promise<boolean> {
    try {
      const response = await this.makeRequest(queueItem.message);
      return response.success;
    } catch (error) {
      console.error('[v0] Retry email error:', error);
      return false;
    }
  }

  private async makeRequest(message: EmailMessage): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        signal: controller.signal,
      })
        .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then(data => resolve(data))
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getQueueStatus(): EmailQueueItem[] {
    return [...this.queue];
  }

  public clearQueue(): void {
    this.queue = [];
    console.log('[v0] Email queue cleared');
  }
}

export default EmailService;
