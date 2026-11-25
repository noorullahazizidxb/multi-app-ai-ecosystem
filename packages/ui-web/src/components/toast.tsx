'use client';

import * as React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { ...msg, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none no-print"
      >
        {toasts.map((t) => {
          const variant = t.variant || 'info';
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border bg-surface text-text shadow-xl backdrop-blur-md transition-all',
                variant === 'success' && 'border-success/50',
                variant === 'warning' && 'border-warning/50',
                variant === 'error' && 'border-error/50',
                variant === 'info' && 'border-primary/40',
              )}
            >
              <span className="mt-0.5 shrink-0">
                {variant === 'success' && <CheckCircle2 className="size-4 text-success" />}
                {variant === 'warning' && <AlertTriangle className="size-4 text-warning" />}
                {variant === 'error' && <XCircle className="size-4 text-error" />}
                {variant === 'info' && <Info className="size-4 text-primary" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text">{t.title}</p>
                {t.description && (
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-text-muted hover:text-text p-0.5 cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
