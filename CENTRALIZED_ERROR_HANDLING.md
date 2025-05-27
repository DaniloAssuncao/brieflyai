# 🚨 Centralized Error Handling & Logging System

## Overview

BrieflyAI implements a comprehensive centralized error handling and logging system designed to provide robust error management, detailed logging, and real-time monitoring capabilities across the entire application.

## 🎯 Goals of This System

### **1. Unified Error Management**
- Centralize all error handling logic in one place
- Provide consistent error responses across API routes
- Standardize error formats and messaging
- Enable easy error tracking and debugging

### **2. Advanced Logging Capabilities**
- Multi-level logging (DEBUG, INFO, WARN, ERROR, FATAL)
- Structured logging with metadata and context
- Performance monitoring with automatic timing
- User session tracking for better debugging

### **3. Production-Ready Monitoring**
- Real-time error monitoring dashboard
- Automatic error reporting to external services
- Circuit breaker patterns for failing services
- Performance metrics and error statistics

### **4. Developer Experience**
- Easy-to-use error handling utilities
- Comprehensive error context and stack traces
- Automatic retry mechanisms with exponential backoff
- Type-safe error handling with custom error classes

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling System                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Logger        │  │ Error Boundary  │  │ API Handler  │ │
│  │ - Multi-level   │  │ - React errors  │  │ - API errors │ │
│  │ - Structured    │  │ - Graceful UI   │  │ - Retries    │ │
│  │ - Performance   │  │ - Recovery      │  │ - Circuit    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Custom Errors   │  │ Monitoring      │  │ External     │ │
│  │ - Type-safe     │  │ - Dashboard     │  │ - Sentry     │ │
│  │ - Contextual    │  │ - Real-time     │  │ - LogRocket  │ │
│  │ - Categorized   │  │ - Filtering     │  │ - DataDog    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
src/
├── lib/
│   ├── logger.ts                    # Advanced logging system
│   ├── errors.ts                    # Custom error classes
│   └── api-error-handler.ts         # API error handling utilities
├── components/
│   ├── error/
│   │   └── ErrorBoundary.tsx        # React error boundary
│   └── admin/
│       └── ErrorMonitoringDashboard.tsx  # Monitoring dashboard
└── hooks/
    └── useApi.ts                    # Enhanced with error handling
```

## 🔧 Core Components

### **1. Advanced Logger (`src/lib/logger.ts`)**

**Purpose**: Centralized logging with multiple levels and structured data

**Key Features**:
- **Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Structured Logging**: JSON format with metadata
- **Performance Monitoring**: Automatic timing and metrics
- **User Context**: Session tracking and user identification
- **Remote Logging**: Integration with external services
- **Buffered Logging**: Performance optimization

**Usage Example**:
```typescript
import { logger } from '@/lib/logger'

// Basic logging
logger.info('User logged in', { userId: '123', email: 'user@example.com' })
logger.error('Database connection failed', { error: dbError })

// Performance monitoring
const timer = logger.startTimer('api-call')
// ... perform operation
timer.end('API call completed')

// User context
logger.setUserContext({ id: '123', email: 'user@example.com' })
```

### **2. Custom Error Classes (`src/lib/errors.ts`)**

**Purpose**: Type-safe, categorized error handling with rich context

**Error Types**:
- `AppError`: Base application error
- `ValidationAppError`: Form and input validation errors
- `AuthenticationError`: Authentication and authorization errors
- `DatabaseError`: Database operation errors
- `ExternalServiceError`: Third-party service errors

**Usage Example**:
```typescript
import { ValidationAppError, AuthenticationError } from '@/lib/errors'

// Validation error
throw new ValidationAppError('Invalid email format', {
  field: 'email',
  value: 'invalid-email',
  code: 'INVALID_EMAIL'
})

// Authentication error
throw new AuthenticationError('Invalid credentials', {
  userId: '123',
  attemptCount: 3
})
```

### **3. API Error Handler (`src/lib/api-error-handler.ts`)**

**Purpose**: Robust API error handling with retries and circuit breaker

**Key Features**:
- **Automatic Retries**: Exponential backoff for transient failures
- **Circuit Breaker**: Prevent cascading failures
- **Request Tracking**: Unique request IDs for debugging
- **Performance Monitoring**: API call metrics
- **Type-Safe Responses**: Consistent error response format

**Usage Example**:
```typescript
import { apiCall, withRetry } from '@/lib/api-error-handler'

// API call with automatic error handling
const result = await apiCall('/api/content', {
  method: 'GET',
  retries: 3,
  timeout: 5000
})

// Manual retry wrapper
const data = await withRetry(
  () => fetchUserData(userId),
  { maxRetries: 3, backoffMs: 1000 }
)
```

### **4. React Error Boundary (`src/components/error/ErrorBoundary.tsx`)**

**Purpose**: Graceful error handling for React components

**Error Levels**:
- **Component Level**: Isolated component errors
- **Page Level**: Full page error fallbacks
- **Critical Level**: Application-wide error handling

**Features**:
- **Graceful Fallbacks**: User-friendly error displays
- **Error Recovery**: Retry functionality
- **Automatic Reporting**: Send errors to monitoring services
- **Error Details Export**: For debugging purposes

**Usage Example**:
```tsx
import ErrorBoundary from '@/components/error/ErrorBoundary'

// Wrap components with error boundary
<ErrorBoundary level="component" fallback={<ComponentErrorFallback />}>
  <MyComponent />
</ErrorBoundary>

