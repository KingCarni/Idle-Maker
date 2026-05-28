'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  SAMPLE_COMPANION_MESSAGES,
  SAMPLE_CONCEPT,
  SAMPLE_CREATURES,
  SAMPLE_CURRENCIES,
  SAMPLE_GENERATORS,
  SAMPLE_UPGRADES,
} from '@/lib/mockData';
import type {
  CompanionMessage,
  Creature,
  Currency,
  GameConcept,
  Generator,
  ImportedFile,
  Upgrade,
} from '@/lib/types';
import { TAB_KEYS, type TabKey } from '@/components/NotebookTabs';
import { ProjectAPI, type Project, type ProjectSummary } from '@/lib/api';

interface AppState {
  activeTab: TabKey;
  concept: GameConcept;
  currencies: Currency[];
  generators: Generator[];
  upgrades: Upgrade[];
  creatures: Creature[];
  imports: ImportedFile[];
  messages: CompanionMessage[];
  companionOpen: boolean;
  // Mini playground state
  pgCrumbs: number;
  pgRaccoons: number;
  pgPerSec: number;
  ownedUpgrades: string[];
  // Generated asset slot images, keyed by slotId
  assets: Record<string, string>;
  // slotIds currently generating
  generating: Record<string, boolean>;
  // last-error per slot for friendly UI feedback
  assetErrors: Record<string, string>;
  // Project / persistence
  projectId: string | null;
  projects: ProjectSummary[];
  saveState: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  lastSavedAt: number | null;
  projectModalOpen: boolean;
  loadingProject: boolean;
}

type Action =
  | { type: 'setTab'; tab: TabKey }
  | { type: 'updateConcept'; patch: Partial<GameConcept> }
  | { type: 'toggleSystem'; system: string }
  | { type: 'addImport'; file: ImportedFile }
  | { type: 'removeImport'; id: string }
  | { type: 'addMessage'; message: CompanionMessage }
  | { type: 'setCompanionOpen'; open: boolean }
  | { type: 'tapCrumbs'; amount?: number }
  | { type: 'buyRaccoon' }
  | { type: 'buyUpgrade'; id: string }
  | { type: 'prestige' }
  | { type: 'tick' }
  | { type: 'assetStart'; slotId: string }
  | { type: 'assetDone'; slotId: string; image: string }
  | { type: 'assetError'; slotId: string; error: string }
  | { type: 'assetClear'; slotId: string }
  | { type: 'setProjects'; projects: ProjectSummary[] }
  | { type: 'loadProject'; project: Project }
  | { type: 'setSaveState'; saveState: AppState['saveState']; error?: string | null; lastSavedAt?: number | null }
  | { type: 'markDirty' }
  | { type: 'setProjectModal'; open: boolean }
  | { type: 'setLoadingProject'; loading: boolean };

