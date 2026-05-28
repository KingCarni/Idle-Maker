'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { COMPANION_PROMPTS } from '@/lib/mockData';
import { MessageSquareHeart, Send, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SketchAsterisk, SketchStar } from './doodles';

const CANNED: Record<string, string> = {
  'Improve my loop':
    'Try compressing your first 90 seconds: drop the first generator unlock to 8 Crumbs, and let the first upgrade arrive by 55s. Players love early dopamine.',
  'Make it grindier':
    "Lengthen the cost curve to ×1.18 instead of ×1.15, add a 'Patience Pet' that rewards inactivity, and tier Crumbs into Crumbs → Sugar Stars → Golden Muffins.",
  'Add a weird pet':
    "How about a 'Sock Goblin' that occasionally hides 1 generator for 30s, but doubles its output when it returns? Mascot-tier weirdness.",
  'Suggest bosses':
    'Three bosses for the bakery arc: 🥐 Croissant Hydra (multi-head), 🍩 Donut Lich (rings of decay), 🧁 Muffin Wraith (final). Each drops a unique sticker.',
  'Review my imports':
    "I'll do a deeper review once the real integration is connected — for now I can confirm your tray is recognizing JSON/MD/images correctly.",
  'Prepare export plan':
    'I will prep: design_doc.md, config.json (schema v0.1), browser_proto/, godot_starter/, unity_starter/, unreal_research.md, asset_pack/. Mocks for now.',
};

export default function CompanionPanel() {
  const { messages, addMessage, companionOpen, setCompanionOpen, concept } = useApp();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, companionOpen]);

  function send(text: string) {
    if (!text.trim()) return;
    addMessage({ id: `u${Date.now()}`, from: 'you', text, ts: Date.now() });
    setTimeout(() => {
      const reply =
        CANNED[text] ||
        `Mod-Mate is offline-ish — but here's a note: I'd thread "${text}" into ${concept.title}'s loop somewhere around the first prestige.`;
      addMessage({ id: `m${Date.now()}`, from: 'mate', text: reply, tone: 'tip', ts: Date.now() });
    }, 400);
    setDraft('');
  }

  return (
    <>
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setCompanionOpen(!companionOpen)}
        data-testid="companion-trigger"
        aria-expanded={companionOpen}
        className={cn(
          'fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full',
          'bg-ink text-card font-nunito font-bold border-2 border-ink shadow-inkBig',
          'hover:-translate-y-0.5 hover:rotate-1 transition-transform'
        )}
      >
        <MessageSquareHeart className="w-5 h-5" strokeWidth={1.6} />
        <span>Mod-Mate</span>
        <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />
      </button>

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] transition-transform duration-300',
          companionOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!companionOpen}
        data-testid="companion-panel"
      >
        <div className="h-full flex flex-col bg-card border-l-2 border-ink shadow-inkBig">
          {/* Spiral header */}
          <div className="relative bg-paper px-5 pt-6 pb-4 border-b-2 border-ink">
            <SpiralBinding />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-pencil">Companion</p>
                <h3 className="font-fraunces text-2xl text-ink leading-tight flex items-center gap-2">
                  Mod-Mate
                  <SketchAsterisk size={16} color="#A98BD8" />
                </h3>
                <p className="font-caveat text-base text-pencil">a friendly notebook helper</p>
              </div>
              <button
                type="button"
                aria-label="Close companion"
                data-testid="companion-close"
                onClick={() => setCompanionOpen(false)}
                className="rounded-full border-2 border-ink p-1.5 bg-card hover:bg-coral/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 paper-dot-grid"
            data-testid="companion-messages"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[88%] p-3 border-2 rounded-2xl font-nunito',
                  m.from === 'mate'
                    ? 'bg-white border-ink shadow-ink'
                    : 'bg-honey/40 border-ink ml-auto shadow-sticker'
                )}
              >
                {m.from === 'mate' && (
                  <div className="flex items-center gap-1.5 mb-1 font-fraunces text-xs text-lavender">
                    <Sparkles className="w-3.5 h-3.5" /> Mod-Mate
                  </div>
                )}
                <p className="text-sm leading-snug text-ink">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Prompt chips */}
          <div className="border-t-2 border-dashed border-softBorder p-3 flex flex-wrap gap-2 bg-paper">
            {COMPANION_PROMPTS.map((p, i) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="px-3 py-1.5 rounded-full border-2 border-ink bg-card text-ink text-xs font-bold shadow-sticker hover:bg-honey/40 hover:-rotate-1 transition-transform"
                data-testid={`companion-prompt-${i}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="border-t-2 border-ink bg-card p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Mod-Mate anything…"
              className="flex-1 bg-paper border-2 border-softBorder focus:border-ink rounded-full px-4 py-2 font-nunito text-sm outline-none"
              data-testid="companion-input"
            />
            <button
              type="submit"
              className="bg-ink text-card rounded-full p-2 border-2 border-ink hover:bg-coral hover:text-ink"
              data-testid="companion-send"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function SpiralBinding() {
  return (
    <div className="absolute -top-1 left-0 right-0 flex justify-around px-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-ink/80 border border-ink shadow-[inset_0_-1px_0_rgba(255,255,255,.4)]"
        />
      ))}
    </div>
  );
}
