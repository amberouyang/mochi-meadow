# Mochi Meadow

Desktop study companion that rewards focused work with a small virtual meadow. Completing study time and tasks earns points, unlocks the garden, and lets a cloud mochi settle in and grow with you.

Built with Electron, React, TypeScript, and Vite.

## Features

| Area | Description |
|------|-------------|
| Study timer | Set a daily hours + minutes goal, start/stop sessions, earn points per minute |
| Tasks | Create, complete, and remove to-dos; completions award points |
| Points | Shared currency for the store and pet care (feeding) |
| Meadow | Unlocks when the daily study goal is met or all tasks are done |
| Brain-rot fog | Miss a full calendar day of studying and dark fog blocks pet care until you buy Meadow Mist |
| Onboarding | Clear debris on first visit; the first mochi appears once the meadow is clean |
| Pets | Idle bounce, blink, and wander; click to view energy and feed |
| Meadow Nest | Collection shelf for unlocked pets, locked perches, and a hatching nest |
| Controls | Bottom dock for Tasks, Study, Nest, Store, plus placeholders for Friends, Board, and Rooms |

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
│   ├── components/        # Meadow, pets, dock, study/task panels
│   ├── store/             # Zustand store (study, tasks, points, pets, tutorial)
│   ├── assets/            # Art and audio
│   ├── types.ts
│   └── App.tsx            # Routing for main / sidebar / overlay views
├── index.html
├── package.json
└── README.md
```

## How progress works

1. Study with the timer and/or complete tasks to earn points.
2. Meeting the daily study goal **or** finishing all tasks unlocks the meadow.
3. First time in the meadow: clear rocks, then the first mochi moves in.
4. Keep studying to fill the hatching nest; spend points in the store and on feeding.

## Roadmap

- Persist progress between sessions
- Enable always on top pet reminder overlays
- Friends list and presence
- Study scoreboard
- Shared online study rooms
- Meadow upgrades and richer pet care