import { useState, useCallback } from 'react';

export interface UseReelSwiperNativeOptions<T> {
  items: T[];
  initialIndex?: number;
  onActiveChange?: (item: T, index: number) => void;
}

export function useReelSwiper<T>(options: UseReelSwiperNativeOptions<T>) {
  const { items = [], initialIndex = 0, onActiveChange } = options;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<{ index: number | null; item: T }> }) => {
      if (info.viewableItems.length > 0) {
        const first = info.viewableItems[0];
        if (first.index !== null) {
          setActiveIndex(first.index);
          onActiveChange?.(first.item, first.index);
        }
      }
    },
    [onActiveChange]
  );

  return {
    activeIndex,
    activeItem: items[activeIndex] ?? null,
    handleViewableItemsChanged,
  };
}
