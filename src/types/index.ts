/**
 * Shared Type Definitions
 * Core types used across the application
 */

/* ===== USER & AUTHENTICATION ===== */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/* ===== CONSULTATION & FORMS ===== */
export interface ConsultationRequest {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  concern: 'data_breaches' | 'compliance' | 'access_control' | 'other';
  companySize: '<50' | '50-500' | '500+';
  budget: 'free' | '10k-50k' | '50k+' | 'not_sure';
  message?: string;
  createdAt?: Date;
  status?: 'pending' | 'contacted' | 'scheduled' | 'completed';
}

export interface ConsultationFitScore {
  score: number; // 0-100
  tier: 'high' | 'medium' | 'low';
  recommendation: string;
  routing: 'priority' | 'standard' | 'resource';
}

/* ===== SERVICES ===== */
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: ServicePricing;
  leadTime?: string;
}

export interface ServicePricing {
  type: 'fixed' | 'hourly' | 'retainer';
  amount: number;
  currency: 'USD' | 'ZAR' | 'KES' | 'GHS';
  description?: string;
}

/* ===== CASE STUDIES ===== */
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  company: string;
  industry: string;
  region: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  metrics: CaseStudyMetrics;
  featured: boolean;
  publishedAt: Date;
}

export interface CaseStudyResult {
  label: string;
  before?: string;
  after: string;
  impact: string;
}

export interface CaseStudyMetrics {
  vulnerabilitiesFixed?: number;
  timeToResolution?: string;
  costSavings?: number;
  clientSatisfaction?: number;
}

/* ===== NOTIFICATIONS & FORMS ===== */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    href?: string;
    callback?: () => void;
  };
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: (value: any) => string | null;
  value?: any;
  error?: string;
}

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormState {
  fields: { [key: string]: FormField };
  isSubmitting: boolean;
  isValid: boolean;
  errors: { [key: string]: string };
}

/* ===== EMAIL TEMPLATES ===== */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  sendgridId?: string;
}

export interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  templateId: string;
  dynamicData: { [key: string]: any };
  retryCount?: number;
  sentAt?: Date;
  failedAt?: Date;
}

/* ===== API RESPONSES ===== */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/* ===== ANALYTICS ===== */
export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageMetrics {
  title: string;
  path: string;
  visitCount: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate?: number;
}

/* ===== ERROR HANDLING ===== */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type ErrorHandler = (error: Error | AppError) => void;
