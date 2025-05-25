'use client';


import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useCallback, memo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { BaseComponentProps } from '@/types/common';
import type { UnsplashImage } from '@/types/unsplash';

// Animation configuration
const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
  staggerDelay: 0.05,
} as const;

// Component configuration
const MAX_VISIBLE_TAGS = 2;
const IMAGE_SIZES = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";

interface ImageGridProps extends BaseComponentProps {
  readonly images: readonly UnsplashImage[];
  readonly onImageClick: (image: UnsplashImage) => void;
}

interface ImageCardProps {
  readonly image: UnsplashImage;
  readonly index: number;
  readonly onImageClick: (image: UnsplashImage) => void;
  readonly onImageLoad: (imageId: string) => void;
  readonly isLoaded: boolean;
}

/**
 * Individual image card component
 */
const ImageCard = memo<ImageCardProps>(({ 
  image, 
  index, 
  onImageClick, 
  onImageLoad, 
  isLoaded 
}) => {
  const handleClick = useCallback(() => {
    onImageClick(image);
  }, [image, onImageClick]);

  const handleImageLoad = useCallback(() => {
    onImageLoad(image.id);
  }, [image.id, onImageLoad]);

  const handleUserClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const userProfileUrl = `https://unsplash.com/@${image.user.username}`;
  const imageAlt = image.alt_description || image.description || 'Unsplash image';
  const visibleTags = image.tags?.slice(0, MAX_VISIBLE_TAGS) || [];

  return (
    <motion.div
      initial={ANIMATION_CONFIG.initial}
      animate={ANIMATION_CONFIG.animate}
      transition={{ 
        ...ANIMATION_CONFIG.transition, 
        delay: index * ANIMATION_CONFIG.staggerDelay 
      }}
      className="group cursor-pointer break-inside-avoid mb-4"
      onClick={handleClick}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 p-0">
        <div 
          className="relative overflow-hidden bg-muted"
          style={{ 
            aspectRatio: `${image.width} / ${image.height}`,
            minHeight: '150px'
          }}
        >
          <Image
            src={image.urls.small}
            alt={imageAlt}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            sizes={IMAGE_SIZES}
            priority={index < 6} // Prioritize first 6 images
          />
          
          {/* Loading skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Image info overlay */}
          <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex justify-end">
              <div className="flex gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-white/90 hover:bg-white text-black transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  <Heart className="w-3 h-3 mr-1 transition-transform duration-200 hover:scale-110" />
                  {image.likes.toLocaleString()}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <a
                href={userProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-white/90 transition-colors duration-200 cursor-pointer"
                onClick={handleUserClick}
                aria-label={`View ${image.user.name}'s profile on Unsplash`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110">
                  <Image
                    src={image.user.profile_image.small}
                    alt={`${image.user.name}'s profile`}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium truncate max-w-[100px] hover:underline">
                  {image.user.name}
                </span>
              </a>
              
              {visibleTags.length > 0 && (
                <div className="flex gap-1">
                  {visibleTags.map((tag) => (
                    <Badge 
                      key={`${image.id}-${tag.title}`}
                      variant="outline" 
                      className="bg-white/90 hover:bg-white text-black text-xs border-0 transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

ImageCard.displayName = 'ImageCard';

/**
 * Empty state component
 */
interface EmptyStateProps {
  readonly message: string;
}

const EmptyState = memo<EmptyStateProps>(({ message }) => (
  <div className="text-center py-12">
    <p className="text-muted-foreground">{message}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

/**
 * Main image grid component
 */
export const ImageGrid = memo<ImageGridProps>(({ 
  images, 
  onImageClick, 
  className = '' 
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const tExplore = useTranslations('explore');

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  }, []);

  if (images.length === 0) {
    return <EmptyState message={tExplore('noImages')} />;
  }

  return (
    <div className={`columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 ${className}`}>
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          index={index}
          onImageClick={onImageClick}
          onImageLoad={handleImageLoad}
          isLoaded={loadedImages.has(image.id)}
        />
      ))}
    </div>
  );
});

ImageGrid.displayName = 'ImageGrid'; 