// Page-level error boundary
<ErrorBoundary level="page" fallback={<PageErrorFallback />}>
  <Dashboard />
</ErrorBoundary>
```

### **5. Error Monitoring Dashboard (`src/components/admin/ErrorMonitoringDashboard.tsx`)**

**Purpose**: Real-time error monitoring and analysis

**Features**:
- **Real-Time Updates**: Live error feed with auto-refresh
- **Advanced Filtering**: By level, context, time range
- **Error Statistics**: Metrics and trends
- **Export Functionality**: Download error logs
- **Interactive Details**: Expandable error information

**Dashboard Sections**:
- Error overview and statistics
- Real-time error feed
- Performance metrics
- Filter and search capabilities
- Export and analysis tools

## 🚀 Implementation Guide

### **Step 1: Basic Error Handling Setup**

```typescript
// 1. Import error handling utilities
import { logger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { apiCall } from '@/lib/api-error-handler'

// 2. Set up logging in your API routes
export async function GET() {
  try {
    logger.info('Content API called')
    const data = await fetchContent()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logger.error('Content fetch failed', { error })
    throw new AppError('Failed to fetch content', { originalError: error })
  }
}
```

### **Step 2: Component Error Boundaries**

```tsx
// Wrap your app with error boundaries
function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary level="critical">
      <SessionProvider>
        <ErrorBoundary level="page">
          <Component {...pageProps} />
        </ErrorBoundary>
      </SessionProvider>
    </ErrorBoundary>
  )
}
```

### **Step 3: API Client Integration**

```typescript
// Use enhanced API client with error handling
import { contentApi } from '@/lib/api-client'

const MyComponent = () => {
  const [content, setContent] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await contentApi.getAll()
        setContent(data)
      } catch (error) {
        setError(error)
        logger.error('Failed to load content', { error })
      }
    }
    fetchData()
  }, [])

  if (error) return <ErrorDisplay error={error} />
  return <ContentList content={content} />
}
```

## 📊 Monitoring and Analytics

### **Error Metrics Tracked**:
- Error frequency and trends
- Error types and categories
- User impact and affected sessions
- Performance impact
- Resolution times

### **Integration with External Services**:
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs'

logger.addTransport({
  name: 'sentry',
  level: 'error',
  transport: (log) => {
    Sentry.captureException(log.error, {
      tags: log.tags,
      extra: log.metadata
    })
  }
})

// Custom webhook integration
logger.addTransport({
  name: 'webhook',
  level: 'fatal',
  transport: async (log) => {
    await fetch('/api/alerts/critical', {
      method: 'POST',
      body: JSON.stringify(log)
    })
  }
})
```

## 🛠️ Configuration

### **Environment Variables**:
```env
# Logging configuration
LOG_LEVEL=info
ENABLE_REMOTE_LOGGING=true
LOG_BUFFER_SIZE=100

# Error reporting
SENTRY_DSN=your_sentry_dsn
ERROR_WEBHOOK_URL=your_webhook_url

# Performance monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_SAMPLE_RATE=0.1
```

### **Logger Configuration**:
```typescript
// Configure logger in your app initialization
logger.configure({
  level: process.env.LOG_LEVEL || 'info',
  enableRemoteLogging: process.env.ENABLE_REMOTE_LOGGING === 'true',
  bufferSize: parseInt(process.env.LOG_BUFFER_SIZE || '100'),
  transports: [
    { name: 'console', level: 'debug' },
    { name: 'file', level: 'info', filename: 'app.log' },
    { name: 'remote', level: 'error', endpoint: '/api/logs' }
  ]
})
```

## 🔍 Debugging and Troubleshooting

### **Common Issues and Solutions**:

**1. High Error Rates**
- Check error monitoring dashboard
- Analyze error patterns and trends
- Review recent deployments
- Check external service status

**2. Performance Issues**
- Monitor API response times
- Check database query performance
- Review error retry patterns
- Analyze circuit breaker status

**3. Missing Error Context**
- Ensure proper error wrapping
- Add relevant metadata to logs
- Check user context setting
- Verify error boundary placement

### **Debug Commands**:
```bash
# View error logs
npm run logs:errors

# Monitor real-time errors
npm run logs:watch

# Export error reports
npm run logs:export --from=2024-01-01 --to=2024-01-31

# Test error handling
npm run test:errors
```

## 📈 Best Practices

### **1. Error Handling**
- Always wrap async operations in try-catch
- Use specific error types for different scenarios
- Include relevant context in error messages
- Log errors at appropriate levels

### **2. Logging**
- Use structured logging with consistent fields
- Include request IDs for tracing
- Log user actions for debugging
- Monitor performance metrics

### **3. User Experience**
- Provide meaningful error messages
- Implement graceful fallbacks
- Allow error recovery when possible
- Hide technical details from users

### **4. Monitoring**
- Set up alerts for critical errors
- Monitor error trends and patterns
- Track error resolution times
- Review error logs regularly

## 🚀 Future Enhancements

1. **Machine Learning Error Prediction**
   - Predict potential failures
   - Proactive error prevention
   - Anomaly detection

2. **Advanced Analytics**
   - Error correlation analysis
   - User journey impact tracking
   - Performance regression detection

3. **Automated Recovery**
   - Self-healing mechanisms
   - Automatic rollback triggers
   - Dynamic configuration updates

4. **Enhanced Monitoring**
   - Real-time alerting
   - Custom dashboards
   - Integration with more services

---

This centralized error handling system provides a robust foundation for maintaining application reliability, debugging issues quickly, and ensuring excellent user experience even when errors occur. 