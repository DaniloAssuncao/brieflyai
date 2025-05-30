import { ApiResponse, IPublicContent, IPublicUser, IUserRegistrationData, IUserLoginData } from '@/types';
import { apiCall as enhancedApiCall } from './api-error-handler';
import { log } from './logger';

// Base API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Enhanced API call function with centralized error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const result = await enhancedApiCall<ApiResponse<T>>(url, options, {
      endpoint,
      method: options.method || 'GET',
    });

    if (!result.success) {
      throw new Error(result.error || 'API call failed');
    }

    return result.data as T;
  } catch (error) {
    log.error(`API call failed for ${endpoint}`, 'ApiClient', {
      endpoint,
      method: options.method || 'GET',
    }, error as Error);
    throw error;
  }
}

// Content API functions
export const contentApi = {
  // Get all content
  getAll: (): Promise<IPublicContent[]> => {
    return apiCall<IPublicContent[]>('/content');
  },

  // Get favorite content only
  getFavorites: (): Promise<IPublicContent[]> => {
    return apiCall<IPublicContent[]>('/favorites');
  },

  // Get content by ID
  getById: (id: string): Promise<IPublicContent> => {
    return apiCall<IPublicContent>(`/content/${id}`);
  },

  // Create new content
  create: (data: Omit<IPublicContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPublicContent> => {
    return apiCall<IPublicContent>('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update content
  update: (id: string, data: Partial<IPublicContent>): Promise<IPublicContent> => {
    return apiCall<IPublicContent>(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete content
  delete: (id: string): Promise<void> => {
    return apiCall<void>(`/content/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle favorite
  toggleFavorite: (id: string): Promise<IPublicContent> => {
    return apiCall<IPublicContent>(`/content/${id}/favorite`, {
      method: 'PATCH',
    });
  },
};

// Auth API functions
export const authApi = {
  // Register new user
  register: (data: IUserRegistrationData): Promise<IPublicUser> => {
    return apiCall<IPublicUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login user (handled by NextAuth, but included for completeness)
  login: (data: IUserLoginData): Promise<{ success: boolean }> => {
    return apiCall<{ success: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// User API functions
export const userApi = {
  // Get current user profile
  getProfile: (): Promise<IPublicUser> => {
    return apiCall<IPublicUser>('/user/profile');
  },

  // Update user profile
  updateProfile: (data: Partial<IPublicUser>): Promise<IPublicUser> => {
    return apiCall<IPublicUser>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Export the main API client
export const apiClient = {
  content: contentApi,
  auth: authApi,
  user: userApi,
};

export default apiClient; 