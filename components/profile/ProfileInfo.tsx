"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ui/theme-toggle";
import { LanguageSwitcherSimple } from "@/components/ui/language-switcher";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfileInfo() {
  const { profile, isLoadingProfile, profileError, user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");

  // Function to decode URL-encoded email
  const decodeEmail = (email: string | undefined) => {
    if (!email) return '';
    try {
      return decodeURIComponent(email);
    } catch (e) {
      console.error("Error decoding email:", e);
      return email; // Return original if decoding fails
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  if (isLoadingProfile) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <Skeleton className="h-7 sm:h-8 w-40" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 sm:h-9 w-9 sm:w-9" />
            <Skeleton className="h-8 sm:h-9 w-9 sm:w-9" />
            <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
            <Skeleton className="h-8 sm:h-9 w-16 sm:w-20" />
          </div>
        </div>
        
        <div className="grid gap-4 sm:gap-6">
          <div className="rounded-lg border border-border p-4 sm:p-6 bg-card">
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-3 sm:mb-4" />
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Skeleton className="h-3 w-10 mb-1" />
                <Skeleton className="h-4 sm:h-5 w-40 sm:w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-20 sm:w-24 mb-1" />
                <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border p-4 sm:p-6 bg-card">
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-3 sm:mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 sm:h-5 w-full" />
              <Skeleton className="h-4 sm:h-5 w-3/4" />
              <Skeleton className="h-4 sm:h-5 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center py-6 sm:py-10">
        <div className="bg-destructive/15 p-3 sm:p-4 rounded-md mb-3 sm:mb-4 max-w-md mx-auto">
          <p className="text-destructive text-sm sm:text-base">{tCommon("error")}: {profileError.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>{tCommon("tryAgain")}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tProfile("myProfile")}</h1>
        <div className="flex flex-wrap gap-2">
          <LanguageSwitcherSimple />
          <ThemeToggleSimple />
          <Link 
            href="/chat" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-9 px-3 sm:px-4 py-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{tCommon("chat")}</span>
          </Link>
          <Button 
            onClick={() => setShowLogoutDialog(true)} 
            variant="outline" 
            size="sm" 
            className="h-9 sm:size-default"
          >
            {tCommon("logout")}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        <div className="rounded-lg border border-border p-4 sm:p-6 bg-card">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{tProfile("userInfo")}</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-muted-foreground text-xs sm:text-sm">{tCommon("email")}</p>
              <p className="font-medium text-sm sm:text-base">{decodeEmail(profile?.email || user?.email)}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-xs sm:text-sm">{tProfile("registrationDate")}</p>
              <p className="font-medium text-sm sm:text-base">
                {profile?.registeredAt ? formatDate(new Date(profile.registeredAt)) : 'Н/Д'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-border p-4 sm:p-6 bg-card">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{tProfile("subscriptions")}</h2>
          
          {profile?.subscriptions && profile.subscriptions.length > 0 ? (
            <ul className="space-y-1 sm:space-y-2">
              {profile.subscriptions.map((subscription, index) => (
                <li key={index} className="flex items-center gap-x-2 text-sm sm:text-base">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary"></div>
                  <span>{subscription}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">{tProfile("noSubscriptions")}</p>
          )}
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCommon("logout")}</DialogTitle>
            <DialogDescription>
              {tProfile("confirmLogout")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="mt-2 sm:mt-0"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="sm:ml-2"
            >
              {tCommon("yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 