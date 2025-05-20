"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { useTranslations } from "next-intl";
import { setCookie } from "cookies-next";

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
    return <Button variant="ghost" className="w-16 opacity-0" />;
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
    <div className="flex items-center space-x-2">
      <Button
        variant={currentLocale === "en" ? "default" : "ghost"}
        onClick={() => switchLocale("en")}
        className="w-12"
      >
        EN
      </Button>
      <Button
        variant={currentLocale === "ru" ? "default" : "ghost"}
        onClick={() => switchLocale("ru")}
        className="w-12"
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
    return <Button variant="ghost" className="w-16 opacity-0" />;
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
      className="px-3"
      title={t("language")}
    >
      {currentLocale.toUpperCase()}
    </Button>
  );
} 