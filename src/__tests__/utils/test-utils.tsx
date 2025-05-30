import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { IPublicContent, IPublicUser, SourceType } from '@/types'

// Mock session data
export const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  expires: '2024-12-31',
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null
}

export function renderWithProviders(
  ui: ReactElement,
  { session = mockSession, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock data factories
export const createMockUser = (overrides: Partial<IPublicUser> = {}): IPublicUser => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  ...overrides,
})

export const createMockContent = (overrides: Partial<IPublicContent> = {}): IPublicContent => ({
  id: '1',
  title: 'Test Article',
  summary: 'This is a test article summary',
  tags: ['test', 'article'],
  source: {
    name: 'Test Source',
    avatarUrl: 'https://example.com/avatar.jpg',
    type: 'article' as SourceType,
    url: 'https://example.com',
  },
  date: '2024-01-01T00:00:00.000Z',
  readTime: '5 min read',
  originalUrl: 'https://example.com/article',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  favorite: false,
  ...overrides,
})

export const createMockContentList = (count: number = 3): IPublicContent[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockContent({
      id: (index + 1).toString(),
      title: `Test Article ${index + 1}`,
      source: {
        name: `Source ${index + 1}`,
        avatarUrl: `https://example.com/avatar${index + 1}.jpg`,
        type: ['article', 'youtube', 'newsletter'][index % 3] as SourceType,
        url: `https://example${index + 1}.com`,
      },
      favorite: index % 2 === 0,
    })
  )
}

// API response mocks
export const createMockApiResponse = (data: unknown, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
  ...(success ? {} : { error: 'Test error' }),
})

// Event helpers
export const createMockEvent = (overrides: Record<string, unknown> = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: { value: 'test' },
  ...overrides,
})

// Async helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event' 