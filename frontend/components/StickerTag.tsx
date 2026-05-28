'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StickerTagProps {
  children: ReactNode;
  tint?: 'blue' | 'green' | 'gold' | 'red' | 'lavender' | 'ink';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const tints: Record<string, string> = {
  blue: 'bg-crayonBlue/20 hover:bg-crayonBlue/45',
  green: 'bg-moss/20 hover:bg-moss/50',
  gold: 'bg-honey/30 hover:bg-honey/60',
  red: 'bg-coral/25 hover:bg-coral/55',
  lavender: 'bg-lavender/25 hover:bg-lavender/55',
  ink: 'bg-paper hover:bg-card',
};
const tintsSelected: Record<string, string> = {
  blue: 'bg-crayonBlue/70 text-ink',
  green: 'bg-moss/70 text-ink',
  gold: 'bg-honey/80 text-ink',
  red: 'bg-coral/70 text-ink',
  lavender: 'bg-lavender/70 text-ink',
  ink: 'bg-ink text-card',
};

export default function StickerTag({
  children,
  tint = 'ink',
  selected = false,
  onClick,
  className,
  ...rest
}: StickerTagProps) {
  const cls = selected ? tintsSelected[tint] : tints[tint];
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={rest['data-testid']}
      className={cn(
        'sticker-peel inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'border-2 border-ink text-ink font-nunito font-bold text-sm',
        'shadow-sticker',
        cls,
        className
      )}
    >
      {children}
    </button>
  );
}
