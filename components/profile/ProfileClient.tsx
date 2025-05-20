"use client";

import { Suspense } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { Skeleton } from '@/components/ui/skeleton';

// Create a loading fallback component
const ProfileLoadingSkeleton = () => (
  <div className="container mx-auto py-10 max-w-4xl">
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border border-border p-6 bg-card">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
        <div className="container mx-auto py-10 max-w-4xl">
          <ProfileInfo />
        </div>
      </ProtectedRoute>
    </Suspense>
  );
} 