import { log } from './logger';
import { AppError, ValidationAppError, AuthenticationError, NotFoundError, ConflictError } from './errors';
import { HttpStatusCode, ApiError, ValidationError } from '@/types';

export interface ApiErrorContext {
  endpoint: string;
  method: string;
  requestId?: string;
  userId?: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatusCodes: number[];
}

export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private retryConfig: RetryConfig;

  constructor(retryConfig?: Partial<RetryConfig>) {
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      ...retryConfig,
    };
  }

  public static getInstance(retryConfig?: Partial<RetryConfig>): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler(retryConfig);
    }
    return ApiErrorHandler.instance;
  }

  // Enhanced fetch wrapper with error handling and retries
  public async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {},
    context?: Partial<ApiErrorContext>
  ): Promise<T> {
    const requestId = this.generateRequestId();
    const fullContext: ApiErrorContext = {
      endpoint: url,
      method: options.method || 'GET',
      requestId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      ...context,
    };

    log.debug(`API Request Started`, 'ApiErrorHandler', {
      ...fullContext,
      headers: options.headers,
    });

    const startTime = performance.now();

    try {
      const result = await this.executeWithRetry<T>(url, options, fullContext);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      log.info(`API Request Successful`, 'ApiErrorHandler', {
        ...fullContext,
        duration: `${duration.toFixed(2)}ms`,
        success: true,
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      log.error(`API Request Failed`, 'ApiErrorHandler', {
        ...fullContext,
        duration: `${duration.toFixed(2)}ms`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, error as Error);

      throw this.enhanceError(error, fullContext);
    }
  }

  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    context: ApiErrorContext,
    attempt: number = 1
  ): Promise<T> {
    try {
             const response = await fetch(url, {
         ...options,
         headers: {
           'Content-Type': 'application/json',
           'X-Request-ID': context.requestId || '',
           ...options.headers,
         },
       });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        const shouldRetry = this.shouldRetry(response.status, attempt);

        if (shouldRetry) {
          const delay = this.calculateDelay(attempt);
          log.warn(`API Request Failed - Retrying`, 'ApiErrorHandler', {
            ...context,
            attempt,
            status: response.status,
            retryAfter: `${delay}ms`,
          });

          await this.delay(delay);
          return this.executeWithRetry<T>(url, options, context, attempt + 1);
        }

        throw this.createErrorFromResponse(response.status, errorData, context);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      // Network or parsing errors
      const shouldRetry = this.shouldRetryNetworkError(attempt);
      if (shouldRetry) {
        const delay = this.calculateDelay(attempt);
        log.warn(`Network Error - Retrying`, 'ApiErrorHandler', {
          ...context,
          attempt,
          error: error instanceof Error ? error.message : 'Unknown error',
          retryAfter: `${delay}ms`,
        });

        await this.delay(delay);
        return this.executeWithRetry<T>(url, options, context, attempt + 1);
      }

      throw error;
    }
  }

  private async parseErrorResponse(response: Response): Promise<ApiError | null> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  }

  private createErrorFromResponse(
    status: number,
    errorData: ApiError | null,
    context: ApiErrorContext
  ): AppError {
    const message = errorData?.message || errorData?.error || `HTTP ${status}`;
    const details = {
      ...context,
      responseData: errorData,
    };

    switch (status) {
      case HttpStatusCode.BAD_REQUEST:
        if (errorData && 'validationErrors' in errorData) {
          return new ValidationAppError(
            message,
            (errorData as { validationErrors: ValidationError[] }).validationErrors,
            status
          );
        }
        return new AppError(message, status, true, details);

      case HttpStatusCode.UNAUTHORIZED:
        return new AuthenticationError(message);

      case HttpStatusCode.NOT_FOUND:
        return new NotFoundError(message);

      case HttpStatusCode.CONFLICT:
        return new ConflictError(message);

      case HttpStatusCode.UNPROCESSABLE_ENTITY:
        return new ValidationAppError(message, [], status);

      default:
        return new AppError(message, status, status < 500, details);
    }
  }

  private enhanceError(error: unknown, context: ApiErrorContext): Error {
    if (error instanceof AppError) {
      // Create new AppError with enhanced context
      return new AppError(
        error.message,
        error.statusCode,
        error.isOperational,
        {
          ...error.details,
          ...context,
        }
      );
    }

    if (error instanceof Error) {
      // Wrap regular errors
      return new AppError(
        error.message,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        false,
        {
          ...context,
          originalError: error.message,
          stack: error.stack,
        }
      );
    }

    // Handle unknown errors
    return new AppError(
      'An unknown error occurred',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      false,
      {
        ...context,
        originalError: String(error),
      }
    );
  }

  private shouldRetry(status: number, attempt: number): boolean {
    return (
      attempt < this.retryConfig.maxRetries &&
      this.retryConfig.retryableStatusCodes.includes(status)
    );
  }

  private shouldRetryNetworkError(attempt: number): boolean {
    return attempt < this.retryConfig.maxRetries;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Circuit breaker pattern for failing endpoints
  private circuitBreakers = new Map<string, CircuitBreaker>();

  public async fetchWithCircuitBreaker<T>(
    url: string,
    options: RequestInit = {},
    context?: Partial<ApiErrorContext>
  ): Promise<T> {
    const circuitBreaker = this.getCircuitBreaker(url);
    
    if (circuitBreaker.isOpen()) {
      const error = new AppError(
        'Circuit breaker is open - service temporarily unavailable',
        503, // Service Unavailable
        true,
        { endpoint: url, circuitBreakerState: 'open' }
      );
      
      log.warn('Circuit Breaker Open', 'ApiErrorHandler', {
        endpoint: url,
        state: 'open',
        failures: circuitBreaker.getFailureCount(),
      });
      
      throw error;
    }

    try {
      const result = await this.fetchWithErrorHandling<T>(url, options, context);
      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  private getCircuitBreaker(endpoint: string): CircuitBreaker {
    if (!this.circuitBreakers.has(endpoint)) {
      this.circuitBreakers.set(endpoint, new CircuitBreaker(endpoint));
    }
    return this.circuitBreakers.get(endpoint)!;
  }
}

// Circuit Breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  constructor(private endpoint: string) {}

  public isOpen(): boolean {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
        log.info('Circuit Breaker Half-Open', 'CircuitBreaker', {
          endpoint: this.endpoint,
          state: 'half-open',
        });
        return false;
      }
      return true;
    }
    return false;
  }

  public recordSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
      log.info('Circuit Breaker Closed', 'CircuitBreaker', {
        endpoint: this.endpoint,
        state: 'closed',
      });
    }
  }

  public recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold && this.state === 'closed') {
      this.state = 'open';
      log.warn('Circuit Breaker Opened', 'CircuitBreaker', {
        endpoint: this.endpoint,
        state: 'open',
        failures: this.failures,
      });
    }
  }

  public getFailureCount(): number {
    return this.failures;
  }
}

// Create singleton instance
export const apiErrorHandler = ApiErrorHandler.getInstance();

// Convenience functions
export const apiCall = <T>(
  url: string,
  options?: RequestInit,
  context?: Partial<ApiErrorContext>
): Promise<T> => apiErrorHandler.fetchWithErrorHandling<T>(url, options, context);

export const apiCallWithCircuitBreaker = <T>(
  url: string,
  options?: RequestInit,
  context?: Partial<ApiErrorContext>
): Promise<T> => apiErrorHandler.fetchWithCircuitBreaker<T>(url, options, context);

export default apiErrorHandler; 