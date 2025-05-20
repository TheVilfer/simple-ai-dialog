import ProfileClient from '@/components/profile/ProfileClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your profile information',
};

export default function ProfilePage() {
  return <ProfileClient />;
} 