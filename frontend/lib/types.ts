export type GameType =
  | 'Classic clicker'
  | 'Generator / automation idle'
  | 'Combat idle'
  | 'Hero / party idle RPG'
  | 'Creature / pet collector idle'
  | 'Merge idle'
  | 'Tycoon idle'
  | 'Resource chain idle'
  | 'Prestige-heavy incremental'
  | 'Narrative idle'
  | 'Cozy idle'
  | 'Dark fantasy idle'
  | 'Sci-fi idle'
  | 'Absurd / comedy idle';

export interface GameConcept {
  title: string;
  theme: string;
  gameType: GameType;
  coreFantasy: string;
  mainAction: string;
  progressionStyle: string;
  currencyModel: string;
  systems: string[];
  tone: string;
  freeText: string;
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  tier: 'soft' | 'hard' | 'prestige';
  flavor: string;
}

export interface Generator {
  id: string;
  name: string;
  produces: string;
  baseCost: number;
  costCurrency: string;
  productionRate: string;
  unlock: string;
  flavor: string;
}

export interface Upgrade {
  id: string;
  name: string;
  effect: string;
  cost: number;
  costCurrency: string;
  tint: 'blue' | 'green' | 'gold' | 'red' | 'lavender';
  flavor: string;
}

export interface Creature {
  id: string;
  name: string;
  kind: 'pet' | 'enemy' | 'boss';
  emoji: string;
  doodle: string; // svg path or fallback emoji
  flavor: string;
}

export interface ImportedFile {
  id: string;
  name: string;
  kind: 'json' | 'md' | 'image' | 'invalid';
  size: number;
  preview: string; // for image: dataURL; for json/md: text
  mime: string;
  addedAt: number;
}

export interface CompanionMessage {
  id: string;
  from: 'mate' | 'you';
  text: string;
  tone?: 'tip' | 'idea' | 'warn' | 'review';
  ts: number;
}
