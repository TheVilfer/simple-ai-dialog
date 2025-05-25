"use client";

import { Suspense } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { Skeleton } from '@/components/ui/skeleton';

// Create a loading fallback component
const ProfileLoadingSkeleton = () => (
  <div className="container mx-auto py-4 sm:py-10 px-4 sm:px-6 max-w-full sm:max-w-4xl">
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <Skeleton className="h-7 sm:h-8 w-40" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 sm:h-9 w-9 sm:w-9" />
          <Skeleton className="h-8 sm:h-9 w-9 sm:w-9" />
          <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
          <Skeleton className="h-8 sm:h-9 w-16 sm:w-20" />
        </div>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        <div className="rounded-lg border border-border p-4 sm:p-6 bg-card">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-3 sm:mb-4" />
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProfileClient() {
  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      <ProtectedRoute>
        <div className="container mx-auto py-4 sm:py-10 px-4 sm:px-6 max-w-full sm:max-w-4xl">
          <ProfileInfo />
        </div>
      </ProtectedRoute>
    </Suspense>
  );
} 