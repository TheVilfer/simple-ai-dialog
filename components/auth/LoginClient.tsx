"use client";

import LoginForm from '@/components/auth/LoginForm';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { LanguageSwitcherSimple } from '@/components/ui/language-switcher';
import { useTranslations } from 'next-intl';

export default function LoginClient() {
  const t = useTranslations('auth');
  
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end p-4 space-x-2">
        <LanguageSwitcherSimple />
        <ThemeToggleSimple />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('loginTitle')}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {t('loginDescription')}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
} 