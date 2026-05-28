import type {
  GameConcept,
  Currency,
  Generator,
  Upgrade,
  Creature,
  CompanionMessage,
} from './types';

export const GAME_TYPES = [
  'Classic clicker',
  'Generator / automation idle',
  'Combat idle',
  'Hero / party idle RPG',
  'Creature / pet collector idle',
  'Merge idle',
  'Tycoon idle',
  'Resource chain idle',
  'Prestige-heavy incremental',
  'Narrative idle',
  'Cozy idle',
  'Dark fantasy idle',
  'Sci-fi idle',
  'Absurd / comedy idle',
] as const;

export const THEMES = [
  'Cozy Bakery',
  'Haunted Forest',
  'Goblin Market',
  'Deep Space Tea Lounge',
  'Underground Library',
  'Cursed Carnival',
  'Mossy Wizard Tower',
  'Tiny Robot Workshop',
];

export const CORE_FANTASIES = [
  'Watch a tiny world grow without you',
  'Become absurdly powerful from one click',
  'Run a chaotic but loveable business',
  'Befriend strange creatures',
  'Decode the secrets of a weird realm',
  'Hoard increasingly ridiculous resources',
];

export const MAIN_ACTIONS = ['Tap', 'Bake', 'Forage', 'Brew', 'Summon', 'Mine', 'Chant'];
export const PROGRESSION_STYLES = ['Linear', 'Prestige loops', 'Branching tech', 'Map zones', 'Story chapters'];
export const CURRENCY_MODELS = ['Single', 'Soft + Hard', 'Soft + Hard + Prestige', 'Resource chain'];
export const TONES = ['Cozy', 'Spooky', 'Silly', 'Wholesome chaos', 'Serene', 'Snarky'];

export const SYSTEMS = [
  'Pets',
  'Bosses',
  'Achievements',
  'Prestige',
  'Offline earnings',
  'Quests',
  'Zones',
  'Skills',
  'Equipment',
] as const;

export const SAMPLE_CONCEPT: GameConcept = {
  title: 'Cursed Muffin Raccoons',
  theme: 'Cozy Bakery',
  gameType: 'Absurd / comedy idle',
  coreFantasy: 'Run a chaotic but loveable business',
  mainAction: 'Bake',
  progressionStyle: 'Prestige loops',
  currencyModel: 'Soft + Hard + Prestige',
  systems: ['Pets', 'Bosses', 'Achievements', 'Prestige', 'Offline earnings'],
  tone: 'Wholesome chaos',
  freeText:
    'A cozy absurd idle game where raccoons run a magical bakery, automate cursed muffin production, hire woodland helpers, battle pastry ghosts, and prestige into Golden Muffins.',
};

export const SAMPLE_CURRENCIES: Currency[] = [
  { id: 'crumbs', name: 'Crumbs', symbol: '◍', tier: 'soft', flavor: 'Tiny crumbs swept up from the bakery floor.' },
  { id: 'sugar-stars', name: 'Sugar Stars', symbol: '✦', tier: 'hard', flavor: 'Glittering reward from completing recipes.' },
  { id: 'golden-muffins', name: 'Golden Muffins', symbol: '✺', tier: 'prestige', flavor: 'Achieved by re-baking the entire bakery from scratch.' },
];

export const SAMPLE_GENERATORS: Generator[] = [
  {
    id: 'raccoon-baker',
    name: 'Raccoon Baker',
    produces: 'Crumbs',
    baseCost: 15,
    costCurrency: 'Crumbs',
    productionRate: '+1.2 / sec',
    unlock: 'From the start',
    flavor: 'Wears a tiny apron. Bites the dough sometimes.',
  },
  {
    id: 'haunted-oven',
    name: 'Haunted Oven',
    produces: 'Crumbs',
    baseCost: 220,
    costCurrency: 'Crumbs',
    productionRate: '+9 / sec',
    unlock: 'Unlock at 100 Crumbs',
    flavor: 'Bakes at exactly 666°F. Smells suspicious.',
  },
  {
    id: 'sprinkle-mixer',
    name: 'Sprinkle Mixer',
    produces: 'Sugar Stars',
    baseCost: 5,
    costCurrency: 'Sugar Stars',
    productionRate: '+0.4 / sec',
    unlock: 'Unlock after first recipe',
    flavor: 'Mixes ambient color. Slightly possessed.',
  },
  {
    id: 'moonlit-cart',
    name: 'Moonlit Delivery Cart',
    produces: 'Crumbs',
    baseCost: 3400,
    costCurrency: 'Crumbs',
    productionRate: '+110 / sec',
    unlock: 'Defeat Pastry Ghost',
    flavor: 'Pulled by a confused but charming goat.',
  },
  {
    id: 'elderberry-book',
    name: 'Elderberry Recipe Book',
    produces: 'Sugar Stars',
    baseCost: 80,
    costCurrency: 'Sugar Stars',
    productionRate: '+2.5 / sec',
    unlock: 'Prestige x1',
    flavor: 'Whispers recipes you never asked for.',
  },
];

