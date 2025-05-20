"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileInfo from '@/components/profile/ProfileInfo';

export default function ProfileClient() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 max-w-4xl">
        <ProfileInfo />
      </div>
    </ProtectedRoute>
  );
} 