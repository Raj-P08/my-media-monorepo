import { useState, useEffect, useRef, useCallback, HTMLAttributes } from 'react';

export interface UseReelSwiperOptions<T> {
  items: T[];
  initialIndex?: number;
  onActiveChange?: (item: T, index: number) => void;
  onLoadMore?: () => void;
  visibilityThreshold?: number; // 0.0 to 1.0 (default 0.6)
}

export interface UseReelSwiperReturn<T> {
  activeIndex: number;
  activeItem: T | null;
  scrollToIndex: (index: number) => void;
  getContainerProps: () => HTMLAttributes<HTMLElement> & {
    style: React.CSSProperties;
    ref: React.RefObject<HTMLDivElement | null>;
  };
  getItemProps: (item: T, index: number) => HTMLAttributes<HTMLElement> & {
    key: string | number;
    style: React.CSSProperties;
    ref: (node: HTMLElement | null) => void;
  };
}

export function useReelSwiper<T extends { id?: string | number }>(
  options: UseReelSwiperOptions<T>
): UseReelSwiperReturn<T> {
  const {
    items = [],
    initialIndex = 0,
    onActiveChange,
    onLoadMore,
    visibilityThreshold = 0.6,
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const activeItem = items[activeIndex] ?? null;

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        const targetNode = itemRefs.current.get(index);
        if (targetNode) {
          targetNode.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [items.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold) {
            const indexAttr = entry.target.getAttribute('data-reel-index');
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              if (!isNaN(idx)) {
                setActiveIndex(idx);
                if (items[idx]) {
                  onActiveChange?.(items[idx], idx);
                }
                // Trigger loadMore when user reaches near the end of the reel list
                if (onLoadMore && idx >= items.length - 2) {
                  onLoadMore();
                }
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: visibilityThreshold,
      }
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, [items, visibilityThreshold, onActiveChange, onLoadMore]);

  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      style: {
        height: '100%',
        width: '100%',
        overflowY: 'scroll' as const,
        scrollSnapType: 'y mandatory' as const,
        scrollBehavior: 'smooth' as const,
        WebkitOverflowScrolling: 'touch' as const,
      },
    };
  }, []);

  const getItemProps = useCallback(
    (item: T, index: number) => {
      const id = item?.id ?? index;
      return {
        key: id,
        'data-reel-index': index,
        ref: (node: HTMLElement | null) => {
          if (node) {
            itemRefs.current.set(index, node);
          } else {
            itemRefs.current.delete(index);
          }
        },
        style: {
          height: '100%',
          width: '100%',
          scrollSnapAlign: 'start' as const,
          scrollSnapStop: 'always' as const,
          position: 'relative' as const,
        },
      };
    },
    []
  );

  return {
    activeIndex,
    activeItem,
    scrollToIndex,
    getContainerProps,
    getItemProps,
  };
}
