import { useState, useEffect, useCallback, HTMLAttributes, ButtonHTMLAttributes } from 'react';

export interface UseLightboxOptions<T> {
  items: T[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onItemChange?: (item: T, index: number) => void;
}

export interface UseLightboxReturn<T> {
  isOpen: boolean;
  activeIndex: number;
  activeItem: T | null;
  hasPrev: boolean;
  hasNext: boolean;
  close: () => void;
  prev: () => void;
  next: () => void;
  getOverlayProps: () => HTMLAttributes<HTMLElement>;
  getContentProps: () => HTMLAttributes<HTMLElement>;
  getCloseButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  getPrevButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  getNextButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
}

export function useLightbox<T>(options: UseLightboxOptions<T>): UseLightboxReturn<T> {
  const {
    items = [],
    initialIndex = 0,
    isOpen: controlledIsOpen,
    onClose,
    onItemChange,
  } = options;

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const isOpen = controlledIsOpen ?? internalIsOpen;

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < items.length) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, items.length]);

  const activeItem = items[activeIndex] ?? null;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const close = useCallback(() => {
    setInternalIsOpen(false);
    onClose?.();
  }, [onClose]);

  const prev = useCallback(() => {
    if (hasPrev) {
      const nextIdx = activeIndex - 1;
      setActiveIndex(nextIdx);
      onItemChange?.(items[nextIdx], nextIdx);
    }
  }, [hasPrev, activeIndex, items, onItemChange]);

  const next = useCallback(() => {
    if (hasNext) {
      const nextIdx = activeIndex + 1;
      setActiveIndex(nextIdx);
      onItemChange?.(items[nextIdx], nextIdx);
    }
  }, [hasNext, activeIndex, items, onItemChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close, prev, next]);

  const getOverlayProps = useCallback(() => {
    return {
      role: 'dialog',
      'aria-modal': true,
      tabIndex: -1,
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          close();
        }
      },
    };
  }, [close]);

  const getContentProps = useCallback(() => {
    return {
      role: 'document',
    };
  }, []);

  const getCloseButtonProps = useCallback(() => {
    return {
      type: 'button' as const,
      'aria-label': 'Close Lightbox',
      onClick: close,
    };
  }, [close]);

  const getPrevButtonProps = useCallback(() => {
    return {
      type: 'button' as const,
      'aria-label': 'Previous Item',
      disabled: !hasPrev,
      onClick: prev,
    };
  }, [hasPrev, prev]);

  const getNextButtonProps = useCallback(() => {
    return {
      type: 'button' as const,
      'aria-label': 'Next Item',
      disabled: !hasNext,
      onClick: next,
    };
  }, [hasNext, next]);

  return {
    isOpen,
    activeIndex,
    activeItem,
    hasPrev,
    hasNext,
    close,
    prev,
    next,
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    getPrevButtonProps,
    getNextButtonProps,
  };
}
