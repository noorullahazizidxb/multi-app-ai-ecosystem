'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<DialogProps['size']>, string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
  className,
}: DialogProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full rounded-2xl border border-border bg-surface text-text shadow-2xl transition-all flex flex-col max-h-[88vh]',
          SIZE_CLASSES[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 p-5 sm:p-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <h3 id="dialog-title" className="text-lg sm:text-xl font-bold leading-snug tracking-tight">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="text-text-muted hover:text-text hover:bg-bg rounded-lg p-1.5 transition-colors cursor-pointer shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
          {description && <p className="text-xs sm:text-sm text-text-muted">{description}</p>}
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-2 p-4 sm:px-6 border-t border-border shrink-0 bg-bg/40 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