function reducer(state: AppState, action: Action): AppState {
  // Marks the project dirty if it represents user-driven state changes that we persist.
  const dirty = (next: AppState): AppState => ({
    ...next,
    saveState: state.loadingProject ? next.saveState : 'dirty',
  });
  switch (action.type) {
    case 'setTab':
      return { ...state, activeTab: action.tab };
    case 'updateConcept':
      return dirty({ ...state, concept: { ...state.concept, ...action.patch } });
    case 'toggleSystem': {
      const s = state.concept.systems.includes(action.system)
        ? state.concept.systems.filter((x) => x !== action.system)
        : [...state.concept.systems, action.system];
      return dirty({ ...state, concept: { ...state.concept, systems: s } });
    }
    case 'addImport':
      return { ...state, imports: [action.file, ...state.imports] };
    case 'removeImport':
      return { ...state, imports: state.imports.filter((f) => f.id !== action.id) };
    case 'addMessage':
      return { ...state, messages: [...state.messages, action.message] };
    case 'setCompanionOpen':
      return { ...state, companionOpen: action.open };
    case 'tapCrumbs':
      return dirty({ ...state, pgCrumbs: state.pgCrumbs + (action.amount ?? 1) });
    case 'buyRaccoon': {
      const cost = Math.floor(15 * Math.pow(1.15, state.pgRaccoons));
      if (state.pgCrumbs < cost) return state;
      return dirty({
        ...state,
        pgCrumbs: state.pgCrumbs - cost,
        pgRaccoons: state.pgRaccoons + 1,
        pgPerSec: +(state.pgPerSec + 1.2).toFixed(2),
      });
    }
    case 'buyUpgrade': {
      if (state.ownedUpgrades.includes(action.id)) return state;
      const up = state.upgrades.find((u) => u.id === action.id);
      if (!up) return state;
      if (up.costCurrency === 'Crumbs' && state.pgCrumbs < up.cost) return state;
      let crumbs = state.pgCrumbs;
      if (up.costCurrency === 'Crumbs') crumbs = state.pgCrumbs - up.cost;
      // Apply simple effects
      let perSec = state.pgPerSec;
      if (up.id === 'big-bowl') perSec = +(perSec * 1.25).toFixed(2);
      if (up.id === 'whisk') perSec = +(perSec + state.pgRaccoons * 1.2).toFixed(2);
      if (up.id === 'double-baked') perSec = +(perSec * 2).toFixed(2);
      if (up.id === 'multiplier') perSec = +(perSec * 1.5).toFixed(2);
      return dirty({
        ...state,
        pgCrumbs: crumbs,
        pgPerSec: perSec,
        ownedUpgrades: [...state.ownedUpgrades, action.id],
      });
    }
    case 'prestige':
      return dirty({
        ...state,
        pgCrumbs: 0,
        pgRaccoons: 0,
        pgPerSec: 0,
        ownedUpgrades: [],
      });
    case 'tick':
      // Tick changes pgCrumbs continuously; don't spam save state.
      return { ...state, pgCrumbs: state.pgCrumbs + state.pgPerSec / 5 };
    case 'assetStart':
      return {
        ...state,
        generating: { ...state.generating, [action.slotId]: true },
        assetErrors: { ...state.assetErrors, [action.slotId]: '' },
      };
    case 'assetDone': {
      const { [action.slotId]: _gone, ...restGen } = state.generating;
      return dirty({
        ...state,
        generating: restGen,
        assets: { ...state.assets, [action.slotId]: action.image },
        assetErrors: { ...state.assetErrors, [action.slotId]: '' },
      });
    }
    case 'assetError': {
      const { [action.slotId]: _gone, ...restGen } = state.generating;
      return {
        ...state,
        generating: restGen,
        assetErrors: { ...state.assetErrors, [action.slotId]: action.error },
      };
    }
    case 'assetClear': {
      const { [action.slotId]: _gone, ...restAssets } = state.assets;
      const { [action.slotId]: _err, ...restErr } = state.assetErrors;
      return dirty({ ...state, assets: restAssets, assetErrors: restErr });
    }
    case 'setProjects':
      return { ...state, projects: action.projects };
    case 'loadProject': {
      const p = action.project;
      return {
        ...state,
        projectId: p.id,
        concept: { ...SAMPLE_CONCEPT, ...p.concept },
        pgCrumbs: p.playground?.pgCrumbs ?? 0,
        pgRaccoons: p.playground?.pgRaccoons ?? 0,
        pgPerSec: p.playground?.pgPerSec ?? 0,
        ownedUpgrades: p.playground?.ownedUpgrades ?? [],
        assets: p.assets || {},
        assetErrors: {},
        generating: {},
        saveState: 'saved',
        saveError: null,
        lastSavedAt: Date.now(),
      };
    }
    case 'setSaveState':
      return {
        ...state,
        saveState: action.saveState,
        saveError: action.error ?? null,
        lastSavedAt: action.lastSavedAt ?? state.lastSavedAt,
      };
    case 'markDirty':
      return { ...state, saveState: 'dirty' };
    case 'setProjectModal':
      return { ...state, projectModalOpen: action.open };
    case 'setLoadingProject':
      return { ...state, loadingProject: action.loading };
    default:
      return state;
  }
}

const initial: AppState = {
  activeTab: 'landing',
  concept: SAMPLE_CONCEPT,
  currencies: SAMPLE_CURRENCIES,
  generators: SAMPLE_GENERATORS,
  upgrades: SAMPLE_UPGRADES,
  creatures: SAMPLE_CREATURES,
  imports: [],
  messages: SAMPLE_COMPANION_MESSAGES,
  companionOpen: false,
  pgCrumbs: 0,
  pgRaccoons: 0,
  pgPerSec: 0,
  ownedUpgrades: [],
  assets: {},
  generating: {},
  assetErrors: {},
  projectId: null,
  projects: [],
  saveState: 'idle',
  saveError: null,
  lastSavedAt: null,
  projectModalOpen: false,
  loadingProject: false,
};

