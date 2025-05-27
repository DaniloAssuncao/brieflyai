import { SourceType } from '@/types';

// Application constants
export const APP_CONSTANTS = {
  // User validation
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 50,
  
  // Session configuration
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  
  // Content configuration
  CONTENT_TITLE_MAX_LENGTH: 200,
  CONTENT_SUMMARY_MAX_LENGTH: 1000,
  MAX_TAGS_PER_CONTENT: 10,
  TAG_MAX_LENGTH: 50,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  
  // API rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  
  // Supported source types
  SUPPORTED_SOURCE_TYPES: ['youtube', 'article', 'newsletter'] as const satisfies readonly SourceType[],
  
  // URL patterns
  URL_PATTERNS: {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    YOUTUBE: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  },
  
  // Error messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${6} characters`,
    PASSWORD_TOO_LONG: `Password cannot exceed ${128} characters`,
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    INVALID_URL: 'Please enter a valid URL',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_ALREADY_EXISTS: 'A user with this email already exists',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INTERNAL_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection',
    VALIDATION_ERROR: 'Please check your input and try again',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    USER_CREATED: 'Account created successfully',
    USER_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    CONTENT_CREATED: 'Content created successfully',
    CONTENT_UPDATED: 'Content updated successfully',
    CONTENT_DELETED: 'Content deleted successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
  },
} as const;

// Environment configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // API URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // Database
  mongodbUri: process.env.MONGODB_URI,
  
  // Authentication
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  
  // External services
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
} as const;

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      600: '#4b5563',
      900: '#111827',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Navigation configuration
export const NAVIGATION_CONFIG = {
  mainNav: [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Content', href: '/dashboard/content', icon: 'FileText' },
    { label: 'Favorites', href: '/dashboard/favorites', icon: 'Heart' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ],
  userNav: [
    { label: 'Profile', href: '/dashboard/profile' },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Help', href: '/help' },
  ],
} as const; 