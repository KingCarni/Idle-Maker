'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApp } from './AppContext';
import { X, Plus, Copy, Trash2, FolderOpen, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CornerClip, SketchAsterisk, SketchUnderline } from './doodles';

export default function ProjectModal() {
  const {
    projectModalOpen,
    setProjectModalOpen,
    projects,
    projectId,
    refreshProjects,
    openProject,
    newProject,
    duplicateProject,
    deleteProject,
    loadingProject,
  } = useApp();

  const [query, setQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    if (projectModalOpen) {
      refreshProjects();
      setPendingDelete(null);
      setQuery('');
    }
  }, [projectModalOpen, refreshProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q) ||
        p.gameType.toLowerCase().includes(q) ||
        p.tone.toLowerCase().includes(q)
    );
  }, [projects, query]);

  if (!projectModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Projects"
      data-testid="project-modal"
      className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close projects"
        onClick={() => setProjectModalOpen(false)}
        data-testid="project-modal-backdrop"
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
      />
      {/* Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border-2 border-ink rounded-3xl shadow-inkBig overflow-hidden flex flex-col">
        <CornerClip className="absolute -top-2 left-6 z-10" />
        <header className="paper-dot-grid bg-paper border-b-2 border-ink px-6 pt-7 pb-4 relative">
          <button
            type="button"
            onClick={() => setProjectModalOpen(false)}
            data-testid="project-modal-close"
            className="absolute top-3 right-3 rounded-full border-2 border-ink p-1.5 bg-card hover:bg-coral/40"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-[10px] uppercase tracking-[0.25em] text-pencil">your sketchbook</p>
          <h2 className="font-fraunces font-black text-3xl sm:text-4xl text-ink flex items-center gap-2 leading-tight">
            <span className="relative">
              Projects
              <SketchUnderline className="absolute left-0 -bottom-1 w-full h-3" color="#A98BD8" />
            </span>
            <SketchAsterisk size={18} />
          </h2>
          <p className="font-caveat text-pencil text-lg mt-1">
            every project is auto-saved to the studio.
          </p>

          <div className="mt-4 flex flex-wrap items-stretch gap-2">
            <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-card border-2 border-softBorder focus-within:border-ink rounded-full px-3 py-1.5">
              <Search className="w-4 h-4 text-pencil" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search projects…"
                data-testid="project-modal-search"
                className="flex-1 bg-transparent outline-none font-nunito text-sm text-ink"
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = newTitle.trim() || 'Untitled Sketch';
                newProject(t);
                setNewTitle('');
                setProjectModalOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="new project title…"
                data-testid="project-modal-new-input"
                className="bg-paper border-2 border-softBorder focus:border-ink rounded-full px-3 py-1.5 font-nunito text-sm text-ink outline-none w-44"
              />
              <button
                type="submit"
                data-testid="project-modal-new-button"
                className="inline-flex items-center gap-1 bg-ink text-card border-2 border-ink rounded-full px-3 py-1.5 text-sm font-bold shadow-sticker hover:-rotate-1 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </form>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 bg-card">
          {loadingProject && (
            <div className="flex items-center gap-2 text-pencil font-caveat text-lg mb-3">
              <Loader2 className="w-4 h-4 animate-spin" /> loading…
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="font-caveat text-pencil text-xl text-center py-12">
              No projects match. Try a different search, or create one above.
            </p>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4" data-testid="project-list">
              {filtered.map((p, i) => {
                const active = p.id === projectId;
                const ago = relativeTime(p.updatedAt);
                const tilts = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]', 'rotate-[0.5deg]'];
                return (
                  <li
                    key={p.id}
                    data-testid={`project-item-${p.id}`}
                    className={cn(
                      'relative bg-paper border-2 rounded-2xl p-4 transition-transform',
                      active ? 'border-ink shadow-ink' : 'border-softBorder hover:border-ink hover:shadow-pencil',
                      tilts[i % tilts.length]
                    )}
                  >
                    {active && (
                      <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-honey text-ink text-[10px] uppercase tracking-widest font-bold border-2 border-ink shadow-sticker">
                        current
                      </span>
                    )}
                    <h3 className="font-fraunces font-bold text-xl text-ink leading-tight pr-6 truncate" title={p.title}>
                      {p.title || 'Untitled Sketch'}
                    </h3>
                    <p className="font-caveat text-pencil text-base leading-tight mt-0.5">
                      {p.gameType} · {p.tone}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-[10px] text-ink">
                      <Stat label="theme" value={p.theme.split(' ')[0] || '—'} />
                      <Stat label="systems" value={String(p.systemsCount)} />
                      <Stat label="assets" value={String(p.assetsCount)} />
                    </div>
                    <p className="mt-2 text-[11px] font-mono text-pencil">updated {ago}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={active}
                        onClick={() => {
                          openProject(p.id);
                          setProjectModalOpen(false);
                        }}
                        data-testid={`project-open-${p.id}`}
                        className="inline-flex items-center gap-1 bg-honey/70 border-2 border-ink rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sticker disabled:opacity-50"
                      >
                        <FolderOpen className="w-3 h-3" /> Open
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateProject(p.id)}
                        data-testid={`project-duplicate-${p.id}`}
                        className="inline-flex items-center gap-1 bg-card border-2 border-ink rounded-full px-2.5 py-1 text-xs font-bold text-ink shadow-sticker hover:bg-lavender/40"
                      >
                        <Copy className="w-3 h-3" /> Duplicate
                      </button>
                      {pendingDelete === p.id ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => deleteProject(p.id).then(() => setPendingDelete(null))}
                            data-testid={`project-delete-confirm-${p.id}`}
                            className="inline-flex items-center gap-1 bg-coral border-2 border-ink rounded-full px-2.5 py-1 text-xs font-bold text-ink shadow-sticker"
                          >
                            <Trash2 className="w-3 h-3" /> confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            data-testid={`project-delete-cancel-${p.id}`}
                            className="text-xs underline text-pencil hover:text-ink"
                          >
                            cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(p.id)}
                          data-testid={`project-delete-${p.id}`}
                          className="inline-flex items-center gap-1 bg-card border-2 border-ink rounded-full px-2.5 py-1 text-xs font-bold text-ink shadow-sticker hover:bg-coral/40"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-softBorder rounded-md px-1 py-0.5 text-center">
      <div className="text-[8px] uppercase tracking-widest text-pencil">{label}</div>
      <div className="text-[11px] text-ink truncate" title={value}>
        {value}
      </div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '—';
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 45) return 'just now';
  if (s < 90) return 'a minute ago';
  const m = Math.floor(s / 60);
  if (m < 45) return `${m}m ago`;
  const h = Math.floor(s / 3600);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(s / 86400);
  if (d < 14) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
