'use client';

import { useApp } from './AppContext';
import { Check, Loader2, AlertTriangle, Save, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SaveStatus() {
  const { saveState, saveError, saveNow, setProjectModalOpen, concept, projectId } = useApp();

  const label =
    saveState === 'saving'
      ? 'saving…'
      : saveState === 'dirty'
      ? 'unsaved changes'
      : saveState === 'error'
      ? 'save failed'
      : saveState === 'saved'
      ? 'saved'
      : 'idle';

  const Dot = saveState === 'saving'
    ? Loader2
    : saveState === 'error'
    ? AlertTriangle
    : saveState === 'dirty'
    ? Save
    : Check;

  const tint =
    saveState === 'saving'
      ? 'bg-crayonBlue/30 text-ink border-ink'
      : saveState === 'dirty'
      ? 'bg-honey/40 text-ink border-ink'
      : saveState === 'error'
      ? 'bg-coral/40 text-ink border-ink'
      : 'bg-moss/30 text-ink border-ink';

  return (
    <div className="flex items-center gap-2" data-testid="save-status-bar">
      {/* Project chip */}
      <button
        type="button"
        onClick={() => setProjectModalOpen(true)}
        data-testid="open-project-modal"
        className="inline-flex items-center gap-2 max-w-[220px] bg-card border-2 border-ink rounded-full px-3 py-1 shadow-sticker text-ink hover:-translate-y-0.5 transition-transform"
        title={projectId ? `Project: ${concept.title}` : 'Open project switcher'}
      >
        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
        <span className="font-fraunces font-bold text-sm truncate" data-testid="current-project-title">
          {concept.title || 'Untitled'}
        </span>
      </button>

      {/* Save state pill */}
      <span
        className={cn(
          'hidden sm:inline-flex items-center gap-1.5 border-2 rounded-full px-2.5 py-1 text-xs font-bold font-nunito shadow-sticker',
          tint
        )}
        data-testid="save-state"
        data-state={saveState}
        title={saveError || label}
      >
        <Dot
          className={cn('w-3.5 h-3.5', saveState === 'saving' && 'animate-spin')}
          strokeWidth={2}
        />
        <span>{label}</span>
      </span>

      {/* Manual save button */}
      <button
        type="button"
        onClick={() => saveNow()}
        disabled={saveState === 'saving' || !projectId}
        data-testid="save-now"
        className="hidden md:inline-flex items-center gap-1 bg-ink text-card border-2 border-ink rounded-full px-3 py-1 text-xs font-bold shadow-sticker disabled:opacity-50 hover:-rotate-1 transition-transform"
      >
        <Save className="w-3.5 h-3.5" /> Save
      </button>
    </div>
  );
}
