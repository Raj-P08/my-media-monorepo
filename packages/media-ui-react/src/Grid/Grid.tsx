import React from 'react';
import { useGrid, UseGridOptions, UseGridReturn } from './useGrid';

export interface GridProps<T> extends UseGridOptions<T> {
  renderItem: (
    item: T,
    index: number,
    itemProps: ReturnType<UseGridReturn<T>['getItemProps']>
  ) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Grid<T extends { id?: string | number }>({
  items,
  columns,
  gap,
  onLoadMore,
  loadMoreThreshold,
  onItemSelect,
  renderItem,
  className,
  style: customStyle,
}: GridProps<T>): React.ReactElement {
  const { getGridProps, getItemProps } = useGrid({
    items,
    columns,
    gap,
    onLoadMore,
    loadMoreThreshold,
    onItemSelect,
  });

  const gridProps = getGridProps();

  return (
    <div
      {...gridProps}
      className={className}
      style={{
        ...gridProps.style,
        ...customStyle,
      }}
    >
      {items.map((item, index) => renderItem(item, index, getItemProps(item, index)))}
    </div>
  );
}
