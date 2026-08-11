import { useEffect, useCallback, UIEvent, HTMLAttributes } from 'react';

export interface UseGridOptions<T> {
  items: T[];
  columns?: number;
  gap?: number;
  onLoadMore?: () => void;
  loadMoreThreshold?: number; // Distance in px from bottom to trigger onLoadMore
  onItemSelect?: (item: T, index: number) => void;
}

export interface UseGridReturn<T> {
  columns: number;
  getGridProps: () => HTMLAttributes<HTMLElement> & {
    style: React.CSSProperties;
    onScroll?: (e: UIEvent<HTMLElement>) => void;
  };
  getItemProps: (item: T, index: number) => HTMLAttributes<HTMLElement> & {
    key: string | number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
    role: string;
  };
}

export function useGrid<T extends { id?: string | number }>(
  options: UseGridOptions<T>
): UseGridReturn<T> {
  const {
    columns = 3,
    gap = 16,
    onLoadMore,
    loadMoreThreshold = 300,
    onItemSelect,
  } = options;

  // Window scroll listener for document-level infinite scrolling
  useEffect(() => {
    if (!onLoadMore) return;

    let ticking = false;
    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const threshold = document.documentElement.scrollHeight - loadMoreThreshold;
          if (scrollPosition >= threshold) {
            onLoadMore();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [onLoadMore, loadMoreThreshold]);

  // Element scroll listener for overflow container scrolling
  const handleScroll = useCallback(
    (e: UIEvent<HTMLElement>) => {
      if (!onLoadMore) return;
      const target = e.currentTarget;
      const bottomDistance = target.scrollHeight - target.scrollTop - target.clientHeight;
      if (bottomDistance <= loadMoreThreshold) {
        onLoadMore();
      }
    },
    [onLoadMore, loadMoreThreshold]
  );

  const getGridProps = useCallback(() => {
    return {
      role: 'grid',
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      },
      onScroll: handleScroll,
    };
  }, [columns, gap, handleScroll]);

  const getItemProps = useCallback(
    (item: T, index: number) => {
      const id = item?.id ?? index;
      return {
        key: id,
        role: 'gridcell',
        tabIndex: 0,
        onClick: () => onItemSelect?.(item, index),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onItemSelect?.(item, index);
          }
        },
      };
    },
    [onItemSelect]
  );

  return {
    columns,
    getGridProps,
    getItemProps,
  };
}
