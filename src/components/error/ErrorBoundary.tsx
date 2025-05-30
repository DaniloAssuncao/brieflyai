'use client'
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '@/lib/logger';
import Button from '@/components/ui/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Log the error with context
    log.error(
      `React Error Boundary Caught Error (${level})`,
      'ErrorBoundary',
      {
        errorId: this.state.errorId,
        level,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      },
      error
    );

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo);
    }
  }

  private async reportErrorToService(error: Error, errorInfo: ErrorInfo) {
    try {
      // This would integrate with your error reporting service (Sentry, Bugsnag, etc.)
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(),
        errorId: this.state.errorId,
        level: this.props.level,
      };

      // Send to your error reporting endpoint
      if (process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
      }
    } catch (reportingError) {
      log.error('Failed to report error to external service', 'ErrorBoundary', {}, reportingError as Error);
    }
  }

  private getUserId(): string | null {
    try {
      const session = localStorage.getItem('user-session');
      return session ? JSON.parse(session).userId : null;
    } catch {
      return null;
    }
  }

  private handleRetry = () => {
    log.info('User initiated error recovery', 'ErrorBoundary', {
      errorId: this.state.errorId,
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleReportIssue = () => {
    const { error, errorId } = this.state;
    
    log.info('User reported issue', 'ErrorBoundary', {
      errorId,
    });

    // Create a detailed error report for the user to send
    const errorReport = {
      errorId,
      message: error?.message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Copy to clipboard or open email client
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
      alert('Error details copied to clipboard. Please paste this in your bug report.');
    } else {
      // Fallback for older browsers
      const mailtoLink = `mailto:support@brieflyai.com?subject=Error Report - ${errorId}&body=${encodeURIComponent(JSON.stringify(errorReport, null, 2))}`;
      window.open(mailtoLink);
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = false, level = 'component' } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI based on level
      return (
        <div className="error-boundary-container">
          {level === 'critical' ? (
            <CriticalErrorFallback
              error={error}
              errorInfo={errorInfo}
              onRetry={this.handleRetry}
              onReportIssue={this.handleReportIssue}
              showDetails={showDetails}
            />
          ) : level === 'page' ? (
            <PageErrorFallback
              error={error}
              errorInfo={errorInfo}
              onRetry={this.handleRetry}
              onReportIssue={this.handleReportIssue}
              showDetails={showDetails}
            />
          ) : (
            <ComponentErrorFallback
              error={error}
              errorInfo={errorInfo}
              onRetry={this.handleRetry}
              onReportIssue={this.handleReportIssue}
              showDetails={showDetails}
            />
          )}
        </div>
      );
    }

    return children;
  }
}

// Critical Error Fallback (Full page)
const CriticalErrorFallback: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onReportIssue: () => void;
  showDetails: boolean;
}> = ({ error, onRetry, onReportIssue, showDetails }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        We encountered an unexpected error. Our team has been notified.
      </p>
      
      <div className="space-y-3">
        <Button onClick={onRetry} className="w-full" variant="primary">
          Try Again
        </Button>
        <Button onClick={onReportIssue} className="w-full" variant="outline">
          Report Issue
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          className="w-full" 
          variant="ghost"
        >
          Go Home
        </Button>
      </div>

      {showDetails && error && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
            Technical Details
          </summary>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
            <div className="text-red-600 dark:text-red-400 mb-2">{error.message}</div>
            {error.stack && (
              <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                {error.stack}
              </pre>
            )}
          </div>
        </details>
      )}
    </div>
  </div>
);

// Page Error Fallback
const PageErrorFallback: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onReportIssue: () => void;
  showDetails: boolean;
}> = ({ error, onRetry, onReportIssue, showDetails }) => (
  <div className="flex flex-col items-center justify-center min-h-96 p-6">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Page Error
      </h2>
             <p className="text-gray-600 dark:text-gray-400 mb-6">
         This page encountered an error and couldn&apos;t load properly.
       </p>
      
      <div className="flex gap-3 justify-center">
        <Button onClick={onRetry} variant="primary">
          Retry
        </Button>
        <Button onClick={onReportIssue} variant="outline">
          Report
        </Button>
      </div>

      {showDetails && error && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
            Error Details
          </summary>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {error.message}
          </div>
        </details>
      )}
    </div>
  </div>
);

// Component Error Fallback
const ComponentErrorFallback: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onReportIssue: () => void;
  showDetails: boolean;
}> = ({ onRetry, onReportIssue, showDetails }) => (
  <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
          Component Error
        </h3>
                 <p className="text-sm text-red-700 dark:text-red-300 mt-1">
           This component failed to render properly.
         </p>
        <div className="mt-3 flex gap-2">
          <Button onClick={onRetry} size="sm" variant="outline">
            Retry
          </Button>
          {showDetails && (
            <Button onClick={onReportIssue} size="sm" variant="ghost">
              Report
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ErrorBoundary; 