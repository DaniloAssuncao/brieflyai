import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Button component props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

// Input component props
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  error?: string;
}

// Pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

// Table column definition
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string | number;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

// Table props
export interface TableProps<T = Record<string, unknown>> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
}

// Dropdown/Select option
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
}

// Select component props
export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  onChange: (value: string | number | (string | number)[]) => void;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  isActive?: boolean;
  disabled?: boolean;
}

// Sidebar props
export interface SidebarProps extends BaseComponentProps {
  items: NavItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

// Header props
export interface HeaderProps extends BaseComponentProps {
  title?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onMenuToggle?: () => void;
  onUserMenuClick?: () => void;
  onLogout?: () => void;
}

// Search component props
export interface SearchProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  loading?: boolean;
  debounceMs?: number;
}

// Filter component props
export interface FilterProps extends BaseComponentProps {
  filters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'checkbox';
    options?: SelectOption[];
  }>;
} 