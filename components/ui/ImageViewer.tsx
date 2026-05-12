'use client';

import { useEffect, useState } from 'react';

interface ImageViewerProps {
  images: Array<{
    id: string;
    url: string;
    handle?: string;
    caption?: string | null;
  }>;
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentImage = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) setCurrentIndex(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) setCurrentIndex(currentIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex, hasPrev, hasNext, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && hasPrev) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-primary transition-colors text-4xl w-12 h-12 flex items-center justify-center"
        aria-label="Close viewer"
      >
        ×
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-50 text-white font-mono text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-primary transition-colors text-6xl w-16 h-16 flex items-center justify-center"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-primary transition-colors text-6xl w-16 h-16 flex items-center justify-center"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Photo by ${currentImage.handle}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Image Info */}
        {(currentImage.handle || currentImage.caption) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            {currentImage.handle && (
              <p className="text-primary font-mono text-sm mb-1">{currentImage.handle}</p>
            )}
            {currentImage.caption && (
              <p className="text-white text-sm">{currentImage.caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
