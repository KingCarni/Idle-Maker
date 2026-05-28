'use client';

import { ChevronLeft, ChevronRight, Notebook } from 'lucide-react';
import { useApp } from './AppContext';
import NotebookTabs, { TAB_KEYS, TAB_LABELS } from './NotebookTabs';
import ProjectTray from './ProjectTray';
import CompanionPanel from './CompanionPanel';
import CustomCursor from './CustomCursor';

// Sections
import LandingSection from './sections/LandingSection';
import IdeaPage from './sections/IdeaPage';
import LoopSketch from './sections/LoopSketch';
import EconomyNotes from './sections/EconomyNotes';
import UpgradeStickers from './sections/UpgradeStickers';
import CreatureDoodles from './sections/CreatureDoodles';
import AssetKit from './sections/AssetKit';
import PrototypePlayground from './sections/PrototypePlayground';
import ExportFolder from './sections/ExportFolder';
import { SketchStar } from './doodles';

export default function AppShell() {
  const { activeTab, setTab, next, prev } = useApp();
  const i = TAB_KEYS.indexOf(activeTab);

  return (
    <div className="paper-dot-grid min-h-screen flex flex-col">
      <CustomCursor />
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <ProjectTray />
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="pt-4 px-4 sm:px-8 max-w-7xl w-full mx-auto">
            <NotebookTabs active={activeTab} onChange={setTab} />
          </div>
          <div
            className="flex-1 mx-4 sm:mx-8 max-w-7xl w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] self-center
                          border-2 border-ink rounded-b-3xl rounded-tr-3xl bg-card shadow-ink
                          relative overflow-hidden"
          >
            {/* Section content */}
            <div className="p-5 sm:p-8 min-h-[60vh]">
              <SectionRouter />
            </div>
            {/* Footer nav */}
            <div className="px-5 sm:px-8 pb-6 flex items-center justify-between border-t-2 border-dashed border-softBorder pt-4 mt-2">
              <button
                type="button"
                onClick={prev}
                disabled={i === 0}
                data-testid="footer-prev"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink bg-paper text-ink font-bold shadow-sticker disabled:opacity-40 hover:-translate-y-0.5 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <p className="font-caveat text-pencil text-base">
                page {i + 1} of {TAB_KEYS.length} — {TAB_LABELS[activeTab]}
              </p>
              <button
                type="button"
                onClick={next}
                disabled={i === TAB_KEYS.length - 1}
                data-testid="footer-next"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink bg-honey text-ink font-bold shadow-ink disabled:opacity-40 hover:-translate-y-0.5 transition-transform"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-8" />
        </main>
      </div>
      <CompanionPanel />
    </div>
  );
}

function SectionRouter() {
  const { activeTab } = useApp();
  switch (activeTab) {
    case 'landing':
      return <LandingSection />;
    case 'idea':
      return <IdeaPage />;
    case 'loop':
      return <LoopSketch />;
    case 'economy':
      return <EconomyNotes />;
    case 'upgrades':
      return <UpgradeStickers />;
    case 'creatures':
      return <CreatureDoodles />;
    case 'assets':
      return <AssetKit />;
    case 'prototype':
      return <PrototypePlayground />;
    case 'export':
      return <ExportFolder />;
  }
}

function TopBar() {
  return (
    <header className="border-b-2 border-ink bg-paper/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group" data-testid="brand-link">
          <span className="relative inline-grid place-items-center w-10 h-10 rounded-xl bg-ink text-card border-2 border-ink shadow-ink group-hover:rotate-3 transition-transform">
            <Notebook className="w-5 h-5" strokeWidth={1.6} />
            <SketchStar className="absolute -top-3 -right-3" size={20} color="#F2B84B" />
          </span>
          <span>
            <span className="block font-fraunces font-bold text-2xl text-ink leading-none">
              Idle <em className="not-italic text-coral">Maker</em>
            </span>
            <span className="block font-caveat text-base text-pencil leading-tight -mt-0.5">
              sketchbook studio · v0.1
            </span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-3 font-nunito text-sm text-pencil">
          <span className="px-2 py-1 rounded-full bg-card border border-softBorder">
            mock data · local state
          </span>
          <span className="font-mono text-xs">build / preview</span>
        </div>
      </div>
    </header>
  );
}
