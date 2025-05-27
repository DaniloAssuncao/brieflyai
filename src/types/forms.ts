// Form field validation state
export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// Generic form state
export interface FormState<T = Record<string, unknown>> {
  fields: {
    [K in keyof T]: FormFieldState;
  };
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<Record<keyof T, string>>;
}

// Form validation rule
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
  message?: string;
}

// Form field configuration
export interface FormFieldConfig {
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  validation?: ValidationRule[];
  options?: Array<{ label: string; value: string | number }>;
  disabled?: boolean;
  required?: boolean;
}

// Form configuration
export interface FormConfig<T = Record<string, unknown>> {
  fields: {
    [K in keyof T]: FormFieldConfig;
  };
  submitText?: string;
  resetOnSubmit?: boolean;
}

// Form submission result
export interface FormSubmissionResult {
  success: boolean;
  data?: unknown;
  errors?: Record<string, string>;
  message?: string;
}

// Login form specific types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormState extends FormState<LoginFormData> {
  showPassword: boolean;
}

// Signup form specific types
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormState extends FormState<SignupFormData> {
  showPassword: boolean;
  passwordsMatch: boolean;
}

// Content form specific types
export interface ContentFormData {
  title: string;
  summary: string;
  tags: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  originalUrl: string;
  readTime: string;
}

export interface ContentFormState extends FormState<ContentFormData> {
  selectedTags: string[];
}

// Search form types
export interface SearchFormData {
  query: string;
  filters: {
    tags: string[];
    sourceType: string;
    dateRange: {
      from: string;
      to: string;
    };
    favorite: boolean;
  };
}

// Form event handlers
export interface FormEventHandlers<T = Record<string, unknown>> {
  onChange: (field: keyof T, value: unknown) => void;
  onBlur: (field: keyof T) => void;
  onSubmit: (data: T) => Promise<FormSubmissionResult>;
  onReset: () => void;
  onValidate: (field?: keyof T) => boolean;
} 