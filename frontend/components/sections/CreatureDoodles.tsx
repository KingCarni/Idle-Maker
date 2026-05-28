'use client';

import { useApp } from '@/components/AppContext';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import StickerTag from '@/components/StickerTag';

const KIND_LABEL: Record<string, string> = {
  pet: 'pet',
  enemy: 'enemy',
  boss: 'boss',
};

export default function CreatureDoodles() {
  const { creatures } = useApp();
  const pets = creatures.filter((c) => c.kind === 'pet');
  const enemies = creatures.filter((c) => c.kind === 'enemy');
  const bosses = creatures.filter((c) => c.kind === 'boss');

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Creature Doodles
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#A98BD8" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        index cards pinned to the corkboard.
      </p>

      <Section title="Pets" tint="blue" items={pets} />
      <Section title="Enemies" tint="red" items={enemies} />
      <Section title="Bosses" tint="gold" items={bosses} big />
    </div>
  );
}

function Section({
  title,
  tint,
  items,
  big,
}: {
  title: string;
  tint: 'blue' | 'green' | 'gold' | 'red' | 'lavender';
  items: any[];
  big?: boolean;
}) {
  const tilts = [-2, 1, -1, 2, -3, 1];
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-fraunces font-bold text-2xl text-ink">{title}</h3>
        <StickerTag tint={tint}>{items.length}</StickerTag>
        <SketchAsterisk size={18} />
      </div>
      <div
        className={`grid gap-6 ${
          big ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        } stagger`}
      >
        {items.map((c, i) => (
          <article
            key={c.id}
            data-testid={`creature-${c.id}`}
            className="relative bg-card border-2 border-ink rounded-md shadow-ink p-4 pt-10"
            style={{ transform: `rotate(${tilts[i % tilts.length]}deg)` }}
          >
            {/* paperclip */}
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-md border border-pencil bg-paper"
            />
            <div
              className="aspect-square grid place-items-center bg-paper border-2 border-dashed border-softBorder rounded-md text-[64px]"
              aria-label={c.name}
            >
              <span className="drop-shadow-[1px_2px_0_rgba(47,42,36,.25)]">{c.emoji}</span>
            </div>
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-widest text-pencil">
                {KIND_LABEL[c.kind]}
              </p>
              <h4 className="font-fraunces font-bold text-lg text-ink leading-tight">{c.name}</h4>
              <p className="font-caveat text-pencil text-base leading-snug mt-1">
                {c.flavor}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
