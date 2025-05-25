/**
 * Unsplash API response types
 * @see https://unsplash.com/documentation
 */

export interface UnsplashUser {
  readonly id: string;
  readonly username: string;
  readonly name: string;
  readonly first_name: string;
  readonly last_name: string | null;
  readonly twitter_username: string | null;
  readonly portfolio_url: string | null;
  readonly bio: string | null;
  readonly location: string | null;
  readonly links: {
    readonly self: string;
    readonly html: string;
    readonly photos: string;
    readonly likes: string;
    readonly portfolio: string;
    readonly following: string;
    readonly followers: string;
  };
  readonly profile_image: {
    readonly small: string;
    readonly medium: string;
    readonly large: string;
  };
  readonly instagram_username: string | null;
  readonly total_collections: number;
  readonly total_likes: number;
  readonly total_photos: number;
  readonly accepted_tos: boolean;
  readonly for_hire: boolean;
  readonly social: {
    readonly instagram_username: string | null;
    readonly portfolio_url: string | null;
    readonly twitter_username: string | null;
    readonly paypal_email: string | null;
  };
}

export interface UnsplashImageUrls {
  readonly raw: string;
  readonly full: string;
  readonly regular: string;
  readonly small: string;
  readonly thumb: string;
  readonly small_s3: string;
}

export interface UnsplashImageLinks {
  readonly self: string;
  readonly html: string;
  readonly download: string;
  readonly download_location: string;
}

export interface UnsplashTag {
  readonly type: string;
  readonly title: string;
  readonly source?: {
    readonly ancestry: {
      readonly type: {
        readonly slug: string;
        readonly pretty_slug: string;
      };
      readonly category: {
        readonly slug: string;
        readonly pretty_slug: string;
      };
      readonly subcategory?: {
        readonly slug: string;
        readonly pretty_slug: string;
      };
    };
    readonly title: string;
    readonly subtitle: string;
    readonly description: string;
    readonly meta_title: string;
    readonly meta_description: string;
    readonly cover_photo: UnsplashImage;
  };
}

export interface UnsplashExif {
  readonly make: string | null;
  readonly model: string | null;
  readonly name: string | null;
  readonly exposure_time: string | null;
  readonly aperture: string | null;
  readonly focal_length: string | null;
  readonly iso: number | null;
}

export interface UnsplashLocation {
  readonly name: string | null;
  readonly city: string | null;
  readonly country: string | null;
  readonly position: {
    readonly latitude: number | null;
    readonly longitude: number | null;
  };
}

export interface UnsplashImage {
  readonly id: string;
  readonly slug: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly promoted_at: string | null;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly blur_hash: string;
  readonly description: string | null;
  readonly alt_description: string | null;
  readonly breadcrumbs: ReadonlyArray<{
    readonly slug: string;
    readonly title: string;
    readonly index: number;
    readonly type: string;
  }>;
  readonly urls: UnsplashImageUrls;
  readonly links: UnsplashImageLinks;
  readonly likes: number;
  readonly liked_by_user: boolean;
  readonly current_user_collections: ReadonlyArray<unknown>;
  readonly sponsorship: unknown | null;
  readonly topic_submissions: Record<string, unknown>;
  readonly user: UnsplashUser;
  readonly exif?: UnsplashExif;
  readonly location?: UnsplashLocation;
  readonly tags?: ReadonlyArray<UnsplashTag>;
  readonly views?: number;
  readonly downloads?: number;
}

// API Response types
export type UnsplashRandomResponse = ReadonlyArray<UnsplashImage>;

export interface UnsplashSearchResponse {
  readonly total: number;
  readonly total_pages: number;
  readonly results: ReadonlyArray<UnsplashImage>;
}

// Error types
export interface UnsplashError {
  readonly errors: ReadonlyArray<string>;
}

// Utility types
export type UnsplashImageSize = keyof UnsplashImageUrls;
export type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish';
export type UnsplashOrderBy = 'latest' | 'oldest' | 'popular';

// API parameters
export interface UnsplashRandomParams {
  readonly count?: number;
  readonly featured?: boolean;
  readonly username?: string;
  readonly query?: string;
  readonly orientation?: UnsplashOrientation;
  readonly content_filter?: 'low' | 'high';
  readonly collections?: string;
}

export interface UnsplashSearchParams {
  readonly query: string;
  readonly page?: number;
  readonly per_page?: number;
  readonly order_by?: UnsplashOrderBy;
  readonly collections?: string;
  readonly content_filter?: 'low' | 'high';
  readonly color?: 'black_and_white' | 'black' | 'white' | 'yellow' | 'orange' | 'red' | 'purple' | 'magenta' | 'green' | 'teal' | 'blue';
  readonly orientation?: UnsplashOrientation;
} 