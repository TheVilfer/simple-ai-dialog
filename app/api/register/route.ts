import { NextResponse } from 'next/server';

import { 
  AUTH_COOKIE_NAME, 
  USER_COOKIE_NAME, 
  cookieOptions, 
  generateToken,
  type AuthCredentials 
} from '@/lib/auth';

export async function POST(request: Request) {
  console.warn("[API] Register request received");
  
  try {
    // Try to parse the request body as JSON
    let body: AuthCredentials;
    try {
      body = await request.json();
      console.warn("[API] Register request body parsed:", { email: body.email });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Email and password validation
    if (!body.email || !body.password) {
    {
  }
      console.warn("[API] Missing email or password");
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    if (body.password.length < 6) {
    {
  }
      console.warn("[API] Password too short");
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Here you would typically save the user to a database and hash the password
    // For demo purposes, we'll just return a mock response
    
    // Generate a token
    const token = generateToken('new_user');
    console.warn("[API] Generated token:", `${token.substring(0, 10)}...`);
    
    // Create response data
    const responseData = {
      email: body.email,
      token: token,
      message: 'Registration successful'
    };
    
    // Create the response
    const response = NextResponse.json(responseData, { status: 201 });
    
    // Set cookies for authentication with the predefined options
    // Ensure email is not URL-encoded when stored in the cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
    response.cookies.set(USER_COOKIE_NAME, decodeURIComponent(body.email), cookieOptions);
    
    // Log the cookie operation
    console.warn("[API] Setting auth cookies with options:", {
      token: `${token.substring(0, 10)}...`,
      email: body.email,
      options: cookieOptions
    });
    
    console.warn("[API] Register response ready:", { status: 201 });
    return response;
    
  } catch (error) {
    console.error('[API] Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
} 