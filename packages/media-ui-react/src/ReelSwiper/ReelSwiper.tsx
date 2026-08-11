import React from 'react';
import { useReelSwiper, UseReelSwiperOptions, UseReelSwiperReturn } from './useReelSwiper';

export interface ReelSwiperProps<T> extends UseReelSwiperOptions<T> {
  renderItem: (
    item: T,
    index: number,
    isActive: boolean,
    itemProps: ReturnType<UseReelSwiperReturn<T>['getItemProps']>
  ) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ReelSwiper<T extends { id?: string | number }>({
  items,
  initialIndex,
  onActiveChange,
  onLoadMore,
  visibilityThreshold,
  renderItem,
  className,
  style: customStyle,
}: ReelSwiperProps<T>): React.ReactElement {
  const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({
    items,
    initialIndex,
    onActiveChange,
    onLoadMore,
    visibilityThreshold,
  });

  const containerProps = getContainerProps();
  const { ref: containerRef, ...restContainerProps } = containerProps;

  return (
    <div
      ref={containerRef as React.Ref<HTMLDivElement>}
      {...restContainerProps}
      className={className}
      style={{
        ...containerProps.style,
        ...customStyle,
      }}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const itemProps = getItemProps(item, index);
        return renderItem(item, index, isActive, itemProps);
      })}
    </div>
  );
}
