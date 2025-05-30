# 🧪 Testing Guide for BrieflyAI

## Overview

BrieflyAI uses a comprehensive testing strategy with Jest, React Testing Library, and TypeScript to ensure code quality and reliability.

## Test Structure

```
src/
├── __tests__/
│   └── utils/
│       └── test-utils.tsx          # Testing utilities and helpers
├── components/
│   └── ui/
│       └── __tests__/
│           ├── Button.test.tsx     # Component tests
│           └── Input.test.tsx
├── lib/
│   └── __tests__/
│       └── validation.test.ts      # Utility function tests
├── app/
│   ├── api/
│   │   └── content/
│   │       └── __tests__/
│   │           └── route.test.ts   # API route tests
│   └── dashboard/
│       └── __tests__/
│           └── page.test.tsx       # Page component tests
└── types/
    └── jest.d.ts                   # TypeScript declarations
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="validation"
```

### Coverage Thresholds

Current coverage requirements:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## Test Categories

### 1. Unit Tests

**Component Tests** (`src/components/**/__tests__/`)
- Test individual React components
- Verify props, rendering, and user interactions
- Use React Testing Library for DOM testing

```typescript
// Example: Button component test
import { renderWithProviders, screen, userEvent } from '@/__tests__/utils/test-utils'
import Button from '../Button'

describe('Button Component', () => {
  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Utility Tests** (`src/lib/**/__tests__/`)
- Test pure functions and utilities
- Validate input/output behavior
- Test edge cases and error conditions

```typescript
// Example: Validation function test
import { validateEmail } from '../validation'

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBeNull()
  })
  
  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).not.toBeNull()
  })
})
```

### 2. Integration Tests

**API Route Tests** (`src/app/api/**/__tests__/`)
- Test API endpoints
- Mock database connections
- Verify request/response handling

```typescript
// Example: API route test
import { GET } from '../route'
import connectToDatabase from '@/lib/db'

jest.mock('@/lib/db')

describe('/api/content', () => {
  it('should return content successfully', async () => {
    const mockConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>
    mockConnectToDatabase.mockResolvedValue(undefined)
    
    const response = await GET()
    expect(response.status).toBe(200)
  })
})
```

**Page Tests** (`src/app/**/__tests__/`)
- Test complete page components
- Verify user flows and interactions
- Test authentication states

### 3. Test Utilities

**Custom Render Function**
```typescript
// Renders components with necessary providers
renderWithProviders(<Component />, { session: mockSession })
```

**Mock Data Factories**
```typescript
// Create consistent test data
const mockContent = createMockContentList(3)
const mockUser = createMockUser({ name: 'Test User' })
```

**API Response Helpers**
```typescript
// Create standardized API responses
const response = createMockApiResponse(data, true)
```

## Mocking Strategy

### External Dependencies

**NextAuth**
```typescript
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: mockSession,
    status: 'authenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))
```

**Next.js Router**
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}))
```

**Database Models**
```typescript
jest.mock('@/models/Content')
const mockContent = Content as jest.Mocked<typeof Content>
```

### Environment Variables
```typescript
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.MONGODB_URI = 'mongodb://localhost:27017/test'
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Component Testing
- Test user interactions, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features

### 3. Async Testing
- Use `waitFor` for async operations
- Properly handle promises and timeouts
- Test loading and error states

### 4. Mock Management
- Clear mocks between tests with `beforeEach`
- Mock at the module level for consistency
- Verify mock calls when testing integrations

## Current Test Coverage

### ✅ Well Tested (>70% coverage)
- **Button Component**: 100%
- **Dashboard Page**: 97.5%
- **ContentCard**: 78.26%
- **Validation Utils**: 50%

### ⚠️ Needs Improvement (<50% coverage)
- API Routes: 0%
- Authentication: 0%
- Error Handling: 3.7%
- Database Models: 0%

## Debugging Tests

### Common Issues

**Jest-DOM Matchers Not Found**
- Ensure `@testing-library/jest-dom` is imported in setup
- Check TypeScript declarations in `src/types/jest.d.ts`

**Module Resolution Errors**
- Verify `moduleNameMapper` in `jest.config.js`
- Check path aliases match `tsconfig.json`

**Async Test Failures**
- Use `waitFor` for DOM updates
- Increase timeout for slow operations
- Check for unhandled promises

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file with debugging
npm test -- --testNamePattern="specific test" --verbose

# Run tests without coverage (faster)
npm test -- --coverage=false
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release builds

CI configuration ensures:
- All tests pass
- Coverage thresholds are met
- No linting errors
- TypeScript compilation succeeds

## Future Improvements

1. **Increase API Route Coverage**
   - Add tests for all endpoints
   - Test error scenarios
   - Mock database operations

2. **Add E2E Tests**
   - User authentication flows
   - Content management workflows
   - Cross-browser compatibility

3. **Performance Testing**
   - Component render performance
   - API response times
   - Bundle size monitoring

4. **Visual Regression Testing**
   - Screenshot comparisons
   - Component visual states
   - Responsive design validation 