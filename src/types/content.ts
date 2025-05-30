import { Document } from 'mongoose';

// Source type enum
export type SourceType = 'youtube' | 'article' | 'newsletter';

// Content source interface
export interface IContentSource {
  name: string;
  avatarUrl: string;
  type: SourceType;
  url: string;
}

// Base Content interface matching the database schema
export interface IContent {
  _id: string;
  title: string;
  summary: string;
  tags: string[];
  source: IContentSource;
  date: Date;
  readTime: string;
  favorite: boolean;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Content document interface for Mongoose
export interface IContentDocument extends IContent, Document {
  _id: string;
}

// Public content interface for API responses
export interface IPublicContent {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  source: IContentSource;
  date: string; // ISO string for JSON serialization
  readTime: string;
  favorite: boolean;
  originalUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Content creation form data
export interface IContentCreateData {
  title: string;
  summary: string;
  tags: string[];
  source: IContentSource;
  date: Date;
  readTime: string;
  favorite?: boolean;
  originalUrl: string;
}

// Content update form data
export interface IContentUpdateData {
  title?: string;
  summary?: string;
  tags?: string[];
  source?: Partial<IContentSource>;
  date?: Date;
  readTime?: string;
  favorite?: boolean;
  originalUrl?: string;
}

// Content filter options
export interface IContentFilters {
  tags?: string[];
  sourceType?: SourceType;
  favorite?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// Content sort options
export interface IContentSortOptions {
  field: 'date' | 'title' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
}

// Content pagination options
export interface IContentPaginationOptions {
  page: number;
  limit: number;
  sort?: IContentSortOptions;
  filters?: IContentFilters;
} 