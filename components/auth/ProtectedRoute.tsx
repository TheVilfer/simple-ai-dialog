"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-provider";
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
  
  useEffect(() => {
    // Don't do anything until we know the authentication state
    if (isLoading) return;
    
    // If authenticated, render the children
    if (isAuthenticated) {
      console.log("[ProtectedRoute] User is authenticated");
      setIsChecking(false);
      return;
    }
    
    // If not authenticated, redirect to login
    console.log("[ProtectedRoute] User is not authenticated, redirecting to login");
    const from = searchParams.get('from') || pathname;
    router.push(`/auth/login?from=${encodeURIComponent(from)}`);
  }, [isLoading, isAuthenticated, router, pathname, searchParams]);

  // Show loading state while checking
  if (isLoading || (isChecking && !isAuthenticated)) {
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

  // Render children if authenticated
  return <>{children}</>;
} 