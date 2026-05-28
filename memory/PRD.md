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
- ✅ Persistent **Project Tray** with current-game summary, project count chip, + import dropzone
- ✅ **Mod-Mate Companion** drawer with seed messages, canned replies, free-text input, 6 quick-prompt buttons, spiral-notebook header
- ✅ **Custom cursor** with mode-aware variants (pencil / paw / ink nib) + trailing ink dot
- ✅ Client-side **Import Dropzone** for JSON/MD/PNG/JPG/JPEG/WEBP/SVG with previews and friendly sketchbook warning
- ✅ **Idea page** concept builder
- ✅ **Loop Sketch**, **Economy Notes**, **Upgrade Stickers**, **Creature Doodles**, **Asset Kit**, **Prototype Playground**, **Export Folder**
- ✅ **Real Nano Banana image generation** wired into Asset Kit (Emergent LLM key, `gemini-3.1-flash-image-preview`)
- ✅ **MongoDB-backed multi-project persistence**:
  - Backend: `Project` / `GameConcept` / `PlaygroundState` Pydantic models + CRUD endpoints (`GET/POST/PUT/DELETE /api/projects`, `POST /api/projects/{id}/duplicate`)
  - Idempotent **startup seed** of "Cursed Muffin Raccoons" when the collection is empty; **reseed on delete-everything** so the workspace is never empty
  - Project summaries include `systemsCount` / `assetsCount` / timestamps for fast list rendering
  - PUT supports partial updates (title, concept, playground, assets) with timestamp bump
- ✅ Frontend persistence UX:
  - Topbar **project chip** + **save-state pill** (idle / dirty / saving / saved / error) + manual **Save** button
  - **Auto-save**: 800ms debounce after any concept/system/playground/asset change
  - **Dedicated ProjectModal** with search, "New project" inline form, per-card Open / Duplicate / Delete-with-confirm
  - Bootstrap on app load: fetch `/api/projects` → auto-open most recently updated
  - Per-project state lives in AppContext; loadProject swaps concept + playground + assets atomically without flagging dirty
- ✅ Sketchbook UI primitives, custom Tailwind theme, full data-testid coverage
- ✅ Production build passes (`yarn build` clean)
- ✅ Test reports:
  - iteration_1 — backend 8/8, frontend 100% (initial MVP)
  - iteration_2 — backend 11/11 (+3 asset-gen tests), frontend 100% (Nano Banana)
  - iteration_3 — backend 20/20 (+12 project tests), frontend 100% (project persistence)

## Backlog / Next Phase (P0 → P2)
P0 — Real systems
- Wire **real Mod-Mate** via Emergent LLM key (Claude/GPT/Gemini) with streaming
- Sharable read-only project links (URL-shareable snapshots)

P1 — Production polish
- Real JSON Config exporter (download a single config.json — schema already lives in `Project` model)
- Browser Prototype export (HTML + JS bundle)
- Markdown design-doc export
- Asset Pack zip (bundle generated Nano Banana outputs + imports)
- Drag-to-rearrange loop nodes; auto-routed arrows
- Persist edited Asset-Kit slot prompts (currently session-local; lift into Project)
- Persist imported files into the project (currently session-local — would need GridFS or object-storage for blobs)

P2 — Studio extras
- Godot / Unity starter project export scaffolds
- Idle balancing simulator (run-N-minutes preview with curve plots)
- Multiplayer sketchbook (shared notebook page)
- Mobile sketchbook view

## Notes
- Frontend env: `NEXT_PUBLIC_BACKEND_URL` (mirrors `REACT_APP_BACKEND_URL`)
- All AI replies are MOCKED via canned map in `CompanionPanel.tsx`
- All export downloads are MOCKED (buttons disabled)
- The `cursor: none` on html is intentional; touch devices get native cursor back via media query
