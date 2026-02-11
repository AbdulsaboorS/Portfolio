# Abdulsaboor Shaikh Interactive Portfolio

Dark, interactive landing page with a 3D "Night Ops Command Room" scene and recruiter-focused content panels.

## Run locally

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/index.html
```

## Compare two versions

This repo now includes an alternate implementation under `/alt`.

```text
http://localhost:4173/compare.html
```

Direct URLs:

- Current build: `http://localhost:4173/index.html`
- Alternate build: `http://localhost:4173/alt/index.html`

## WebGL diagnostics

Use this route to isolate renderer setup issues without portfolio UI complexity:

- Debug harness: `http://localhost:4173/debug-webgl.html`

## Controls

- Drag to rotate camera
- Scroll to zoom
- Click glowing objects to switch sections
- Use quick section buttons above the scene
- Use left and right arrow keys to cycle sections
- Click "Start guided tour" for auto walkthrough

If WebGL is unavailable, the app automatically falls back to quick-access mode.
