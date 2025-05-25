/**
 * Application constants
 * Centralized configuration values and magic numbers
 */

// API Configuration
export const API_CONFIG = {
  UNSPLASH: {
    BASE_URL: 'https://api.unsplash.com',
    DEFAULT_PER_PAGE: 30,
    MAX_PER_PAGE: 50,
    RATE_LIMIT: {
      FREE_TIER: 50, // requests per hour
      DEMO_MODE: true,
    },
  },
} as const;

// Authentication
export const AUTH_CONFIG = {
  COOKIE_NAMES: {
    TOKEN: 'auth_token',
    USER: 'user_email',
  },
  SESSION: {
    DURATION: 7 * 24 * 60 * 60, // 7 days in seconds
    REFRESH_THRESHOLD: 24 * 60 * 60, // 1 day in seconds
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  RATE_LIMITING: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60, // 15 minutes in seconds
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  GRID: {
    COLUMNS: {
      MOBILE: 2,
      TABLET: 3,
      DESKTOP: 4,
      LARGE: 5,
    },
    GAP: 16, // pixels
  },
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MESSAGE: {
    MAX_LENGTH: 4000,
    MIN_LENGTH: 1,
  },
  AI: {
    RESPONSE_DELAY: 1000, // milliseconds
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    MODEL: 'gpt-3.5-turbo', // placeholder
  },
  HISTORY: {
    MAX_MESSAGES: 1000,
    AUTO_SAVE: true,
    SAVE_INTERVAL: 30000, // 30 seconds
  },
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  SIZES: {
    THUMBNAIL: 150,
    SMALL: 400,
    MEDIUM: 800,
    LARGE: 1200,
    FULL: 2400,
  },
  FORMATS: {
    SUPPORTED: ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const,
    PREFERRED: 'webp',
  },
  QUALITY: {
    THUMBNAIL: 60,
    PREVIEW: 75,
    FULL: 90,
  },
  LAZY_LOADING: {
    ROOT_MARGIN: '50px',
    THRESHOLD: 0.1,
  },
} as const;

// Localization
export const LOCALE_CONFIG = {
  DEFAULT: 'en',
  SUPPORTED: ['en', 'ru'] as const,
  FALLBACK: 'en',
  COOKIE_NAME: 'NEXT_LOCALE',
  COOKIE_MAX_AGE: 365 * 24 * 60 * 60, // 1 year
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT: 'system',
  MODES: ['light', 'dark', 'system'] as const,
  STORAGE_KEY: 'theme-preference',
  CSS_VARIABLES: {
    LIGHT: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    DARK: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
    },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'An internal server error occurred.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
  REGISTER: 'Account created successfully.',
  PASSWORD_RESET: 'Password reset email sent.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  IMAGE_DOWNLOADED: 'Image downloaded successfully.',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254,
  },
  PASSWORD: {
    MIN_LENGTH: AUTH_CONFIG.PASSWORD.MIN_LENGTH,
    MAX_LENGTH: AUTH_CONFIG.PASSWORD.MAX_LENGTH,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
  ] as const,
  MAX_FILES: 5,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: {
    SHORT: 1 * 60 * 1000, // 1 minute
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
    VERY_LONG: 60 * 60 * 1000, // 1 hour
  },
  CACHE_TIME: {
    DEFAULT: 5 * 60 * 1000, // 5 minutes
    IMAGES: 30 * 60 * 1000, // 30 minutes
    USER_DATA: 10 * 60 * 1000, // 10 minutes
  },
} as const;

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_DEVTOOLS: process.env.NODE_ENV === 'development',
  ENABLE_LOGGING: process.env.NODE_ENV !== 'production',
  MOCK_API_DELAY: 1000, // milliseconds
  DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  UNSPLASH: {
    HOME: 'https://unsplash.com',
    API_DOCS: 'https://unsplash.com/documentation',
    TERMS: 'https://unsplash.com/terms',
    PRIVACY: 'https://unsplash.com/privacy',
  },
  SOCIAL: {
    GITHUB: 'https://github.com',
    TWITTER: 'https://twitter.com',
    LINKEDIN: 'https://linkedin.com',
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_EXPLORE: true,
  ENABLE_PROFILE: true,
  ENABLE_THEMES: true,
  ENABLE_I18N: true,
  ENABLE_ANALYTICS: false,
  ENABLE_PWA: false,
  ENABLE_OFFLINE: false,
} as const; 