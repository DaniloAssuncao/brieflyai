// Re-export all types from individual modules
export * from './user';
export * from './content';
export * from './api';
export * from './forms';
export * from './components';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Generic ID type
export type ID = string | number;

// Generic timestamp type
export type Timestamp = Date | string;

// Generic key-value pair
export interface KeyValuePair<T = unknown> {
  key: string;
  value: T;
}

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Language/Locale types
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt';

// Generic callback function types
export type VoidCallback = () => void;
export type AsyncVoidCallback = () => Promise<void>;
export type Callback<T> = (value: T) => void;
export type AsyncCallback<T> = (value: T) => Promise<void>;

// Event handler types
export type ChangeHandler<T = unknown> = (value: T) => void;
export type ClickHandler = (event: React.MouseEvent) => void;
export type SubmitHandler = (event: React.FormEvent) => void;

// Generic state types
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginatedState<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

// Generic filter state
export interface FilterState<T = Record<string, unknown>> {
  filters: T;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Generic modal state
export interface ModalState {
  isOpen: boolean;
  data?: unknown;
  mode?: 'create' | 'edit' | 'view' | 'delete';
}

// Application configuration types
export interface AppConfig {
  apiUrl: string;
  environment: Environment;
  version: string;
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    sessionTimeout: number;
  };
}

// User preferences
export interface UserPreferences {
  theme: Theme;
  language: Locale;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: number;
    defaultSort: string;
  };
} 