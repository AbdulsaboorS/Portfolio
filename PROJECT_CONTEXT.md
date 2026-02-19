# Project context (for agent handoffs)

**Purpose**: This file gives any coding agent (or human) enough context to work on this repo after a handoff. Update it whenever there is a **confirmed, committed change** that affects how the project works, what’s in it, or how to run/deploy it.

---

## What this repo is

- **Static personal portfolio** for Abdulsaboor Shaikh. No build step; plain HTML, CSS, and JavaScript.
- **Main entry**: [index.html](index.html). The live experience is a single page: header, WIP message, full-viewport 3D “desk” scene (Three.js), quick-nav buttons, and a detail panel that opens when you click desk objects (monitor, side monitor, keyboard, mouse, dumbbell).
- **Tech**: Three.js (v0.162.0, ESM from jsDelivr), OrbitControls, WebGL. One main script: [app.js](app.js). Styles: [styles.css](styles.css).
- **Hosting**: GitHub Pages (prod). Repo: `AbdulsaboorS/Portfolio`. Typical URL: `https://abdulsaboors.github.io/Portfolio/`.

---

## Key files

| Path | Role |
|------|------|
| `index.html` | Main page: header, WIP message bar, scene container, detail panel. |
| `styles.css` | All layout and visuals. One breakpoint at 900px (mobile), one at 480px. |
| `app.js` | 3D scene setup, OrbitControls, raycasting for clicks, panel content, section data. |
| `assets/` | Images; `assets/logos/README.md` lists logo filenames for the monitor. |
| `alt/` | Alternate portfolio version (separate entry). |
| `AGENTS.md` | Agent rules and conventions; keep it in sync with this file. |
| `debug-webgl.html`, `debug-webgl.js` | WebGL diagnostics. |
| `compare.html` | Compare view (if used). |

---

## Current UI state (as of last update)

- **Header**: Name + “Product Manager and Builder” on the left; LinkedIn, GitHub, Email on the right. No Resume link.
- **WIP message**: Single always-visible bar (`.top-message-bar`) below the header, center-right (`left: calc(50% + 2in)`), rectangle, dark background. Not a CTA or expand/collapse on desktop.
- **Detail panel**: Opens on the right when a desk object is clicked. Positioned at `top: 9rem` so it sits below the WIP message and does not overlap.
- **Panel flow**: Experience, Projects, and Activities use a two-level flow: **overview** (all items as clickable cards) → **detail** (one item’s full content). “Back to [Section]” returns to overview. Arrow keys cycle items when in detail; Escape goes back to overview or closes the panel.
- **Skills**: Four groups (Programming languages, Software & tools, Databases, AI stack) with logos from Simple Icons CDN and labels. Single view, no drill-down.
- **Quick-nav**: Experience, Projects, Activities, Skills, Interests. Section data (including `items[]` for multi-item sections and `skillGroups` for Skills) lives in [app.js](app.js).

---

## How to run locally

From repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Or use `npx serve .` (often port 3000).

---

## How to push to prod

1. Commit and push your branch (e.g. `cursor/portfolio-github-repository-632e`).
2. Update `main` to match and push (Pages deploys from `main`):
   ```bash
   git checkout main
   git reset --hard cursor/portfolio-github-repository-632e
   git push origin main --force
   git checkout cursor/portfolio-github-repository-632e
   ```
3. Wait 1–2 minutes; hard refresh or incognito if the live site doesn’t update.

---

## When to update this file

- After **confirmed** changes (merged, pushed, or accepted by the user) that affect:
  - Project structure (new/removed key files or features)
  - UI (header, WIP message, detail panel, nav, breakpoints)
  - How to run or deploy
  - Tech stack or main dependencies
- Keep the “Current UI state” and “Key files” sections accurate so the next agent (or you in a new session) can continue without re-discovering everything.
- Also update [AGENTS.md](AGENTS.md) when you change conventions or layout rules.

---

*Last meaningful update: Section UX overhaul—Experience/Projects/Activities use overview → detail flow with arrow-key navigation; Skills redesigned as four logo groups (Simple Icons CDN); Interests copy updated; AGENTS.md and PROJECT_CONTEXT.md updated.*
