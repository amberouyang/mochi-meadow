# Mochi Meadow

Desktop study companion that turns focus time into a cozy virtual meadow of mochi pets.

Built with Electron, React, TypeScript, Vite, and Zustand.

## Features

| Area | Description |
|------|-------------|
| Study timer | Daily hours + minutes goal, start/stop sessions, earn points per minute |
| Tasks | Create, complete, and remove to-dos; completions award points |
| Points | Shared currency for the store and pet care (feeding) |
| Meadow | Unlocks when the daily study goal is met or all tasks are done |
| Onboarding | Name + welcome points; clear rocks on first visit to welcome your first mochi |
| Pets | Idle bounce, blink, and wander; click to view energy and feed |
| Store | Buy mochi eggs (Sakura, Matcha, Yuzu, Sesame) and Meadow Mist |
| Nest | Barn scene with pet collection shelf and a straw hatching bed |
| Egg incubation | Bought eggs warm in the nest as you study/earn points, then hatch into new pets |
| Brain-rot fog | Miss a full calendar day of studying; buy Meadow Mist to clear it |
| Settings | Player name, study goal default, mute, and full progress reset |
| Progress save | Points, pets, tasks, nest eggs, and tutorial progress persist in localStorage |
| Controls | Bottom dock: Tasks, Study, Nest, Store, Storage, Settings (+ Friends/Board/Rooms soon) |

## Tech stack

| Layer | Choice |
|-------|--------|
| Desktop shell | Electron |
| UI | React 18, TypeScript |
| Bundler | Vite |
| State | Zustand |

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the Vite dev server and launches the Electron window.

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Electron + Vite (primary development) |
| `npm run dev:vite` | Vite only; open http://localhost:5173 in a browser |
| `npm run build` | Typecheck and production build to `dist/` |
| `npm start` | Build, then run Electron against the production build |

## Project structure

```
Mochi-Meadow/
├── electron/              # Electron main process and windows
├── src/
│   ├── components/        # Meadow, nest, pets, dock, panels
│   ├── store/             # Zustand store
│   ├── utils/             # Progress save, study streak, settings
│   ├── assets/            # Art and audio
│   ├── types.ts
│   └── App.tsx
├── index.html
├── package.json
└── README.md
```

## How progress works

1. Study with the timer and/or complete tasks to earn points.
2. Meeting the daily study goal **or** finishing all tasks unlocks the meadow.
3. First time: clear rocks, then the first mochi moves in.
4. Buy an egg in the Store; it incubates in Nest as you keep studying.
5. Progress (points, pets, eggs, tutorial) saves locally between sessions.

## Roadmap

- **Mochi Meadow Online** — accounts, cloud save, API (Auth0 + Postgres)
- Friends can visit each other’s meadows
- Study rooms / presence
- Always-on-top pet reminder overlays
- Meadow upgrades and richer pet care
