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
| `resume-highlights.html` | Resume page; linked from main nav. |
| `debug-webgl.html` / `debug-webgl.js` | WebGL diagnostics. |
| `compare.html` | Compare view (if used). |

## Main UI (index.html)

- **Header (`.top-bar`)**: Two main parts only — **left**: name + role (`.name-block`); **right**: nav links LinkedIn, GitHub, Email, Resume (`.top-links`). Flex layout with `justify-content: space-between`.
- **Below the header**: Full-viewport scene with a **quick-nav** toolbar (Experience, Projects, Activities, Skills, Interests) and a **detail panel** that opens when desk objects are clicked.
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
2. **Resume**: Only remove or change the Resume link and `resume-highlights.html` if the user explicitly asks.
3. **Formatting**: Preserve existing indentation and style; run linters if available and fix any new issues.
4. **Spelling**: It’s fine to fix obvious typos in new copy (e.g. “information”) unless the user asks to keep exact wording.
