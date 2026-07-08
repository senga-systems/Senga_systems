# SendGrid Email Integration Setup Guide

## Overview
This guide explains how to set up SendGrid for transactional emails (password resets, consultation confirmations) with retry logic and failover.

## Prerequisites
- SendGrid account (free tier available at sendgrid.com)
- Vercel project with environment variables support
- Node.js backend or serverless functions (Vercel Edge Functions, Lambda, etc.)

---

## Step 1: Create SendGrid Account & Get API Key

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Navigate to **Settings → API Keys**
3. Click **Create API Key**
4. Select **Full Access** and name it `senga-systems-prod`
5. Copy the API key (you won't see it again!)

---

## Step 2: Set Up Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxx...
SENDGRID_FROM_EMAIL=noreply@senga.systems
BASE_URL=https://senga.systems

# Template IDs (create templates in SendGrid dashboard)
SENDGRID_TEMPLATE_CONSULTATION=d-xxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_COMPLIANCE_AUDIT=d-xxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_PASSWORD_RESET=d-xxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_DIGEST=d-xxxxxxxxxxxxxxxx
```

---

## Step 3: Create Email Templates in SendGrid

### Template 1: Consultation Confirmation

1. In SendGrid, go to **Email API → Templates**
2. Click **Create Template**
3. Name: `Consultation Confirmation`
4. Add content:

```html
<h2>Your Consultation is Confirmed!</h2>
<p>Hi there,</p>
<p>{{consultantName}} will call you on {{consultationDate}} at {{consultationTime}}.</p>
<p><strong>Before the call:</strong></p>
<ul>
  <li>Prepare your infrastructure overview (what systems do you use?)</li>
  <li>List current security concerns</li>
  <li>Note your compliance requirements</li>
</ul>
<p><a href="{{preCallChecklistUrl}}">Download our pre-call checklist</a></p>
<p>Questions? Reply to this email or contact {{supportEmail}}</p>
```

**Template ID** (shown after saving): Copy this to `SENDGRID_TEMPLATE_CONSULTATION`

---

### Template 2: Compliance Audit Confirmation

1. Click **Create Template**
2. Name: `Compliance Audit Confirmation`
3. Add content:

```html
<h2>Your Compliance Audit Begins</h2>
<p>Hi {{bankName}},</p>
<p>Your 90-day compliance sprint starts {{auditDate}}.</p>
<h3>What to Expect:</h3>
<ol>
  <li><strong>Week 1:</strong> Regulatory audit & findings report</li>
  <li><strong>Week 2-3:</strong> Risk prioritization & action plan</li>
  <li><strong>Week 4-12:</strong> Remediation support & live dashboard</li>
  <li><strong>Day 90:</strong> Final sign-off & compliance certificate</li>
</ol>
<p><a href="{{reportUrl}}">View your audit report (when ready)</a></p>
<p><a href="{{timelineUrl}}">Learn about our process</a></p>
<p>Contact us anytime: {{supportEmail}}</p>
```

**Template ID** → Copy to `SENDGRID_TEMPLATE_COMPLIANCE_AUDIT`

---

### Template 3: Password Reset

1. Click **Create Template**
2. Name: `Password Reset`
3. Add content:

```html
<h2>Reset Your Password</h2>
<p>We received a password reset request for your Senga Systems account.</p>
<p><a href="{{resetLink}}" style="background:#00d4ff; color:#0a0a0f; padding:12px 24px; border-radius:8px; text-decoration:none; display:inline-block;">
  Reset Password
</a></p>
<p><strong>This link expires in {{expirationTime}}.</strong></p>
<p>If you didn't request this, ignore this email.</p>
<p>Questions? Contact {{supportEmail}}</p>
```

**Template ID** → Copy to `SENDGRID_TEMPLATE_PASSWORD_RESET`

---

### Template 4: Weekly Security Digest

1. Click **Create Template**
2. Name: `Weekly Security Digest`
3. Add content:

```html
<h2>This Week in Security</h2>
<h3>Critical Threats</h3>
<ul>
  {{#threats}}
  <li><strong>{{title}}:</strong> {{description}}</li>
  {{/threats}}
</ul>
<h3>New Resources</h3>
<ul>
  {{#resources}}
  <li><a href="{{url}}">{{title}}</a></li>
  {{/resources}}
</ul>
<h3>Upcoming Training</h3>
<ul>
  {{#trainingSessions}}
  <li>{{title}} - {{date}}</li>
  {{/trainingSessions}}
</ul>
<p><a href="{{digestUrl}}">View all updates</a></p>
```

**Template ID** → Copy to `SENDGRID_TEMPLATE_DIGEST`

---

## Step 4: Verify Sender Domain

1. In SendGrid, go to **Settings → Sender Authentication**
2. Click **Authenticate Your Domain**
3. Enter: `senga.systems`
4. Add DNS records (SendGrid will provide them) to your domain host
5. Wait 24 hours for DNS propagation, then verify

---

## Step 5: Set Up Backend Email Handler

### Option A: Vercel API Routes (Recommended)

Create `/api/send-email.js`:

```javascript
import { sendConsultationConfirmation } from '@/services/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email, type, data } = req.body;
  
  try {
    let result;
    
    switch (type) {
      case 'consultation':
        result = await sendConsultationConfirmation(
          email,
          data.consultantName,
          data.consultationDate,
          data.consultationTime
        );
        break;
      
      case 'compliance-audit':
        result = await sendComplianceAuditConfirmation(
          email,
          data.bankName,
          data.auditDate,
          data.reportUrl
        );
        break;
      
      default:
        return res.status(400).json({ error: 'Unknown email type' });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
```

### Option B: Supabase Edge Functions

```javascript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendConsultationConfirmation } from "./email.js";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  
  const { email, type, data } = await req.json();
  
  try {
    const result = await sendConsultationConfirmation(
      email,
      data.consultantName,
      data.consultationDate,
      data.consultationTime
    );
    
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

---

## Step 6: Install Dependencies

```bash
npm install @sendgrid/mail
```

---

## Step 7: Test Email Sending

Use this test script:

```javascript
// test-sendgrid.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  const msg = {
    to: 'your-email@example.com',
    from: 'noreply@senga.systems',
    subject: 'Test Email from Senga Systems',
    html: '<h1>Test</h1><p>If you see this, SendGrid is working!</p>',
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
  } catch (error) {
    console.error('Email failed:', error.message);
  }
}

testEmail();
```

Run with:
```bash
SENDGRID_API_KEY=sg_xxxx node test-sendgrid.js
```

---

## Step 8: Set Up Retry Queue (Optional but Recommended)

### Database Schema (Supabase)

```sql
CREATE TABLE email_queue (
  id BIGSERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  template_type TEXT NOT NULL,
  dynamic_data JSONB,
  retry_count INT DEFAULT 0,
  next_retry TIMESTAMP DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  message_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pending_emails ON email_queue(email_sent, next_retry);
```

### Cron Job Setup

Use Vercel Cron or AWS EventBridge:

```bash
# Vercel: vercel.json
{
  "crons": [
    {
      "path": "/api/cron/retry-emails",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Monitoring & Best Practices

### Monitor SendGrid Activity
- Dashboard → Activity Feed (view all sends, bounces, spam reports)
- Set up alerts for bounce rates > 2%

### Avoid Spam Folder
- ✅ Use template variables (not dynamic HTML)
- ✅ Include unsubscribe link
- ✅ Keep subject lines under 50 chars
- ✅ Avoid ALL CAPS and spam words ("FREE", "URGENT", "ACT NOW")

### Track Deliverability
- Enable open/click tracking (already configured in email.js)
- Monitor bounce rate via SendGrid dashboard
- Add sender domain authentication (DKIM, SPF)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check SENDGRID_API_KEY is correct in env vars |
| 403 Forbidden | API key lacks permissions; regenerate with "Full Access" |
| 400 Bad Request | Verify template ID matches actual template in SendGrid |
| Email goes to spam | Add SPF/DKIM records; check sender domain authentication |
| Emails not sending | Check SendGrid activity feed for bounce reasons |

---

## Cost Breakdown

- **Free tier:** 100 emails/day (perfect for testing)
- **Paid plan:** $15/month = 5,000 emails/month
- **Expected cost for Senga:** ~$20/month (500 emails/month)

---

## Next Steps

1. ✅ Create SendGrid account
2. ✅ Set up 4 email templates
3. ✅ Add environment variables to Vercel
4. ✅ Implement API route (`/api/send-email.js`)
5. ✅ Test with `test-sendgrid.js`
6. ✅ Hook up contact form to email API
7. ✅ Monitor activity in SendGrid dashboard
