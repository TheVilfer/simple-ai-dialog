import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // First check the Authorization header
    const authHeader = request.headers.get('Authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no token in header, check cookies from the request
    if (!token) {
      // Extract cookies from request
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        token = cookies['auth_token'];
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication token is missing or invalid' },
        { status: 401 }
      );
    }
    
    // In a real application, you would verify the JWT token here
    // For demo purposes, we'll just check if it exists and return mock data
    
    // Mock user data
    // In a real application, this data would come from a database
    return NextResponse.json({
      email: 'user@example.com',
      registeredAt: new Date().toISOString(),
      subscriptions: ['Basic Plan', 'Premium Content']
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to parse cookies from a cookie header
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
} 