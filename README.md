<<<<<<< HEAD
# chronicles
=======
# Chronicles

**Chronicles** is a local-first visual archive for exploring connections across listening history and transaction records. It presents a small sample dataset as an interactive constellation, a moving archive stream, and a guided story.
- Responsive desktop and mobile layouts
- Reduced-motion support
- Local-only sample data; no archive records are sent to an API
- Framer Motion and GSAP
- Lucide icons
- Express static production server

## Run locally

Install dependencies with the package manager specified in `package.json`:

```bash
pnpm install
pnpm dev
```

If pnpm is not available, npm also works with the existing local dependencies:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm check` | Type-check without emitting files |
| `pnpm build` | Create the frontend and server production build |
| `pnpm start` | Run the built Express server |
| `pnpm preview` | Preview the Vite production bundle |

## Project structure

```text
client/src/
  pages/Home.tsx              Main archive experience and sample records
  components/DriftWall.tsx    Landing-page visual wall
  components/ui/hero-parallax.tsx
                              Scroll-driven archive stream
  contexts/ThemeContext.tsx   Theme persistence and switching
  index.css                   Global visual system and responsive styles
server/index.ts               Static production server
```

## Data and privacy

The current experience uses hard-coded sample records and connections in `client/src/pages/Home.tsx`. It is a frontend prototype: there is no login, database, import flow, or remote archive API.

The landing-page image wall loads placeholder images from `picsum.photos`, and the page loads Google Fonts. Replace these with local assets/fonts for a fully offline deployment.

## Production notes

Before using Chronicles with real personal data, add a typed data layer, local import flow, and durable browser storage such as IndexedDB. Keep private records out of the frontend bundle and avoid exposing any service keys in `VITE_*` variables.
>>>>>>> 6a142ad (Initial commit)