interface AppContextValue extends AppState {
  setTab: (t: TabKey) => void;
  updateConcept: (p: Partial<GameConcept>) => void;
  toggleSystem: (s: string) => void;
  addImport: (f: ImportedFile) => void;
  removeImport: (id: string) => void;
  addMessage: (m: CompanionMessage) => void;
  setCompanionOpen: (o: boolean) => void;
  tap: (amount?: number) => void;
  buyRaccoon: () => void;
  buyUpgrade: (id: string) => void;
  prestige: () => void;
  raccoonCost: () => number;
  next: () => void;
  prev: () => void;
  generateAsset: (slotId: string, label: string, prompt: string) => Promise<void>;
  clearAsset: (slotId: string) => void;
  // Project / persistence
  refreshProjects: () => Promise<void>;
  openProject: (id: string) => Promise<void>;
  newProject: (title?: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  renameProject: (title: string) => void;
  saveNow: () => Promise<void>;
  setProjectModalOpen: (open: boolean) => void;
}

const Ctx = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  // Idle tick
  useTick(() => dispatch({ type: 'tick' }), state.pgPerSec > 0);

  const setTab = useCallback((t: TabKey) => dispatch({ type: 'setTab', tab: t }), []);
  const updateConcept = useCallback((p: Partial<GameConcept>) => dispatch({ type: 'updateConcept', patch: p }), []);
  const toggleSystem = useCallback((s: string) => dispatch({ type: 'toggleSystem', system: s }), []);
  const addImport = useCallback((f: ImportedFile) => dispatch({ type: 'addImport', file: f }), []);
  const removeImport = useCallback((id: string) => dispatch({ type: 'removeImport', id }), []);
  const addMessage = useCallback((m: CompanionMessage) => dispatch({ type: 'addMessage', message: m }), []);
  const setCompanionOpen = useCallback((o: boolean) => dispatch({ type: 'setCompanionOpen', open: o }), []);
  const tap = useCallback((a?: number) => dispatch({ type: 'tapCrumbs', amount: a }), []);
  const buyRaccoon = useCallback(() => dispatch({ type: 'buyRaccoon' }), []);
  const buyUpgrade = useCallback((id: string) => dispatch({ type: 'buyUpgrade', id }), []);
  const prestige = useCallback(() => dispatch({ type: 'prestige' }), []);

  const raccoonCost = useCallback(
    () => Math.floor(15 * Math.pow(1.15, state.pgRaccoons)),
    [state.pgRaccoons]
  );

  const next = useCallback(() => {
    const i = TAB_KEYS.indexOf(state.activeTab);
    if (i < TAB_KEYS.length - 1) dispatch({ type: 'setTab', tab: TAB_KEYS[i + 1] });
  }, [state.activeTab]);
  const prev = useCallback(() => {
    const i = TAB_KEYS.indexOf(state.activeTab);
    if (i > 0) dispatch({ type: 'setTab', tab: TAB_KEYS[i - 1] });
  }, [state.activeTab]);

