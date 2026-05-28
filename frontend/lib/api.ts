import type { GameConcept } from './types';
import { backendUrl } from './utils';

export interface ProjectSummary {
  id: string;
  title: string;
  theme: string;
  gameType: string;
  tone: string;
  systemsCount: number;
  assetsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaygroundState {
  pgCrumbs: number;
  pgRaccoons: number;
  pgPerSec: number;
  ownedUpgrades: string[];
}

export interface Project {
  id: string;
  title: string;
  concept: GameConcept;
  playground: PlaygroundState;
  assets: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

function api(path: string) {
  return `${backendUrl()}${path}`;
}

async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text.slice(0, 200) || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const ProjectAPI = {
  list: () => jsonFetch<ProjectSummary[]>(api('/api/projects')),
  get: (id: string) => jsonFetch<Project>(api(`/api/projects/${id}`)),
  create: (body: Partial<Project>) =>
    jsonFetch<Project>(api('/api/projects'), { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Project>) =>
    jsonFetch<Project>(api(`/api/projects/${id}`), {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    jsonFetch<{ ok: boolean }>(api(`/api/projects/${id}`), { method: 'DELETE' }),
  duplicate: (id: string) =>
    jsonFetch<Project>(api(`/api/projects/${id}/duplicate`), { method: 'POST' }),
};
