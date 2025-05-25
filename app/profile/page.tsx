import { Metadata } from 'next';

import ProfileClient from '@/components/profile/ProfileClient';


export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your profile information',
};

export default function ProfilePage() {
  return <ProfileClient />;
} 