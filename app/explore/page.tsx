'use client';


import { useQuery } from '@tanstack/react-query';
import { RefreshCw, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ImageGrid } from '@/components/explore/image-grid';
import { ImageGridSkeleton } from '@/components/explore/image-grid-skeleton';
import { ImageModal } from '@/components/explore/image-modal';
import { Button } from '@/components/ui/button';
import { LanguageSwitcherSimple } from '@/components/ui/language-switcher';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import { unsplashApi, UnsplashApiError } from '@/lib/services/unsplash.service';
import type { UnsplashImage } from '@/types/unsplash';

// Configuration
const IMAGES_PER_PAGE = 30;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const RETRY_COUNT = 2;

interface ExplorePageState {
  readonly selectedImage: UnsplashImage | null;
  readonly refreshKey: number;
}

/**
 * Maps UnsplashApiError to user-friendly error messages
 */
const getErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (error instanceof UnsplashApiError) {
    switch (error.code) {
      case 'MISSING_API_KEY':
      case 'INVALID_API_KEY':
        return t('apiKeyMissing');
      case 'RATE_LIMIT_EXCEEDED':
        return t('rateLimitExceeded');
      case 'NETWORK_ERROR':
        return t('networkError');
      default:
        return t('errorLoading');
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return t('errorLoading');
};

/**
 * Error display component
 */
interface ErrorDisplayProps {
  readonly error: unknown;
  readonly onRetry: () => void;
}

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const tCommon = useTranslations('common');
  const tExplore = useTranslations('explore');
  
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          {getErrorMessage(error, tExplore)}
        </div>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4 mr-2 transition-transform duration-200 hover:scale-110" />
          {tCommon('tryAgain')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Page header component
 */
interface PageHeaderProps {
  readonly onRefresh: () => void;
  readonly isLoading: boolean;
}

function PageHeader({ onRefresh, isLoading }: PageHeaderProps) {
  const tCommon = useTranslations('common');
  const tExplore = useTranslations('explore');
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-2 sm:p-4">
      <div className="flex items-center gap-2">
        <Link 
          href="/profile" 
          className="mr-1 sm:mr-2 rounded-md p-1 hover:bg-muted transition-all duration-200 hover:scale-110 hover:shadow-md"
          aria-label={tCommon("back")}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 hover:scale-110" />
        </Link>
        <h1 className="text-lg sm:text-xl font-bold">{tExplore('title')}</h1>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <LanguageSwitcherSimple />
        <ThemeToggleSimple />
        <Link 
          href="/chat" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 h-8 w-8 sm:h-9 sm:w-9 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:shadow-lg"
          title={tCommon("chat")}
        >
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 hover:scale-110" />
        </Link>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          disabled={isLoading} 
          size="icon" 
          className="h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 hover:scale-110 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
          title={tCommon('refresh')}
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 hover:scale-110 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </header>
  );
}

/**
 * Main explore page component
 */
export default function ExplorePage() {
  const [state, setState] = useState<ExplorePageState>({
    selectedImage: null,
    refreshKey: 0,
  });
  
  const tExplore = useTranslations('explore');

  const {
    data: images,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['unsplash-images', state.refreshKey],
    queryFn: () => unsplashApi.getRandomImages(IMAGES_PER_PAGE),
    staleTime: STALE_TIME,
    retry: RETRY_COUNT,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const handleRefresh = (): void => {
    setState(prev => ({ 
      ...prev, 
      refreshKey: prev.refreshKey + 1 
    }));
    refetch();
  };

  const handleImageClick = (image: UnsplashImage): void => {
    setState(prev => ({ 
      ...prev, 
      selectedImage: image 
    }));
  };

  const handleModalClose = (): void => {
    setState(prev => ({ 
      ...prev, 
      selectedImage: null 
    }));
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen flex-col">
          <PageHeader onRefresh={handleRefresh} isLoading={isLoading} />
          <ErrorDisplay error={error} onRetry={handleRefresh} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <PageHeader onRefresh={handleRefresh} isLoading={isLoading} />

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
                onImageClick={handleImageClick}
              />
            )}
          </div>
        </div>

        <ImageModal
          image={state.selectedImage}
          isOpen={!!state.selectedImage}
          onClose={handleModalClose}
        />
      </div>
    </ProtectedRoute>
  );
} 