import { NextResponse } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  console.warn("[API] /me endpoint called");

  try {
    // Get the user from the request
    const user = getUserFromRequest(request);
    
    // If no user is found, return 401
    if (!user) {
    {
  }
      console.warn("[API] Authentication failed");
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Log the authenticated user
    console.warn("[API] Authenticated user:", { email: user.email });

    // In a real application, you would fetch more user data from a database
    // For demo purposes, we'll just return mock data
    return NextResponse.json({
      email: user.email,
      registeredAt: new Date().toISOString(),
      subscriptions: ['Basic Plan', 'Premium Content']
    });
    
  } catch (error) {
    console.error('[API] Profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 