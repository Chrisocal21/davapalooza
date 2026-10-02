'use client';

import { useState, useRef, useEffect } from 'react';
import Icon, { type IconName } from '@/components/ui/Icon';

interface ShareButtonProps {
  url: string;
  text?: string;
  /** 'icon' renders just a share icon; 'button' renders a labelled button */
  variant?: 'icon' | 'button';
  /** Set when the control sits on the ink field (the photo viewer) */
  onDark?: boolean;
  className?: string;
}

const itemCls =
  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[0.95rem] font-medium text-ink transition-colors hover:bg-cream-deep';

export default function ShareButton({
  url,
  text = 'Check out Davapalooza! #SouthOBlockParty',
  variant = 'icon',
  onDark = false,
  className = '',
}: ShareButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const shareLinks: { label: string; href: string; icon: IconName }[] = [
    { label: 'X / Twitter', href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, icon: 'x' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: 'facebook' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, icon: 'whatsapp' },
  ];

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey, true);
    };
  }, [menuOpen]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Use native share sheet on supported devices (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Davapalooza', text, url });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to dropdown
      }
    }

    setMenuOpen((prev) => !prev);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure origin) — nothing to do but leave the menu open
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyLink();
    setMenuOpen(false);
  };

  const handleInstagram = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await copyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setMenuOpen(false);
  };

  const iconTone = onDark
    ? 'border-cream/70 text-cream hover:border-sun-yellow hover:bg-sun-yellow hover:text-ink focus-visible:outline-sun-yellow'
    : 'border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={handleShare}
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${iconTone}`}
          aria-label={copied ? 'Link copied' : 'Share'}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <Icon name={copied ? 'check' : 'share'} size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[2.75rem] items-center gap-2 rounded border-2 border-ink px-4 pt-0.5 text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-cream"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <Icon name={copied ? 'check' : 'share'} size={17} className="-mt-0.5" />
          {copied ? 'Link copied' : 'Share'}
        </button>
      )}

      {/* Dropdown (desktop fallback) */}
      {menuOpen && (
        <div
          role="menu"
          className={`absolute bottom-full z-50 mb-2 w-60 animate-fade-in overflow-hidden rounded-md border-2 border-ink bg-cream text-left shadow-print ${
            variant === 'button' ? 'left-0' : 'right-0'
          }`}
        >
          <p className="eyebrow border-b-2 border-ink/10 px-4 py-2.5 text-muted">Share to</p>
          {shareLinks.map((link) => (
            <a
              key={link.label}
              role="menuitem"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={itemCls}
            >
              <Icon name={link.icon} size={16} />
              {link.label}
            </a>
          ))}
          <button type="button" role="menuitem" onClick={handleInstagram} className={`${itemCls} border-t-2 border-ink/10`}>
            <Icon name="instagram" size={16} />
            Copy link + open Instagram
          </button>
          <button type="button" role="menuitem" onClick={handleCopy} className={`${itemCls} border-t-2 border-ink/10`}>
            <Icon name="copy" size={16} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <p className="border-t-2 border-ink/10 px-4 py-3 text-xs leading-snug text-muted">
            Tip: copy the link to paste into Instagram stories or posts.
          </p>
        </div>
      )}
    </div>
  );
}
