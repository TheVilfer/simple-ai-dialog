"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";


import { Button } from "./button";


export function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Get the current locale from the cookie or default to 'en'
    const locale = document.cookie
      .split("; ")
      .find(row => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] || "en";
    
    setCurrentLocale(locale);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    {
  }
    return <Button variant="ghost" className="h-8 w-14 sm:h-9 sm:w-16 opacity-0" />;
  }

  const switchLocale = (locale: string) => {
    // Set cookie
    setCookie("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    
    // Reload the page to apply the new locale
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Button
        variant={currentLocale === "en" ? "default" : "ghost"}
        onClick={() => switchLocale("en")}
        className="h-8 sm:h-9 w-10 sm:w-12 text-xs sm:text-sm"
      >
        EN
      </Button>
      <Button
        variant={currentLocale === "ru" ? "default" : "ghost"}
        onClick={() => switchLocale("ru")}
        className="h-8 sm:h-9 w-10 sm:w-12 text-xs sm:text-sm"
      >
        RU
      </Button>
    </div>
  );
}

// Simple toggle version
export function LanguageSwitcherSimple() {
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>("en");
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
    // Get the current locale from the cookie or default to 'en'
    const locale = document.cookie
      .split("; ")
      .find(row => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] || "en";
    
    setCurrentLocale(locale);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    {
  }
    return <Button variant="ghost" className="h-8 w-12 sm:h-9 sm:w-16 opacity-0" />;
  }

  const toggleLocale = () => {
    const newLocale = currentLocale === "en" ? "ru" : "en";
    
    // Set cookie
    setCookie("NEXT_LOCALE", newLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    
    setCurrentLocale(newLocale);
    
    // Reload the page to apply the new locale
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLocale}
      className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
      title={t("language")}
    >
      {currentLocale.toUpperCase()}
    </Button>
  );
} 