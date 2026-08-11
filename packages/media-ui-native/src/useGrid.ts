import { useCallback } from 'react';

export interface UseGridNativeOptions<T> {
  items: T[];
  columns?: number;
  onLoadMore?: () => void;
  onItemSelect?: (item: T, index: number) => void;
}

export function useGrid<T extends { id?: string | number }>(options: UseGridNativeOptions<T>) {
  const { columns = 2, onLoadMore, onItemSelect } = options;

  const getItemProps = useCallback(
    (item: T, index: number) => ({
      key: String(item?.id ?? index),
      onPress: () => onItemSelect?.(item, index),
    }),
    [onItemSelect]
  );

  return {
    columns,
    onLoadMore,
    getItemProps,
  };
}
