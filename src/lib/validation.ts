import { APP_CONSTANTS } from './constants';
import { IUserRegistrationData, IUserLoginData, IContentCreateData, ValidationError } from '@/types';

// Generic validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return {
      field: 'email',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: email
    };
  }
  
  if (!APP_CONSTANTS.URL_PATTERNS.EMAIL.test(email)) {
    return {
      field: 'email',
      message: APP_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL,
      value: email
    };
  }
  
  return null;
}

// Password validation
export function validatePassword(password: string): ValidationError | null {
  if (!password) {
    return {
      field: 'password',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: password
    };
  }
  
  if (password.length < APP_CONSTANTS.PASSWORD_MIN_LENGTH) {
    return {
      field: 'password',
      message: APP_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_SHORT,
      value: password
    };
  }
  
  if (password.length > APP_CONSTANTS.PASSWORD_MAX_LENGTH) {
    return {
      field: 'password',
      message: APP_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_LONG,
      value: password
    };
  }
  
  return null;
}

// Name validation
export function validateName(name: string): ValidationError | null {
  if (!name) {
    return {
      field: 'name',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: name
    };
  }
  
  if (name.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
    return {
      field: 'name',
      message: `Name cannot exceed ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
      value: name
    };
  }
  
  return null;
}

// URL validation
export function validateUrl(url: string): ValidationError | null {
  if (!url) {
    return {
      field: 'url',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: url
    };
  }
  
  if (!APP_CONSTANTS.URL_PATTERNS.URL.test(url)) {
    return {
      field: 'url',
      message: APP_CONSTANTS.ERROR_MESSAGES.INVALID_URL,
      value: url
    };
  }
  
  return null;
}

// User registration validation
export function validateUserRegistration(data: IUserRegistrationData): ValidationResult {
  const errors: ValidationError[] = [];
  
  const nameError = validateName(data.name);
  if (nameError) errors.push(nameError);
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// User login validation
export function validateUserLogin(data: IUserLoginData): ValidationResult {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Content creation validation
export function validateContentCreation(data: IContentCreateData): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Title validation
  if (!data.title) {
    errors.push({
      field: 'title',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: data.title
    });
  } else if (data.title.length > APP_CONSTANTS.CONTENT_TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${APP_CONSTANTS.CONTENT_TITLE_MAX_LENGTH} characters`,
      value: data.title
    });
  }
  
  // Summary validation
  if (!data.summary) {
    errors.push({
      field: 'summary',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: data.summary
    });
  } else if (data.summary.length > APP_CONSTANTS.CONTENT_SUMMARY_MAX_LENGTH) {
    errors.push({
      field: 'summary',
      message: `Summary cannot exceed ${APP_CONSTANTS.CONTENT_SUMMARY_MAX_LENGTH} characters`,
      value: data.summary
    });
  }
  
  // Tags validation
  if (data.tags.length > APP_CONSTANTS.MAX_TAGS_PER_CONTENT) {
    errors.push({
      field: 'tags',
      message: `Cannot have more than ${APP_CONSTANTS.MAX_TAGS_PER_CONTENT} tags`,
      value: data.tags
    });
  }
  
  // Source validation
  if (!data.source.name) {
    errors.push({
      field: 'source.name',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: data.source.name
    });
  }
  
  if (!data.source.url) {
    errors.push({
      field: 'source.url',
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value: data.source.url
    });
  } else {
    const urlError = validateUrl(data.source.url);
    if (urlError) {
      errors.push({
        ...urlError,
        field: 'source.url'
      });
    }
  }
  
  // Original URL validation
  if (data.originalUrl) {
    const urlError = validateUrl(data.originalUrl);
    if (urlError) {
      errors.push({
        ...urlError,
        field: 'originalUrl'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generic field validation
export function validateRequired(value: unknown, fieldName: string): ValidationError | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: APP_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
      value
    };
  }
  return null;
}

// Password confirmation validation
export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationError | null {
  if (password !== confirmPassword) {
    return {
      field: 'confirmPassword',
      message: APP_CONSTANTS.ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
      value: confirmPassword
    };
  }
  return null;
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim(); // Remove leading/trailing whitespace
}

// Type guard functions
export function isValidEmail(email: string): boolean {
  return APP_CONSTANTS.URL_PATTERNS.EMAIL.test(email);
}

export function isValidUrl(url: string): boolean {
  return APP_CONSTANTS.URL_PATTERNS.URL.test(url);
}

export function isYouTubeUrl(url: string): boolean {
  return APP_CONSTANTS.URL_PATTERNS.YOUTUBE.test(url);
} 