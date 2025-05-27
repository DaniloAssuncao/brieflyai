import { GET } from '../route'
import connectToDatabase from '@/lib/db'
import Content from '@/models/Content'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@/models/Content')

const mockConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>
const mockContent = Content as jest.Mocked<typeof Content>

describe('/api/content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return content successfully', async () => {
      // Mock database connection
      mockConnectToDatabase.mockResolvedValue({} as typeof import('mongoose'))

      // Mock content data
      const mockContentData = [
        {
          _id: '1',
          title: 'Test Article',
          summary: 'Test summary',
          tags: ['test'],
          source: {
            name: 'Test Source',
            avatarUrl: 'https://example.com/avatar.jpg',
            type: 'article',
            url: 'https://example.com',
          },
          date: new Date('2024-01-01'),
          readTime: '5 min read',
          originalUrl: 'https://example.com/article',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          favorite: false,
        },
      ]

      // Mock Content.find chain
      const mockFind = jest.fn().mockReturnThis()
      const mockSort = jest.fn().mockResolvedValue(mockContentData)
      
      mockContent.find = mockFind
      mockFind.mockReturnValue({ sort: mockSort })

      // Execute the API route
      const response = await GET()
      const responseData = await response.json()

      // Assertions
      expect(mockConnectToDatabase).toHaveBeenCalledTimes(1)
      expect(mockContent.find).toHaveBeenCalledWith({})
      expect(mockSort).toHaveBeenCalledWith({ date: -1 })
      
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data).toHaveLength(1)
      expect(responseData.data[0].id).toBe('1')
      expect(responseData.data[0].title).toBe('Test Article')
      expect(responseData.message).toBe('Content retrieved successfully')
    })

    it('should handle database connection errors', async () => {
      // Mock database connection failure
      mockConnectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      // Execute the API route
      const response = await GET()
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
      expect(responseData.message).toBe('Failed to retrieve content')
    })

    it('should handle content query errors', async () => {
      // Mock successful database connection
      mockConnectToDatabase.mockResolvedValue({} as typeof import('mongoose'))

      // Mock Content.find to throw error
      const mockFind = jest.fn().mockReturnThis()
      const mockSort = jest.fn().mockRejectedValue(new Error('Query failed'))
      
      mockContent.find = mockFind
      mockFind.mockReturnValue({ sort: mockSort })

      // Execute the API route
      const response = await GET()
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should return empty array when no content exists', async () => {
      // Mock database connection
      mockConnectToDatabase.mockResolvedValue({} as typeof import('mongoose'))

      // Mock empty content result
      const mockFind = jest.fn().mockReturnThis()
      const mockSort = jest.fn().mockResolvedValue([])
      
      mockContent.find = mockFind
      mockFind.mockReturnValue({ sort: mockSort })

      // Execute the API route
      const response = await GET()
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data).toEqual([])
      expect(responseData.message).toBe('Content retrieved successfully')
    })
  })
}) 