export const SAMPLE_UPGRADES: Upgrade[] = [
  { id: 'big-bowl', name: 'Bigger Mixing Bowl', effect: '+25% Crumb output', cost: 150, costCurrency: 'Crumbs', tint: 'blue', flavor: 'Holds suspicious amounts of dough.' },
  { id: 'whisk', name: 'Suspiciously Efficient Whisk', effect: 'Raccoon Bakers x2', cost: 600, costCurrency: 'Crumbs', tint: 'green', flavor: 'It hums when no one is looking.' },
  { id: 'aprons', name: 'Ghost-Proof Aprons', effect: '+15% boss damage', cost: 12, costCurrency: 'Sugar Stars', tint: 'gold', flavor: 'Slightly haunted, but in a polite way.' },
  { id: 'double-baked', name: 'Double-Baked Automation', effect: 'Generators tick 2x faster', cost: 40, costCurrency: 'Sugar Stars', tint: 'red', flavor: 'Crispier crusts. More chaos.' },
  { id: 'multiplier', name: 'Muffin Multiplier', effect: 'All production x1.5', cost: 1, costCurrency: 'Golden Muffins', tint: 'lavender', flavor: 'A small reward for hubris.' },
];

export const SAMPLE_CREATURES: Creature[] = [
  { id: 'crumb-sniffer', name: 'Crumb Sniffer', kind: 'pet', emoji: '🐿️', doodle: 'sniffer', flavor: 'Finds bonus crumbs every 30s.' },
  { id: 'tiny-apron', name: 'Tiny Apron Raccoon', kind: 'pet', emoji: '🦝', doodle: 'apron', flavor: 'Boosts Raccoon Baker speed by 10%.' },
  { id: 'sugar-moth', name: 'Sugar Moth', kind: 'pet', emoji: '🦋', doodle: 'moth', flavor: 'Drawn to recipe completions.' },
  { id: 'pastry-ghost', name: 'Pastry Ghost', kind: 'enemy', emoji: '👻', doodle: 'ghost', flavor: 'Steals 5% of your Crumbs.' },
  { id: 'burnt-imp', name: 'Burnt Biscuit Imp', kind: 'enemy', emoji: '🍪', doodle: 'imp', flavor: 'Smells of regret and butter.' },
  { id: 'dough-blob', name: 'Dough Blob', kind: 'enemy', emoji: '🫧', doodle: 'blob', flavor: 'Surprisingly tanky.' },
  { id: 'muffin-wraith', name: 'The Muffin Wraith', kind: 'boss', emoji: '🧁', doodle: 'wraith', flavor: 'Once Head Pastry Chef. Now... bigger.' },
];

export const SAMPLE_LOOP_NODES = [
  { id: 'tap', label: 'Tap Oven', color: 'crayonBlue' },
  { id: 'earn', label: 'Earn Crumbs', color: 'honey' },
  { id: 'hire', label: 'Hire Raccoon Bakers', color: 'moss' },
  { id: 'recipes', label: 'Unlock Recipes', color: 'lavender' },
  { id: 'defeat', label: 'Defeat Pastry Ghosts', color: 'coral' },
  { id: 'muffins', label: 'Earn Golden Muffins', color: 'honey' },
  { id: 'prestige', label: 'Prestige → Bigger Bakery', color: 'lavender' },
];

export const SAMPLE_COMPANION_MESSAGES: CompanionMessage[] = [
  { id: 'm1', from: 'mate', text: 'Your loop is clear, but the first upgrade should arrive sooner — try at 60 Crumbs.', tone: 'tip', ts: Date.now() - 9000 },
  { id: 'm2', from: 'mate', text: 'Want me to make this game cozier, weirder, or more combat-heavy?', tone: 'idea', ts: Date.now() - 6000 },
  { id: 'm3', from: 'mate', text: 'Your prestige currency has a strong hook: Golden Muffins ✺', tone: 'tip', ts: Date.now() - 3000 },
  { id: 'm4', from: 'mate', text: 'I can review imported JSON once the real integration is connected.', tone: 'review', ts: Date.now() - 1000 },
];

export const COMPANION_PROMPTS = [
  'Improve my loop',
  'Make it grindier',
  'Add a weird pet',
  'Suggest bosses',
  'Review my imports',
  'Prepare export plan',
];

export const PACING_NOTES = [
  'First click → first generator unlock around 8s',
  'First upgrade should land before 60s of play',
  'First prestige opportunity ~ 25min mark',
  'Offline cap at 6 hours, scaled by Lullaby Lantern',
];

export const EXPORT_OPTIONS = [
  { id: 'design-doc', title: 'Design Doc', desc: 'Hand-bound game design notes, ready to share.', status: 'Mock only', icon: 'BookText' },
  { id: 'json-config', title: 'JSON Config', desc: 'A single config.json describing your full game.', status: 'Ready later', icon: 'Braces' },
  { id: 'browser-proto', title: 'Browser Prototype', desc: 'A tiny HTML build you can play in the browser.', status: 'Mock only', icon: 'Globe2' },
  { id: 'godot', title: 'Godot Starter', desc: 'A Godot project skeleton wired to your config.', status: 'Planned', icon: 'Boxes' },
  { id: 'unity', title: 'Unity Starter', desc: 'A Unity package matching your loop & economy.', status: 'Planned', icon: 'Package' },
  { id: 'unreal', title: 'Unreal Research', desc: 'Notes on bringing this loop into Unreal.', status: 'Planned', icon: 'FileSearch' },
  { id: 'asset-pack', title: 'Asset Pack', desc: 'A neat folder of placeholder doodles and icons.', status: 'Mock only', icon: 'FolderArchive' },
] as const;
