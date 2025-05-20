"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated according to useAuth, we can skip the extra check
    if (!isLoading && isAuthenticated) {
      setIsChecking(false);
      return;
    }

    // If useAuth says we're not authenticated, we'll make one direct check
    // with the server to be sure, in case the middleware doesn't catch it
    const checkAuthDirectly = async () => {
      if (isLoading) return;
      
      console.log("[ProtectedRoute] Checking authentication directly with server");
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          // If server says we're authenticated but useAuth doesn't, the useAuth
          // hook might not have completed its initialization yet
          console.log("[ProtectedRoute] Server confirms we're authenticated");
          setIsChecking(false);
          return;
        }
        
        // Not authenticated, redirect to login
        console.log("[ProtectedRoute] Server confirms we're NOT authenticated");
        const from = searchParams.get('from') || pathname;
        router.push(`/auth/login?from=${encodeURIComponent(from)}`);
        setAuthError("Authentication required");
      } catch (error) {
        console.error("[ProtectedRoute] Error checking auth:", error);
        setAuthError("Error checking authentication");
      } finally {
        setIsChecking(false);
      }
    };

    if (!isLoading && !isAuthenticated) {
      checkAuthDirectly();
    }
  }, [isLoading, isAuthenticated, router, pathname, searchParams]);

  // Show loading state or error if needed
  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="space-y-4 w-64">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-500">Authentication Error</h2>
            <p>{authError}</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 