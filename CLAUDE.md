# Agent context: Portfolio

## What this is

- **Static personal portfolio** (HTML, CSS, JS). Main entry: [index.html](index.html).
- **3D interactive “desk” scene** via Three.js/WebGL in [app.js](app.js). Canvas is full-viewport; users drag to rotate, scroll to zoom, click objects to open a detail panel.
- **Production**: intended for **GitHub Pages** (e.g. `username.github.io` or repo Pages).

## Structure

| Path | Purpose |
|------|--------|
| `index.html` | Main portfolio page (header + scene + detail panel). |
| `styles.css` | All main layout and visuals. |
| `app.js` | 3D scene, interactions, panel content (loaded as ES module). |
| `assets/` | Images, logos (see `assets/logos/README.md` for logo names). |
| `alt/` | Alternate version of the portfolio (separate entry point). |
| `resume-highlights.html` | Not used; Resume was removed from main nav. |
| `debug-webgl.html` / `debug-webgl.js` | WebGL diagnostics. |
| `compare.html` | Compare view (if used). |

## Main UI (index.html)

- **Header (`.top-bar`)**: Two main parts only — **left**: name + role (`.name-block`); **right**: nav links LinkedIn, GitHub, Email (no Resume; `.top-links`). Flex layout with `justify-content: space-between`.
- **WIP message (`.top-message-bar`)**: Single always-visible `<p>` below the header; positioned center-right (e.g. `left: calc(50% + 2in)`), rectangle style. Do not replace with CTA/expand on desktop without explicit request.
- **Below that**: Full-viewport scene with **quick-nav** (Experience, Projects, Activities, Skills, Interests) and a **detail panel** that opens when desk objects are clicked. Detail panel is at `top: 9rem` so it sits below the WIP message and does not overlap.
- **Panel UX (Experience, Projects, Activities)**: Opening a section shows an **overview** of all items (e.g. company, role, dates). Clicking an item opens its **detail view**; a “Back to [Section]” button returns to the overview. **Arrow keys** (Left/Right) cycle through that section’s items when in detail view; **Escape** goes back to overview, or closes the panel when already on overview.
- **Skills**: Single view with four groups (Programming languages, Software & tools, Databases, AI stack). Logos loaded from Simple Icons CDN; labels under each. Data and slug map in [app.js](app.js).
- **Interests**: Single view; content is static HTML in `sectionData`.
- **Do not** add extra blocks or messages inside the header without explicit user request. Past attempts to add a “top middle” message by inserting a third flex item caused layout/overlap issues (e.g. with the quick-nav or tooltips). If the user wants header text or a message, prefer a design that does not change the two-column header structure (e.g. a subtitle under the name, or a separate row below the bar), and always verify locally.

## Local testing

From repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or `http://localhost:8000/index.html`).  
Alternatively: `npx serve .` (often serves on port 3000).

**Always run the site locally after changing layout or header** so the user can confirm nothing is broken or overlapping.

## Deployment

- **Prod** = GitHub Pages (GitHub.io). Push the branch that should be published (e.g. `main` or the branch configured in repo Settings → Pages). No build step; static files are served as-is.

## Conventions for agents

1. **Header changes**: Avoid adding new flex children to `.top-bar`; the current two-column layout is fragile. Prefer changes that keep “name block left, links right” and put new content elsewhere (e.g. below the bar or inside the scene area).
2. **WIP message**: Leave as a single `.top-message-bar` on desktop; do not change to CTA/expand or move it without explicit user request.
3. **Detail panel**: Keep `top: 9rem` (or adjust only to avoid overlapping the WIP message); do not move it above the message.
4. **Formatting**: Preserve existing indentation and style; run linters if available and fix any new issues.
5. **Spelling**: It’s fine to fix obvious typos in new copy (e.g. “information”) unless the user asks to keep exact wording.
6. **Keep AGENTS.md updated**: After any confirmed change that affects structure, UI, or deployment, update this file so it stays accurate for the next agent or session.
