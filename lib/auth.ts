import { cookies } from 'next/headers';

// Server-side functions
export const AUTH_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'user_email';

// Types
export interface User {
  email: string;
  token?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

// Cookie options - used in both client and server
export const cookieOptions = {
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
};

/**
 * Server-side function to get the current user from a request
 */
export const getUserFromRequest = (request: Request): User | null => {
  try {
    let token: string | undefined;
    
    // First check the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If no token in header, check cookies from the request
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        token = cookies[AUTH_COOKIE_NAME];
      }
    }

    if (!token) {
      return null;
    }

    // For demo purposes, just extract email from the cookie or use default
    const cookieHeader = request.headers.get('cookie');
    let email = 'user@example.com';
    if (cookieHeader) {
      const parsedCookies = parseCookies(cookieHeader);
      if (parsedCookies[USER_COOKIE_NAME]) {
        email = parsedCookies[USER_COOKIE_NAME];
      }
    }
    
    return {
      email,
      token
    };
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
};

/**
 * Server-side function to get the current user from server cookies
 * This is meant to be used in Server Components
 */
export const getUserFromServerCookies = async (): Promise<User | null> => {
  try {
    const cookiesList = await cookies();
    const token = cookiesList.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }
    
    const email = cookiesList.get(USER_COOKIE_NAME)?.value || 'user@example.com';
    
    return {
      email,
      token
    };
  } catch (error) {
    console.error('Error getting user from server cookies:', error);
    return null;
  }
};

/**
 * Parses cookies from a cookie header string
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}

/**
 * Generates a secure token (in a real app, you'd use a JWT library)
 */
export function generateToken(prefix = 'token'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
} 