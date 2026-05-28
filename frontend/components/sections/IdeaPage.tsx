'use client';

import { useApp } from '@/components/AppContext';
import PaperCard from '@/components/PaperCard';
import StickerTag from '@/components/StickerTag';
import StickyNote from '@/components/StickyNote';
import {
  CORE_FANTASIES,
  CURRENCY_MODELS,
  GAME_TYPES,
  MAIN_ACTIONS,
  PROGRESSION_STYLES,
  SYSTEMS,
  THEMES,
  TONES,
} from '@/lib/mockData';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';

export default function IdeaPage() {
  const { concept, updateConcept, toggleSystem } = useApp();
  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink mb-1">
        <span className="relative">
          The Idea Page
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#5DADEC" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        scribble your weird little game into something you can build.
      </p>

      <div className="grid md:grid-cols-2 gap-6 stagger">
        <Field label="Title">
          <input
            type="text"
            value={concept.title}
            onChange={(e) => updateConcept({ title: e.target.value })}
            data-testid="idea-title"
            className="w-full bg-card border-2 border-softBorder focus:border-ink rounded-xl px-4 py-2 font-fraunces text-xl text-ink outline-none"
          />
        </Field>
        <Field label="Theme">
          <Select
            value={concept.theme}
            onChange={(v) => updateConcept({ theme: v })}
            options={THEMES}
            testid="idea-theme"
          />
        </Field>

        <Field label="Game Type / Genre">
          <Select
            value={concept.gameType}
            onChange={(v) => updateConcept({ gameType: v as any })}
            options={[...GAME_TYPES]}
            testid="idea-gametype"
          />
        </Field>

        <Field label="Core Fantasy">
          <Select
            value={concept.coreFantasy}
            onChange={(v) => updateConcept({ coreFantasy: v })}
            options={CORE_FANTASIES}
            testid="idea-fantasy"
          />
        </Field>

        <Field label="Main Action">
          <ChipGroup
            value={concept.mainAction}
            options={MAIN_ACTIONS}
            onChange={(v) => updateConcept({ mainAction: v })}
            testid="idea-action"
            tint="blue"
          />
        </Field>

        <Field label="Progression Style">
          <ChipGroup
            value={concept.progressionStyle}
            options={PROGRESSION_STYLES}
            onChange={(v) => updateConcept({ progressionStyle: v })}
            testid="idea-progression"
            tint="green"
          />
        </Field>

        <Field label="Currency Model">
          <ChipGroup
            value={concept.currencyModel}
            options={CURRENCY_MODELS}
            onChange={(v) => updateConcept({ currencyModel: v })}
            testid="idea-currency"
            tint="gold"
          />
        </Field>

        <Field label="Tone">
          <ChipGroup
            value={concept.tone}
            options={TONES}
            onChange={(v) => updateConcept({ tone: v })}
            testid="idea-tone"
            tint="lavender"
          />
        </Field>
      </div>

      <div className="mt-7">
        <Field label="Systems Enabled">
          <div className="flex flex-wrap gap-2">
            {SYSTEMS.map((s, i) => (
              <StickerTag
                key={s}
                tint={(['blue', 'green', 'gold', 'red', 'lavender'] as const)[i % 5]}
                selected={concept.systems.includes(s)}
                onClick={() => toggleSystem(s)}
                data-testid={`system-${s.toLowerCase().replace(/\s+/g,'-')}`}
              >
                {s}
              </StickerTag>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-7 grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        <Field label="Free-text idea">
          <textarea
            value={concept.freeText}
            onChange={(e) => updateConcept({ freeText: e.target.value })}
            data-testid="idea-freetext"
            rows={6}
            className="w-full bg-card border-2 border-softBorder focus:border-ink rounded-xl p-4 font-nunito text-base text-ink outline-none paper-lined"
            placeholder="describe the weird shape of your idle game..."
          />
        </Field>
        <StickyNote tone="yellow" tilt={-3}>
          tip: keep one ridiculous thing as the
          <br />
          <em className="not-italic text-coral">soul</em> of your game.
          <br />
          for ours: it's the cursed muffins.
          <SketchAsterisk className="absolute -right-2 -bottom-2" size={22} />
        </StickyNote>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <PaperCard variant="flat" className="bg-card/80">
      <p className="font-caveat text-pencil text-lg leading-none mb-2">{label}</p>
      {children}
    </PaperCard>
  );
}

function Select({
  value,
  onChange,
  options,
  testid,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  testid: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testid}
      className="w-full bg-card border-2 border-softBorder focus:border-ink rounded-xl px-3 py-2 font-nunito text-base text-ink outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function ChipGroup({
  value,
  options,
  onChange,
  testid,
  tint = 'blue',
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  testid: string;
  tint?: 'blue' | 'green' | 'gold' | 'red' | 'lavender';
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <StickerTag
          key={o}
          tint={tint}
          selected={value === o}
          onClick={() => onChange(o)}
          data-testid={`${testid}-${o.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {o}
        </StickerTag>
      ))}
    </div>
  );
}
