'use client';

import PaperCard from '@/components/PaperCard';
import StickerTag from '@/components/StickerTag';
import StickyNote from '@/components/StickyNote';
import { useApp } from '@/components/AppContext';
import { SYSTEMS } from '@/lib/mockData';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';

export default function UpgradeStickers() {
  const { upgrades, concept, toggleSystem } = useApp();
  const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3'];

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Upgrade Stickers
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#E97865" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        stickers you peel onto the design when a player levels up.
      </p>

      {/* Upgrades grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        {upgrades.map((u, i) => (
          <div
            key={u.id}
            data-testid={`upgrade-${u.id}`}
            className={`sticker-peel ${tilts[i % tilts.length]} relative bg-card border-2 border-ink rounded-2xl shadow-ink p-5`}
            style={{
              background:
                u.tint === 'blue' ? 'linear-gradient(135deg,#FFF9EA,#cfe7fa)' :
                u.tint === 'green' ? 'linear-gradient(135deg,#FFF9EA,#cdebc1)' :
                u.tint === 'gold' ? 'linear-gradient(135deg,#FFF9EA,#fadf9c)' :
                u.tint === 'red' ? 'linear-gradient(135deg,#FFF9EA,#f3c0b6)' :
                'linear-gradient(135deg,#FFF9EA,#dccbf2)',
            }}
          >
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-ink text-card text-[10px] uppercase tracking-widest rounded-full">
              upgrade
            </div>
            <h3 className="font-fraunces font-bold text-xl text-ink leading-tight">{u.name}</h3>
            <p className="font-caveat text-pencil text-lg leading-none mt-1">{u.flavor}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-paper border-2 border-ink rounded-full px-3 py-1 font-mono text-sm">
              <span className="text-moss">{u.effect}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-sm text-ink">
                {u.cost} <span className="text-pencil">{u.costCurrency}</span>
              </span>
              <SketchAsterisk size={18} color="#A98BD8" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        <PaperCard variant="flat" className="bg-paper" data-testid="systems-card">
          <h3 className="font-fraunces font-bold text-xl text-ink mb-2">Systems enabled</h3>
          <p className="text-sm text-pencil mb-3">
            Toggle which big systems your game should ship with.
          </p>
          <div className="flex flex-wrap gap-2">
            {SYSTEMS.map((s, i) => (
              <StickerTag
                key={s}
                tint={(['blue', 'green', 'gold', 'red', 'lavender'] as const)[i % 5]}
                selected={concept.systems.includes(s)}
                onClick={() => toggleSystem(s)}
                data-testid={`upgrade-system-${s.toLowerCase().replace(/\s+/g,'-')}`}
              >
                {s}
              </StickerTag>
            ))}
          </div>
        </PaperCard>

        <StickyNote tone="lavender" tilt={3}>
          stickers are <em className="not-italic text-ink">consumable</em>:
          <br />
          one per design, one per surprise.
          <br />
          do not over-sticker the page.
        </StickyNote>
      </div>
    </div>
  );
}
