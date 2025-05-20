"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function ProfileInfo() {
  const { profile, isLoadingProfile, profileError, user, logout } = useAuth();

  if (isLoadingProfile) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Загрузка данных профиля...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center py-10">
        <div className="bg-destructive/15 p-4 rounded-md mb-4 max-w-md mx-auto">
          <p className="text-destructive">Ошибка загрузки профиля: {profileError.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Мой профиль</h1>
        <div className="flex gap-2">
          <Link href="/chat" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-9 px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Чат</span>
          </Link>
          <Button onClick={logout} variant="outline">Выйти</Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{profile?.email || user?.email}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">Дата регистрации</p>
              <p className="font-medium">
                {profile?.registeredAt ? formatDate(new Date(profile.registeredAt)) : 'Н/Д'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-border p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Подписки</h2>
          
          {profile?.subscriptions && profile.subscriptions.length > 0 ? (
            <ul className="space-y-2">
              {profile.subscriptions.map((subscription, index) => (
                <li key={index} className="flex items-center gap-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{subscription}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">У вас нет активных подписок</p>
          )}
        </div>
      </div>
    </div>
  );
} 