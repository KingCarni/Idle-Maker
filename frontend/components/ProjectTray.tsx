'use client';

import { useState } from 'react';
import { useApp } from './AppContext';
import ImportDropzone from './ImportDropzone';
import { FileJson, FileText, Image as ImageIcon, X, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CornerClip } from './doodles';

const KIND_ICON = {
  json: FileJson,
  md: FileText,
  image: ImageIcon,
  invalid: AlertTriangle,
} as const;

export default function ProjectTray() {
  const { imports, addImport, removeImport, concept } = useApp();
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <aside
      className="relative hidden lg:flex flex-col w-72 shrink-0 border-r-2 border-dashed border-softBorder/80 bg-paper/40 backdrop-blur-[1px]"
      aria-label="Project Tray"
      data-testid="project-tray"
    >
      <CornerClip className="absolute -top-2 left-6 z-10" />
      <div className="p-5 border-b-2 border-dashed border-softBorder">
        <p className="text-xs uppercase tracking-[0.2em] text-pencil font-nunito">Project Tray</p>
        <h2 className="font-fraunces text-2xl text-ink leading-tight">
          {concept.title}
        </h2>
        <p className="font-caveat text-base text-pencil mt-1">
          {concept.gameType} · {concept.tone}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat label="theme" value={concept.theme.split(' ')[0]} />
          <Stat label="loop" value={concept.mainAction} />
          <Stat label="systems" value={String(concept.systems.length)} />
        </div>
      </div>
      <div className="p-4 border-b-2 border-dashed border-softBorder">
        <ImportDropzone
          compact
          onFiles={(files) => files.forEach(addImport)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="project-tray-list">
        {imports.length === 0 && (
          <p className="font-caveat text-lg text-pencil text-center mt-4">
            Nothing pinned yet. Drop a doodle or config here.
          </p>
        )}
        {imports.map((f) => {
          const Icon = KIND_ICON[f.kind];
          return (
            <div
              key={f.id}
              className={cn(
                'group relative bg-card border-2 border-softBorder rounded-xl p-3 flex items-start gap-3',
                'shadow-pencil/0 hover:shadow-pencil hover:-translate-y-0.5 transition-all'
              )}
              data-testid={`tray-item-${f.id}`}
            >
              <div className="shrink-0 w-12 h-12 rounded-md bg-paper border border-softBorder grid place-items-center overflow-hidden">
                {f.kind === 'image' && f.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon className="w-5 h-5 text-pencil" strokeWidth={1.6} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-nunito font-bold text-sm text-ink truncate" title={f.name}>
                  {f.name}
                </p>
                <p className="text-xs text-pencil font-mono">
                  {(f.size / 1024).toFixed(1)} KB · {f.kind}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewId(previewId === f.id ? null : f.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ink bg-honey/40 border border-ink rounded-full px-2 py-0.5 hover:bg-honey/70"
                    data-testid={`tray-preview-${f.id}`}
                  >
                    <Eye className="w-3 h-3" /> {previewId === f.id ? 'Hide' : 'Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImport(f.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ink bg-coral/30 border border-ink rounded-full px-2 py-0.5 hover:bg-coral/60"
                    data-testid={`tray-remove-${f.id}`}
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
              {previewId === f.id && <Preview kind={f.kind} text={f.preview} src={f.preview} />}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-softBorder rounded-lg px-1 py-1.5">
      <p className="text-[10px] uppercase tracking-widest text-pencil font-nunito">{label}</p>
      <p className="font-mono text-sm text-ink truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

function Preview({ kind, text, src }: { kind: string; text: string; src: string }) {
  if (kind === 'image')
    return (
      <div className="basis-full mt-3 border-2 border-dashed border-softBorder rounded-lg p-2 bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="preview" className="w-full max-h-44 object-contain" />
      </div>
    );
  if (kind === 'json') {
    let pretty = text;
    try {
      pretty = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      /* keep raw */
    }
    return (
      <pre className="basis-full mt-3 bg-paper border-2 border-dashed border-softBorder rounded-lg p-3 text-[11px] font-mono text-ink max-h-44 overflow-auto">
        {pretty.slice(0, 4000)}
      </pre>
    );
  }
  if (kind === 'md')
    return (
      <pre className="basis-full mt-3 bg-paper border-2 border-dashed border-softBorder rounded-lg p-3 text-[12px] font-mono text-ink max-h-44 overflow-auto whitespace-pre-wrap">
        {text.slice(0, 4000)}
      </pre>
    );
  return (
    <p className="basis-full mt-3 text-sm text-coral font-caveat">
      We can't preview this file kind, but it's pinned to the tray.
    </p>
  );
}
