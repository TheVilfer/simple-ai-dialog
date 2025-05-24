'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Heart, Calendar, ExternalLink } from 'lucide-react';
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
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full h-[90vh] max-w-7xl translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            {image.description || image.alt_description || `Photo by ${image.user.name}`}
          </DialogTitle>
          
          <div className={`relative w-full h-full ${resolvedTheme === 'light' ? 'bg-white' : 'bg-black'}`}>
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-4 right-4 z-50 ${
                resolvedTheme === 'light' 
                  ? 'bg-white/80 hover:bg-white/90 text-black border border-gray-200' 
                  : 'bg-black/50 hover:bg-black/70 text-white'
              }`}
              onClick={onClose}
              title={tCommon('close')}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center p-4 pt-16 pb-40">
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
                ? 'bg-gradient-to-t from-white/95 to-transparent' 
                : 'bg-gradient-to-t from-black/90 to-transparent'
            }`}>
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  {/* Image description */}
                  {(image.description || image.alt_description) && (
                    <p className={`text-lg mb-4 max-w-2xl ${
                      resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {image.description || image.alt_description}
                    </p>
                  )}

                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={image.user.profile_image.small}
                        alt={image.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>{image.user.name}</p>
                      <p className={`text-sm ${
                        resolvedTheme === 'light' ? 'text-gray-600' : 'text-white/70'
                      }`}>@{image.user.username}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {image.tags.slice(0, 5).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className={`border-0 ${
                            resolvedTheme === 'light' 
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                              : 'bg-white/20 text-white hover:bg-white/30'
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
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className={`border-0 ${
                      resolvedTheme === 'light' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {tCommon('download')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className={`border-0 ${
                      resolvedTheme === 'light' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <a
                      href={`https://unsplash.com/@${image.user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {tExplore('viewProfile')}
                    </a>
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