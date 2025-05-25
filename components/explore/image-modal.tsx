'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Heart, Calendar } from 'lucide-react';
import { UnsplashImage } from '@/lib/types/unsplash';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/lib/providers/theme-provider';

interface ImageModalProps {
  image: UnsplashImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { theme } = useTheme();
  const tCommon = useTranslations('common');
  const tExplore = useTranslations('explore');

  // Helper function to get the resolved theme
  const getResolvedTheme = () => {
    if (theme === "system") {
      return typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const resolvedTheme = getResolvedTheme();

  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `unsplash-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const formatDate = (dateString: string) => {
    // Get locale from cookie or use default 'en'
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

    return new Date(dateString).toLocaleDateString(localeMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full h-[90vh] max-w-7xl translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden rounded-xl shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-75 data-[state=open]:zoom-in-75 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            {image.description || image.alt_description || `Photo by ${image.user.name}`}
          </DialogTitle>
          
          <div className={`relative w-full h-full rounded-xl overflow-hidden ${
            resolvedTheme === 'light' ? 'bg-white' : 'bg-slate-950'
          }`}>
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-4 right-4 z-50 transition-all duration-200 hover:scale-110 hover:rotate-90 ${
                resolvedTheme === 'light' 
                  ? 'bg-white/80 hover:bg-white text-black border border-gray-200 hover:border-gray-300 hover:shadow-lg' 
                  : 'bg-black/50 hover:bg-black/80 text-white hover:shadow-xl'
              }`}
              onClick={onClose}
              title={tCommon('close')}
            >
              <X className="w-6 h-6 transition-transform duration-200" />
            </Button>

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center p-4 pt-16 pb-52">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={image.urls.regular}
                  alt={image.alt_description || image.description || 'Unsplash image'}
                  width={image.width}
                  height={image.height}
                  className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                  priority
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
                
                {/* Loading skeleton */}
                {!isImageLoaded && (
                  <div className={`absolute inset-4 animate-pulse rounded ${
                    resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            </div>

            {/* Bottom overlay with image info */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 ${
              resolvedTheme === 'light' 
                ? 'bg-gradient-to-t from-white/95 via-white/90 to-transparent' 
                : 'bg-gradient-to-t from-black/90 via-black/80 to-transparent'
            }`} style={{ minHeight: '200px' }}>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="flex-1 min-w-0 max-w-3xl">
                  {/* Image description */}
                  {(image.description || image.alt_description) && (
                    <p className={`text-base lg:text-lg mb-4 leading-relaxed ${
                      resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`} style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {image.description || image.alt_description}
                    </p>
                  )}

                  {/* User info */}
                  <a
                    href={`https://unsplash.com/@${image.user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 mb-4 group/user cursor-pointer hover:bg-black/10 hover:bg-white/10 rounded-lg p-2 -m-2 transition-all duration-200 max-w-fit"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-200 group-hover/user:scale-110 group-hover/user:shadow-lg flex-shrink-0">
                      <Image
                        src={image.user.profile_image.small}
                        alt={image.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium transition-colors duration-200 group-hover/user:underline truncate ${
                        resolvedTheme === 'light' ? 'text-gray-900 group-hover/user:text-gray-700' : 'text-white group-hover/user:text-white/90'
                      }`}>{image.user.name}</p>
                      <p className={`text-sm transition-colors duration-200 truncate ${
                        resolvedTheme === 'light' ? 'text-gray-600 group-hover/user:text-gray-500' : 'text-white/70 group-hover/user:text-white/60'
                      }`}>@{image.user.username}</p>
                    </div>
                  </a>

                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {image.tags.slice(0, 5).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className={`border-0 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                            resolvedTheme === 'light' 
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900' 
                              : 'bg-white/20 text-white hover:bg-white/30 hover:text-white/95'
                          }`}
                        >
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Image stats */}
                  <div className={`flex items-center gap-4 text-sm ${
                    resolvedTheme === 'light' ? 'text-gray-600' : 'text-white/70'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{image.likes} {tExplore('likes')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(image.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{image.width} × {image.height}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end lg:ml-4 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className={`border-0 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      resolvedTheme === 'light' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:text-black' 
                        : 'bg-white/20 hover:bg-white/30 text-white hover:text-white/95'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2 transition-transform duration-200 hover:scale-110" />
                    {tCommon('download')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
} 