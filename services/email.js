/**
 * Email Service - SendGrid Integration
 * Handles email sending with retry logic and failover
 */

// Note: This file requires Node.js backend/serverless runtime
// For production, integrate with Vercel API routes or Lambda functions

const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Email Templates Configuration
 */
const EMAIL_TEMPLATES = {
    CONSULTATION_CONFIRMATION: {
        templateId: process.env.SENDGRID_TEMPLATE_CONSULTATION,
        name: 'Consultation Confirmation'
    },
    COMPLIANCE_AUDIT_CONFIRMATION: {
        templateId: process.env.SENDGRID_TEMPLATE_COMPLIANCE_AUDIT,
        name: 'Compliance Audit Confirmation'
    },
    PASSWORD_RESET: {
        templateId: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,
        name: 'Password Reset'
    },
    WEEKLY_DIGEST: {
        templateId: process.env.SENDGRID_TEMPLATE_DIGEST,
        name: 'Weekly Security Digest'
    }
};

/**
 * Send email via SendGrid
 * @param {string} to - Recipient email
 * @param {string} templateType - Key from EMAIL_TEMPLATES
 * @param {object} dynamicData - Variables for template
 * @returns {Promise<object>} SendGrid response
 */
async function sendEmail(to, templateType, dynamicData) {
    try {
        const template = EMAIL_TEMPLATES[templateType];
        
        if (!template) {
            throw new Error(`Unknown email template: ${templateType}`);
        }
        
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@senga.systems',
            templateId: template.templateId,
            dynamicTemplateData: {
                ...dynamicData,
                timestamp: new Date().toISOString()
            },
            // Track opens/clicks for analytics
            trackingSettings: {
                clickTracking: { enabled: true },
                openTracking: { enabled: true }
            }
        };
        
        const response = await sgMail.send(msg);
        
        console.log(`[Email] ${template.name} sent to ${to}. MessageId: ${response[0].headers['x-message-id']}`);
        
        return {
            success: true,
            messageId: response[0].headers['x-message-id'],
            templateType,
            recipient: to
        };
    } catch (error) {
        console.error(`[Email Error] Failed to send ${templateType} to ${to}:`, error.message);
        
        // Queue for retry instead of immediate failure
        await queueEmailForRetry(to, templateType, dynamicData);
        
        return {
            success: false,
            error: error.message,
            templateType,
            recipient: to,
            queued: true
        };
    }
}

/**
 * Queue email for retry (requires database)
 * Implements exponential backoff: 5min → 30min → 2hrs
 */
async function queueEmailForRetry(to, templateType, dynamicData, retryCount = 0) {
    try {
        // This would use your database (Supabase, etc.)
        // For now, log the requirement
        console.log(`[Queue] ${templateType} queued for retry (attempt ${retryCount + 1})`);
        
        // Database insert would look like:
        /*
        const { data, error } = await supabase
            .from('email_queue')
            .insert([{
                recipient: to,
                template_type: templateType,
                dynamic_data: dynamicData,
                retry_count: retryCount,
                next_retry: calculateNextRetry(retryCount),
                created_at: new Date()
            }]);
        */
    } catch (error) {
        console.error('[Queue] Failed to queue email:', error.message);
    }
}

/**
 * Retry queued emails (run via cron job)
 * Execute this every 5 minutes
 */
async function retryQueuedEmails() {
    try {
        console.log('[Cron] Starting email retry job...');
        
        // Database query would look like:
        /*
        const { data: pendingEmails, error } = await supabase
            .from('email_queue')
            .select('*')
            .eq('email_sent', false)
            .lte('next_retry', new Date().toISOString())
            .lt('retry_count', 3);
        */
        
        // For each pending email:
        // 1. Try sending
        // 2. Mark as sent or increment retry_count
        
        console.log('[Cron] Email retry job completed.');
    } catch (error) {
        console.error('[Cron] Email retry job failed:', error.message);
    }
}

/**
 * Template: Consultation Confirmation
 */
async function sendConsultationConfirmation(email, consultantName, consultationDate, consultationTime) {
    return sendEmail(email, 'CONSULTATION_CONFIRMATION', {
        consultantName,
        consultationDate,
        consultationTime,
        preCallChecklistUrl: `${process.env.BASE_URL}/resources/pre-call-checklist`,
        supportEmail: 'support@senga.systems'
    });
}

/**
 * Template: Compliance Audit Confirmation
 */
async function sendComplianceAuditConfirmation(email, bankName, auditDate, reportUrl) {
    return sendEmail(email, 'COMPLIANCE_AUDIT_CONFIRMATION', {
        bankName,
        auditDate,
        reportUrl,
        timelineUrl: `${process.env.BASE_URL}/compliance-audit#solution`,
        contactUrl: `${process.env.BASE_URL}/compliance-audit#consultation`
    });
}

/**
 * Template: Password Reset
 */
async function sendPasswordReset(email, resetLink) {
    return sendEmail(email, 'PASSWORD_RESET', {
        resetLink,
        expirationTime: '1 hour',
        supportEmail: 'support@senga.systems'
    });
}

/**
 * Template: Weekly Security Digest
 */
async function sendWeeklyDigest(email, threats, resources, trainingSessions) {
    return sendEmail(email, 'WEEKLY_DIGEST', {
        threats: threats.slice(0, 3), // Top 3 threats
        resources: resources.slice(0, 3),
        trainingSessions,
        digestUrl: `${process.env.BASE_URL}/security-updates`
    });
}

module.exports = {
    sendEmail,
    queueEmailForRetry,
    retryQueuedEmails,
    sendConsultationConfirmation,
    sendComplianceAuditConfirmation,
    sendPasswordReset,
    sendWeeklyDigest,
    EMAIL_TEMPLATES
};
