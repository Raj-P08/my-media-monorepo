import { useState, useCallback } from 'react';

export interface UseLightboxNativeOptions<T> {
  items: T[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export function useLightbox<T>(options: UseLightboxNativeOptions<T>) {
  const { items = [], initialIndex = 0, isOpen: controlledIsOpen, onClose } = options;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const activeItem = items[activeIndex] ?? null;

  const close = useCallback(() => {
    setInternalIsOpen(false);
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    if (activeIndex < items.length - 1) setActiveIndex((prev) => prev + 1);
  }, [activeIndex, items.length]);

  const prev = useCallback(() => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  }, [activeIndex]);

  return {
    isOpen,
    activeIndex,
    activeItem,
    close,
    next,
    prev,
  };
}
