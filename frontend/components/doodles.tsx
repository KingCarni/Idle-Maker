'use client';

import { JSX } from 'react';

// Reusable sketchy SVG doodles used as accents around the UI.
// Keep them inline, scalable and ink-colored by default.

export function SketchArrow({
  className,
  color = '#2F2A24',
  width = 90,
  height = 36,
}: {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}): JSX.Element {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 120 40" fill="none">
      <path
        d="M3 28 C 25 6, 60 6, 100 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="6 4"
      />
      <path d="M88 8 L 104 18 L 90 26" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SketchUnderline({ className, color = '#E97865' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 12" fill="none" preserveAspectRatio="none">
      <path d="M2 8 C 30 2, 70 12, 158 4" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SketchStar({ className, color = '#F2B84B', size = 28 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L18.5 13 L28 14 L20.5 19.5 L23 28 L16 23 L9 28 L11.5 19.5 L4 14 L13.5 13 Z" stroke={color} strokeWidth="2" fill={color} fillOpacity=".25" />
    </svg>
  );
}

export function SketchAsterisk({ className, color = '#A98BD8', size = 22 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 3 V21" />
      <path d="M3 12 H21" />
      <path d="M5.5 5.5 L18.5 18.5" />
      <path d="M18.5 5.5 L5.5 18.5" />
    </svg>
  );
}

export function SketchScribble({ className, color = '#8A7D6B' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 20" fill="none">
      <path d="M2 10 C 10 -2, 18 22, 26 8 S 42 22, 52 8 S 70 22, 78 10" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CornerClip({ className, color = '#8A7D6B' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="34" height="48" viewBox="0 0 34 48" fill="none">
      <path d="M17 4 v32 a8 8 0 1 0 8 -8 v-22" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
