import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

// Define supported locales
export const locales = ['en', 'ru'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const cookiesList = await cookies();
  const localeCookie = cookiesList.get('NEXT_LOCALE')?.value;
  
  // Validate that the locale from cookie is supported
  const locale = localeCookie && locales.includes(localeCookie) 
    ? localeCookie 
    : defaultLocale;

  return {
    locale,
    // Import messages for the current locale
    messages: (await import(`../../messages/${locale}.json`)).default
  };
}); 