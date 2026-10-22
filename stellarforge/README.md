# StellarForge

NASA-inspired science fiction writing assistant. Next.js 14, TypeScript, Tailwind CSS, App Router.

## Setup

```bash
cd stellarforge
cp .env.example .env
# Add your OpenAI API key to .env:
# OPENAI_API_KEY=sk-...
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Home** — Hero, CTA, feature cards (Scientific Scene Enhancement, Term Explorer, Realism Analyzer)
- **Write Studio** (`/write`) — Scene textarea, “Enhance with Scientific Realism” → OpenAI-backed suggestions
- **Term Explorer** (`/terms`) — Search/filter 20 NASA/sci‑fi terms with definitions
- **Realism Checker** (`/realism`) — “Analyze Scientific Plausibility” → analysis text + 1–10 score + meter

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind
- Dark space theme, starfield background, glow accents, mobile-friendly
- Edge API routes: `/api/enhance`, `/api/realism` (require `OPENAI_API_KEY`)

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Run production server
- `npm run lint` — ESLint
