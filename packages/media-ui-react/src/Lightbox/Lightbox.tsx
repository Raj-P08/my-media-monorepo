import React from 'react';
import { useLightbox, UseLightboxOptions, UseLightboxReturn } from './useLightbox';

export interface LightboxProps<T> extends UseLightboxOptions<T> {
  renderContent: (
    item: T,
    activeIndex: number,
    controls: {
      close: () => void;
      prev: () => void;
      next: () => void;
      hasPrev: boolean;
      hasNext: boolean;
      getCloseButtonProps: UseLightboxReturn<T>['getCloseButtonProps'];
      getPrevButtonProps: UseLightboxReturn<T>['getPrevButtonProps'];
      getNextButtonProps: UseLightboxReturn<T>['getNextButtonProps'];
    }
  ) => React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  overlayStyle?: React.CSSProperties;
}

export function Lightbox<T>({
  items,
  initialIndex,
  isOpen: controlledIsOpen,
  onClose,
  onItemChange,
  renderContent,
  overlayClassName,
  contentClassName,
  overlayStyle,
}: LightboxProps<T>): React.ReactElement | null {
  const {
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
  } = useLightbox({
    items,
    initialIndex,
    isOpen: controlledIsOpen,
    onClose,
    onItemChange,
  });

  if (!isOpen || !activeItem) {
    return null;
  }

  const overlayProps = getOverlayProps();
  const contentProps = getContentProps();

  const defaultOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...overlayStyle,
  };

  return (
    <div {...overlayProps} className={overlayClassName} style={defaultOverlayStyle}>
      <div {...contentProps} className={contentClassName}>
        {renderContent(activeItem, activeIndex, {
          close,
          prev,
          next,
          hasPrev,
          hasNext,
          getCloseButtonProps,
          getPrevButtonProps,
          getNextButtonProps,
        })}
      </div>
    </div>
  );
}
