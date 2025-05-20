import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  console.log("[API] Logout request received");
  
  try {
    // Create response with success message
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    
    // Clear the auth cookies
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete(USER_COOKIE_NAME);
    
    console.log("[API] Auth cookies cleared");
    return response;
  } catch (error) {
    console.error('[API] Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 