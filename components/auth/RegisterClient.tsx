"use client";

import RegisterForm from '@/components/auth/RegisterForm';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { LanguageSwitcherSimple } from '@/components/ui/language-switcher';
import { useTranslations } from 'next-intl';

export default function RegisterClient() {
  const t = useTranslations('auth');
  
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end p-2 sm:p-4 space-x-1 sm:space-x-2">
        <LanguageSwitcherSimple />
        <ThemeToggleSimple />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          <div className="flex flex-col space-y-1 sm:space-y-2 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t('registerTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              {t('registerDescription')}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-8 shadow-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
} 