import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register'];

// API routes that don't require authentication
const publicApiRoutes = ['/api/login', '/api/register', '/api/logout'];

export function middleware(request: NextRequest) {
  // Get all cookies for debugging
  const cookieList = request.cookies.getAll();
  const cookieValues = cookieList.map(c => `${c.name}=${c.value.substring(0, 10)}...`).join(', ');
  
  // Get the token from cookies
  const authToken = request.cookies.get('auth_token');
  const userEmail = request.cookies.get('user_email');
  const { pathname, search } = request.nextUrl;
  const method = request.method;

  // Enhanced logging
  console.log(`[Middleware] ${method} ${pathname}${search || ''}`);
  console.log(`[Middleware] Cookies: ${cookieValues}`);
  console.log(`[Middleware] auth_token: ${authToken ? `${authToken.value.substring(0, 10)}...` : 'None'}`);
  console.log(`[Middleware] user_email: ${userEmail ? userEmail.value : 'None'}`);

  // Use the token for auth check
  const token = authToken?.value;

  // Allow access to public routes regardless of authentication
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log(`[Middleware] Access allowed to public route: ${pathname}`);
    return NextResponse.next();
  }

  // Allow access to public API routes
  if (publicApiRoutes.some(route => pathname === route)) {
    console.log(`[Middleware] Access allowed to public API route: ${pathname}`);
    return NextResponse.next();
  }

  // Static files are handled separately
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // For other API routes, check for authentication
  if (pathname.startsWith('/api')) {
    if (!token) {
      console.log(`[Middleware] Unauthorized API access: ${pathname}`);
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    console.log(`[Middleware] Authorized API access: ${pathname}`);
    return NextResponse.next();
  }

  // For protected routes, redirect to login if not authenticated
  if (!token) {
    console.log(`[Middleware] Redirecting to login: ${pathname}`);
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log(`[Middleware] Access allowed to protected route: ${pathname}`);
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 