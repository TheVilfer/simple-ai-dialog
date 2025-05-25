/**
 * Authentication related types
 */

import type { DateString, ID } from './common';

// User types
export interface User {
  readonly id: ID;
  readonly email: string;
  readonly name?: string;
  readonly avatar?: string;
  readonly createdAt: DateString;
  readonly updatedAt: DateString;
  readonly emailVerified?: boolean;
  readonly role?: UserRole;
}

export type UserRole = 'user' | 'admin' | 'moderator';

// Authentication credentials
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface RegisterCredentials {
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly name?: string;
  readonly acceptTerms: boolean;
}

export interface ResetPasswordCredentials {
  readonly email: string;
}

export interface ChangePasswordCredentials {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

// Authentication state
export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

// Token types
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAt: DateString;
}

export interface DecodedToken {
  readonly sub: string; // user ID
  readonly email: string;
  readonly role?: UserRole;
  readonly iat: number; // issued at
  readonly exp: number; // expires at
}

// Session types
export interface Session {
  readonly id: string;
  readonly userId: ID;
  readonly token: string;
  readonly expiresAt: DateString;
  readonly createdAt: DateString;
  readonly userAgent?: string;
  readonly ipAddress?: string;
}

// Authentication responses
export interface LoginResponse {
  readonly user: User;
  readonly tokens: AuthTokens;
  readonly session: Session;
}

export interface RegisterResponse {
  readonly user: User;
  readonly tokens: AuthTokens;
  readonly session: Session;
  readonly emailVerificationRequired?: boolean;
}

// Authentication errors
export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'RATE_LIMIT_EXCEEDED';

export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly field?: string;
}

// Cookie configuration
export interface CookieConfig {
  readonly name: string;
  readonly maxAge: number;
  readonly secure: boolean;
  readonly httpOnly: boolean;
  readonly sameSite: 'strict' | 'lax' | 'none';
  readonly path: string;
}

// Authentication configuration
export interface AuthConfig {
  readonly tokenCookie: CookieConfig;
  readonly userCookie: CookieConfig;
  readonly sessionDuration: number;
  readonly passwordMinLength: number;
  readonly maxLoginAttempts: number;
  readonly lockoutDuration: number;
}

// Form validation
export interface AuthFormErrors {
  readonly email?: string;
  readonly password?: string;
  readonly confirmPassword?: string;
  readonly name?: string;
  readonly general?: string;
}

// OAuth types (for future implementation)
export type OAuthProvider = 'google' | 'github' | 'discord';

export interface OAuthConfig {
  readonly provider: OAuthProvider;
  readonly clientId: string;
  readonly redirectUri: string;
  readonly scope: string[];
}

// Permission types
export type Permission = 
  | 'read:profile'
  | 'write:profile'
  | 'read:chat'
  | 'write:chat'
  | 'read:explore'
  | 'admin:users'
  | 'admin:system';

export interface UserPermissions {
  readonly userId: ID;
  readonly permissions: readonly Permission[];
  readonly role: UserRole;
} 