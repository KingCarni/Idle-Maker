'use client';

import { useApp } from '@/components/AppContext';
import { formatNumber } from '@/lib/utils';
import { PACING_NOTES } from '@/lib/mockData';
import StickyNote from '@/components/StickyNote';
import PaperCard from '@/components/PaperCard';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import { Cookie, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function PrototypePlayground() {
  const {
    pgCrumbs,
    pgRaccoons,
    pgPerSec,
    ownedUpgrades,
    upgrades,
    tap,
    buyRaccoon,
    buyUpgrade,
    prestige,
    raccoonCost,
  } = useApp();

  const [clicked, setClicked] = useState(false);
  function onTap() {
    tap(1);
    setClicked(true);
    setTimeout(() => setClicked(false), 90);
  }
  const cost = raccoonCost();

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Prototype Playground
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#79B86D" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        a tiny demo so you can <em>feel</em> the loop. real engine comes later.
      </p>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
        {/* Phone/embedded preview */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-ink/70 rounded-full" />
          <div className="rounded-[36px] border-[6px] border-ink bg-paper shadow-inkBig p-5 pt-7">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-pencil">cursed muffin raccoons · prototype</p>
              <p className="font-fraunces text-5xl font-black text-ink mt-2" data-testid="pg-crumbs">
                {formatNumber(pgCrumbs)}
              </p>
              <p className="font-mono text-sm text-pencil -mt-1">Crumbs</p>
              <p className="font-mono text-xs text-moss mt-1" data-testid="pg-persec">+{pgPerSec.toFixed(2)} / sec</p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onTap}
                data-testid="pg-tap"
                aria-label="Tap oven"
                className={`relative w-44 h-44 rounded-full border-[6px] border-ink bg-honey shadow-inkBig grid place-items-center font-fraunces font-black text-2xl text-ink hover:rotate-1 transition-transform ${clicked ? 'scale-95' : ''}`}
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, #fde29a, #f2b84b 60%, #d99828 100%)',
                }}
              >
                <Cookie className="absolute -top-3 -right-3 w-8 h-8 text-ink" strokeWidth={1.6} />
                <span>TAP&nbsp;OVEN</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={buyRaccoon}
                disabled={pgCrumbs < cost}
                data-testid="pg-buy-raccoon"
                className="bg-card border-2 border-ink rounded-xl p-3 text-left disabled:opacity-50 hover:-translate-y-0.5 transition-transform shadow-sticker"
              >
                <p className="font-fraunces font-bold text-ink leading-tight">Raccoon Baker 🦝</p>
                <p className="font-mono text-xs text-pencil">owned: {pgRaccoons}</p>
                <p className="font-mono text-sm text-coral mt-1">{cost} Crumbs</p>
              </button>
              <button
                type="button"
                onClick={prestige}
                data-testid="pg-prestige"
                className="bg-lavender/30 border-2 border-ink rounded-xl p-3 text-left hover:-translate-y-0.5 transition-transform shadow-sticker"
              >
                <p className="font-fraunces font-bold text-ink leading-tight flex items-center gap-1">
                  Prestige <RefreshCw className="w-3.5 h-3.5" />
                </p>
                <p className="font-mono text-xs text-pencil">resets · earns Muffins ✺</p>
                <p className="font-mono text-sm text-ink mt-1">placeholder</p>
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <PaperCard variant="flat" className="bg-paper">
            <h3 className="font-fraunces font-bold text-xl text-ink mb-3 flex items-center gap-2">
              Upgrade shop <Sparkles className="w-4 h-4 text-honey" />
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {upgrades.map((u) => {
                const owned = ownedUpgrades.includes(u.id);
                const canAfford = u.costCurrency !== 'Crumbs' ? false : pgCrumbs >= u.cost;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => buyUpgrade(u.id)}
                    disabled={owned || !canAfford}
                    data-testid={`pg-upgrade-${u.id}`}
                    className="text-left bg-card border-2 border-ink rounded-xl p-3 disabled:opacity-50 hover:-translate-y-0.5 transition-transform shadow-sticker"
                  >
                    <p className="font-fraunces font-bold text-ink leading-tight">{u.name}</p>
                    <p className="text-xs text-moss font-mono">{u.effect}</p>
                    <p className="font-mono text-xs text-pencil mt-1">
                      {owned ? 'owned' : `${u.cost} ${u.costCurrency}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </PaperCard>

          <PaperCard variant="flat" className="bg-card">
            <h3 className="font-fraunces font-bold text-xl text-ink mb-2 flex items-center gap-2">
              Pacing notes <SketchAsterisk size={16} />
            </h3>
            <ul className="space-y-2 text-sm text-ink font-nunito list-disc pl-5">
              {PACING_NOTES.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </PaperCard>

          <StickyNote tone="green" tilt={-2}>
            click the oven a few times,
            <br />
            hire a raccoon, watch the crumbs roll in.
          </StickyNote>
        </div>
      </div>
    </div>
  );
}
