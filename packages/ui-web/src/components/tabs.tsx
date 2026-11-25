'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTabId, activeTabId, className, onTabChange }: TabsProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTabId || tabs[0]?.id);
  const currentTab = activeTabId ?? internalTab;

  const handleSelect = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Segmented pill/underline tab bar with clean horizontal overflow on mobile */}
      <div
        role="tablist"
        className="flex gap-1.5 overflow-x-auto p-1 rounded-xl border border-border bg-surface/70 backdrop-blur-xs"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(tab.id)}
              className={cn(
                'shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-text-muted hover:text-text hover:bg-bg/70',
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                    isActive ? 'bg-white/20 text-white' : 'bg-bg text-text-muted border border-border',
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div>{tabs.find((t) => t.id === currentTab)?.content}</div>
    </div>
  );
}
