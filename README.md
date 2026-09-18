# Abdulsaboor Shaikh – Interactive 3D Portfolio

**[→ Live portfolio](https://abdulsaboorshaikh.com)**

An interactive 3D desk that replaces a static resume with an after-hours builder's lab. Click objects on the desk (monitor, side monitor, keyboard, mouse, PC, dumbbell) to open experience, projects, activities, skills, and interests. Built for recruiters and hiring managers who want to explore content in one place without scrolling a long page.

**What it does**

- **Single-page experience** – One scene; section panels slide in so you stay in context.
- **Keyboard-friendly** – Arrow keys move between cards; Esc or Back returns to the section overview.
- **Graceful fallback** – If WebGL isn’t available, quick-nav buttons and the same content stay usable.
- **Focused panels** – Each section shows an overview grid; click a card for full detail (e.g. project descriptions, tech stacks, links).

**Why it exists**

I wanted a portfolio that feels like a product: something you interact with instead of skim. The 3D desk is the entry point; the real value is the structured content behind each object, so the layout supports both “quick scan” and “deep dive.”

---

## Tech stack (this site)

- **Frontend:** Vanilla JS, HTML, CSS
- **3D:** Three.js
- **Hosting:** Cloudflare Pages with a custom domain
- **Accessibility:** Keyboard navigation, reduced-motion aware, non-WebGL fallback

---

## How to use the live site

- **Rotate:** Drag to rotate the camera; scroll to zoom.
- **Open a section:** Click a desk object or open the System Index.
- **Browse cards:** Click a card for details; use ← → to move between items; press ← or Esc to go back to the overview.

If WebGL is unavailable, the app switches to quick-access mode and the same content is available via the section buttons.
