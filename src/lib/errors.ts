import { HttpStatusCode, ApiError, ValidationError } from '@/types';
import { APP_CONSTANTS } from './constants';

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationAppError extends AppError {
  public readonly validationErrors: ValidationError[];

  constructor(
    message: string,
    validationErrors: ValidationError[],
    statusCode: number = HttpStatusCode.BAD_REQUEST
  ) {
    super(message, statusCode, true, { validationErrors });
    this.validationErrors = validationErrors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = APP_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, HttpStatusCode.CONFLICT);
  }
}

// Error handling utilities
export function createApiError(
  error: unknown,
  defaultMessage: string = APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR
): ApiError {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return {
      error: error.message,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      message: error.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      timestamp,
    };
  }

  return {
    error: defaultMessage,
    message: defaultMessage,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    timestamp,
  };
}

// Type guards for error checking
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationAppError {
  return error instanceof ValidationAppError;
}

// Error logging utility
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}] ` : '';
  
  if (error instanceof AppError) {
    console.error(`${timestamp} ${contextStr}AppError:`, {
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      details: error.details,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    console.error(`${timestamp} ${contextStr}Error:`, {
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(`${timestamp} ${contextStr}Unknown error:`, error);
  }
}

// Safe error message extraction
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR;
}

// Async error wrapper
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, fn.name);
      throw error;
    }
  };
}

// Error boundary helper
export function handleAsyncError(error: unknown): void {
  logError(error, 'AsyncErrorBoundary');
  
  // In development, re-throw to see the error
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }
} 