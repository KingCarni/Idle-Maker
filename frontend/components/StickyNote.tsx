'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StickyNoteProps {
  children: ReactNode;
  tilt?: number;
  tone?: 'yellow' | 'blue' | 'pink' | 'green' | 'lavender';
  className?: string;
  tape?: boolean;
  tapeColor?: string;
}

const tones = {
  yellow: 'bg-sticky border-honey/40',
  blue: 'bg-crayonBlue/20 border-crayonBlue/40',
  pink: 'bg-coral/20 border-coral/40',
  green: 'bg-moss/20 border-moss/40',
  lavender: 'bg-lavender/20 border-lavender/40',
};

export default function StickyNote({
  children,
  tilt = 2,
  tone = 'yellow',
  className,
  tape = true,
  tapeColor = 'rgba(93,173,236,0.55)',
}: StickyNoteProps) {
  return (
    <div
      className={cn(
        'relative border p-4 shadow-pencil font-caveat text-xl text-ink leading-snug max-w-sm',
        tones[tone],
        className
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {tape && <span aria-hidden className="washi-tape" style={{ background: tapeColor }} />}
      {children}
    </div>
  );
}
