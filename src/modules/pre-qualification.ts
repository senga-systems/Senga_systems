/**
 * Pre-Qualification Form Module
 * Lead scoring and intelligent routing for consultation requests
 */

import type {
  ConsultationRequest,
  ConsultationFitScore,
  Notification,
  ApiResponse,
} from '../types/index';

interface QualificationConfig {
  formId: string;
  containerId: string;
  apiEndpoint: string;
}

class PreQualification {
  private config: QualificationConfig;
  private formElement: HTMLFormElement | null;
  private containerElement: HTMLElement | null;
  private formData: Partial<ConsultationRequest> = {};
  private currentStep: number = 1;
  private totalSteps: number = 4;

  constructor(config: Partial<QualificationConfig> = {}) {
    this.config = {
      formId: '#prequalificationForm',
      containerId: '#qualificationForm',
      apiEndpoint: '/api/consultations',
      ...config,
    };

    this.formElement = document.querySelector(this.config.formId) as HTMLFormElement;
    this.containerElement = document.querySelector(this.config.containerId) as HTMLElement;

    if (this.containerElement) {
      this.renderForm();
      this.init();
    }
  }

  private init(): void {
    this.setupEventListeners();
    this.focusFirstInput();
  }

  private renderForm(): void {
    if (!this.containerElement) return;

    const formHTML = this.getFormHTML();
    this.containerElement.innerHTML = formHTML;

    this.formElement = this.containerElement.querySelector(
      this.config.formId
    ) as HTMLFormElement;
  }

  private getFormHTML(): string {
    return `
      <form id="prequalificationForm" class="qualification-form">
        <!-- Step 1: Security Concern -->
        <div class="form-step active" data-step="1">
          <div class="form-group">
            <label class="form-label">What's your biggest security concern?</label>
            <div class="form-options">
              <label class="option-label">
                <input type="radio" name="concern" value="data_breaches" required />
                <span>Data Breaches & Vulnerabilities</span>
              </label>
              <label class="option-label">
                <input type="radio" name="concern" value="compliance" />
                <span>Regulatory Compliance</span>
              </label>
              <label class="option-label">
                <input type="radio" name="concern" value="access_control" />
                <span>Access Control & Identity</span>
              </label>
              <label class="option-label">
                <input type="radio" name="concern" value="other" />
                <span>Something Else</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 2: Company Info -->
        <div class="form-step" data-step="2">
          <div class="form-group">
            <label class="form-label">Company Size</label>
            <select name="companySize" class="form-select" required>
              <option value="">Select...</option>
              <option value="<50">Fewer than 50 employees</option>
              <option value="50-500">50 - 500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
        </div>

        <!-- Step 3: Budget -->
        <div class="form-step" data-step="3">
          <div class="form-group">
            <label class="form-label">Budget Range</label>
            <div class="form-options">
              <label class="option-label">
                <input type="radio" name="budget" value="free" />
                <span>Free Consultation Only</span>
              </label>
              <label class="option-label">
                <input type="radio" name="budget" value="10k-50k" />
                <span>$10k - $50k</span>
              </label>
              <label class="option-label">
                <input type="radio" name="budget" value="50k+" />
                <span>$50k+</span>
              </label>
              <label class="option-label">
                <input type="radio" name="budget" value="not_sure" />
                <span>Not Sure</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 4: Contact Info -->
        <div class="form-step" data-step="4">
          <div class="form-group">
            <label class="form-label" for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              class="form-input"
              required
              placeholder="John"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              class="form-input"
              required
              placeholder="Doe"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              required
              placeholder="john@company.com"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              class="form-input"
              required
              placeholder="Your Company"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              class="form-input"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
          <button type="button" id="prevBtn" class="btn btn-secondary" style="display:none;">
            Back
          </button>
          <button type="button" id="nextBtn" class="btn btn-primary">
            Continue
          </button>
          <button type="submit" id="submitBtn" class="btn btn-primary" style="display:none;">
            Get Assessment
          </button>
        </div>

        <!-- Progress Indicator -->
        <div class="form-progress">
          <div class="progress-bar" id="progressBar"></div>
          <span class="progress-text" id="progressText">Step 1 of 4</span>
        </div>
      </form>
    `;
  }

  private setupEventListeners(): void {
    if (!this.formElement) return;

    const nextBtn = this.formElement.querySelector('#nextBtn') as HTMLButtonElement;
    const prevBtn = this.formElement.querySelector('#prevBtn') as HTMLButtonElement;
    const submitBtn = this.formElement.querySelector('#submitBtn') as HTMLButtonElement;

    nextBtn?.addEventListener('click', () => this.nextStep());
    prevBtn?.addEventListener('click', () => this.previousStep());
    submitBtn?.addEventListener('click', (e) => this.handleSubmit(e));
    this.formElement.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private nextStep(): void {
    if (!this.validateCurrentStep()) {
      this.showError('Please fill in all required fields');
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
      this.collectFormData();
    }
  }

  private previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  }

  private validateCurrentStep(): boolean {
    const currentStepElement = this.formElement?.querySelector(
      `[data-step="${this.currentStep}"]`
    ) as HTMLElement;

    if (!currentStepElement) return false;

    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach((input: Element) => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;
      if (inputElement.type === 'radio') {
        const name = inputElement.name;
        const checked = this.formElement?.querySelector(
          `input[name="${name}"]:checked`
        );
        if (!checked) isValid = false;
      } else if (!inputElement.value) {
        isValid = false;
      }
    });

