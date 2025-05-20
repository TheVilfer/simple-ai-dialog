"use client";

import RegisterForm from '@/components/auth/RegisterForm';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';

export default function RegisterClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end p-4">
        <ThemeToggleSimple />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Создать аккаунт
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Введите данные ниже, чтобы создать аккаунт
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
} 