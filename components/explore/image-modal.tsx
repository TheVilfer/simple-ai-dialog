'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Heart, Calendar, ExternalLink } from 'lucide-react';
import { UnsplashImage } from '@/lib/types/unsplash';
import { useTranslations } from 'next-intl';

interface ImageModalProps {
  image: UnsplashImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const tCommon = useTranslations('common');
  const tExplore = useTranslations('explore');

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
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full bg-black">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
            title={tCommon('close')}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative max-w-full max-h-full">
              <Image
                src={image.urls.regular}
                alt={image.alt_description || image.description || 'Unsplash image'}
                width={image.width}
                height={image.height}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
                priority
              />
              
              {/* Loading skeleton */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded" />
              )}
            </div>
          </div>

          {/* Bottom overlay with image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                {/* Image description */}
                {(image.description || image.alt_description) && (
                  <p className="text-white text-lg mb-4 max-w-2xl">
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
                    <p className="text-white font-medium">{image.user.name}</p>
                    <p className="text-white/70 text-sm">@{image.user.username}</p>
                  </div>
                </div>

                {/* Tags */}
                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {image.tags.slice(0, 5).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-0">
                        {tag.title}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Image stats */}
                <div className="flex items-center gap-4 text-white/70 text-sm">
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
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {tCommon('download')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
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
      </DialogContent>
    </Dialog>
  );
} 