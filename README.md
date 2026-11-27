# Zero to Qubit

Live at **[zerotoqubit.com](https://zerotoqubit.com)**.

A study site for Newcastle University's **CSC3132 Introduction to Quantum Computing**. Every lecture is explained in order, with interactive visuals, worked exercises, flashcards, quizzes, a code lab, a concept map, a history timeline and a reading library.

It's a static site built with [Astro](https://astro.build). There's no server and no database: progress (flashcards, quiz mistakes, lecture ratings, code) is saved in the browser's `localStorage`.

## What's inside

| Page | What it does |
|---|---|
| `/` | Home: today's study session, your progress, all lectures |
| `/lectures/…` | Lectures 1–9: notation boxes, predict-first questions, interactive labs, common-mistake alerts, worked exercises (with Full / Some / Exam guidance levels), "Lock it in" recall cards, and "Go deeper" sections at Module+, MSc and PhD level |
| `/summaries/…` | One-page printable summary for each lecture |
| `/flashcards` | Spaced-repetition flashcards (FSRS scheduler, two-button grading) |
| `/quiz` | Mixed or per-lecture quizzes with full working, confidence ratings and an error log that triggers mistake alerts |
| `/code-lab` | Qiskit (Python subset) and OpenQASM 3 exercises run on an in-browser simulator, with unit tests and a tutor that recognises common mistakes |
| `/map` | Concept map with study routes based on your ratings |
| `/notation` | Every symbol in plain words (press `/` anywhere) |
| `/history`, `/library`, `/tools` | Timeline, reading list by level, curated tools |

## Running it locally

You need Node.js 22.23.4 or newer.

```bash
npm install
npm run dev       # http://localhost:4321, reloads as you edit
npm test          # simulator and parser tests
npm run build     # builds the static site into dist/
npm run preview   # serves dist/ locally
```

## Deploying to Cloudflare

You can add this as another project next to the ones already on your account; they don't interfere.

### Option A: Cloudflare Pages connected to GitHub (recommended)

Every push to `main` then redeploys automatically.

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the `zero-to-qubit` repository (if it isn't listed, use the link there to give Cloudflare's GitHub app access to it).
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - The `.node-version` file tells Cloudflare which Node version to use. If the build complains about Node, add an environment variable `NODE_VERSION` = `22.23.4`.
4. **Save and Deploy.** You'll get a `*.pages.dev` address.
5. **Custom domains → Set up a custom domain**: add `zerotoqubit.com` and `www.zerotoqubit.com` (then redirect `www` to the bare domain with a Redirect Rule). If you ever change the domain, update `site` in `astro.config.mjs` too.

### Option B: upload from your laptop

```bash
npm run build
npx wrangler login                       # once
npx wrangler pages deploy dist --project-name <your-pages-project-name>
```

`public/_headers` sets basic security headers and long-term caching for the hashed asset files.

## Project layout

```
src/
  content/lectures/   one MDX file per lecture (frontmatter holds objectives and the summary sheet)
  components/         interactive labs (Bloch, measurement, two-qubit, cloning, Bell, teleportation) and lesson blocks
  data/               flashcards, quiz, code-lab exercises, notation, history, library
  lib/                state-vector simulator, Qiskit/OpenQASM parser, FSRS wrapper, storage helpers
  pages/              routes
tests/                node:test tests for the simulator and parser
scripts/              content helper (fixes display-maths fences)
```

### Adding things

- **A flashcard:** add an entry to `src/data/cards.ts`. Use `$...$` for maths. Reference its `id` in a lecture's `<LockIn ids={[...]} />` to embed it.
- **A quiz question:** add to `src/data/quiz.ts`. Map wrong options to mistake tags (`src/data/mistakes.ts`) so the error log can track them.
- **A code-lab exercise:** add to `src/data/exercises.ts` with starter code, tests and a `diagnose` function.
- **Lecture 10 (hardware):** copy a lecture MDX file, set `number: 10`, and write it.

Maths shortcuts (KaTeX): `\ket{x}`, `\bra{x}`, `\braket{a}{b}`, and `\A{...}` / `\B{...}`, which colour α purple and β teal.

## Notes

- The code lab's Python mode understands one Qiskit instruction per line (`qc.h(0)`, `qc.cx(0, 1)`, `qc.ry(pi/2, 0)`, …). It is not a Python interpreter. To run on real IBM hardware, copy the code into a local Qiskit install; instructions are on the code-lab page.
- If anything on the site disagrees with the lecturers' slides, the slides win.
