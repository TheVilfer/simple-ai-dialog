"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { useAuth } from "@/lib/providers/auth-provider";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Create a loading fallback
const LoginFormSkeleton = () => (
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
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="text-center">
      <Skeleton className="h-4 w-40 mx-auto" />
    </div>
  </div>
);

// Separate component that uses useSearchParams
function LoginFormWithParams() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  
  const { login, isLoggingIn, loginError } = useAuth();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from') || '/profile';
  
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  const validateForm = () => {
    // Clear previous errors
    setCustomError(null);

    // Basic email validation
    if (!email) {
      setCustomError(tAuth("emailRequired"));
      return false;
    }

    // Password validation
    if (!password) {
      setCustomError(tAuth("passwordRequired"));
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
      login({ email, password });
    } catch (error) {
      console.error("Login error:", error);
      setCustomError(tAuth("loginError"));
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{tCommon("email")}</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoggingIn}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">{tCommon("password")}</Label>
            <Input
              id="password"
              placeholder="••••••"
              type="password"
              autoComplete="current-password"
              disabled={isLoggingIn}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <FormError message={customError || (loginError instanceof Error ? loginError.message : undefined)} />
          
          <Button type="submit" disabled={isLoggingIn} className="w-full">
            {isLoggingIn ? (
              <div className="flex justify-center items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ) : tCommon("login")}
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {tAuth("noAccount")}{" "}
        </span>
        <Link 
          href={`/auth/register${fromPath ? `?from=${encodeURIComponent(fromPath)}` : ''}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          {tCommon("register")}
        </Link>
      </div>
    </div>
  );
}

// Main component with suspense
export default function LoginForm() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginFormWithParams />
    </Suspense>
  );
} 