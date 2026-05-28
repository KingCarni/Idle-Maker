'use client';

import { SAMPLE_LOOP_NODES } from '@/lib/mockData';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import StickyNote from '@/components/StickyNote';

// Hand-positioned nodes for that "drawn on a napkin" feel
const POSITIONS: Record<string, { x: number; y: number; rot: number }> = {
  tap:       { x: 60,  y: 80,  rot: -3 },
  earn:      { x: 290, y: 50,  rot: 2 },
  hire:      { x: 540, y: 110, rot: -2 },
  recipes:   { x: 760, y: 70,  rot: 3 },
  defeat:    { x: 870, y: 270, rot: -4 },
  muffins:   { x: 590, y: 330, rot: 1 },
  prestige:  { x: 260, y: 320, rot: -1 },
};

const COLORS: Record<string, string> = {
  crayonBlue: '#5DADEC',
  honey: '#F2B84B',
  moss: '#79B86D',
  lavender: '#A98BD8',
  coral: '#E97865',
};

const LINKS: [string, string][] = [
  ['tap', 'earn'],
  ['earn', 'hire'],
  ['hire', 'recipes'],
  ['recipes', 'defeat'],
  ['defeat', 'muffins'],
  ['muffins', 'prestige'],
  ['prestige', 'tap'],
];

export default function LoopSketch() {
  // Reduced viewport: 1020x460
  const W = 1020;
  const H = 460;

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Loop Sketch
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#79B86D" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        the core loop, sketched out on the back of a napkin.
      </p>

      <div className="relative w-full overflow-x-auto">
        <div className="relative" style={{ width: W, height: H, minWidth: W }}>
          {/* Lined background panel */}
          <div className="absolute inset-0 paper-lined rounded-2xl border-2 border-softBorder" />

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            {/* hand-drawn arrows */}
            {LINKS.map(([a, b], i) => {
              const A = POSITIONS[a];
              const B = POSITIONS[b];
              if (!A || !B) return null;
              const ax = A.x + 75;
              const ay = A.y + 30;
              const bx = B.x + 75;
              const by = B.y + 30;
              // mid-control point with slight randomness
              const mx = (ax + bx) / 2 + (i % 2 ? 12 : -16);
              const my = (ay + by) / 2 - 30 - (i % 3) * 4;
              return (
                <g key={i}>
                  <path
                    d={`M ${ax} ${ay} Q ${mx} ${my} ${bx - 18} ${by}`}
                    stroke="#2F2A24"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                    style={{ animation: 'dashFlow 1.2s linear infinite' }}
                  />
                  {/* arrowhead */}
                  <path
                    d={`M ${bx - 22} ${by - 6} L ${bx - 4} ${by} L ${bx - 22} ${by + 6}`}
                    stroke="#2F2A24"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {SAMPLE_LOOP_NODES.map((n) => {
            const p = POSITIONS[n.id];
            const c = COLORS[n.color] || '#F2B84B';
            return (
              <div
                key={n.id}
                data-testid={`loop-node-${n.id}`}
                className="absolute select-none"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: `rotate(${p.rot}deg)`,
                  width: 160,
                }}
              >
                <div
                  className="rounded-2xl border-2 border-ink bg-card shadow-ink px-3 py-3 flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
                  style={{ background: c + '33' }}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-ink"
                    style={{ background: c }}
                  />
                  <span className="font-fraunces font-bold text-ink leading-tight text-sm">
                    {n.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Doodle stamp */}
          <div className="absolute" style={{ top: 18, right: 30 }}>
            <SketchAsterisk size={36} color="#A98BD8" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <StickyNote tone="blue" tilt={-2}>
          read it like:
          <br />
          <span className="font-mono text-sm text-ink">
            tap → crumbs → bakers → recipes → ghosts → muffins → prestige ↺
          </span>
        </StickyNote>
        <StickyNote tone="green" tilt={2}>
          a tight loop wants
          <br />a <em className="not-italic text-coral">payoff</em> every 30–60s.
          <br />ours: muffin pop, ghost defeat, recipe unlock.
        </StickyNote>
      </div>
    </div>
  );
}
