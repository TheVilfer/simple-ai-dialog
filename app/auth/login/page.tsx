import LoginClient from '@/components/auth/LoginClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return <LoginClient />;
} 