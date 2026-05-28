'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppContext';
import PaperCard from '@/components/PaperCard';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Trash2,
  Loader2,
  AlertTriangle,
  Pencil,
} from 'lucide-react';

interface Slot {
  id: string;
  label: string;
  hint: string;
  defaultPrompt: string;
}

const SLOTS: Slot[] = [
  {
    id: 'moodboard',
    label: 'Moodboard',
    hint: 'Vibe references for the whole game',
    defaultPrompt: 'Vibe collage of cozy bakery interiors, raccoons, soft moonlight, muffin shapes',
  },
  {
    id: 'mascot',
    label: 'Hero / Mascot',
    hint: 'The face on your store page',
    defaultPrompt: 'A friendly raccoon baker mascot wearing a tiny apron, holding a steaming muffin',
  },
  {
    id: 'pet-1',
    label: 'Pet Concept',
    hint: 'Stack of pet ideas',
    defaultPrompt: 'A tiny squirrel pet called Crumb Sniffer with a magnifying glass',
  },
  {
    id: 'pet-2',
    label: 'Pet Concept',
    hint: 'Stranger pets welcome',
    defaultPrompt: 'A whimsical luminous moth named Sugar Moth, fluttering above a bowl of icing',
  },
  {
    id: 'enemy',
    label: 'Enemy Concepts',
    hint: 'Things that try to steal your crumbs',
    defaultPrompt: 'A small pastry ghost, a burnt biscuit imp, and a dough blob, arranged as concepts',
  },
  {
    id: 'boss',
    label: 'Boss Concept',
    hint: 'The Muffin Wraith deserves a portrait',
    defaultPrompt: 'The Muffin Wraith — a towering, ghostly muffin creature with crumb-dust aura',
  },
  {
    id: 'currency',
    label: 'Currency Icons',
    hint: 'Crumbs / Stars / Golden Muffins',
    defaultPrompt: 'Three small currency icons: a crumb pile, a sugar star, a golden muffin',
  },
  {
    id: 'upgrades',
    label: 'Upgrade Icons',
    hint: 'The sticker pack family',
    defaultPrompt: 'A grid of four upgrade icon stickers: bigger bowl, whisk, ghost-proof apron, multiplier',
  },
  {
    id: 'zone',
    label: 'Background / Zone',
    hint: 'The bakery interior',
    defaultPrompt: 'The interior of a magical raccoon-run bakery at dusk, with haunted ovens and shelves',
  },
  {
    id: 'ui',
    label: 'UI Style Samples',
    hint: 'Buttons, panels, dialogs',
    defaultPrompt: 'A small mock UI panel with a tap button, a generator card, and a sticker badge',
  },
];

// Light fallback placeholders (used until user generates their own)
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
  const { imports, assets, generating, assetErrors, generateAsset, clearAsset } = useApp();
  const userImages = imports.filter((f) => f.kind === 'image');
  // Per-slot editable prompt overrides
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Asset Kit
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#5DADEC" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        the supply drawer. tap{' '}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border-2 border-ink bg-honey/60 text-ink font-nunito text-xs font-bold align-middle">
          <Sparkles className="w-3 h-3" /> generate
        </span>{' '}
        on any slot — Nano Banana sketches it.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        {SLOTS.map((s) => {
          const userImg = assets[s.id];
          const isGen = !!generating[s.id];
          const err = assetErrors[s.id];
          const src = userImg || PREFILLED[s.id];
          const prompt = prompts[s.id] ?? s.defaultPrompt;
          const isEditing = editing === s.id;

          return (
            <article
              key={s.id}
              data-testid={`asset-${s.id}`}
              className="relative bg-card border-2 border-ink rounded-2xl shadow-pencil overflow-hidden hover:-translate-y-0.5 transition-transform"
            >
              {/* washi tape */}
              <span
                aria-hidden
                className="absolute -top-1 right-4 w-20 h-5 rotate-3 z-10"
                style={{ background: 'rgba(242,184,75,.6)' }}
              />
              {/* image / placeholder */}
              <div className="relative aspect-[4/3] bg-paper border-b-2 border-dashed border-softBorder grid place-items-center overflow-hidden">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={s.label}
                    className="w-full h-full object-cover"
                    data-testid={`asset-img-${s.id}`}
                  />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-7 h-7 text-pencil mx-auto" strokeWidth={1.5} />
                    <p className="font-caveat text-pencil text-lg mt-2">placeholder</p>
                  </div>
                )}

                {/* "AI" sticker badge if this is user-generated */}
                {userImg && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-ink bg-lavender/80 text-ink text-[10px] font-bold uppercase tracking-widest shadow-sticker">
                    <Sparkles className="w-3 h-3" /> Nano Banana
                  </span>
                )}

                {/* loading overlay */}
                {isGen && (
                  <div
                    className="absolute inset-0 bg-paper/85 backdrop-blur-sm grid place-items-center"
                    data-testid={`asset-loading-${s.id}`}
                  >
                    <div className="text-center">
                      <Loader2 className="w-7 h-7 text-ink mx-auto animate-spin" strokeWidth={1.6} />
                      <p className="font-caveat text-ink text-lg mt-1">sketching...</p>
                      <p className="font-mono text-[10px] text-pencil">~10–25s</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-fraunces font-bold text-lg text-ink leading-tight">
                  {s.label}
                </h4>
                <p className="text-sm text-pencil mt-0.5">{s.hint}</p>

                {/* Prompt: collapsed by default, editable */}
                {isEditing ? (
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompts((p) => ({ ...p, [s.id]: e.target.value }))}
                    rows={3}
                    className="mt-2 w-full text-sm bg-paper border-2 border-softBorder focus:border-ink rounded-lg px-2 py-1.5 font-nunito text-ink outline-none"
                    data-testid={`asset-prompt-${s.id}`}
                  />
                ) : (
                  <p
                    className="mt-2 font-caveat text-pencil text-base leading-snug line-clamp-2"
                    title={prompt}
                  >
                    “{prompt}”
                  </p>
                )}

                {err && (
                  <div
                    className="mt-2 flex items-start gap-1.5 text-xs text-coral font-nunito font-bold"
                    data-testid={`asset-error-${s.id}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{err}</span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isGen}
                    onClick={() => generateAsset(s.id, s.label, prompt)}
                    data-testid={`asset-generate-${s.id}`}
                    className="inline-flex items-center gap-1.5 bg-honey/80 border-2 border-ink rounded-full px-3 py-1 text-sm font-bold text-ink hover:bg-honey disabled:opacity-60 shadow-sticker"
                  >
                    {isGen ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> generating
                      </>
                    ) : userImg ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> re-sketch
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> generate
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditing(isEditing ? null : s.id)}
                    data-testid={`asset-edit-prompt-${s.id}`}
                    className="inline-flex items-center gap-1.5 bg-card border-2 border-ink rounded-full px-2.5 py-1 text-xs font-bold text-ink hover:bg-paper shadow-sticker"
                    aria-label="Edit prompt"
                  >
                    <Pencil className="w-3 h-3" /> {isEditing ? 'done' : 'edit prompt'}
                  </button>

                  {userImg && (
                    <button
                      type="button"
                      onClick={() => clearAsset(s.id)}
                      data-testid={`asset-clear-${s.id}`}
                      className="inline-flex items-center gap-1 bg-coral/30 border-2 border-ink rounded-full px-2.5 py-1 text-xs font-bold text-ink hover:bg-coral/60 shadow-sticker"
                      aria-label="Clear generated asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
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
