/**
 * Common types used throughout the application
 */

// Base types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// API related types
export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
}

export interface ApiError {
  readonly message: string;
  readonly code?: string | number;
  readonly details?: Record<string, unknown>;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

// Component props
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface WithTestId {
  readonly 'data-testid'?: string;
}

// Form types
export interface FormField<T = string> {
  readonly value: T;
  readonly error?: string;
  readonly touched?: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  readonly fields: {
    readonly [K in keyof T]: FormField<T[K]>;
  };
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}

// Event handlers
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]];
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Theme and styling
export type ThemeMode = 'light' | 'dark' | 'system';
export type Locale = 'en' | 'ru';

// Navigation
export interface NavigationItem {
  readonly href: string;
  readonly label: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly external?: boolean;
}

// Pagination
export interface PaginationInfo {
  readonly page: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
}

// Search and filtering
export interface SearchParams {
  readonly query?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

// Modal and dialog states
export interface ModalState {
  readonly isOpen: boolean;
  readonly data?: unknown;
}

// Image related types
export interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

export interface ImageMetadata extends ImageDimensions {
  readonly alt?: string;
  readonly title?: string;
  readonly caption?: string;
}

// Date and time
export type DateString = string; // ISO 8601 format
export type Timestamp = number; // Unix timestamp

// Generic ID types
export type ID = string | number;
export type UUID = string;

// Environment
export type Environment = 'development' | 'production' | 'test';

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Status codes
export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500; 