  const generateAsset = useCallback(
    async (slotId: string, label: string, prompt: string) => {
      dispatch({ type: 'assetStart', slotId });
      try {
        const base =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          (process.env.REACT_APP_BACKEND_URL as string) ||
          '';
        const res = await fetch(`${base}/api/assets/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId,
            label,
            prompt,
            conceptTitle: state.concept.title,
            conceptTheme: state.concept.theme,
            conceptTone: state.concept.tone,
          }),
        });
        if (!res.ok) {
          const detail = await res.text();
          throw new Error(detail.slice(0, 200) || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as { image: string };
        if (!data.image) throw new Error('Empty response');
        dispatch({ type: 'assetDone', slotId, image: data.image });
      } catch (e: any) {
        dispatch({
          type: 'assetError',
          slotId,
          error: e?.message || 'Generation failed',
        });
      }
    },
    [state.concept.title, state.concept.theme, state.concept.tone]
  );

  const clearAsset = useCallback(
    (slotId: string) => dispatch({ type: 'assetClear', slotId }),
    []
  );

  // ---- Projects ----

  const refreshProjects = useCallback(async () => {
    try {
      const list = await ProjectAPI.list();
      dispatch({ type: 'setProjects', projects: list });
    } catch (e) {
      // Non-fatal: keep prior list
      console.warn('Failed to refresh projects', e);
    }
  }, []);

  const openProject = useCallback(async (id: string) => {
    dispatch({ type: 'setLoadingProject', loading: true });
    try {
      const p = await ProjectAPI.get(id);
      dispatch({ type: 'loadProject', project: p });
    } catch (e: any) {
      dispatch({ type: 'setSaveState', saveState: 'error', error: e?.message || 'Load failed' });
    } finally {
      dispatch({ type: 'setLoadingProject', loading: false });
    }
  }, []);

  const newProject = useCallback(async (title?: string) => {
    dispatch({ type: 'setLoadingProject', loading: true });
    try {
      const created = await ProjectAPI.create({
        title: title || 'Untitled Sketch',
        concept: {
          ...SAMPLE_CONCEPT,
          title: title || 'Untitled Sketch',
          theme: 'Cozy Bakery',
          systems: [],
          freeText: '',
        },
      } as any);
      dispatch({ type: 'loadProject', project: created });
      await refreshProjects();
    } catch (e: any) {
      dispatch({ type: 'setSaveState', saveState: 'error', error: e?.message || 'Create failed' });
    } finally {
      dispatch({ type: 'setLoadingProject', loading: false });
    }
  }, [refreshProjects]);

  const duplicateProject = useCallback(async (id: string) => {
    try {
      const copy = await ProjectAPI.duplicate(id);
      await refreshProjects();
      dispatch({ type: 'loadProject', project: copy });
    } catch (e: any) {
      dispatch({ type: 'setSaveState', saveState: 'error', error: e?.message || 'Duplicate failed' });
    }
  }, [refreshProjects]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await ProjectAPI.remove(id);
      await refreshProjects();
      // If we deleted the current project, load the most recently updated one.
      if (state.projectId === id) {
        const list = await ProjectAPI.list();
        if (list.length > 0) {
          await openProject(list[0].id);
        } else {
          // The backend reseeds when empty — pick whatever it created.
          const list2 = await ProjectAPI.list();
          if (list2.length > 0) await openProject(list2[0].id);
        }
      }
    } catch (e: any) {
      dispatch({ type: 'setSaveState', saveState: 'error', error: e?.message || 'Delete failed' });
    }
  }, [refreshProjects, openProject, state.projectId]);

  const renameProject = useCallback((title: string) => {
    dispatch({ type: 'updateConcept', patch: { title } });
  }, []);

  // Build the payload for save/persist.
  const buildPayload = useCallback(
    (s: AppState) => ({
      title: s.concept.title,
      concept: s.concept,
      playground: {
        pgCrumbs: s.pgCrumbs,
        pgRaccoons: s.pgRaccoons,
        pgPerSec: s.pgPerSec,
        ownedUpgrades: s.ownedUpgrades,
      },
      assets: s.assets,
    }),
    []
  );

  // Latest-state ref so the debounced timer always reads current values.
  const stateRef = useRef(state);
  stateRef.current = state;

  const saveNow = useCallback(async () => {
    const s = stateRef.current;
    if (!s.projectId) return;
    dispatch({ type: 'setSaveState', saveState: 'saving' });
    try {
      await ProjectAPI.update(s.projectId, buildPayload(s) as any);
      dispatch({
        type: 'setSaveState',
        saveState: 'saved',
        lastSavedAt: Date.now(),
        error: null,
      });
      // Refresh list so the sidebar/modal reflects the new updatedAt order
      refreshProjects();
    } catch (e: any) {
      dispatch({
        type: 'setSaveState',
        saveState: 'error',
        error: e?.message || 'Save failed',
      });
    }
  }, [buildPayload, refreshProjects]);

  const setProjectModalOpen = useCallback(
    (open: boolean) => dispatch({ type: 'setProjectModal', open }),
    []
  );

  // Bootstrap: load project list + open the most recent one.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    (async () => {
      try {
        const list = await ProjectAPI.list();
        dispatch({ type: 'setProjects', projects: list });
        if (list.length > 0) {
          await openProject(list[0].id);
        }
      } catch (e) {
        console.warn('Project bootstrap failed', e);
      }
    })();
  }, [openProject]);

  // Auto-save: debounce dirty state for 800ms.
  useEffect(() => {
    if (state.saveState !== 'dirty') return;
    if (!state.projectId) return;
    const t = window.setTimeout(() => {
      saveNow();
    }, 800);
    return () => window.clearTimeout(t);
  }, [state.saveState, state.projectId, saveNow]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setTab,
      updateConcept,
      toggleSystem,
      addImport,
      removeImport,
      addMessage,
      setCompanionOpen,
      tap,
      buyRaccoon,
      buyUpgrade,
      prestige,
      raccoonCost,
      next,
      prev,
      generateAsset,
      clearAsset,
      refreshProjects,
      openProject,
      newProject,
      duplicateProject,
      deleteProject,
      renameProject,
      saveNow,
      setProjectModalOpen,
    }),
    [state, setTab, updateConcept, toggleSystem, addImport, removeImport, addMessage, setCompanionOpen, tap, buyRaccoon, buyUpgrade, prestige, raccoonCost, next, prev, generateAsset, clearAsset, refreshProjects, openProject, newProject, duplicateProject, deleteProject, renameProject, saveNow, setProjectModalOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}

// Internal: tick helper
function useTick(fn: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(fn, 200);
    return () => window.clearInterval(id);
  }, [fn, active]);
}
