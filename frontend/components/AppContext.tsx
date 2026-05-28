'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
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
  | { type: 'tick' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setTab':
      return { ...state, activeTab: action.tab };
    case 'updateConcept':
      return { ...state, concept: { ...state.concept, ...action.patch } };
    case 'toggleSystem': {
      const s = state.concept.systems.includes(action.system)
        ? state.concept.systems.filter((x) => x !== action.system)
        : [...state.concept.systems, action.system];
      return { ...state, concept: { ...state.concept, systems: s } };
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
      return { ...state, pgCrumbs: state.pgCrumbs + (action.amount ?? 1) };
    case 'buyRaccoon': {
      const cost = Math.floor(15 * Math.pow(1.15, state.pgRaccoons));
      if (state.pgCrumbs < cost) return state;
      return {
        ...state,
        pgCrumbs: state.pgCrumbs - cost,
        pgRaccoons: state.pgRaccoons + 1,
        pgPerSec: +(state.pgPerSec + 1.2).toFixed(2),
      };
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
      return {
        ...state,
        pgCrumbs: crumbs,
        pgPerSec: perSec,
        ownedUpgrades: [...state.ownedUpgrades, action.id],
      };
    }
    case 'prestige':
      return {
        ...state,
        pgCrumbs: 0,
        pgRaccoons: 0,
        pgPerSec: 0,
        ownedUpgrades: [],
      };
    case 'tick':
      return {
        ...state,
        pgCrumbs: state.pgCrumbs + state.pgPerSec / 5, // 200ms tick
      };
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
    }),
    [state, setTab, updateConcept, toggleSystem, addImport, removeImport, addMessage, setCompanionOpen, tap, buyRaccoon, buyUpgrade, prestige, raccoonCost, next, prev]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}

// Internal: tick helper
import { useEffect } from 'react';
function useTick(fn: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(fn, 200);
    return () => window.clearInterval(id);
  }, [fn, active]);
}
