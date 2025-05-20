"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-provider";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// Create a separate component for navigation handling
function NavigationHandler({ children }: { children: React.ReactNode }) {
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
    return <LoadingSkeleton variant="page" />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="page" />}>
      <NavigationHandler>
        {children}
      </NavigationHandler>
    </Suspense>
  );
} 