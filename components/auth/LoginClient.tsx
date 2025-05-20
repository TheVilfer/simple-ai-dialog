"use client";

import LoginForm from '@/components/auth/LoginForm';

export default function LoginClient() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Войти в аккаунт
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Введите данные ниже, чтобы войти в аккаунт
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 