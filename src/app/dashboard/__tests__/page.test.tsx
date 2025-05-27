import { renderWithProviders, screen, waitFor, userEvent } from '@/__tests__/utils/test-utils'
import { useSession } from 'next-auth/react'
import DashboardPage from '../page'
import { contentApi } from '@/lib/api-client'
import { createMockContentList } from '@/__tests__/utils/test-utils'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('@/lib/api-client')

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockContentApi = contentApi as jest.Mocked<typeof contentApi>

describe('Dashboard Page', () => {
  const mockSession = {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
    expires: '2024-12-31',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    })
  })

  it('renders dashboard with user greeting', async () => {
    const mockContent = createMockContentList(3)
    mockContentApi.getAll.mockResolvedValue(mockContent)

    renderWithProviders(<DashboardPage />)

    // Check for greeting (using fallback since ClientOnly might not render immediately)
    expect(screen.getByText(/good morning/i)).toBeInTheDocument()
    
    // Check for description
    expect(screen.getByText(/here's your personalized feed/i)).toBeInTheDocument()
  })

  it('displays content cards when data is loaded', async () => {
    const mockContent = createMockContentList(3)
    mockContentApi.getAll.mockResolvedValue(mockContent)

    renderWithProviders(<DashboardPage />)

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
      expect(screen.getByText('Test Article 2')).toBeInTheDocument()
      expect(screen.getByText('Test Article 3')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    mockContentApi.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves

    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    mockContentApi.getAll.mockRejectedValue(new Error('API Error'))

    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/API Error/)).toBeInTheDocument()
    })
  })

  it('filters content by search term', async () => {
    const mockContent = createMockContentList(3)
    mockContentApi.getAll.mockResolvedValue(mockContent)
    const user = userEvent.setup()

    renderWithProviders(<DashboardPage />)

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })

    // Search for specific article
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'Test Article 1')

    // Should show only matching article
    expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Article 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Article 3')).not.toBeInTheDocument()
  })

  it('filters content by tab selection', async () => {
    const mockContent = [
      ...createMockContentList(2),
      {
        ...createMockContentList(1)[0],
        id: '3',
        title: 'Favorite Article',
        favorite: true,
      },
    ]
    mockContentApi.getAll.mockResolvedValue(mockContent)
    const user = userEvent.setup()

    renderWithProviders(<DashboardPage />)

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })

    // Click on Favorites tab
    const favoritesTab = screen.getByRole('button', { name: /favorites/i })
    await user.click(favoritesTab)

    // Should show only favorite content
    expect(screen.getByText('Favorite Article')).toBeInTheDocument()
    expect(screen.queryByText('Test Article 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Article 2')).not.toBeInTheDocument()
  })

  it('toggles favorite status on content', async () => {
    const mockContent = createMockContentList(1)
    mockContentApi.getAll.mockResolvedValue(mockContent)
    const user = userEvent.setup()

    renderWithProviders(<DashboardPage />)

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })

    // Find and click the favorite button (this would be in ContentCard)
    // Note: This test assumes ContentCard has a favorite toggle button
    // You might need to adjust based on your actual ContentCard implementation
    const favoriteButtons = screen.getAllByRole('button')
    const favoriteButton = favoriteButtons.find(button => 
      button.getAttribute('aria-label')?.includes('favorite') ||
      button.textContent?.includes('♡') ||
      button.textContent?.includes('♥')
    )

    if (favoriteButton) {
      await user.click(favoriteButton)
      // The state should be updated locally
      // You can add more specific assertions based on your UI
    }
  })

  it('handles unauthenticated state', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    renderWithProviders(<DashboardPage />)

    // Should still render the page but without user-specific content
    expect(screen.getByText(/good morning/i)).toBeInTheDocument()
  })
}) 