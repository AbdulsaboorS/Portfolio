# Portfolio project context

## Purpose

This repo is Abdulsaboor Shaikh’s personal portfolio: an interactive 3D desk that presents his work, experience, activities, skills, and interests as an explorable environment.

The portfolio is intentionally personal and expressive. Its visual language is a bright, warm, Infernape-inspired fire dojo: ivory walls, wood, ember red, orange, flame yellow, anime/game-inspired typography, and an original mascot figurine. It does not use official Pokémon artwork, logos, or copied game UI.

## Core vocabulary

- **Desk scene**: The full-viewport Three.js/WebGL workstation and its interactive objects.
- **Section**: One content area opened from a desk object or the System Index: Experience, Projects, Activities, Skills, or Interests.
- **Overview**: The summary cards shown when a multi-item section opens.
- **Detail view**: The expanded content for one experience, project, or activity.
- **Project readout**: The right side of the Projects detail view, paired with the scrollable project index on the left.
- **Current Mission**: The wall card that displays the latest public GitHub push or pull request when available, with a manual fallback.
- **Compact viewport**: A mobile or short landscape viewport. It receives tighter composition, touch-oriented spacing, and an adaptive renderer profile.

## User-approved decisions

- The portfolio represents Abdulsaboor’s taste rather than optimizing for generic recruiter conventions.
- The portrait is photo-only; the old label beneath it is intentionally removed.
- The monitor presents Experience and its career timeline. The side monitor presents Projects.
- Projects in progress are marked WIP and the project index scrolls independently from the project readout.
- Locations live inside expanded experience details, not overview cards. Overview cards show role and dates.
- The scene supports orbiting, zooming, click targets, keyboard navigation, reduced motion, and a non-WebGL content path.

## Content ownership

Primary portfolio content lives in `app.js`, including experience, project, activity, skill, interest, and mission data. `index.html` owns the shell and `styles.css` owns the visual system and responsive layout.

## Runtime and deployment

- Local static server: `python3 -m http.server 8082`
- Local URL: `http://127.0.0.1:8082/`
- Cloudflare Pages project: `abdulsaboorshaikh-portfolio`
- Production URL: `https://abdulsaboorshaikh.com`
- Preview URL pattern: `https://<deployment-id>.abdulsaboorshaikh-portfolio.pages.dev`
- Deployment command: `wrangler pages deploy . --project-name abdulsaboorshaikh-portfolio --commit-dirty=true`

Wrangler uses OAuth. If a non-interactive command reports that an API token is required, rerun the command in a TTY and complete `wrangler login` in the browser.

## Verification checklist

Before handing off a change:

```bash
git diff --check
node --check app.js
```

For visual changes, verify the desktop scene, Projects index/readout, expanded Experience, mobile landscape layout, touch scrolling, and the live custom domain after deployment.
