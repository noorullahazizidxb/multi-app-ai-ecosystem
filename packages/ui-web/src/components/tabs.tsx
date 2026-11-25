import * as React from 'react';
import { cn } from '../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTabId, className, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTabId || tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Scrolls horizontally on narrow screens; the inset shadow draws the baseline under the active tab border. */}
      <div role="tablist" className="flex gap-2 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              'shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer',
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-muted hover:text-text hover:border-border',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.id === activeTab)?.content}</div>
    </div>
  );
}

