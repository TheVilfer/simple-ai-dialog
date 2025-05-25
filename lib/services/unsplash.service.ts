/**
 * Unsplash API service
 * Handles all interactions with the Unsplash API
 */

import type {
  UnsplashImage,
  UnsplashRandomParams,
  UnsplashSearchParams,
  UnsplashRandomResponse,
  UnsplashSearchResponse,
  UnsplashError,
} from '@/types/unsplash';

// Configuration
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';
const DEFAULT_PER_PAGE = 30;
const MAX_PER_PAGE = 50;

// Error types
export class UnsplashApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'UnsplashApiError';
  }
}

// Service class
export class UnsplashService {
  private readonly accessKey: string;
  private readonly baseUrl: string;

  constructor(accessKey?: string) {
    this.accessKey = accessKey || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
    this.baseUrl = UNSPLASH_BASE_URL;

    if (!this.accessKey) {
    {
  }
      throw new UnsplashApiError(
        'Unsplash API key is required',
        'MISSING_API_KEY'
      );
    }
  }

  /**
   * Makes a request to the Unsplash API
   */
  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add query parameters
    if (params) {
    {
  }
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
    {
  }
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
    {
  }
        await this.handleApiError(response);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof UnsplashApiError) {
    {
  }
        throw error;
      }

