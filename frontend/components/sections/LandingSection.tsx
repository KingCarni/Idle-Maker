'use client';

import PaperCard from '@/components/PaperCard';
import StickerTag from '@/components/StickerTag';
import StickyNote from '@/components/StickyNote';
import { useApp } from '@/components/AppContext';
import { SketchArrow, SketchAsterisk, SketchScribble, SketchStar, SketchUnderline } from '@/components/doodles';
import { ArrowRight, Sparkles, Coffee } from 'lucide-react';

export default function LandingSection() {
  const { setTab, concept } = useApp();
  return (
    <div className="relative">
      <SketchStar className="absolute -top-2 right-6 animate-floatY" size={32} />
      <SketchAsterisk className="absolute top-24 -right-1" size={22} />
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <div className="relative pt-4">
          <p className="text-xs uppercase tracking-[0.3em] text-pencil font-nunito mb-3">
            a cozy workbench for weird little games
          </p>
          <h1 className="font-fraunces font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink tracking-tight">
            Sketch an idle game
            <br />
            <span className="relative inline-block">
              the way you'd
              <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#E97865" />
            </span>{' '}
            <span className="font-caveat text-coral text-6xl sm:text-7xl">doodle</span> a notebook
            page.
          </h1>

          <p className="mt-6 font-nunito text-lg text-ink/80 max-w-xl">
            Idle Maker is a paper-themed studio for designing, balancing,
            prototyping and exporting idle/clicker/incremental games. Start with
            a weird idea — end with a packed project kit.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <StickerTag tint="blue" data-testid="hero-tag-cozy">cozy</StickerTag>
            <StickerTag tint="green" data-testid="hero-tag-draft">draft-y</StickerTag>
            <StickerTag tint="gold" data-testid="hero-tag-playful">playful</StickerTag>
            <StickerTag tint="red" data-testid="hero-tag-handmade">handmade</StickerTag>
            <StickerTag tint="lavender" data-testid="hero-tag-organized">organized but never corporate</StickerTag>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setTab('idea')}
              data-testid="cta-start-sketching"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-card border-2 border-ink shadow-inkBig font-bold hover:-translate-y-0.5 hover:rotate-1 transition-transform"
            >
              Start sketching <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTab('prototype')}
              data-testid="cta-try-playground"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-honey text-ink border-2 border-ink shadow-ink font-bold hover:-translate-y-0.5 transition-transform"
            >
              Or try the Playground <Sparkles className="w-4 h-4" />
            </button>
            <span className="font-caveat text-lg text-pencil flex items-center gap-1">
              <Coffee className="w-4 h-4" /> warm paper, no signup
            </span>
          </div>

          {/* Workflow tape */}
          <div className="mt-10 relative">
            <p className="text-[10px] uppercase tracking-[0.3em] text-pencil mb-3">the page flow</p>
            <div className="flex flex-wrap items-center gap-2 font-fraunces text-ink">
              {['Idea', 'Loop', 'Economy', 'Upgrades', 'Creatures', 'Assets', 'Playground', 'Export'].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-paper border-2 border-ink rounded-full shadow-sticker text-sm">
                    {s}
                  </span>
                  {i < arr.length - 1 && <SketchArrow width={42} height={20} className="opacity-70" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: stacked sketch cards */}
        <div className="relative min-h-[420px]">
          <PaperCard tilt="left" tape className="absolute top-2 left-2 w-[78%]" data-testid="hero-card-concept">
            <p className="text-xs uppercase tracking-widest text-pencil">current concept</p>
            <h3 className="font-fraunces text-2xl text-ink mt-1">{concept.title}</h3>
            <p className="text-sm text-ink/80 mt-2 leading-snug">
              {concept.freeText}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <StickerTag tint="gold">{concept.gameType}</StickerTag>
              <StickerTag tint="green">{concept.tone}</StickerTag>
            </div>
          </PaperCard>

          <StickyNote
            tone="yellow"
            tilt={-4}
            className="absolute right-0 top-32"
          >
            “Your loop is clear — but the first upgrade should arrive sooner.”
            <br />
            <span className="text-sm text-pencil">— Mod-Mate</span>
          </StickyNote>

          <PaperCard
            tilt="right"
            tape
            tapeColor="rgba(121,184,109,0.6)"
            className="absolute left-10 top-64 w-[66%] bg-paper"
            data-testid="hero-card-loop"
          >
            <p className="text-xs uppercase tracking-widest text-pencil">loop sketch</p>
            <p className="mt-2 font-mono text-sm text-ink leading-relaxed">
              tap oven → +crumbs → hire raccoons → recipes → fight ghosts → golden muffins → prestige ↺
            </p>
            <SketchScribble className="mt-2 h-3 w-full" />
          </PaperCard>

          <SketchAsterisk className="absolute -bottom-4 left-0 animate-wiggle" size={28} />
        </div>
      </div>
    </div>
  );
}
