"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
    {
  }
      if (isAuthenticated) {
    {
  }
        router.push("/profile");
      } else {
        router.push("/auth/login");
      }
    }
  }, [router, isAuthenticated, isLoading]);

  // Show loading state
  if (isLoading) {
    {
  }
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

  return null;
}
