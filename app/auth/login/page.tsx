import { Metadata } from 'next';

import LoginClient from '@/components/auth/LoginClient';


export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return <LoginClient />;
} 