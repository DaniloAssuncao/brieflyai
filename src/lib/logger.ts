// Centralized Logging System
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  stack?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  enablePerformance: boolean;
  enableUserTracking: boolean;
  maxLogSize: number;
  bufferSize: number;
}

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: true,
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
      enablePerformance: true,
      enableUserTracking: true,
      maxLogSize: 1000,
      bufferSize: 50,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    
    // Setup global error handlers
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', 'GlobalErrorHandler', {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Catch uncaught errors
    window.addEventListener('error', (event) => {
      this.error('Uncaught Error', 'GlobalErrorHandler', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Performance monitoring
    if (this.config.enablePerformance && 'performance' in window) {
      this.setupPerformanceMonitoring();
    }
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.info('Page Load Performance', 'Performance', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint(),
          });
        }
      }, 0);
    });
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
      sessionId: this.sessionId,
    };

    if (error) {
      entry.stack = error.stack;
    }

    // Add user context if available
    if (this.config.enableUserTracking && typeof window !== 'undefined') {
      entry.userAgent = navigator.userAgent;
      // Add user ID from session if available
      const userSession = this.getUserSession();
      if (userSession) {
        entry.userId = userSession.userId;
      }
    }

    return entry;
  }

  private getUserSession(): { userId: string } | null {
    // This would integrate with your auth system
    // For now, we'll check localStorage or session storage
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem('user-session');
        return session ? JSON.parse(session) : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async logToConsole(entry: LogEntry): Promise<void> {
    if (!this.config.enableConsole) return;

    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = ['#888', '#007acc', '#ff8c00', '#ff4444', '#cc0000'];
    
    const style = `color: ${levelColors[entry.level]}; font-weight: bold;`;
    const contextStr = entry.context ? `[${entry.context}] ` : '';
    
    console.log(
      `%c${levelNames[entry.level]} ${entry.timestamp} ${contextStr}${entry.message}`,
      style,
      entry.metadata || '',
      entry.stack || ''
    );
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  private async processLogEntry(entry: LogEntry): Promise<void> {
    // Add to buffer
    this.logBuffer.push(entry);
    
    // Trim buffer if too large
    if (this.logBuffer.length > this.config.maxLogSize) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxLogSize);
    }

    // Log to console
    await this.logToConsole(entry);

    // Batch remote logging for performance
    if (this.config.enableRemote && this.logBuffer.length >= this.config.bufferSize) {
      await this.flushLogs();
    }
  }

  public async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    for (const entry of logsToSend) {
      await this.logToRemote(entry);
    }
  }

  // Public logging methods
  public debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, metadata);
    this.processLogEntry(entry);
  }

  public info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createLogEntry(LogLevel.INFO, message, context, metadata);
    this.processLogEntry(entry);
  }

  public warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createLogEntry(LogLevel.WARN, message, context, metadata);
    this.processLogEntry(entry);
  }

  public error(message: string, context?: string, metadata?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, metadata, error);
    this.processLogEntry(entry);
  }

  public fatal(message: string, context?: string, metadata?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.FATAL)) return;
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, metadata, error);
    this.processLogEntry(entry);
  }

  // Utility methods
  public startTimer(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.info(`Timer: ${label}`, 'Performance', { duration: `${duration.toFixed(2)}ms` });
    };
  }

  public async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.info(`Async Operation: ${label}`, 'Performance', { 
        duration: `${duration.toFixed(2)}ms`,
        success: true 
      });
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.error(`Async Operation Failed: ${label}`, 'Performance', { 
        duration: `${duration.toFixed(2)}ms`,
        success: false 
      }, error as Error);
      throw error;
    }
  }

  public setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-session', JSON.stringify({ userId }));
    }
  }

  public clearUserId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-session');
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: string, metadata?: Record<string, unknown>) => 
    logger.debug(message, context, metadata),
  info: (message: string, context?: string, metadata?: Record<string, unknown>) => 
    logger.info(message, context, metadata),
  warn: (message: string, context?: string, metadata?: Record<string, unknown>) => 
    logger.warn(message, context, metadata),
  error: (message: string, context?: string, metadata?: Record<string, unknown>, error?: Error) => 
    logger.error(message, context, metadata, error),
  fatal: (message: string, context?: string, metadata?: Record<string, unknown>, error?: Error) => 
    logger.fatal(message, context, metadata, error),
  timer: (label: string) => logger.startTimer(label),
  measure: <T>(label: string, fn: () => Promise<T>) => logger.measureAsync(label, fn),
  setUser: (userId: string) => logger.setUserId(userId),
  clearUser: () => logger.clearUserId(),
};

export default logger; 