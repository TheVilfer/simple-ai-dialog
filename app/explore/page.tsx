'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImageGrid } from '@/components/explore/image-grid';
import { ImageModal } from '@/components/explore/image-modal';
import { ImageGridSkeleton } from '@/components/explore/image-grid-skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft, MessageSquare } from 'lucide-react';
import { UnsplashImage } from '@/lib/types/unsplash';
import Link from 'next/link';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { LanguageSwitcherSimple } from '@/components/ui/language-switcher';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useTranslations } from 'next-intl';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

async function fetchRandomImages(count: number = 30): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash API key not configured');
  }

  const response = await fetch(
    `https://api.unsplash.com/photos/random?count=${count}&orientation=portrait,landscape,squarish`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('API rate limit exceeded');
    }
    throw new Error('Failed to fetch images from Unsplash');
  }

  return response.json();
}

export default function ExplorePage() {
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const tCommon = useTranslations('common');
  const tExplore = useTranslations('explore');

  const {
    data: images,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['unsplash-images', refreshKey],
    queryFn: () => fetchRandomImages(30),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const getErrorMessage = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('API key not configured')) {
      return tExplore('apiKeyMissing');
    }
    if (errorMessage.includes('rate limit')) {
      return tExplore('rateLimitExceeded');
    }
    if (errorMessage.includes('Failed to fetch')) {
      return tExplore('networkError');
    }
    return tExplore('errorLoading');
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <Link 
                href="/profile" 
                className="mr-1 sm:mr-2 rounded-md p-1 hover:bg-muted transition-colors"
                aria-label={tCommon("back")}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <h1 className="text-lg sm:text-xl font-bold">{tExplore('title')}</h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcherSimple />
              <ThemeToggleSimple />
            </div>
          </header>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                {getErrorMessage(error)}
              </div>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                {tCommon('tryAgain')}
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/profile" 
              className="mr-1 sm:mr-2 rounded-md p-1 hover:bg-muted transition-colors"
              aria-label={tCommon("back")}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold">{tExplore('title')}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcherSimple />
            <ThemeToggleSimple />
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 h-8 w-8 sm:h-9 sm:w-9 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
              title={tCommon("chat")}
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={isLoading} 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9"
              title={tCommon('refresh')}
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <p className="text-muted-foreground">
                {tExplore('description')}
              </p>
            </div>

            {isLoading ? (
              <ImageGridSkeleton />
            ) : (
              <ImageGrid
                images={images || []}
                onImageClick={setSelectedImage}
              />
            )}
          </div>
        </div>

        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </ProtectedRoute>
  );
} 