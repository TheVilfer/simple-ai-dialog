"use client";



import { useMutation, useQuery } from "@tanstack/react-query";
import { setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { type User, type AuthCredentials } from "../auth";

// Define the shape of the Auth Context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => void;
  register: (credentials: AuthCredentials) => void;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Error | null;
  registerError: Error | null;
  profile: ProfileData | undefined;
  isLoadingProfile: boolean;
  profileError: Error | null;
}

interface ProfileData {
  email: string;
  registeredAt: string;
  subscriptions: string[];
}

// Create the Auth Context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  register: () => {},
  logout: async () => {},
  isLoggingIn: false,
  isRegistering: false,
  loginError: null,
  registerError: null,
  profile: undefined,
  isLoadingProfile: false,
  profileError: null,
});

// Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    console.warn("[Auth] Initializing auth state");
    
    // Check authentication by calling the ME endpoint
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
    {
  }
          const data = await res.json();
          console.warn("[Auth] Successfully fetched user profile:", data);
          
          // Set user state with the response data
          setUser({
            email: data.email,
            // We don't have access to the actual token since it's httpOnly
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

  // Save a client-side reference to the user email
  const saveUserEmailClientSide = (email: string) => {
    setCookie('user_email_client', email, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  };

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.warn("Sending registration request:", { email: credentials.email });
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        redirect: "manual",
      });
      
      console.warn("Registration response:", { 
        status: response.status, 
        statusText: response.statusText,
        type: response.type,
        url: response.url
      });

      if (!response.ok) {
    {
  }
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        } catch {
          throw new Error(`Registration failed: ${response.statusText}`);
        }
      }

      try {
        return await response.json();
      } catch {
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: (data) => {
      console.warn("Registration successful:", data);
      
      // Update auth state
      setUser({
        email: data.email,
        token: "http-only-token"  // Token is stored in HTTP-only cookie
      });
      
      // Save user email for client-side reference
      saveUserEmailClientSide(data.email);
      
      // Redirect to profile page
      router.push("/profile");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.warn("Sending login request:", { email: credentials.email });
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        redirect: "manual",
      });
      
      console.warn("Login response:", { 
        status: response.status, 
        statusText: response.statusText,
        type: response.type,
        url: response.url
      });

      if (!response.ok) {
    {
  }
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        } catch {
          throw new Error(`Login failed: ${response.statusText}`);
        }
      }

      try {
        return await response.json();
      } catch {
        throw new Error("Invalid response format from server");
      }
    },
    onSuccess: (data) => {
      console.warn("Login successful:", data);
      
      // Update auth state
      setUser({
        email: data.email,
        token: "http-only-token"  // Token is stored in HTTP-only cookie
      });
      
      // Save user email for client-side reference
      saveUserEmailClientSide(data.email);
      
      // Check if we need to redirect to a specific page
      const from = new URLSearchParams(window.location.search).get('from');
      router.push(from || "/profile");
    },
    onError: (error) => {
      console.error("Login error:", error);
    }
  });

  // Profile query
  const profileQuery = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async (): Promise<ProfileData> => {
      if (!user) {
    {
  }
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/me");

      if (!response.ok) {
    {
  }
        throw new Error("Failed to fetch profile");
      }

      return await response.json();
    },
    enabled: !!user,
  });

  // Logout function
  const logout = async () => {
    try {
      console.warn("[Auth] Logging out");
      
      // Call logout API to clear server-side cookies
      await fetch('/api/logout', { method: 'POST' });
      
      // Clear client-side reference
      deleteCookie('user_email_client');
      
      // Update state
      setUser(null);
      
      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error as Error | null,
        registerError: registerMutation.error as Error | null,
        profile: profileQuery.data,
        isLoadingProfile: profileQuery.isPending,
        profileError: profileQuery.error as Error | null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 