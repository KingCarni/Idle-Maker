# Idle Maker — Sketchbook Studio

## Original problem statement (verbatim)
Build the first UI-focused shell and interaction prototype for Idle Maker — a
browser-based AI workbench for designing, balancing, prototyping, and exporting
idle/clicker/incremental games. First pass focuses on the app shell, visual
identity (cozy "Sketchbook Studio"), navigation, core interactions, local mock
data, and import/export affordances. NO auth, NO DB, NO billing, NO real AI,
NO production exporters. Sample mock game: **Cursed Muffin Raccoons**.

## User choices (from ask_human)
- Tech stack: **Next.js 14 (App Router) + TypeScript + Tailwind**
- Backend: thin **FastAPI** serving mock data
- AI Companion: **mock canned responses** (Mod-Mate)
- Typography: **Fraunces (display) + Nunito (UI) + JetBrains Mono (numbers) + Caveat (sparingly)**
- Special touch: **fun themed custom cursor** (pencil default / raccoon-paw on hover / closed paw on drag / ink nib on text fields)

## Architecture
- `/app/frontend` — Next.js 14, App Router, TS, Tailwind
  - `app/page.tsx` mounts `<AppProvider><AppShell/></AppProvider>` (client-only)
  - State lives in `components/AppContext.tsx` (single `useReducer`)
  - 9 sections under `components/sections/`
  - Custom cursor in `components/CustomCursor.tsx`
- `/app/backend/server.py` — FastAPI with `/api/health` and `/api/mock-data` (mock game payload) + legacy `/api/status` CRUD
- Mock data lives in `lib/mockData.ts`; types in `lib/types.ts`

## What's implemented (2026-01)
- ✅ App shell with topbar, notebook tabs, content pane, footer prev/next
- ✅ All 9 sections: Landing, Idea, Loop, Economy, Upgrades, Creatures, Assets, Playground, Export
- ✅ Persistent **Project Tray** with current-game summary + import dropzone
- ✅ **Mod-Mate Companion** drawer with seed messages, canned replies, free-text input, 6 quick-prompt buttons, spiral-notebook header
- ✅ **Custom cursor** with mode-aware variants (pencil / paw / ink nib) + trailing ink dot
- ✅ Client-side **Import Dropzone** for JSON/MD/PNG/JPG/JPEG/WEBP/SVG with previews (JSON pretty-printed, MD plaintext, image thumbnails) and friendly sketchbook warning for invalid files
- ✅ **Idea page** concept builder: dropdowns, chip groups, sticker-tag system toggles, free-text
- ✅ **Loop Sketch** with hand-positioned nodes + animated dashed SVG arrows
- ✅ **Economy Notes** with currency cards + JetBrains Mono generator table
- ✅ **Upgrade Stickers** with peel-styled sticker cards + systems toggles
- ✅ **Creature Doodles** as index-card gallery (pets/enemies/bosses)
- ✅ **Asset Kit** with 10 placeholder slots (3 prefilled with mock images) + imports gallery
- ✅ **Prototype Playground** — clickable oven, idle ticks, geometric-cost raccoon buy, 5 upgrades with real effects, prestige reset, pacing notes
- ✅ **Export Folder** — 7 manila-folder cards with status badges + Pack Kit summary
- ✅ Sketchbook UI primitives: PaperCard, StickerTag, StickyNote, NotebookTabs, doodles (SketchArrow/Star/Asterisk/Scribble/Underline)
- ✅ Custom Tailwind theme: paper/card/sticky/ink/pencil + 5 accent colors, wobble border radius, pencil + ink box shadows, washi-tape decorator, dot-grid background
- ✅ Backend `/api/health` + `/api/mock-data` endpoints (legacy `/api/status` retained)
- ✅ data-testid coverage on every interactive element
- ✅ Production build passes (`yarn build` clean)
- ✅ Test report iteration_1: backend 8/8 pytest, frontend 100% on isolated re-test, no bugs

## Backlog / Next Phase (P0 → P2)
P0 — Real systems
- Wire **real Mod-Mate** via Emergent LLM key (Claude/GPT/Gemini) with streaming
- Persist projects (currently single in-memory concept) — MongoDB models for projects, generators, upgrades
- Save / load / list multiple game projects
- Sharable read-only project links

P1 — Production polish
- Real JSON Config exporter (download a single config.json)
- Browser Prototype export (HTML + JS bundle)
- Markdown design-doc export
- Asset Pack zip (group imported + generated assets)
- AI image generation for asset slots (Gemini Nano Banana)
- Drag-to-rearrange loop nodes; auto-routed arrows

P2 — Studio extras
- Godot / Unity starter project export scaffolds
- Idle game balancing simulator (run N minutes, plot curves)
- Multiplayer sketchbook (shared notebook page)
- Mobile sketchbook view

## Notes
- Frontend env: `NEXT_PUBLIC_BACKEND_URL` (mirrors `REACT_APP_BACKEND_URL`)
- All AI replies are MOCKED via canned map in `CompanionPanel.tsx`
- All export downloads are MOCKED (buttons disabled)
- The `cursor: none` on html is intentional; touch devices get native cursor back via media query
