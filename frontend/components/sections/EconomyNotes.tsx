'use client';

import PaperCard from '@/components/PaperCard';
import StickerTag from '@/components/StickerTag';
import { useApp } from '@/components/AppContext';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';

export default function EconomyNotes() {
  const { currencies, generators } = useApp();
  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Economy Notes
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#F2B84B" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        the math, the money, the muffins.
      </p>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        <section>
          <h3 className="font-fraunces font-bold text-2xl text-ink mb-3 flex items-center gap-2">
            Currencies <SketchAsterisk size={18} />
          </h3>
          <div className="space-y-4 stagger">
            {currencies.map((c) => (
              <PaperCard key={c.id} tilt={c.tier === 'prestige' ? 'right' : 'left'} className="bg-card" data-testid={`currency-${c.id}`}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-ink bg-honey/40 grid place-items-center font-mono text-2xl text-ink">
                    {c.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-fraunces text-xl text-ink">{c.name}</h4>
                      <StickerTag
                        tint={c.tier === 'soft' ? 'blue' : c.tier === 'hard' ? 'gold' : 'lavender'}
                      >
                        {c.tier}
                      </StickerTag>
                    </div>
                    <p className="mt-1 text-sm text-ink/80 leading-snug font-caveat text-base">
                      {c.flavor}
                    </p>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-fraunces font-bold text-2xl text-ink mb-3">Generators</h3>
          <div className="overflow-x-auto border-2 border-ink rounded-2xl bg-paper shadow-pencil">
            <table className="w-full text-sm" data-testid="generator-table">
              <thead className="bg-ink text-card font-mono text-xs uppercase">
                <tr>
                  <th className="text-left px-3 py-2">name</th>
                  <th className="text-left px-3 py-2">produces</th>
                  <th className="text-right px-3 py-2">cost</th>
                  <th className="text-right px-3 py-2">rate</th>
                  <th className="text-left px-3 py-2">unlock</th>
                </tr>
              </thead>
              <tbody>
                {generators.map((g, i) => (
                  <tr
                    key={g.id}
                    className={`border-t border-dashed border-softBorder hover:bg-card/80 ${i % 2 ? 'bg-card/40' : ''}`}
                    data-testid={`generator-row-${g.id}`}
                  >
                    <td className="px-3 py-3">
                      <div className="font-fraunces font-bold text-ink">{g.name}</div>
                      <div className="font-caveat text-base text-pencil leading-none">
                        {g.flavor}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-ink">{g.produces}</td>
                    <td className="px-3 py-3 font-mono text-right text-ink">
                      {g.baseCost} <span className="text-pencil">{g.costCurrency.slice(0, 4)}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-right text-moss">{g.productionRate}</td>
                    <td className="px-3 py-3 text-pencil text-xs">{g.unlock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-caveat text-pencil text-base">
            * numbers are mock values; balanced for a 25-minute first-prestige.
          </p>
        </section>
      </div>
    </div>
  );
}
