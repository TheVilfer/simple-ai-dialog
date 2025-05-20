import { NextResponse } from 'next/server';
import { 
  AUTH_COOKIE_NAME, 
  USER_COOKIE_NAME, 
  cookieOptions, 
  generateToken,
  type AuthCredentials 
} from '@/lib/auth';

export async function POST(request: Request) {
  console.log("[API] Login request received");
  
  try {
    // Try to parse the request body as JSON
    let body: AuthCredentials;
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
    
    // Generate a token
    const token = generateToken('jwt');
    console.log("[API] Generated token:", `${token.substring(0, 10)}...`);
    
    // Create response data
    const responseData = {
      email: body.email,
      token: token,
      message: 'Login successful'
    };
    
    // Create the response
    const response = NextResponse.json(responseData, { status: 200 });
    
    // Set cookies for authentication with the predefined options
    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
    response.cookies.set(USER_COOKIE_NAME, body.email, cookieOptions);
    
    // Log the cookie operation
    console.log("[API] Setting auth cookies with options:", {
      token: `${token.substring(0, 10)}...`,
      email: body.email,
      options: cookieOptions
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