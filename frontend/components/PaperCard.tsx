'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PaperCardProps {
  children: ReactNode;
  className?: string;
  tilt?: 'left' | 'right' | 'none';
  tape?: boolean;
  tapeColor?: string;
  variant?: 'wobble' | 'index' | 'flat';
  as?: 'div' | 'article' | 'section' | 'button';
  onClick?: () => void;
  'data-testid'?: string;
}

export default function PaperCard({
  children,
  className,
  tilt = 'none',
  tape = false,
  tapeColor = 'rgba(93,173,236,0.55)',
  variant = 'wobble',
  as: Tag = 'div',
  onClick,
  ...rest
}: PaperCardProps) {
  const tiltClass = tilt === 'left' ? '-rotate-1' : tilt === 'right' ? 'rotate-1' : '';
  const shapeClass =
    variant === 'wobble' ? 'wobble' : variant === 'index' ? 'rounded-md' : 'rounded-xl';
  return (
    <Tag
      onClick={onClick}
      data-testid={rest['data-testid']}
      className={cn(
        'relative bg-card border-2 border-softBorder p-6 transition-transform duration-200',
        'hover:-translate-y-0.5 hover:shadow-pencil',
        shapeClass,
        tiltClass,
        className
      )}
    >
      {tape && (
        <span
          aria-hidden
          className="washi-tape"
          style={{ background: tapeColor }}
        />
      )}
      {children}
    </Tag>
  );
}
