'use client';

import { useApp } from '@/components/AppContext';
import PaperCard from '@/components/PaperCard';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import { Image as ImageIcon, Plus } from 'lucide-react';

const SLOTS = [
  { id: 'moodboard', label: 'Moodboard', hint: 'Vibe references for the whole game' },
  { id: 'mascot', label: 'Hero / Mascot', hint: 'The face on your store page' },
  { id: 'pet-1', label: 'Pet Concept', hint: 'Stack of pet ideas' },
  { id: 'pet-2', label: 'Pet Concept', hint: 'Stranger pets welcome' },
  { id: 'enemy', label: 'Enemy Concepts', hint: 'Things that try to steal your crumbs' },
  { id: 'boss', label: 'Boss Concept', hint: 'The Muffin Wraith deserves a portrait' },
  { id: 'currency', label: 'Currency Icons', hint: 'Crumbs / Stars / Golden Muffins' },
  { id: 'upgrades', label: 'Upgrade Icons', hint: 'The sticker pack family' },
  { id: 'zone', label: 'Background / Zone', hint: 'The bakery interior' },
  { id: 'ui', label: 'UI Style Samples', hint: 'Buttons, panels, dialogs' },
];

const MEDIA = {
  raccoon:
    'https://static.prod-images.emergentagent.com/jobs/a33bcda4-5769-4b18-87d6-b5099b590c3a/images/a393829da4aab424870d9cedd5106d7b3ae0e14ca908fbe1b0289eae47338497.png',
  bakery:
    'https://static.prod-images.emergentagent.com/jobs/a33bcda4-5769-4b18-87d6-b5099b590c3a/images/443ccaf3988cd56cbf97ccddf12a0b037ebfadb7ba5a4f835021394f2fbfd4fa.png',
  doodles:
    'https://static.prod-images.emergentagent.com/jobs/a33bcda4-5769-4b18-87d6-b5099b590c3a/images/2371b7d999e4d13108c8746ca782860e3b9f0b3c2ec51030182feddc11523812.png',
};

const PREFILLED: Record<string, string> = {
  mascot: MEDIA.raccoon,
  zone: MEDIA.bakery,
  moodboard: MEDIA.doodles,
};

export default function AssetKit() {
  const { imports } = useApp();
  const userImages = imports.filter((f) => f.kind === 'image');

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Asset Kit
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#5DADEC" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        the supply drawer. drop sketches here or generate later.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        {SLOTS.map((s) => {
          const src = PREFILLED[s.id];
          return (
            <article
              key={s.id}
              data-testid={`asset-${s.id}`}
              className="relative bg-card border-2 border-ink rounded-2xl shadow-pencil overflow-hidden hover:-translate-y-0.5 transition-transform"
            >
              {/* washi tape */}
              <span
                aria-hidden
                className="absolute -top-1 right-4 w-20 h-5 rotate-3"
                style={{ background: 'rgba(242,184,75,.6)' }}
              />
              <div className="aspect-[4/3] bg-paper border-b-2 border-dashed border-softBorder grid place-items-center overflow-hidden">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={s.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-7 h-7 text-pencil mx-auto" strokeWidth={1.5} />
                    <p className="font-caveat text-pencil text-lg mt-2">placeholder</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-fraunces font-bold text-lg text-ink leading-tight">{s.label}</h4>
                <p className="text-sm text-pencil mt-0.5">{s.hint}</p>
                <button
                  type="button"
                  data-testid={`asset-generate-${s.id}`}
                  className="mt-3 inline-flex items-center gap-1 bg-honey/60 border-2 border-ink rounded-full px-3 py-1 text-sm font-bold text-ink hover:bg-honey"
                >
                  <Plus className="w-3.5 h-3.5" /> Generate asset later
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Imports tray */}
      <PaperCard variant="flat" className="mt-8 bg-paper">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-fraunces font-bold text-xl text-ink flex items-center gap-2">
            From your imports <SketchAsterisk size={18} />
          </h3>
          <span className="font-mono text-xs text-pencil">{userImages.length} image(s)</span>
        </div>
        {userImages.length === 0 ? (
          <p className="font-caveat text-pencil text-lg">
            drop a PNG/JPG/SVG into the tray to see it appear here.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {userImages.map((img) => (
              <div
                key={img.id}
                className="aspect-square border-2 border-ink rounded-md overflow-hidden bg-card relative"
              >
                <span
                  aria-hidden
                  className="absolute -top-1 left-3 w-10 h-3 rotate-3"
                  style={{ background: 'rgba(93,173,236,.55)' }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </PaperCard>
    </div>
  );
}
