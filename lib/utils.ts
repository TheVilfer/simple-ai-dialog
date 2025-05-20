import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  // Get locale from cookie or use default 'en-US'
  const locale = typeof document !== 'undefined' 
    ? (document.cookie
        .split("; ")
        .find(row => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1] || 'en') 
    : 'en';
  
  // Map to proper locale format
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'ru': 'ru-RU'
  };
  
  return new Intl.DateTimeFormat(localeMap[locale] || 'en-US', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
