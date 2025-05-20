import { NextResponse } from 'next/server';

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  console.log("[API] Login request received");
  
  try {
    // Try to parse the request body as JSON
    let body: LoginRequestBody;
    try {
      body = await request.json();
      console.log("[API] Login request body parsed:", { email: body.email });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Email and password validation
    if (!body.email || !body.password) {
      console.log("[API] Missing email or password");
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Here you would typically validate the user credentials against a database
    // For demo purposes, we'll just return a mock response
    
    // Simple mock authentication - in a real app, you would check credentials
    // against a database and use proper password hashing
    
    // Generate a token
    const token = 'jwt_token_' + Math.random().toString(36).substring(2, 15);
    console.log("[API] Generated token:", token);
    
    // Create response
    const responseData = {
      email: body.email,
      token: token,
      message: 'Login successful'
    };
    
    const response = NextResponse.json(responseData, { status: 200 });
    
    // Set cookies for authentication with fixed settings
    const oneWeek = 7 * 24 * 60 * 60;
    response.cookies.set('auth_token', token, { 
      path: '/',
      maxAge: oneWeek,
      httpOnly: true,
      sameSite: 'lax',  // Changed from strict to lax to work better with redirects
      secure: process.env.NODE_ENV === 'production'
    });
    response.cookies.set('user_email', body.email, { 
      path: '/',
      maxAge: oneWeek,
      httpOnly: true,
      sameSite: 'lax',  // Changed from strict to lax
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Log detailed cookie information
    console.log("[API] Setting cookies:", {
      auth_token: {
        value: `${token.substring(0, 10)}...`,
        options: {
          path: '/',
          maxAge: oneWeek,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        }
      }
    });
    
    console.log("[API] Login response ready:", { status: 200 });
    return response;
    
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
} 