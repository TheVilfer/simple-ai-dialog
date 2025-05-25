import { Metadata } from 'next';

import RegisterClient from '@/components/auth/RegisterClient';


export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return <RegisterClient />;
} 