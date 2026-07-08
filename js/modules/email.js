class EmailService {
    constructor(config = {}) {
        this.queue = [];
        this.isProcessing = false;
        this.config = {
            apiEndpoint: '/api/email',
            retryAttempts: 3,
            retryDelay: 5000,
            timeout: 10000,
            ...config,
        };
        this.init();
    }
    init() {
        setInterval(() => this.processQueue(), 30000);
    }
    async sendEmail(message) {
        try {
            const response = await this.makeRequest(message);
            if (response.success) {
                console.log('[v0] Email sent successfully to:', message.to);
                return true;
            }
            else {
                this.addToQueue(message);
                return false;
            }
        }
        catch (error) {
            console.error('[v0] Email send error:', error);
            this.addToQueue(message);
            return false;
        }
    }
    async sendPasswordReset(to, resetLink) {
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
    async sendConsultationConfirmation(to, consultantName, consultationDate, consultationTime) {
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
    async sendWelcomeEmail(to, firstName) {
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
    async sendWeeklyDigest(to, threats, resources) {
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
    addToQueue(message) {
        const queueItem = {
            message,
            retryCount: message.retryCount || 0,
            nextRetryTime: this.calculateNextRetryTime(message.retryCount || 0),
        };
        this.queue.push(queueItem);
        console.log('[v0] Email added to retry queue. Total queued:', this.queue.length);
    }
    calculateNextRetryTime(retryCount) {
        const delays = [5 * 60 * 1000, 30 * 60 * 1000, 2 * 60 * 60 * 1000];
        const delay = delays[Math.min(retryCount, delays.length - 1)];
        return new Date(Date.now() + delay);
    }
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        const now = new Date();
        const itemsToRetry = this.queue.filter(item => item.nextRetryTime <= now);
        for (const item of itemsToRetry) {
            try {
                const success = await this.retryEmail(item);
                if (success) {
                    this.queue = this.queue.filter(i => i !== item);
                }
                else if (item.retryCount >= this.config.retryAttempts) {
                    console.error('[v0] Email failed after max retries:', item.message.to);
                    this.queue = this.queue.filter(i => i !== item);
                }
                else {
                    item.retryCount++;
                    item.nextRetryTime = this.calculateNextRetryTime(item.retryCount);
                }
            }
            catch (error) {
                console.error('[v0] Error processing queue item:', error);
            }
        }
        this.isProcessing = false;
    }
    async retryEmail(queueItem) {
        try {
            const response = await this.makeRequest(queueItem.message);
            return response.success;
        }
        catch (error) {
            console.error('[v0] Retry email error:', error);
            return false;
        }
    }
    async makeRequest(message) {
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
    getQueueLength() {
        return this.queue.length;
    }
    getQueueStatus() {
        return [...this.queue];
    }
    clearQueue() {
        this.queue = [];
        console.log('[v0] Email queue cleared');
    }
}
export default EmailService;
//# sourceMappingURL=email.js.map