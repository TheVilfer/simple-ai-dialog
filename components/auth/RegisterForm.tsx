"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

// Create a loading fallback
const RegisterFormSkeleton = () => (
  <div className="grid gap-6">
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="text-center">
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  </div>
);

// Separate component that uses useSearchParams
function RegisterFormWithParams() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  
  const { register, isRegistering, registerError } = useAuth();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from') || '/profile';

  const validateForm = () => {
    // Clear previous errors
    setCustomError(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setCustomError("Email обязателен");
      return false;
    }
    if (!emailRegex.test(email)) {
      setCustomError("Пожалуйста, введите корректный email");
      return false;
    }

    // Password validation
    if (!password) {
      setCustomError("Пароль обязателен");
      return false;
    }
    
    if (password.length < 6) {
      setCustomError("Пароль должен содержать не менее 6 символов");
      return false;
    }

    if (password !== passwordConfirm) {
      setCustomError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      register({ email, password });
    } catch (error) {
      console.error("Registration error:", error);
      setCustomError("Ошибка при регистрации, попробуйте ещё раз");
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isRegistering}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              placeholder="••••••"
              type="password"
              autoComplete="new-password"
              disabled={isRegistering}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password-confirm">Подтвердите пароль</Label>
            <Input
              id="password-confirm"
              placeholder="••••••"
              type="password"
              autoComplete="new-password"
              disabled={isRegistering}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          
          <FormError message={customError || (registerError instanceof Error ? registerError.message : undefined)} />
          
          <Button type="submit" disabled={isRegistering} className="w-full">
            {isRegistering ? (
              <div className="flex justify-center items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ) : "Зарегистрироваться"}
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Уже есть аккаунт?{" "}
        </span>
        <Link 
          href={`/auth/login${fromPath ? `?from=${encodeURIComponent(fromPath)}` : ''}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Войдите
        </Link>
      </div>
    </div>
  );
}

// Main component with suspense
export default function RegisterForm() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterFormWithParams />
    </Suspense>
  );
} 