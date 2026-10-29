'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className={cn(
          'relative w-full max-w-lg rounded-xl border border-[--border] bg-[--surface] p-6 text-[--text] shadow-xl transition-all',
          className,
        )}
      >
        <div className="flex flex-col space-y-1.5 pb-4 border-b border-[--border]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold leading-none tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="text-[--text-muted] hover:text-[--text] text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          {description && <p className="text-sm text-[--text-muted]">{description}</p>}
        </div>

        <div className="py-4">{children}</div>

        {footer && <div className="flex justify-end gap-2 pt-4 border-t border-[--border]">{footer}</div>}
      </div>
    </div>
  );
}

