'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import ShareButton from '@/components/ui/ShareButton';

interface ImageViewerProps {
  images: Array<{
    id: string;
    url: string;
    handle?: string;
    caption?: string | null;
    /** Alt text for images that aren't a community photo (a flyer, say) */
    alt?: string;
  }>;
  initialIndex: number;
  onClose: () => void;
  /** Hide the share control — for images that have nothing to share */
  showShare?: boolean;
}

const navButton =
  'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream/70 bg-ink/70 text-cream ' +
  'transition-colors hover:border-sun-yellow hover:bg-sun-yellow hover:text-ink focus-visible:outline-sun-yellow sm:h-14 sm:w-14';

export default function ImageViewer({ images, initialIndex, onClose, showShare = true }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const currentImage = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const goPrev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setCurrentIndex((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  // Opening: remember what had focus, move focus into the viewer, stop the page
  // scrolling behind it. Closing puts all three back the way they were.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();

      // Keep Tab inside the viewer.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, onClose]);

  // Warm the neighbours so stepping through feels instant.
  useEffect(() => {
    [images[currentIndex - 1], images[currentIndex + 1]].forEach((img) => {
      if (img) new window.Image().src = img.url;
    });
  }, [currentIndex, images]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > 50) goNext();
    if (distance < -50) goPrev();

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!currentImage) return null;

  const alt =
    currentImage.alt ||
    currentImage.caption ||
    (currentImage.handle ? `Photo by ${currentImage.handle}` : 'Photo');

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={images.length > 1 ? `Photo ${currentIndex + 1} of ${images.length}` : 'Image viewer'}
      className="fixed inset-0 z-[100] flex animate-fade-in flex-col bg-ink/[0.97] text-cream"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
        <p className="font-mono text-sm tracking-widest text-cream/80" aria-hidden={images.length <= 1}>
          {images.length > 1 && (
            <>
              {String(currentIndex + 1).padStart(2, '0')} <span className="text-cream/40">/</span>{' '}
              {String(images.length).padStart(2, '0')}
            </>
          )}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream/70 text-cream transition-colors hover:border-sun-yellow hover:bg-sun-yellow hover:text-ink focus-visible:outline-sun-yellow"
          aria-label="Close viewer"
        >
          <Icon name="close" size={22} />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className={`${navButton} left-3 sm:left-5`}
            aria-label="Previous image"
          >
            <Icon name="chevron-left" size={26} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentImage.id}
          src={currentImage.url}
          alt={alt}
          className="max-h-full max-w-full animate-fade-in rounded-sm object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className={`${navButton} right-3 sm:right-5`}
            aria-label="Next image"
          >
            <Icon name="chevron-right" size={26} />
          </button>
        )}
      </div>

      {/* Image Info */}
      <div
        className="flex min-h-[4.25rem] shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          {currentImage.handle && (
            <p className="truncate font-mono text-sm tracking-wide text-sun-yellow">{currentImage.handle}</p>
          )}
          {currentImage.caption && <p className="mt-0.5 text-[0.95rem] leading-snug text-cream/90">{currentImage.caption}</p>}
        </div>
        {showShare && (
          <ShareButton
            url={typeof window !== 'undefined' ? window.location.origin + '/gallery' : '/gallery'}
            text={`Check out this photo from Davapalooza by ${currentImage.handle ?? 'the community'}! #SouthOBlockParty`}
            variant="icon"
            onDark
          />
        )}
      </div>
    </div>
  );
}
