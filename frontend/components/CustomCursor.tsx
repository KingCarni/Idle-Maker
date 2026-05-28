'use client';

import { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'hover' | 'drag' | 'text';

/**
 * Custom themed cursor for Idle Maker.
 * Default:  graphite pencil (Soft Ink) tilted slightly
 * Hover:    raccoon paw print stamp (matches Cursed Muffin Raccoons lore)
 * Drag:     closed paw, holding
 * Text:     tiny ink nib
 *
 * Hidden on touch devices via globals.css.
 */
export default function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    let dotX = 0,
      dotY = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) setVisible(true);

      // Determine hover mode from element under cursor
      const el = e.target as HTMLElement | null;
      if (el) {
        const interactive = el.closest(
          'a, button, [role="button"], input[type="checkbox"], label, summary, [data-cursor="hover"]'
        );
        const textArea = el.closest('input[type="text"], input[type="search"], textarea, [contenteditable="true"]');
        if (textArea) setMode('text');
        else if (interactive) setMode('hover');
        else setMode('default');
      }
    };

    const onDown = () => setMode((m) => (m === 'hover' ? 'drag' : m));
    const onUp = () => setMode((m) => (m === 'drag' ? 'hover' : m));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const loop = () => {
      // Smoothed follow for the trailing dot
      dotX += (tx - dotX) * 0.18;
      dotY += (ty - dotY) * 0.18;
      cx = tx;
      cy = ty;
      if (root.current) {
        root.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dotX - 6}px, ${dotY - 6}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [visible]);

  return (
    <div
      className="custom-cursor-root pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
      data-testid="custom-cursor-root"
    >
      {/* Trailing ink dot */}
      <div
        ref={dot}
        className="fixed top-0 left-0 will-change-transform transition-[width,height,background-color,opacity] duration-150"
        style={{
          width: mode === 'hover' || mode === 'drag' ? 14 : 10,
          height: mode === 'hover' || mode === 'drag' ? 14 : 10,
          borderRadius: 999,
          background:
            mode === 'drag'
              ? 'rgba(233,120,101,0.85)'
              : mode === 'hover'
              ? 'rgba(93,173,236,0.7)'
              : 'rgba(47,42,36,0.55)',
          opacity: visible ? 1 : 0,
          mixBlendMode: 'multiply',
        }}
      />
      {/* Tool */}
      <div
        ref={root}
        className="fixed top-0 left-0 will-change-transform"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="cursor-tool transition-transform duration-150"
          style={{
            transform:
              mode === 'drag'
                ? 'translate(-10px,-10px) rotate(-20deg) scale(.95)'
                : mode === 'hover'
                ? 'translate(-6px,-6px) rotate(-12deg) scale(1.05)'
                : 'translate(-2px,-2px) rotate(-28deg)',
          }}
        >
          {mode === 'text' ? <InkNib /> : mode === 'hover' || mode === 'drag' ? <PawPrint closed={mode === 'drag'} /> : <Pencil />}
        </div>
      </div>
    </div>
  );
}

function Pencil() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Wood */}
      <path d="M6 30 L20 16 L26 22 L12 36 Z" fill="#F2B84B" stroke="#2F2A24" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Metal ferrule */}
      <path d="M20 16 L23 13 L29 19 L26 22 Z" fill="#D8C8A8" stroke="#2F2A24" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Eraser */}
      <path d="M23 13 L26 10 L32 16 L29 19 Z" fill="#E97865" stroke="#2F2A24" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Tip */}
      <path d="M6 30 L3 37 L10 34 Z" fill="#2F2A24" />
      <path d="M6 30 L7.5 31.5" stroke="#FFF9EA" strokeWidth="1" />
    </svg>
  );
}

function PawPrint({ closed }: { closed?: boolean }) {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <g
        stroke="#2F2A24"
        strokeWidth="1.4"
        fill={closed ? '#E97865' : '#FFF9EA'}
      >
        {/* Main pad */}
        <path d="M20 30 c-5 0 -8 -3 -8 -7 c0 -3 3 -5 8 -5 c5 0 8 2 8 5 c0 4 -3 7 -8 7z" />
        {/* Toes */}
        <circle cx="11" cy="17" r="2.4" />
        <circle cx="17" cy="12" r="2.6" />
        <circle cx="23" cy="12" r="2.6" />
        <circle cx="29" cy="17" r="2.4" />
      </g>
    </svg>
  );
}

function InkNib() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L16 18 L12 16 L8 18 Z" fill="#2F2A24" />
      <path d="M12 8 L12 16" stroke="#FFF9EA" strokeWidth="1" />
    </svg>
  );
}