    return isValid;
  }

  private renderStep(): void {
    const steps = this.formElement?.querySelectorAll('.form-step');
    steps?.forEach((step) => step.classList.remove('active'));

    const currentStep = this.formElement?.querySelector(`[data-step="${this.currentStep}"]`);
    currentStep?.classList.add('active');

    this.updateNavigation();
    this.updateProgress();
    this.focusFirstInput();
  }

  private updateNavigation(): void {
    const prevBtn = this.formElement?.querySelector('#prevBtn') as HTMLButtonElement;
    const nextBtn = this.formElement?.querySelector('#nextBtn') as HTMLButtonElement;
    const submitBtn = this.formElement?.querySelector('#submitBtn') as HTMLButtonElement;

    if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    if (nextBtn) nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
    if (submitBtn) submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
  }

  private updateProgress(): void {
    const progressBar = this.formElement?.querySelector('#progressBar') as HTMLElement;
    const progressText = this.formElement?.querySelector('#progressText') as HTMLElement;

    if (progressBar) {
      progressBar.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
    }
    if (progressText) {
      progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  private collectFormData(): void {
    if (!this.formElement) return;

    const formDataObj = new FormData(this.formElement);
    const data = Object.fromEntries(formDataObj);

    this.formData = {
      ...this.formData,
      ...data,
    } as Partial<ConsultationRequest>;
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.validateCurrentStep()) {
      this.showError('Please fill in all required fields');
      return;
    }

    this.collectFormData();

    try {
      const response = await this.submitForm();
      const fitScore = this.calculateFitScore();

      this.showSuccess(response);
      this.routeToNextStep(fitScore);
    } catch (error) {
      this.handleError(error);
    }
  }

  private calculateFitScore(): ConsultationFitScore {
    const concern = (this.formData.concern || '') as string;
    const size = (this.formData.companySize || '') as string;
    const budget = (this.formData.budget || '') as string;

    let score = 0;
    let routing: 'priority' | 'standard' | 'resource' = 'standard';

    // Scoring logic
    if (concern === 'compliance') score += 40;
    if (concern === 'data_breaches') score += 35;
    if (concern === 'access_control') score += 30;

    if (size === '500+') score += 30;
    if (size === '50-500') score += 20;
    if (size === '<50') score += 10;

    if (budget === '50k+') score += 30;
    if (budget === '10k-50k') score += 15;
    if (budget === 'not_sure') score += 5;

    // Determine routing
    if (score >= 80) {
      routing = 'priority';
    } else if (score >= 50) {
      routing = 'standard';
    } else {
      routing = 'resource';
    }

    return {
      score,
      tier: score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low',
      recommendation: this.getRecommendation(score, concern, budget),
      routing,
    };
  }

  private getRecommendation(score: number, concern: string, budget: string): string {
    if (score >= 80) {
      return 'Perfect fit! We have specialized expertise in your area. Let\'s schedule a call immediately.';
    }
    if (score >= 50) {
      return 'Good match. Our team can help with your security needs. Let\'s explore next steps.';
    }
    return 'We can help, but may recommend resources first. Let\'s discuss your priorities.';
  }

  private async submitForm(): Promise<ApiResponse> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.formData),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  private routeToNextStep(fitScore: ConsultationFitScore): void {
    if (fitScore.routing === 'priority') {
      // High fit: show calendar, offer priority slot
      this.showMessage(
        'success',
        'Excellent! We have immediate availability. Let\'s schedule your assessment.',
        'Our team specializes in your area. You\'ll speak with a senior consultant.'
      );
    } else if (fitScore.routing === 'standard') {
      // Medium fit: show info + booking
      this.showMessage(
        'info',
        'Great! Our team can help you.',
        'We\'ll match you with the right consultant for your needs.'
      );
    } else {
      // Low fit: show resources, defer booking
      this.showMessage(
        'info',
        'We can help with resources first.',
        'Let\'s connect to discuss your priorities and the best path forward.'
      );
    }
  }

  private focusFirstInput(): void {
    const currentStep = this.formElement?.querySelector(`[data-step="${this.currentStep}"]`);
    const firstInput = currentStep?.querySelector('input, select, textarea') as HTMLInputElement;
    firstInput?.focus();
  }

  private showError(message: string): void {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = message;
    this.formElement?.insertAdjacentElement('beforebegin', alert);
    setTimeout(() => alert.remove(), 5000);
  }

  private showSuccess(response: ApiResponse): void {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = 'Assessment request submitted successfully!';
    this.formElement?.insertAdjacentElement('beforebegin', alert);
  }

  private showMessage(type: string, title: string, description: string): void {
    const message = document.createElement('div');
    message.className = `alert alert-${type}`;
    message.innerHTML = `<strong>${title}</strong><p>${description}</p>`;
    this.formElement?.insertAdjacentElement('afterend', message);
  }

  private handleError(error: any): void {
    console.error('[v0] Form submission error:', error);
    this.showError('An error occurred. Please try again.');
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PreQualification();
  });
} else {
  new PreQualification();
}

export default PreQualification;
