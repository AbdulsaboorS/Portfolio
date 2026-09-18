# Agent instructions for the portfolio

## Scope

This is a static HTML/CSS/JavaScript portfolio with a Three.js/WebGL desk scene. Keep the experience personal, bright, colorful, playful, and anime-inspired. Preserve the warm ivory, wood, ember red, orange, and flame-yellow system.

## Source of truth

- `index.html`: document shell, metadata, canvas, quick navigation, and detail panel.
- `styles.css`: layout, theme tokens, panel styling, and responsive behavior.
- `app.js`: scene construction, interactions, content, panel rendering, and GitHub mission fetching.
- `assets/`: portrait and local visual assets.
- `PROJECT_CONTEXT.md`: approved product language, decisions, and deployment facts.

## Working rules

- Preserve the original Infernape-inspired direction; do not introduce official Pokémon assets, logos, or copied game UI.
- Keep the portrait photo-only and keep the Current Mission card prominent and readable.
- Keep locations inside expanded experience details, not overview cards.
- Treat mobile landscape as a first-class layout. Maintain readable content, touch scrolling, responsive camera framing, and light-theme hover/focus/selected states.
- When changing the header, preserve its two-part structure: name/role on the left and external links on the right.
- Keep Projects’ left index independently scrollable from its right readout.
- Preserve keyboard navigation, reduced-motion behavior, and the non-WebGL fallback.
- Do not use terminal-browser automation. Use the local server and user-provided screenshots for visual verification.
- Do not commit secrets, API tokens, or generated credentials.

## Checks

Run these before committing JavaScript or layout changes:

```bash
git diff --check
node --check app.js
```

## Local run

```bash
python3 -m http.server 8082
```

Open `http://127.0.0.1:8082/`.

## Production

Production is Cloudflare Pages, not GitHub Pages:

- Project: `abdulsaboorshaikh-portfolio`
- Domain: `https://abdulsaboorshaikh.com`
- Deploy: `wrangler pages deploy . --project-name abdulsaboorshaikh-portfolio --commit-dirty=true`

Use Wrangler OAuth; never ask the user to paste an API token into chat or source files.
