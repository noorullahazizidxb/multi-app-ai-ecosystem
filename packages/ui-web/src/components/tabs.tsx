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
      <div className="flex border-b border-[--border] gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer -mb-px',
              activeTab === tab.id
                ? 'border-[--primary] text-[--primary] font-semibold'
                : 'border-transparent text-[--text-muted] hover:text-[--text] hover:border-[--border]',
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

