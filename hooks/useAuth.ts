"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { setCookie, deleteCookie } from 'cookies-next';

interface User {
  email: string;
  token: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface ProfileData {
  email: string;
  registeredAt: string;
  subscriptions: string[];
}

// Cookie options
const cookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize user state when the app is mounted
  useEffect(() => {
    console.warn("[Auth] Initializing auth from cookies");
    
    // For client-side auth state, we'll fetch the user profile
    // to check if we're already authenticated (via HttpOnly cookies)
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
    {
  }
          const data = await res.json();
          console.warn("[Auth] Successfully fetched user profile:", data);
          
          // We're authenticated, set the user state with decoded email
          setUser({
            email: decodeURIComponent(data.email),
            // We don't have access to the actual token since it's httpOnly,
            // but we can set a placeholder value
            token: "http-only-token"  
          });
        } else {
          console.warn("[Auth] No authenticated session found");
        }
      } catch (error) {
        console.error("[Auth] Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Save user data to cookies - only for client-visible cookies, 
  // the HttpOnly cookies are set by the server
  const saveUserToCookies = (userData: User) => {
    // Client-side cookies with cookies-next for state display only
    // Make sure to decode email before saving
    setCookie('user_email_client', decodeURIComponent(userData.email), cookieOptions);
    console.warn("[Auth] Client cookies saved");
  };

  const registerMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.warn("Sending registration request:", { email: credentials.email });
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        // Ensure we don't follow redirects automatically
        redirect: "manual",
      });

      // Log response for debugging
      console.warn("Registration response:", { 
        status: response.status, 
        statusText: response.statusText,
        type: response.type,
        url: response.url
      });

      let responseData;
      if (!response.ok) {
    {
  }
        // Try to parse error response as JSON, fallback to status text
        try {
          responseData = await response.json();
          throw new Error(responseData.message || "Registration failed");
        } catch {
          // If JSON parsing fails, use status text
          throw new Error(`Registration failed: ${response.statusText}`);
        }
      }

      // Try to parse success response
      try {
        responseData = await response.json();
        return responseData;
      } catch {
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: (data) => {
      console.warn("Registration successful:", data);
      const userData = {
        email: data.email,
        token: data.token,
      };
      setUser(userData);
      saveUserToCookies(userData);
      router.push("/profile");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.warn("Sending login request:", { email: credentials.email });
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        // Ensure we don't follow redirects automatically
        redirect: "manual",
      });

      // Log response for debugging
      console.warn("Login response:", { 
        status: response.status, 
        statusText: response.statusText,
        type: response.type,
        url: response.url
      });

      let responseData;
      if (!response.ok) {
    {
  }
        // Try to parse error response as JSON, fallback to status text
        try {
          responseData = await response.json();
          throw new Error(responseData.message || "Login failed");
        } catch {
          // If JSON parsing fails, use status text
          throw new Error(`Login failed: ${response.statusText}`);
        }
      }

      // Try to parse success response
      try {
        responseData = await response.json();
        return responseData;
      } catch {
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: (data) => {
      console.warn("Login successful:", data);
      const userData = {
        email: decodeURIComponent(data.email),
        token: data.token,
      };
      setUser(userData);
      saveUserToCookies(userData);
      
      // Check if we need to redirect to a specific page
      const from = new URLSearchParams(window.location.search).get('from');
      router.push(from || "/profile");
    },
    onError: (error) => {
      console.error("Login error:", error);
    }
  });

  const profileQuery = useQuery({
    queryKey: ["profile", user?.token],
    queryFn: async (): Promise<ProfileData> => {
      if (!user?.token) {
    {
  }
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
    {
  }
        throw new Error("Failed to fetch profile");
      }

      return await response.json();
    },
    enabled: !!user?.token,
  });

  const logout = async () => {
    try {
      // Call the logout API to clear server-side cookies
      await fetch('/api/logout', { method: 'POST' });
      
      // Clear client-side cookies
      deleteCookie('auth_token');
      deleteCookie('user_email');
      
      // Update state
      setUser(null);
      
      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isPending,
    profileError: profileQuery.error,
    logout,
  };
}; 