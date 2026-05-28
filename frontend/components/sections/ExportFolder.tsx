'use client';

import { EXPORT_OPTIONS } from '@/lib/mockData';
import { useApp } from '@/components/AppContext';
import { SketchAsterisk, SketchUnderline } from '@/components/doodles';
import {
  BookText,
  Braces,
  Globe2,
  Boxes,
  Package,
  FileSearch,
  FolderArchive,
  Download,
  PackageCheck,
} from 'lucide-react';
import StickyNote from '@/components/StickyNote';

const ICONS = { BookText, Braces, Globe2, Boxes, Package, FileSearch, FolderArchive } as const;

const STATUS_TINT: Record<string, string> = {
  'Mock only': 'bg-honey/60 border-ink',
  'Ready later': 'bg-moss/40 border-ink',
  Planned: 'bg-lavender/40 border-ink',
};

export default function ExportFolder() {
  const { concept } = useApp();

  return (
    <div className="relative">
      <h2 className="font-fraunces text-4xl text-ink">
        <span className="relative">
          Export Folder
          <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#F2B84B" />
        </span>
      </h2>
      <p className="font-caveat text-pencil text-lg mb-6">
        every page packed neatly into a project kit.
      </p>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div className="grid sm:grid-cols-2 gap-5 stagger">
          {EXPORT_OPTIONS.map((e) => {
            const Icon = ICONS[e.icon as keyof typeof ICONS] || FolderArchive;
            return (
              <article
                key={e.id}
                data-testid={`export-${e.id}`}
                className="relative pt-6 hover:-translate-y-1 transition-transform"
              >
                {/* Folder tab */}
                <div
                  className="absolute -top-1 left-4 px-4 py-1.5 rounded-t-xl border-2 border-b-0 border-ink font-fraunces font-bold text-ink shadow-[2px_-2px_0_rgba(47,42,36,.15)]"
                  style={{ background: '#F2B84B' }}
                >
                  {e.title}
                </div>
                {/* Folder body */}
                <div className="border-2 border-ink rounded-b-2xl rounded-tr-2xl bg-card p-5 pt-7 shadow-inkBig relative overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute -top-3 right-6 w-24 h-5 rotate-3"
                    style={{ background: 'rgba(93,173,236,.5)' }}
                  />
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 grid place-items-center bg-paper border-2 border-ink rounded-xl">
                      <Icon className="w-6 h-6 text-ink" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1">
                      <p className="font-nunito text-sm text-ink/80">{e.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-[11px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border-2 ${STATUS_TINT[e.status]}`}
                    >
                      {e.status}
                    </span>
                    <button
                      type="button"
                      disabled
                      data-testid={`export-download-${e.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold border-2 border-ink rounded-full px-3 py-1 bg-paper text-ink/60 cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pack kit summary */}
        <aside className="space-y-5">
          <div className="relative">
            <div className="absolute -top-3 left-4 px-4 py-1.5 rounded-t-xl border-2 border-b-0 border-ink bg-moss font-fraunces font-bold text-ink shadow-[2px_-2px_0_rgba(47,42,36,.15)]">
              Pack Kit
            </div>
            <div className="border-2 border-ink rounded-2xl bg-paper p-5 pt-7 shadow-inkBig relative">
              <h3 className="font-fraunces font-bold text-xl text-ink">
                {concept.title}
              </h3>
              <p className="font-caveat text-pencil text-lg leading-tight">
                {concept.gameType} · {concept.tone}
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-ink">
                <li>📄 design_doc.md</li>
                <li>🧾 config.json</li>
                <li>🌐 browser_proto/</li>
                <li>🎮 godot_starter/</li>
                <li>🛠 unity_starter/</li>
                <li>🔎 unreal_research.md</li>
                <li>🖼 asset_pack/</li>
              </ul>
              <button
                type="button"
                disabled
                data-testid="pack-kit-button"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 font-bold border-2 border-ink rounded-full px-4 py-2 bg-honey text-ink shadow-ink hover:rotate-1 transition-transform"
              >
                <PackageCheck className="w-4 h-4" /> Pack the whole kit · soon
              </button>
            </div>
          </div>

          <StickyNote tone="pink" tilt={-3}>
            in the next pass we'll wire
            <br />
            real export pipelines + Mod-Mate.
            <SketchAsterisk className="absolute -right-2 -bottom-2" size={20} />
          </StickyNote>
        </aside>
      </div>
    </div>
  );
}