      // Network or other errors
      throw new UnsplashApiError(
        'Failed to fetch from Unsplash API',
        'NETWORK_ERROR',
        undefined,
        error
      );
    }
  }

  /**
   * Handles API errors and throws appropriate UnsplashApiError
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorData: UnsplashError | undefined;
    
    try {
      errorData = await response.json() as UnsplashError;
    } catch {
      // Failed to parse error response
    }

    const errorMessage = errorData?.errors?.[0] || response.statusText || 'Unknown error';

    switch (response.status) {
      case 401:
        throw new UnsplashApiError(
          'Invalid API key',
          'INVALID_API_KEY',
          response.status,
          errorData
        );
      case 403:
        throw new UnsplashApiError(
          'API rate limit exceeded',
          'RATE_LIMIT_EXCEEDED',
          response.status,
          errorData
        );
      case 404:
        throw new UnsplashApiError(
          'Resource not found',
          'NOT_FOUND',
          response.status,
          errorData
        );
      case 422:
        throw new UnsplashApiError(
          'Invalid request parameters',
          'INVALID_PARAMETERS',
          response.status,
          errorData
        );
      default:
        throw new UnsplashApiError(
          errorMessage,
          'API_ERROR',
          response.status,
          errorData
        );
    }
  }

  /**
   * Fetches random images from Unsplash
   */
  async getRandomImages(params: UnsplashRandomParams = {}): Promise<UnsplashImage[]> {
    const {
      count = DEFAULT_PER_PAGE,
      featured,
      username,
      query,
      orientation,
      content_filter,
      collections,
    } = params;

    // Validate count parameter
    const validCount = Math.min(Math.max(1, count), MAX_PER_PAGE);

    const queryParams: Record<string, string | number | boolean> = {
      count: validCount,
    };

    if (featured !== undefined) {
    {
  }
      queryParams.featured = featured;
    }
    if (username) {
    {
  }
      queryParams.username = username;
    }
    if (query) {
    {
  }
      queryParams.query = query;
    }
    if (orientation) {
    {
  }
      queryParams.orientation = orientation;
    }
    if (content_filter) {
    {
  }
      queryParams.content_filter = content_filter;
    }
    if (collections) {
    {
  }
      queryParams.collections = collections;
    }

    const response = await this.makeRequest<UnsplashRandomResponse>('/photos/random', queryParams);
    return Array.from(response);
  }

  /**
   * Searches for images on Unsplash
   */
  async searchImages(params: UnsplashSearchParams): Promise<UnsplashSearchResponse> {
    const {
      query,
      page = 1,
      per_page = DEFAULT_PER_PAGE,
      order_by,
      collections,
      content_filter,
      color,
      orientation,
    } = params;

    if (!query.trim()) {
      throw new UnsplashApiError(
        'Search query is required',
        'MISSING_QUERY'
      );
    }

    // Validate per_page parameter
    const validPerPage = Math.min(Math.max(1, per_page), MAX_PER_PAGE);

    const queryParams: Record<string, string | number> = {
      query: query.trim(),
      page: Math.max(1, page),
      per_page: validPerPage,
    };

    if (order_by) {
      queryParams.order_by = order_by;
    }
    if (collections) {
      queryParams.collections = collections;
    }
    if (content_filter) {
      queryParams.content_filter = content_filter;
    }
    if (color) {
      queryParams.color = color;
    }
    if (orientation) {
      queryParams.orientation = orientation;
    }

    return this.makeRequest<UnsplashSearchResponse>('/search/photos', queryParams);
  }

  /**
   * Gets a single image by ID
   */
  async getImage(id: string): Promise<UnsplashImage> {
    if (!id.trim()) {
      throw new UnsplashApiError(
        'Image ID is required',
        'MISSING_IMAGE_ID'
      );
    }

    return this.makeRequest<UnsplashImage>(`/photos/${id}`);
  }

  /**
   * Triggers a download for tracking purposes (required by Unsplash API guidelines)
   */
  async triggerDownload(downloadLocation: string): Promise<void> {
    if (!downloadLocation) {
      throw new UnsplashApiError(
        'Download location is required',
        'MISSING_DOWNLOAD_LOCATION'
      );
    }

    try {
      await fetch(downloadLocation, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
        },
      });
    } catch (error) {
      // Download tracking is not critical, so we don't throw here
      console.warn('Failed to trigger download tracking:', error);
    }
  }

  /**
   * Gets the rate limit status
   */
  async getRateLimitStatus(): Promise<{
    limit: number;
    remaining: number;
    resetTime: Date;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/photos/random?count=1`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
        },
      });

      const limit = parseInt(response.headers.get('X-Ratelimit-Limit') || '0', 10);
      const remaining = parseInt(response.headers.get('X-Ratelimit-Remaining') || '0', 10);
      const resetTime = new Date(parseInt(response.headers.get('X-Ratelimit-Reset') || '0', 10) * 1000);

      return { limit, remaining, resetTime };
    } catch (error) {
      throw new UnsplashApiError(
        'Failed to get rate limit status',
        'RATE_LIMIT_CHECK_FAILED',
        undefined,
        error
      );
    }
  }
}

// Default service instance
export const unsplashService = new UnsplashService();

// Utility functions for common operations
export const unsplashApi = {
  /**
   * Fetches random images with error handling
   */
  async getRandomImages(count = DEFAULT_PER_PAGE): Promise<UnsplashImage[]> {
    try {
      return await unsplashService.getRandomImages({ count });
    } catch (error) {
      if (error instanceof UnsplashApiError) {
        throw error;
      }
      throw new UnsplashApiError(
        'Failed to fetch random images',
        'UNKNOWN_ERROR',
        undefined,
        error
      );
    }
  },

  /**
   * Searches images with error handling
   */
  async searchImages(query: string, page = 1): Promise<UnsplashSearchResponse> {
    try {
      return await unsplashService.searchImages({ query, page });
    } catch (error) {
      if (error instanceof UnsplashApiError) {
        throw error;
      }
      throw new UnsplashApiError(
        'Failed to search images',
        'UNKNOWN_ERROR',
        undefined,
        error
      );
    }
  },

  /**
   * Downloads an image and triggers download tracking
   */
  async downloadImage(image: UnsplashImage): Promise<void> {
    try {
      // Trigger download tracking
      await unsplashService.triggerDownload(image.links.download_location);
      
      // Open download link
      window.open(image.links.download, '_blank');
    } catch (error) {
      console.warn('Download tracking failed:', error);
      // Still allow download even if tracking fails
      window.open(image.links.download, '_blank');
    }
  },
}; 