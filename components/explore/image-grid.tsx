'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { UnsplashImage } from '@/lib/types/unsplash';
import { useTranslations } from 'next-intl';

interface ImageGridProps {
  images: UnsplashImage[];
  onImageClick: (image: UnsplashImage) => void;
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const tExplore = useTranslations('explore');

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  // Calculate responsive grid columns
  const getGridCols = () => {
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
  };

  // Calculate dynamic height based on aspect ratio
  const getImageHeight = (image: UnsplashImage, index: number) => {
    const aspectRatio = image.height / image.width;
    const baseHeight = 200;
    
    // Add some randomness for masonry effect
    const randomFactor = 0.7 + (index % 3) * 0.3;
    const height = Math.max(150, Math.min(400, baseHeight * aspectRatio * randomFactor));
    
    return `${height}px`;
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tExplore('noImages')}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${getGridCols()}`}>
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div 
              className="relative overflow-hidden bg-muted"
              style={{ height: getImageHeight(image, index) }}
            >
              <Image
                src={image.urls.small}
                alt={image.alt_description || image.description || 'Unsplash image'}
                fill
                className={`object-cover transition-all duration-300 ${
                  loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(image.id)}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
              
              {/* Loading skeleton */}
              {!loadedImages.has(image.id) && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              
              {/* Image info overlay */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      <Heart className="w-3 h-3 mr-1" />
                      {image.likes}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                      <Image
                        src={image.user.profile_image.small}
                        alt={image.user.name}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px]">
                      {image.user.name}
                    </span>
                  </div>
                  
                  <div className="flex gap-1">
                    {image.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="outline" 
                        className="bg-white/90 text-black text-xs border-0"
                      >
                        {tag.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 