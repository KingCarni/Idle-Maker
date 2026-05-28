'use client';

import { cn } from '@/lib/utils';

export const TAB_KEYS = [
  'landing',
  'idea',
  'loop',
  'economy',
  'upgrades',
  'creatures',
  'assets',
  'prototype',
  'export',
] as const;

export type TabKey = (typeof TAB_KEYS)[number];

export const TAB_LABELS: Record<TabKey, string> = {
  landing: 'Landing',
  idea: 'Idea',
  loop: 'Loop',
  economy: 'Economy',
  upgrades: 'Upgrades',
  creatures: 'Creatures',
  assets: 'Assets',
  prototype: 'Playground',
  export: 'Export',
};

interface NotebookTabsProps {
  active: TabKey;
  onChange: (k: TabKey) => void;
}

export default function NotebookTabs({ active, onChange }: NotebookTabsProps) {
  return (
    <div className="relative">
      {/* Underline strip */}
      <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-ink/80" />
      <div
        className="flex flex-wrap items-end gap-1 px-2 pt-2"
        role="tablist"
        aria-label="Idle Maker sections"
        data-testid="notebook-tabs"
      >
        {TAB_KEYS.map((k, i) => {
          const isActive = k === active;
          const tints = ['#5DADEC', '#79B86D', '#F2B84B', '#E97865', '#A98BD8'];
          const accent = tints[i % tints.length];
          return (
            <button
              key={k}
              role="tab"
              aria-selected={isActive}
              data-testid={`tab-${k}`}
              onClick={() => onChange(k)}
              className={cn(
                'relative -mb-[2px] px-4 sm:px-5 py-2 font-fraunces font-bold tracking-tight',
                'border-2 border-b-0 rounded-t-2xl transition-all duration-200',
                isActive
                  ? 'bg-card text-ink border-ink shadow-[0_-4px_0_0_rgba(0,0,0,0)] z-10 scale-[1.02]'
                  : 'bg-paper text-pencil border-softBorder hover:text-ink hover:-translate-y-0.5'
              )}
              style={{
                transform: isActive ? 'translateY(2px)' : undefined,
              }}
            >
              {/* Accent dot like notebook tab marker */}
              <span
                className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                style={{ background: isActive ? accent : 'rgba(138,125,107,.4)' }}
              />
              <span className="align-middle">{TAB_LABELS[k]}</span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-3 right-3 -bottom-[3px] h-[3px] bg-card"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
