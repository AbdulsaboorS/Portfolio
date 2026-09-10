import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/+esm";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js/+esm";
import { RoundedBoxGeometry } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/geometries/RoundedBoxGeometry.js/+esm";

const panel = document.getElementById("detail-panel");
const panelClose = document.getElementById("panel-close");
const panelTitle = document.getElementById("panel-title");
const panelSubtitle = document.getElementById("panel-subtitle");
const panelContent = document.getElementById("panel-content");
let canvas = document.getElementById("scene");
const sceneWrap = document.querySelector(".scene-wrap");
const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));
const quickNavShell = document.querySelector(".quick-nav-shell");
const quickNavToggle = document.getElementById("quick-nav-toggle");
const sceneStatus = document.getElementById("scene-status");
const sceneOverlay = document.getElementById("scene-overlay");
const hoverLabel = document.getElementById("hover-label");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function defaultStatus() {
  return "Interact // select a desk object";
}

sceneOverlay.hidden = true;
sceneOverlay.style.display = "none";
hoverLabel.hidden = true;
hoverLabel.style.display = "none";

const experienceItems = [
  {
    title: "HCSS",
    subtitle: "Product Intern",
    dateRange: "January 2026",
    detailHtml: `
      <p>Working for the spring term.</p>
      <p>Will report back in 2 months with my full impact here. Stay tuned :D</p>
    `,
  },
  {
    title: "Expedia Group",
    subtitle: "Product Intern, Session Management (IAM)",
    dateRange: "June 2025 – August 2025",
    detailHtml: `
      <ul>
        <li>Launched an MVP AI anomaly detection system to prevent $XXX+ in annual fraud losses; led 5 engineers to cut user churn by 12% via incident report reviews.</li>
        <li>Drove product strategy for fraud detection impacting 50K+ users; aligned 4 teams 1 week ahead of schedule by stack ranking and prototyping the leading solution.</li>
        <li>Shaped roadmap via user research to reduce login friction; demoed an AI-powered account recovery chatbot to leadership, now prioritized for a 25% reduction in support tickets.</li>
      </ul>
      <p><strong>More Wins</strong></p>
      <ul>
        <li>Networked Deeply: Completed 30+ coffee chats with PMs and leaders across the company to learn different product philosophies.</li>
        <li>PNW Exploration: Took full advantage of Seattle's location and traveled to Oregon, Vancouver, and many national parks :D</li>
      </ul>
    `,
  },
  {
    title: "HubSpot",
    subtitle: "Product Intern, Employee Technology – Internal AI",
    dateRange: "January 2025 – May 2025",
    detailHtml: `
      <ul>
        <li>Led a POC for an AI RFP automation tool projected to save $XXX+ annually; secured executive buy-in through 10+ user interviews and cross-functional leadership.</li>
        <li>Improved internal Helpdesk AI Agent to reduce IT support tickets by 20%; identified logic gaps and drove 3 design/eng iterations to prevent user drop-offs.</li>
        <li>Scoped and prioritized 6 features for internal AI platform serving 6,000+ weekly active users; drove a 32% adoption increase through usability testing and Loom tutorials.</li>
      </ul>
      <p><strong>More Wins</strong></p>
      <ul>
        <li>Build vs. Buy: Performed a deep-dive competitive analysis of AI vendors to justify the strategic decision to develop a tool in-house.</li>
        <li>Org Onsite: Attended the team onsite in person, which was a highlight for building real-world relationships and connections across the org.</li>
      </ul>
    `,
  },
  {
    title: "Oceaneering International, Inc.",
    subtitle: "Business Analyst Intern, Space Systems (NASA contractor)",
    dateRange: "May 2024 – December 2024",
    detailHtml: `
      <ul>
        <li>Automated monthly reporting workflows via Excel to eliminate data delays; saved 20+ hours per month, enabling faster forecasting and budget planning.</li>
        <li>Reduced project costs by $XXX by auditing budget allocations to identify delivery risks; partnered with engineering leads to reprioritize scope for essential deliverables.</li>
        <li>Increased process efficiency by 8% by developing a standardized compliance checklist; reduced review times and eliminated bottlenecks in client document approval.</li>
      </ul>
      <p><strong>More Wins</strong></p>
      <ul>
        <li>SharePoint Optimization: Revamped the team site for 50+ members, improving documentation accessibility by 30% and resolving legacy permission issues.</li>
        <li>This was my first internship ever so it built my core foundation, especially since it was such a high-stakes, fast-paced space industry environment!</li>
      </ul>
    `,
  },
];

const projectItems = [
  {
    title: "Veil",
    subtitle: "Browser extension · in progress",
    signal: "AI / VIDEO",
    marker: "VL",
    artifact: "veil",
    dateRange: "",
    link: "https://github.com/AbdulsaboorS/veil",
    techStack: [],
    detailHtml: `
      <p>Asks and answers your questions while you watch—without spoiling what happens next. Use the extension instead of risky searches mid-episode.</p>
    `,
  },
  {
    title: "Circles",
    subtitle: "iOS · in development",
    signal: "SOCIAL / IOS",
    marker: "CR",
    artifact: "circles",
    dateRange: "",
    link: "https://github.com/AbdulsaboorS/circles-ios",
    techStack: [],
    detailHtml: `
      <p>Think of Islamic Bereal, sort of. 🤫</p>
    `,
  },
  {
    title: "3D Desk Portfolio",
    subtitle: "Three.js & Vanilla JS",
    signal: "WEBGL / SPACE",
    marker: "3D",
    artifact: "spatial",
    dateRange: "",
    link: "https://github.com/AbdulsaboorS/Portfolio",
    techStack: ["Three.js", "Vanilla JS", "HTML", "CSS"],
    detailHtml: `
      <p>An immersive 3D workspace experience where my portfolio comes to life.</p>
      <ul>
        <li>Each desk item (monitor, side monitor, keyboard, mouse, PC, dumbbell) opens rich detail panels for experience, projects, skills, activities, and interests, with smooth overview-to-detail flow and arrow-key navigation.</li>
      </ul>
    `,
  },
  {
    title: "Fantasy Basketball Bot",
    subtitle: "Python, FastAPI & React",
    signal: "SPORT / AUTO",
    marker: "FB",
    artifact: "lineup",
    dateRange: "",
    link: "https://github.com/AbdulsaboorS/fantasybasketballbot",
    vercelLink: "https://fantasybasketballbot.vercel.app/",
    techStack: ["Python 3.11", "FastAPI", "React", "TypeScript", "Tailwind CSS", "GitHub Actions", "Railway", "Vercel"],
    detailHtml: `
      <p><strong>Live demo above is a read only dashboard (you will not make changes to my actual team lol)</strong></p>
      <p>I built an ESPN fantasy basketball bot to stop losing points to missed game-day swaps and inefficient streaming.</p>
      <ul>
        <li><strong>Game-day checks:</strong> Every 30 minutes before tip-off, identifies OUT/DTD starters and recommends (or executes) valid replacements who play that day.</li>
        <li><strong>Daily optimization:</strong> Nightly IR and lineup optimization, plus streaming evaluation using games-remaining value.</li>
        <li><strong>Protection guardrails:</strong> Untouchables, rank thresholds, weekly transaction limits, and explicit execute mode.</li>
      </ul>
    `,
  },
  {
    title: "Discord Feedback Bot",
    subtitle: "Finished but not using anymore",
    signal: "NLP / COMMUNITY",
    marker: "DB",
    artifact: "sentiment",
    dateRange: "",
    link: "https://github.com/AbdulsaboorS/discord-bot-project",
    techStack: ["Python", "discord.py", "Azure Text Analytics", "spaCy"],
    detailHtml: `
      <p>A Discord bot I built to collect and analyze feedback within channels in real time.</p>
      <ul>
        <li>I put this bot into a friend's stock trading Discord server and got 200+ MAU using it, with a 4.6/5 satisfaction score (average rating from an optional in-server feedback survey).</li>
        <li>Users submit feedback with a simple command; the bot returns per-message sentiment and key phrases.</li>
        <li>Keeps a running summary of themes across the session, so you get both per-message analysis and an aggregate view.</li>
      </ul>
    `,
  },
];

const activityItems = [
  {
    title: "United Mission Relief",
    subtitle: "Co-President",
    dateRange: "August 2025 – Present",
    detailHtml: `
      <p>Houston, TX.</p>
      <ul>
        <li>Lead service events reaching 1,000+ unhoused individuals by coordinating food prep, distribution, and volunteers.</li>
        <li>Developed a digital platform for volunteer check-in and hour tracking, reducing manual coordination by 40%.</li>
      </ul>
    `,
  },
  {
    title: "Hamd Institute",
    subtitle: "Quran Class Teacher (Jan 2023 – May 2024)",
    dateRange: "Houston, TX",
    detailHtml: `
      <ul>
        <li>Improved student performance by 27% by analyzing test results in Excel and tailoring learning content to those results.</li>
        <li>Grew student engagement and retention by 13% through the integration of interactive teaching methods.</li>
      </ul>
      <p>I don't teach anymore but I still volunteer here and there and mentor some students from there.</p>
    `,
  },
  {
    title: "Mentoring",
    subtitle: "School & Bauer",
    dateRange: "",
    detailHtml: `
      <p>I mentor underclassmen in:</p>
      <ul>
        <li><strong>Management Information Systems Student Organization (MISSO)</strong><br/><span class="panel-detail-note">My school's MIS club!</span></li>
        <li><strong>BUMP Bauer Mentorship Program</strong><br/><span class="panel-detail-note">My business school's mentorship program!</span></li>
      </ul>
    `,
  },
];

const skillGroups = [
  {
    name: "Software / tools",
    items: ["Figma", "Jira", "Confluence", "Asana", "Miro", "Amplitude", "Looker", "Tableau", "Power BI", "Loom"],
  },
  {
    name: "Programming languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "HTML5", "CSS3", "R"],
  },
  {
    name: "Frameworks",
    items: ["React", "Node.js"],
  },
  {
    name: "Databases",
    items: ["Supabase", "SQL"],
  },
  {
    name: "AI & DEV TOOLS",
    items: ["Cursor", "Claude", "Lovable", "Vercel", "Replit", "Cloudflare", "GitHub", "Git"],
  },
];

// Path under cdn.simpleicons.org; use "slug/white" for high-contrast on dark background
const skillSlugMap = {
  Figma: "figma", Jira: "jira", Confluence: "confluence", Asana: "asana", Miro: "miro",
  Amplitude: "amplitude/white", Looker: "looker/white", Tableau: "tableau/white", "Power BI": "powerbi/white", Loom: "loom",
  TypeScript: "typescript", JavaScript: "javascript", Python: "python", Java: "openjdk/white", HTML5: "html5", CSS3: "css3/white", R: "r",
  React: "react", "Node.js": "nodedotjs",
  Supabase: "supabase", SQL: "sqlite",
  Cursor: "cursor/white", Claude: "anthropic/white", Lovable: "openai", Vercel: "vercel/white", Replit: "replit", Cloudflare: "cloudflare", GitHub: "github/white", Git: "git",
};

const sectionData = [
  {
    id: "experience",
    objectName: "monitor",
    label: "Experience",
    subtitle: "Internship outcomes",
    status: "Click a card for details · ← → to browse · ← or Esc for overview.",
    items: experienceItems,
  },
  {
    id: "projects",
    objectName: "side monitor",
    label: "Projects",
    subtitle: "",
    status: "Click a card for details · ← → to browse · ← or Esc for overview.",
    items: projectItems,
  },
  {
    id: "activities",
    objectName: "PC",
    label: "Activities",
    subtitle: "Leadership and service",
    status: "Click a card for details · ← → to browse · ← or Esc for overview.",
    items: activityItems,
  },
  {
    id: "skills",
    objectName: "keyboard",
    label: "Skills",
    subtitle: "",
    status: "Click a card for details · ← or Esc for overview.",
    skillGroups,
    skillSlugMap,
  },
  {
    id: "interests",
    objectName: "dumbbell",
    label: "Interests",
    subtitle: "Routine and lifestyle",
    status: "← or Esc for overview.",
    html: `
      <ul>
        <li>I like sports, anime, gaming, and losing money investing in the stock market.</li>
        <li>I'm a gym goer.</li>
        <li>I like fragrances; just got into hiking and nature recently too.</li>
        <li>Just got into golf (I'm a 35 handicap) and love playing tennis.</li>
        <li>I also like wearing clothes.</li>
      </ul>
    `,
  },
];

const sectionMap = new Map(sectionData.map((entry) => [entry.id, entry]));
const sectionOrder = sectionData.map((entry) => entry.id);
const webglDebug = { events: [], lastError: null };
window.__portfolioWebGLDebug = webglDebug;

let activeSectionId = null;
let activeItemIndex = null;
let hoveredRecord = null;
let currentStatus = "";

const state3d = {
  camera: null,
  controls: null,
  renderer: null,
  raycaster: null,
  pointer: null,
  desiredTarget: null,
  desiredCameraPosition: null,
  homeTarget: null,
  homeCameraPosition: null,
  intro: null,
  interactiveRecords: [],
  interactiveBySection: new Map(),
  tempVector: new THREE.Vector3(),
};

function debugEvent(message) {
  const line = `${new Date().toISOString()} | ${message}`;
  webglDebug.events.push(line);
  console.log(`[portfolio-webgl] ${message}`);
}

function updateStatus(message) {
  if (message === currentStatus) return;
  currentStatus = message;
  sceneStatus.textContent = message;
}

function projectedRect(record) {
  if (!record?.sourceObject || !record.sourceCorners || !state3d.camera) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const projected = [];
  const canvasRect = canvas.getBoundingClientRect();

  record.sourceCorners.forEach((corner) => {
    state3d.tempVector.copy(corner);
    record.sourceObject.localToWorld(state3d.tempVector);
    state3d.tempVector.project(state3d.camera);
    const x = canvasRect.left + (state3d.tempVector.x * 0.5 + 0.5) * canvasRect.width;
    const y = canvasRect.top + (-state3d.tempVector.y * 0.5 + 0.5) * canvasRect.height;
    projected.push({ x, y });
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
    points: projected,
  };
}

function projectiveMatrix(width, height, points) {
  const [p0, p1, p2, p3] = points;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const perspectiveX = Math.abs(determinant) < 0.0001 ? 0 : (dx3 * dy2 - dx2 * dy3) / determinant;
  const perspectiveY = Math.abs(determinant) < 0.0001 ? 0 : (dx1 * dy3 - dx3 * dy1) / determinant;
  const scaleX = p1.x - p0.x + perspectiveX * p1.x;
  const skewX = p3.x - p0.x + perspectiveY * p3.x;
  const scaleY = p1.y - p0.y + perspectiveX * p1.y;
  const skewY = p3.y - p0.y + perspectiveY * p3.y;

  return `matrix3d(${scaleX / width},${scaleY / width},0,${perspectiveX / width},${skewX / height},${skewY / height},0,${perspectiveY / height},0,0,1,0,${p0.x},${p0.y},0,1)`;
}

function setPanelFlightOrigin() {
  const source = projectedRect(state3d.interactiveBySection.get(activeSectionId));
  if (!source || source.width <= 0 || source.height <= 0) return;

  panel.classList.add("is-positioning");
  panel.classList.remove("is-hidden");
  const target = panel.getBoundingClientRect();
  const rawOrigin = { left: target.left, top: target.top + target.height * 0.44 };
  const sourceQuad = [source.points[3], source.points[2], source.points[1], source.points[0]].map((point) => ({
    x: point.x - rawOrigin.left,
    y: point.y - rawOrigin.top,
  }));
  panel.style.setProperty("--flight-matrix", projectiveMatrix(target.width, target.height, sourceQuad));
  panel.classList.add("is-hidden");
  panel.classList.add("is-preflight");
  panel.classList.remove("is-positioning");
}

function setPanelVisible(visible) {
  const shouldFly = visible && panel.classList.contains("is-hidden") && panel.classList.contains("is-projects-panel") && state3d.camera;
  if (shouldFly) {
    setPanelFlightOrigin();
    void panel.offsetWidth;
    const hiddenStyle = getComputedStyle(panel);
    const from = {
      transform: hiddenStyle.transform,
      clipPath: hiddenStyle.clipPath,
      opacity: hiddenStyle.opacity,
    };
    panel.classList.add("is-animating");
    panel.classList.remove("is-hidden");
    panel.classList.remove("is-preflight");
    const visibleStyle = getComputedStyle(panel);
    const to = {
      transform: visibleStyle.transform,
      clipPath: visibleStyle.clipPath,
      opacity: visibleStyle.opacity,
    };
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.remove("is-dossier-open");
    document.body.classList.add("is-panel-flight");
    if (!prefersReducedMotion.matches) {
      const flight = panel.animate([
        { ...from, offset: 0 },
        { ...from, opacity: "1", offset: 0.18 },
        { ...to, offset: 1 },
      ], {
        duration: 920,
        easing: "cubic-bezier(0.5, 0, 0.18, 1)",
      });
      flight.finished.finally(() => {
        panel.classList.remove("is-animating");
        document.body.classList.remove("is-panel-flight");
        if (!panel.classList.contains("is-hidden")) document.body.classList.add("is-dossier-open");
      });
    } else {
      panel.classList.remove("is-animating");
      document.body.classList.remove("is-panel-flight");
      document.body.classList.add("is-dossier-open");
    }
    return;
  }
  panel.classList.toggle("is-hidden", !visible);
  panel.setAttribute("aria-hidden", String(!visible));
  document.body.classList.toggle("is-dossier-open", visible);
  if (!visible) document.body.classList.remove("is-panel-flight");
}

function markActiveButton(id) {
  sectionButtons.forEach((button) => {
    const active = button.dataset.section === id;
    button.setAttribute("aria-pressed", String(active));
  });
}

function focusSectionIn3D(id) {
  const record = state3d.interactiveBySection.get(id);
  if (!record) return;
  state3d.desiredTarget.copy(record.focusTarget);
  if (window.innerHeight <= 500) {
    state3d.desiredCameraPosition.lerpVectors(record.focusTarget, record.focusCameraPosition, 0.78);
  } else {
    state3d.desiredCameraPosition.copy(record.focusCameraPosition);
  }
  if (prefersReducedMotion.matches && state3d.camera && state3d.controls) {
    state3d.camera.position.copy(state3d.desiredCameraPosition);
    state3d.controls.target.copy(state3d.desiredTarget);
    state3d.controls.update();
  }
}

function renderOverview(section) {
  if (section.id === "projects") {
    renderProjects(section, 0);
    return;
  }

  const items = section.items;
  const cardsHtml = items
    .map(
      (item, i) => {
        const inner = `<span class="panel-overview-title">${escapeHtml(item.title)}</span>
          <span class="panel-overview-subtitle">${escapeHtml(item.subtitle)}</span>
          ${item.dateRange ? `<span class="panel-overview-daterange">${escapeHtml(item.dateRange)}</span>` : ""}`;
        const cardLinks = [];
        if (item.vercelLink) cardLinks.push(`<a href="${escapeHtml(item.vercelLink)}" target="_blank" rel="noreferrer" class="panel-card-vercel" aria-label="View on Vercel"><img src="https://cdn.simpleicons.org/vercel" alt="" width="20" height="20" /></a>`);
        if (item.link) cardLinks.push(`<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer" class="panel-card-github" aria-label="View on GitHub"><img src="https://cdn.simpleicons.org/github" alt="" width="20" height="20" /></a>`);
        const linkHtml = cardLinks.length ? cardLinks.join("") : "";
        return `<div class="panel-overview-card" data-index="${i}">
          <button type="button" class="panel-overview-card-inner">${inner}</button>
          ${linkHtml}
        </div>`;
      }
    )
    .join("");
  panelContent.innerHTML = `<div class="panel-overview-grid">${cardsHtml}</div>`;
  panelTitle.textContent = section.label;
  panelSubtitle.textContent = section.subtitle;
  activeItemIndex = null;
}

function renderProjects(section, selectedIndex) {
  const item = section.items[selectedIndex];
  const projectNav = section.items
    .map(
      (project, index) => `
        <button class="project-index-item signal-${index}" type="button" data-project-index="${index}" aria-pressed="${index === selectedIndex}">
          <span class="project-index-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-index-marker" aria-hidden="true">${escapeHtml(project.marker)}</span>
          <span class="project-index-copy">
            <strong>${escapeHtml(project.title)}</strong>
            <span>${escapeHtml(project.signal)}</span>
          </span>
        </button>`,
    )
    .join("");

  const actions = [];
  if (item.vercelLink) {
    actions.push(`<a href="${escapeHtml(item.vercelLink)}" target="_blank" rel="noreferrer" class="project-action project-action-live">Open live demo <span aria-hidden="true">↗</span></a>`);
  }
  if (item.link) {
    actions.push(`<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer" class="project-action">View source <span aria-hidden="true">↗</span></a>`);
  }

  const techStack = item.techStack?.length
    ? `<div class="project-tech">${item.techStack.map((tech) => `<span>${escapeHtml(tech)}</span>`).join("")}</div>`
    : "";

  const artifactPatterns = {
    veil: `<span class="artifact-playhead"></span><span class="artifact-caption">ASK WITHOUT SPOILERS</span>`,
    circles: `<span class="artifact-orbit artifact-orbit-a"></span><span class="artifact-orbit artifact-orbit-b"></span><span class="artifact-core">24H</span>`,
    spatial: `<span class="artifact-cube"><i></i><i></i><i></i></span><span class="artifact-caption">SCENE / INTERACTIVE</span>`,
    lineup: `<span class="artifact-court"><i></i><i></i><i></i><i></i><i></i></span><span class="artifact-caption">LINEUP OPTIMIZER</span>`,
    sentiment: `<span class="artifact-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="artifact-caption">LIVE SENTIMENT</span>`,
  };
  const artifact = `<div class="project-artifact artifact-${escapeHtml(item.artifact)}" aria-hidden="true">
    <span class="artifact-label">SIGNAL VISUAL // ${escapeHtml(item.marker)}-${String(selectedIndex + 1).padStart(2, "0")}</span>
    <span class="artifact-field">${artifactPatterns[item.artifact] || ""}</span>
  </div>`;

  panelContent.innerHTML = `
    <div class="projects-console signal-${selectedIndex}">
      <nav class="project-index" aria-label="Project signals">${projectNav}</nav>
      <article class="project-readout">
        <div class="project-readout-signal">
          <span>Selected // ${escapeHtml(item.title)}</span>
          <strong>${escapeHtml(item.marker)}-${String(selectedIndex + 1).padStart(2, "0")}</strong>
        </div>
        <p class="project-readout-kicker">${escapeHtml(item.signal)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="project-readout-subtitle">${escapeHtml(item.subtitle)}</p>
        ${artifact}
        <div class="project-actions">${actions.join("")}</div>
        <div class="project-readout-body">${item.detailHtml}</div>
        ${techStack}
        <p class="project-position">${String(selectedIndex + 1).padStart(2, "0")} / ${String(section.items.length).padStart(2, "0")} <span>Use ← → to scan</span></p>
      </article>
    </div>`;
  panelTitle.textContent = "Project signals";
  panelSubtitle.textContent = `${String(section.items.length).padStart(2, "0")} active and archived builds`;
  activeItemIndex = selectedIndex;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderDetail(section, index) {
  if (section.id === "projects") {
    renderProjects(section, index);
    return;
  }

  const item = section.items[index];
  const techStackHtml =
    item.techStack && item.techStack.length
      ? `<div class="panel-detail-tech"><span class="panel-detail-tech-label">Tech:</span> ${item.techStack
          .map((t) => `<span class="panel-detail-tech-pill">${escapeHtml(t)}</span>`)
          .join("")}</div>`
      : "";
  const detailLinks = [];
  if (item.vercelLink) detailLinks.push(`<a href="${escapeHtml(item.vercelLink)}" target="_blank" rel="noreferrer" class="panel-detail-vercel-link"><img src="https://cdn.simpleicons.org/vercel" alt="" width="18" height="18" /> Check it out here!</a>`);
  if (item.link) detailLinks.push(`<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer" class="panel-detail-github-link"><img src="https://cdn.simpleicons.org/github" alt="" width="18" height="18" /> View on GitHub</a>`);
  const detailLinksHtml = detailLinks.length ? `<p class="panel-detail-github">${detailLinks.join(" ")}</p>` : "";
  panelContent.innerHTML = `<div class="panel-detail-content">${techStackHtml}${detailLinksHtml}${item.detailHtml}</div>`;
  panelTitle.textContent = item.title;
  panelSubtitle.textContent = "";
  activeItemIndex = index;
}

function renderSkills(section) {
  const base = "https://cdn.simpleicons.org";
  const slugMap = section.skillSlugMap || {};
  const groupsHtml = section.skillGroups
    .map(
      (group) => `
    <div class="panel-skills-group">
      <h3 class="panel-skills-group-title">${escapeHtml(group.name)}</h3>
      <div class="panel-skills-logos">
        ${group.items
          .map((name) => {
            const slug = slugMap[name] || name.toLowerCase().replace(/\s+/g, "");
            const url = slug.startsWith("http") ? slug : `${base}/${slug}`;
            return `<span class="panel-skill-item" title="${escapeHtml(name)}">
              <img src="${url}" alt="${escapeHtml(name)}" class="panel-skill-logo" onerror="this.style.display='none'" />
              <span class="panel-skill-label">${escapeHtml(name)}</span>
            </span>`;
          })
          .join("")}
      </div>
    </div>`
    )
    .join("");
  panelContent.innerHTML = `<div class="panel-skills">${groupsHtml}</div>`;
  panelTitle.textContent = section.label;
  panelSubtitle.textContent = section.subtitle;
}

function openPanel(id, options = {}) {
  const selected = sectionMap.get(id);
  if (!selected) return;

  activeSectionId = id;
  activeItemIndex = null;
  markActiveButton(id);
  updateStatus(selected.status);
  panel.dataset.node = selected.objectName;
  panel.classList.toggle("is-projects-panel", id === "projects");

  if (selected.items) {
    renderOverview(selected);
  } else if (selected.skillGroups) {
    renderSkills(selected);
  } else {
    panelTitle.textContent = selected.label;
    panelSubtitle.textContent = selected.subtitle;
    panelContent.innerHTML = selected.html;
  }

  if (!options.keepPanelHidden) {
    setPanelVisible(true);
    panel.focus({ preventScroll: true });
  }

  if (!options.skip3DFocus) {
    focusSectionIn3D(id);
  }
}

function openPanelItem(sectionId, index) {
  const section = sectionMap.get(sectionId);
  if (!section || !section.items || index < 0 || index >= section.items.length) return;
  activeItemIndex = index;
  renderDetail(section, index);
  setPanelVisible(true);
  panel.focus({ preventScroll: true });
}

function cycleItem(direction) {
  const section = sectionMap.get(activeSectionId);
  if (!section || !section.items || activeItemIndex == null) return false;
  const len = section.items.length;
  const next = (activeItemIndex + direction + len) % len;
  openPanelItem(activeSectionId, next);
  return true;
}

function backToOverview() {
  const section = sectionMap.get(activeSectionId);
  if (!section || !section.items) return;
  renderOverview(section);
}

function cycleSection(direction) {
  const currentIndex = Math.max(sectionOrder.indexOf(activeSectionId), 0);
  const nextIndex = (currentIndex + direction + sectionOrder.length) % sectionOrder.length;
  openPanel(sectionOrder[nextIndex]);
}

function setOverviewMode(options = {}) {
  const hidePanel = options.hidePanel !== false;
  const instant = options.instant === true;

  activeSectionId = null;
  activeItemIndex = null;
  markActiveButton(null);

  if (hidePanel) {
    setPanelVisible(false);
  }

  if (
    state3d.desiredTarget &&
    state3d.desiredCameraPosition &&
    state3d.homeTarget &&
    state3d.homeCameraPosition
  ) {
    state3d.desiredTarget.copy(state3d.homeTarget);
    state3d.desiredCameraPosition.copy(state3d.homeCameraPosition);

    if (instant && state3d.camera && state3d.controls) {
      state3d.camera.position.copy(state3d.homeCameraPosition);
      state3d.controls.target.copy(state3d.homeTarget);
      state3d.controls.update();
    }
  }

  updateStatus(defaultStatus());
}

function collectEmissiveMaterials(rootObjects) {
  const result = [];
  rootObjects.forEach((root) => {
    root.traverse((node) => {
      if (!node.isMesh) return;
      const list = Array.isArray(node.material) ? node.material : [node.material];
      list.forEach((material) => {
        if (material && "emissiveIntensity" in material) result.push(material);
      });
    });
  });
  return result;
}

function addInteractiveRecord(data) {
  const record = {
    id: data.id,
    objectName: data.objectName,
    hitMesh: data.hitMesh,
    floatObject: data.floatObject,
    labelAnchor: data.labelAnchor,
    focusTarget: data.focusTarget,
    focusCameraPosition: data.focusCameraPosition,
    highlightMaterials: data.highlightMaterials,
    sourceObject: data.sourceObject,
    sourceCorners: data.sourceCorners,
    baseY: data.floatObject.position.y,
    baseScale: data.floatObject.scale.clone(),
  };

  state3d.interactiveRecords.push(record);
  state3d.interactiveBySection.set(record.id, record);
}

function createHitMesh(width, height, depth, position) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  mesh.position.copy(position);
  return mesh;
}

function roundedBox(width, height, depth, radius = 0.02, segments = 3) {
  return new RoundedBoxGeometry(width, height, depth, segments, radius);
}

function createScreenTexture(title, subtitle, color = "#78b5ff") {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");

  ctx.fillStyle = "#f8fbff";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
  gradient.addColorStop(0, "#eef6ff");
  gradient.addColorStop(1, "#d8e8ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(12, 12, textureCanvas.width - 24, textureCanvas.height - 24);

  ctx.fillStyle = "rgba(37, 93, 170, 0.18)";
  ctx.fillRect(12, 12, textureCanvas.width - 24, 74);

  ctx.textAlign = "center";
  ctx.fillStyle = "#2f5b9b";
  ctx.font = "700 44px Inter, sans-serif";
  ctx.fillText("CLICK", textureCanvas.width / 2, textureCanvas.height * 0.28);

  ctx.fillStyle = "#18427f";
  ctx.font = "800 80px Inter, sans-serif";
  ctx.fillText(title, textureCanvas.width / 2, textureCanvas.height * 0.58);

  ctx.fillStyle = color;
  ctx.font = "600 31px Inter, sans-serif";
  ctx.fillText(subtitle, textureCanvas.width / 2, textureCanvas.height * 0.79);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawImageContain(ctx, image, x, y, width, height, padding = 0) {
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = x + (width - drawWidth) * 0.5;
  const drawY = y + (height - drawHeight) * 0.5;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function createExperienceTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1280;
  textureCanvas.height = 720;
  const ctx = textureCanvas.getContext("2d");

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const logoSlots = [
    { src: "assets/logos/expedia-group.png", x: 70, y: 70, width: 540, height: 250 },
    { src: "assets/logos/hcss.png", x: 670, y: 70, width: 540, height: 250 },
    { src: "assets/logos/hubspot.png", x: 70, y: 400, width: 540, height: 250 },
    { src: "assets/logos/oceaneering.png", x: 670, y: 400, width: 540, height: 250 },
  ];

  const loadedImages = new Map();

  const render = () => {
    ctx.fillStyle = "#c7d4d2";
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    logoSlots.forEach((slot) => {
      const image = loadedImages.get(slot.src);
      if (!image) return;
      drawImageContain(ctx, image, slot.x, slot.y, slot.width, slot.height, 6);
    });

    texture.needsUpdate = true;
  };

  logoSlots.forEach((slot) => {
    const image = new Image();
    image.onload = () => {
      loadedImages.set(slot.src, image);
      render();
    };
    image.onerror = () => {
      debugEvent(`logo load failed | ${slot.src}`);
    };
    image.src = slot.src;
  });

  render();
  return texture;
}

function createProjectsTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 768;
  textureCanvas.height = 1280;
  const ctx = textureCanvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
  bg.addColorStop(0, "#14201f");
  bg.addColorStop(1, "#080b0c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  ctx.fillStyle = "rgba(98, 214, 198, 0.05)";
  ctx.fillRect(20, 20, textureCanvas.width - 40, textureCanvas.height - 40);

  ctx.fillStyle = "#ffad57";
  ctx.textAlign = "center";
  ctx.font = "700 80px monospace";
  ctx.fillText("PROJECTS", textureCanvas.width / 2, 150);

  ctx.fillStyle = "#62d6c6";
  ctx.font = "600 30px monospace";
  ctx.fillText("BUILD LOG // ACTIVE", textureCanvas.width / 2, 205);

  const cards = [
    { title: "Veil", detail: "in progress" },
    { title: "Circles", detail: "in development" },
    { title: "3D Desk Portfolio", detail: "Three.js" },
    { title: "Fantasy Basketball Bot", detail: "Finished" },
    { title: "Discord Feedback Bot", detail: "200+ MAU" },
  ];

  cards.forEach((card, index) => {
    const x = 58;
    const y = 230 + index * 168;
    const cardH = 158;
    ctx.fillStyle = "#111718";
    ctx.fillRect(x, y, 652, cardH);
    ctx.strokeStyle = "#3d5551";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#f3eee4";
    ctx.font = "700 42px monospace";
    ctx.fillText(card.title, x + 326, y + 68);

    ctx.fillStyle = "#9ca8a5";
    ctx.font = "600 28px monospace";
    ctx.fillText(card.detail, x + 326, y + 118);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffad57";
  ctx.font = "600 27px monospace";
  ctx.fillText("INTERACT // OPEN DOSSIER", textureCanvas.width / 2, 1186);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBuilderSignalTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 576;
  const ctx = textureCanvas.getContext("2d");

  ctx.fillStyle = "#071112";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  ctx.strokeStyle = "#315856";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, textureCanvas.width - 32, textureCanvas.height - 32);
  ctx.fillStyle = "#62d6c6";
  ctx.font = "700 34px monospace";
  ctx.fillText("PRODUCT SYSTEM // PM-01", 56, 72);
  ctx.fillStyle = "#f3eee4";
  ctx.font = "700 66px monospace";
  ctx.fillText("DISCOVER", 56, 154);
  ctx.fillText("DECIDE", 56, 225);
  ctx.fillText("SHIP", 56, 296);

  const stages = [
    { x: 570, y: 150, label: "USER" },
    { x: 740, y: 268, label: "SYSTEM" },
    { x: 570, y: 390, label: "OUTCOME" },
  ];
  ctx.strokeStyle = "rgba(98, 214, 198, 0.55)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(stages[0].x, stages[0].y);
  ctx.lineTo(stages[1].x, stages[1].y);
  ctx.lineTo(stages[2].x, stages[2].y);
  ctx.stroke();
  stages.forEach((stage, index) => {
    ctx.fillStyle = index === 1 ? "#ffad57" : "#62d6c6";
    ctx.beginPath();
    ctx.arc(stage.x, stage.y, index === 1 ? 28 : 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9ca8a5";
    ctx.font = "600 20px monospace";
    ctx.fillText(stage.label, stage.x + 42, stage.y + 7);
  });

  ctx.fillStyle = "#ffad57";
  ctx.fillRect(56, 446, 12, 54);
  ctx.fillStyle = "#9ca8a5";
  ctx.font = "500 22px monospace";
  ctx.fillText("PRODUCT MANAGER + BUILDER", 88, 469);
  ctx.fillText("HOUSTON / ONLINE", 88, 501);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createVeilSignalTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 576;
  const ctx = textureCanvas.getContext("2d");

  ctx.fillStyle = "#100d0a";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  ctx.strokeStyle = "#704324";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, textureCanvas.width - 32, textureCanvas.height - 32);
  ctx.fillStyle = "#ffad57";
  ctx.font = "700 34px monospace";
  ctx.fillText("NOW BUILDING // ACTIVE", 56, 72);
  ctx.fillStyle = "#f3eee4";
  ctx.font = "700 112px monospace";
  ctx.fillText("VEIL", 56, 190);
  ctx.fillStyle = "#c7cfcc";
  ctx.font = "500 25px monospace";
  ctx.fillText("ASK WHILE YOU WATCH", 62, 234);
  ctx.fillText("WITHOUT SPOILING WHAT COMES NEXT", 62, 270);

  ctx.strokeStyle = "#6e4c30";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(78, 390);
  ctx.lineTo(930, 390);
  ctx.stroke();
  const timeline = [
    { x: 120, label: "SEEN", color: "#62d6c6" },
    { x: 510, label: "NOW", color: "#ffad57" },
    { x: 880, label: "LOCKED", color: "#59615f" },
  ];
  timeline.forEach((point) => {
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, 390, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "600 21px monospace";
    ctx.fillText(point.label, point.x - 34, 438);
  });
  ctx.strokeStyle = "#ffad57";
  ctx.lineWidth = 5;
  ctx.strokeRect(458, 338, 104, 104);
  ctx.fillStyle = "#8c9894";
  ctx.font = "500 20px monospace";
  ctx.fillText("SPOILER BOUNDARY", 56, 516);
  ctx.fillStyle = "#62d6c6";
  ctx.fillRect(840, 497, 84, 10);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPortraitLabelTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 768;
  textureCanvas.height = 160;
  const ctx = textureCanvas.getContext("2d");
  ctx.fillStyle = "#080c0d";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  ctx.fillStyle = "#ffad57";
  ctx.font = "700 34px monospace";
  ctx.fillText("ABDULSABOOR // 01", 34, 58);
  ctx.fillStyle = "#9ca8a5";
  ctx.font = "500 22px monospace";
  ctx.fillText("PRODUCT MANAGER + BUILDER", 34, 103);
  ctx.fillStyle = "#62d6c6";
  ctx.fillRect(34, 126, 190, 8);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createDeskTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 256;
  const ctx = textureCanvas.getContext("2d");
  ctx.fillStyle = "#392b21";
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  for (let y = 16; y < textureCanvas.height; y += 18) {
    ctx.beginPath();
    for (let x = 0; x <= textureCanvas.width; x += 16) {
      const offset = Math.sin(x * 0.024 + y * 0.08) * 3;
      if (x === 0) ctx.moveTo(x, y + offset);
      else ctx.lineTo(x, y + offset);
    }
    ctx.strokeStyle = y % 36 === 0 ? "rgba(126, 83, 51, 0.3)" : "rgba(22, 15, 12, 0.34)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(1.7, 1);
  return texture;
}

function applyShadows(object, options = {}) {
  const cast = options.cast !== false;
  const receive = options.receive !== false;
  object.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = cast;
    node.receiveShadow = receive;
  });
}

function buildScene(scene) {
  scene.fog = new THREE.Fog(0x090b0c, 7, 26);

  const ambient = new THREE.AmbientLight(0xc8d7d4, 0.66);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffd4a3, 1.62);
  keyLight.position.set(3.8, 5.8, 4.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.00035;
  scene.add(keyLight);

  const blueFill = new THREE.PointLight(0x72cddd, 1.35, 5.5, 2.1);
  blueFill.position.set(0, 1.05, -0.65);
  scene.add(blueFill);

  const cyanFill = new THREE.PointLight(0x55d8c5, 0.78, 12, 2.2);
  cyanFill.position.set(-3.2, 2, 0.8);
  scene.add(cyanFill);

  const frontFill = new THREE.PointLight(0xffa060, 1.08, 12, 2.1);
  frontFill.position.set(0, 1.55, 3.1);
  scene.add(frontFill);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 72),
    new THREE.MeshStandardMaterial({ color: 0x111415, roughness: 0.94, metalness: 0.04 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.92;
  floor.receiveShadow = true;
  scene.add(floor);

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(11, 3.4, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x202426, roughness: 0.86 })
  );
  backWall.position.set(0, 1.1, -4);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const builderDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 1.32),
    new THREE.MeshStandardMaterial({
      map: createBuilderSignalTexture(),
      emissive: 0x123f3d,
      emissiveIntensity: 0.48,
      roughness: 0.38,
    })
  );
  builderDisplay.position.set(-2.7, 1.87, -3.88);
  builderDisplay.rotation.z = -0.025;
  scene.add(builderDisplay);

  const veilDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 1.32),
    new THREE.MeshStandardMaterial({
      map: createVeilSignalTexture(),
      emissive: 0x4d2815,
      emissiveIntensity: 0.48,
      roughness: 0.38,
    })
  );
  veilDisplay.position.set(2.7, 1.87, -3.88);
  veilDisplay.rotation.z = 0.025;
  scene.add(veilDisplay);

  const portraitGroup = new THREE.Group();
  const portraitFrame = new THREE.Mesh(
    roundedBox(1.42, 1.72, 0.08, 0.035, 5),
    new THREE.MeshStandardMaterial({ color: 0x12191a, roughness: 0.3, metalness: 0.48 })
  );
  portraitGroup.add(portraitFrame);
  const portraitTexture = new THREE.TextureLoader().load(
    "assets/portrait.jpg",
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    },
    undefined,
    () => debugEvent("portrait load failed | assets/portrait.jpg")
  );
  portraitTexture.colorSpace = THREE.SRGBColorSpace;
  const portrait = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 1.28),
    new THREE.MeshStandardMaterial({ map: portraitTexture, roughness: 0.52, emissive: 0x19383a, emissiveIntensity: 0.18 })
  );
  portrait.position.set(0, 0.17, 0.045);
  portraitGroup.add(portrait);
  const portraitLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 0.27),
    new THREE.MeshStandardMaterial({ map: createPortraitLabelTexture(), emissive: 0x3d2415, emissiveIntensity: 0.45, roughness: 0.4 })
  );
  portraitLabel.position.set(0, -0.62, 0.046);
  portraitGroup.add(portraitLabel);
  portraitGroup.position.set(0, 1.98, -3.82);
  applyShadows(portraitGroup, { receive: false });
  scene.add(portraitGroup);

  const desk = new THREE.Mesh(
    roundedBox(5.6, 0.18, 2.2, 0.065, 5),
    new THREE.MeshStandardMaterial({ map: createDeskTexture(), color: 0xffffff, roughness: 0.56, metalness: 0.08 })
  );
  desk.position.set(0, -0.12, -0.55);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  const deskEdge = new THREE.Mesh(
    roundedBox(5.48, 0.08, 0.06, 0.025, 4),
    new THREE.MeshStandardMaterial({ color: 0x171817, roughness: 0.34, metalness: 0.58 })
  );
  deskEdge.position.set(0, -0.1, 0.57);
  deskEdge.castShadow = true;
  scene.add(deskEdge);

  const deskMat = new THREE.Mesh(
    new THREE.BoxGeometry(4.3, 0.02, 1.55),
    new THREE.MeshStandardMaterial({ color: 0x151819, roughness: 0.88 })
  );
  deskMat.position.set(0, -0.02, -0.45);
  deskMat.receiveShadow = true;
  scene.add(deskMat);

  const deskLegMaterial = new THREE.MeshStandardMaterial({ color: 0x171a1b, roughness: 0.75, metalness: 0.3 });
  [-2.55, 2.55].forEach((x) => {
    [-1.45, 0.35].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.88, 0.12), deskLegMaterial);
      leg.position.set(x, -0.57, z);
      scene.add(leg);
    });
  });

  const floorGlow = new THREE.Mesh(
    new THREE.RingGeometry(1.75, 2.65, 64),
    new THREE.MeshBasicMaterial({ color: 0xff8a43, transparent: true, opacity: 0.16 })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.set(0, -0.905, -0.62);
  scene.add(floorGlow);

  const monitorGroup = new THREE.Group();
  const monitorFrame = new THREE.Mesh(
    roundedBox(2.5, 1.2, 0.09, 0.035, 5),
    new THREE.MeshStandardMaterial({
      color: 0x171b1c,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x102829,
      emissiveIntensity: 0.72,
    })
  );
  monitorGroup.add(monitorFrame);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.05),
    new THREE.MeshStandardMaterial({
      map: createExperienceTexture(),
      emissive: 0x3d7ec5,
      emissiveIntensity: 0.82,
      roughness: 0.25,
    })
  );
  monitorScreen.position.z = 0.052;
  monitorGroup.add(monitorScreen);

  const monitorWebcam = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.06, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x202f4e,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x1f4f86,
      emissiveIntensity: 0.65,
    })
  );
  monitorWebcam.position.set(0, 0.64, -0.01);
  monitorGroup.add(monitorWebcam);

  const monitorStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.46, 22),
    new THREE.MeshStandardMaterial({ color: 0x18243d, roughness: 0.58 })
  );
  monitorStand.position.set(0, -0.75, -0.02);
  monitorGroup.add(monitorStand);

  const monitorBase = new THREE.Mesh(
    roundedBox(0.62, 0.04, 0.34, 0.015, 4),
    new THREE.MeshStandardMaterial({ color: 0x131d31, roughness: 0.66 })
  );
  monitorBase.position.set(0, -0.98, -0.02);
  monitorGroup.add(monitorBase);

  monitorGroup.position.set(0, 0.93, -1.26);
  applyShadows(monitorGroup);
  scene.add(monitorGroup);

  const sideMonitor = new THREE.Group();
  const sideMonitorFrame = new THREE.Mesh(
    roundedBox(0.72, 1.36, 0.09, 0.035, 5),
    new THREE.MeshStandardMaterial({
      color: 0x171b1c,
      roughness: 0.42,
      metalness: 0.2,
      emissive: 0x102829,
      emissiveIntensity: 0.7,
    })
  );
  sideMonitor.add(sideMonitorFrame);
  const sideMonitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 1.24),
    new THREE.MeshStandardMaterial({
      map: createProjectsTexture(),
      emissive: 0x2f78b8,
      emissiveIntensity: 0.9,
      roughness: 0.25,
    })
  );
  sideMonitorScreen.position.z = 0.052;
  sideMonitor.add(sideMonitorScreen);

  const sideMonitorStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.04, 0.34, 18),
    new THREE.MeshStandardMaterial({ color: 0x1c2c48, roughness: 0.55, metalness: 0.22 })
  );
  sideMonitorStand.position.set(0, -0.88, 0);
  sideMonitor.add(sideMonitorStand);

  const sideMonitorBase = new THREE.Mesh(
    roundedBox(0.34, 0.03, 0.22, 0.012, 4),
    new THREE.MeshStandardMaterial({ color: 0x16233c, roughness: 0.6 })
  );
  sideMonitorBase.position.set(0, -1.07, 0);
  sideMonitor.add(sideMonitorBase);

  sideMonitor.position.set(-1.45, 0.87, -0.95);
  sideMonitor.rotation.y = 0.36;
  applyShadows(sideMonitor);
  scene.add(sideMonitor);

  const pcTower = new THREE.Group();
  const towerBody = new THREE.Mesh(
    roundedBox(0.94, 1.76, 1.12, 0.075, 5),
    new THREE.MeshStandardMaterial({
      color: 0x1b1e1f,
      roughness: 0.34,
      metalness: 0.34,
      emissive: 0x402418,
      emissiveIntensity: 1.02,
    })
  );
  pcTower.add(towerBody);

  const frontPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 1.6),
    new THREE.MeshStandardMaterial({
      color: 0x0f1a30,
      emissive: 0x183963,
      emissiveIntensity: 0.72,
      roughness: 0.24,
      metalness: 0.2,
    })
  );
  frontPanel.position.set(0, 0, 0.57);
  pcTower.add(frontPanel);

  const sideGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 1.48),
    new THREE.MeshStandardMaterial({
      color: 0x9cd4ff,
      transparent: true,
      opacity: 0.16,
      emissive: 0x2f73bf,
      emissiveIntensity: 0.64,
      roughness: 0.1,
      metalness: 0.05,
    })
  );
  sideGlass.position.set(-0.47, 0, 0);
  sideGlass.rotation.y = Math.PI / 2;
  pcTower.add(sideGlass);

  const fanOffsets = [0.52, 0, -0.52];
  fanOffsets.forEach((y) => {
    const fanRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.022, 16, 42),
      new THREE.MeshStandardMaterial({
        color: 0xffc27a,
        emissive: 0xff6b2c,
        emissiveIntensity: 1.35,
        roughness: 0.25,
      })
    );
    fanRing.position.set(0, y, 0.58);
    pcTower.add(fanRing);

    const fanCore = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 22),
      new THREE.MeshStandardMaterial({ color: 0x332217, emissive: 0xb84b22, emissiveIntensity: 0.8 })
    );
    fanCore.position.set(0, y, 0.585);
    pcTower.add(fanCore);
  });

  const towerFeetX = [-0.28, 0.28];
  towerFeetX.forEach((x) => {
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.05, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x121e34, roughness: 0.6 })
    );
    foot.position.set(x, -0.9, 0.2);
    pcTower.add(foot);
  });

  pcTower.position.set(2.24, 0.45, -0.95);
  pcTower.scale.setScalar(0.86);
  applyShadows(pcTower);
  scene.add(pcTower);

  const keyboard = new THREE.Group();
  const keyboardCase = new THREE.Mesh(
    roundedBox(1.9, 0.08, 0.62, 0.035, 5),
    new THREE.MeshStandardMaterial({
      color: 0x202826,
      roughness: 0.38,
      metalness: 0.28,
      emissive: 0x1f4f4a,
      emissiveIntensity: 0.7,
    })
  );
  keyboard.add(keyboardCase);
  keyboard.position.set(0.1, 0.07, -0.18);

  const wristRest = new THREE.Mesh(
    roundedBox(1.62, 0.05, 0.14, 0.02, 4),
    new THREE.MeshStandardMaterial({ color: 0x101827, roughness: 0.7 })
  );
  wristRest.position.set(0, -0.01, 0.38);
  keyboard.add(wristRest);

  const rowCounts = [14, 14, 13, 12];
  rowCounts.forEach((count, row) => {
    for (let col = 0; col < count; col += 1) {
      const keycap = new THREE.Mesh(
        roundedBox(0.105, 0.03, 0.095, 0.012, 3),
        new THREE.MeshStandardMaterial({
          color: row === 0 ? 0x66716d : 0x424d49,
          roughness: 0.38,
          metalness: 0.18,
          emissive: 0x183632,
          emissiveIntensity: 0.32,
        })
      );
      keycap.position.set((col - (count - 1) / 2) * 0.125, 0.06, -0.22 + row * 0.125);
      keyboard.add(keycap);
    }
  });
  const spacebar = new THREE.Mesh(
    roundedBox(0.58, 0.03, 0.095, 0.012, 3),
    new THREE.MeshStandardMaterial({ color: 0x5a6561, roughness: 0.38, metalness: 0.18 })
  );
  spacebar.position.set(0, 0.06, 0.27);
  keyboard.add(spacebar);
  applyShadows(keyboard);
  scene.add(keyboard);

  const mouse = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 22, 22),
    new THREE.MeshStandardMaterial({
      color: 0x252a29,
      roughness: 0.36,
      metalness: 0.18,
      emissive: 0x173737,
      emissiveIntensity: 0.86,
    })
  );
  mouse.scale.set(1, 0.58, 1.32);
  mouse.position.set(1.2, 0.11, 0.02);
  mouse.castShadow = true;
  mouse.receiveShadow = true;
  scene.add(mouse);

  const mousePad = new THREE.Mesh(
    roundedBox(0.94, 0.02, 0.68, 0.008, 4),
    new THREE.MeshStandardMaterial({ color: 0x0c121e, roughness: 0.92 })
  );
  mousePad.position.set(1.2, 0.01, 0.02);
  mousePad.receiveShadow = true;
  scene.add(mousePad);

  const phone = new THREE.Mesh(
    roundedBox(0.24, 0.42, 0.025, 0.01, 5),
    new THREE.MeshStandardMaterial({
      color: 0x151f32,
      roughness: 0.36,
      emissive: 0x1f4f7f,
      emissiveIntensity: 1,
    })
  );
  phone.rotation.x = -0.4;
  phone.rotation.z = -0.25;
  phone.position.set(1.72, 0.1, -0.06);
  phone.castShadow = true;
  phone.receiveShadow = true;
  scene.add(phone);

  const dumbbell = new THREE.Group();
  const dumbbellBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.95, 16),
    new THREE.MeshStandardMaterial({
      color: 0x1a2e4f,
      roughness: 0.44,
      metalness: 0.6,
      emissive: 0x102542,
      emissiveIntensity: 0.8,
    })
  );
  dumbbellBar.rotation.z = Math.PI / 2;
  dumbbell.add(dumbbellBar);
  [-0.36, 0.36].forEach((offset) => {
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.18, 22),
      new THREE.MeshStandardMaterial({ color: 0x172741, roughness: 0.45, metalness: 0.5 })
    );
    plate.rotation.z = Math.PI / 2;
    plate.position.x = offset;
    dumbbell.add(plate);
  });
  dumbbell.position.set(-1.72, 0.2, 0.22);
  applyShadows(dumbbell);
  scene.add(dumbbell);

  const lamp = new THREE.Group();
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.05, 24),
    new THREE.MeshStandardMaterial({ color: 0x131c2f, roughness: 0.7 })
  );
  lamp.add(lampBase);
  const lampArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.82, 18),
    new THREE.MeshStandardMaterial({ color: 0x1d2d4a, roughness: 0.5 })
  );
  lampArm.position.set(0, 0.4, 0);
  lampArm.rotation.z = 0.35;
  lamp.add(lampArm);
  const lampHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.17, 0.3, 20),
    new THREE.MeshStandardMaterial({
      color: 0xc16c32,
      emissive: 0xff7a32,
      emissiveIntensity: 1.55,
      roughness: 0.25,
    })
  );
  lampHead.position.set(0.26, 0.8, 0);
  lampHead.rotation.z = 1.2;
  lamp.add(lampHead);
  lamp.position.set(2.72, 0.02, -0.25);
  applyShadows(lamp);
  scene.add(lamp);

  const lampGlow = new THREE.PointLight(0xff9a4d, 1.55, 5.4, 1.6);
  lampGlow.position.set(2.9, 0.82, -0.2);
  scene.add(lampGlow);

  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.2, 18),
    new THREE.MeshStandardMaterial({ color: 0x1b2c47, roughness: 0.65 })
  );
  plantPot.position.set(-2.55, 0.03, -0.3);
  plantPot.castShadow = true;
  plantPot.receiveShadow = true;
  scene.add(plantPot);

  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.28, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x67d8bc,
        emissive: 0x2b7566,
        emissiveIntensity: 0.86,
        roughness: 0.4,
      })
    );
    leaf.position.set(-2.55 + (i - 3) * 0.018, 0.21 + Math.random() * 0.09, -0.3 + (Math.random() - 0.5) * 0.08);
    leaf.rotation.z = (i - 3) * 0.2;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    scene.add(leaf);
  }

  const headphones = new THREE.Group();
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.035, 18, 48, Math.PI),
    new THREE.MeshStandardMaterial({
      color: 0x3a3f3c,
      roughness: 0.5,
      metalness: 0.2,
      emissive: 0x572915,
      emissiveIntensity: 0.58,
    })
  );
  band.rotation.z = Math.PI;
  headphones.add(band);
  const earLeft = new THREE.Mesh(
    roundedBox(0.12, 0.17, 0.07, 0.025, 5),
    new THREE.MeshStandardMaterial({
      color: 0x34413f,
      roughness: 0.48,
      metalness: 0.18,
      emissive: 0x1c4b48,
      emissiveIntensity: 0.55,
    })
  );
  earLeft.position.set(-0.2, -0.03, 0);
  headphones.add(earLeft);
  const earRight = earLeft.clone();
  earRight.position.x = 0.2;
  headphones.add(earRight);
  headphones.position.set(2.5, 0.22, 0.38);
  headphones.rotation.y = -0.45;
  applyShadows(headphones);
  scene.add(headphones);

  const expHit = createHitMesh(2.55, 1.4, 0.6, new THREE.Vector3(0, 0.92, -1.2));
  const projHit = createHitMesh(0.92, 1.5, 0.6, new THREE.Vector3(-1.45, 0.87, -0.95));
  const skillsHit = createHitMesh(1.95, 0.32, 0.62, new THREE.Vector3(0.1, 0.11, -0.18));
  const activitiesHit = createHitMesh(0.94, 1.76, 1.12, new THREE.Vector3(2.2, 0.58, -0.95));
  const interestsHit = createHitMesh(1.15, 0.42, 0.45, new THREE.Vector3(-1.72, 0.2, 0.22));

  scene.add(expHit, projHit, skillsHit, activitiesHit, interestsHit);

  addInteractiveRecord({
    id: "experience",
    objectName: "monitor",
    hitMesh: expHit,
    floatObject: monitorGroup,
    labelAnchor: new THREE.Vector3(0, 1.8, -1.2),
    focusTarget: new THREE.Vector3(0, 0.9, -1.2),
    focusCameraPosition: new THREE.Vector3(1.8, 1.65, 2.9),
    highlightMaterials: collectEmissiveMaterials([monitorGroup]),
    sourceObject: monitorGroup,
    sourceCorners: [
      new THREE.Vector3(-1.15, -0.525, 0.05),
      new THREE.Vector3(1.15, -0.525, 0.05),
      new THREE.Vector3(1.15, 0.525, 0.05),
      new THREE.Vector3(-1.15, 0.525, 0.05),
    ],
  });

  addInteractiveRecord({
    id: "projects",
    objectName: "side monitor",
    hitMesh: projHit,
    floatObject: sideMonitor,
    labelAnchor: new THREE.Vector3(-1.45, 1.76, -0.95),
    focusTarget: new THREE.Vector3(-1.45, 0.9, -0.95),
    focusCameraPosition: new THREE.Vector3(-2.15, 1.78, 2.62),
    highlightMaterials: collectEmissiveMaterials([sideMonitor]),
    sourceObject: sideMonitor,
    sourceCorners: [
      new THREE.Vector3(-0.31, -0.62, 0.05),
      new THREE.Vector3(0.31, -0.62, 0.05),
      new THREE.Vector3(0.31, 0.62, 0.05),
      new THREE.Vector3(-0.31, 0.62, 0.05),
    ],
  });

  addInteractiveRecord({
    id: "skills",
    objectName: "keyboard",
    hitMesh: skillsHit,
    floatObject: keyboard,
    labelAnchor: new THREE.Vector3(0.1, 0.5, -0.18),
    focusTarget: new THREE.Vector3(0.1, 0.08, -0.18),
    focusCameraPosition: new THREE.Vector3(1.82, 1.08, 1.84),
    highlightMaterials: collectEmissiveMaterials([keyboard]),
  });

  addInteractiveRecord({
    id: "activities",
    objectName: "PC",
    hitMesh: activitiesHit,
    floatObject: pcTower,
    labelAnchor: new THREE.Vector3(2.2, 1.5, -0.95),
    focusTarget: new THREE.Vector3(2.2, 0.58, -0.95),
    focusCameraPosition: new THREE.Vector3(2.9, 1.1, 0.3),
    highlightMaterials: collectEmissiveMaterials([pcTower]),
  });

  addInteractiveRecord({
    id: "interests",
    objectName: "dumbbell",
    hitMesh: interestsHit,
    floatObject: dumbbell,
    labelAnchor: new THREE.Vector3(-1.72, 0.82, 0.22),
    focusTarget: new THREE.Vector3(-1.72, 0.2, 0.22),
    focusCameraPosition: new THREE.Vector3(-2.25, 1.2, 2.08),
    highlightMaterials: collectEmissiveMaterials([dumbbell]),
  });
}

function updateHoverLabel(record) {
  if (!record || activeSectionId != null) {
    hoverLabel.hidden = true;
    hoverLabel.style.display = "none";
    return;
  }

  state3d.tempVector.copy(record.labelAnchor).project(state3d.camera);
  const x = (state3d.tempVector.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (-state3d.tempVector.y * 0.5 + 0.5) * canvas.clientHeight;

  hoverLabel.hidden = false;
  hoverLabel.style.display = "block";
  hoverLabel.textContent = `Interact // ${record.objectName} : ${sectionMap.get(record.id).label}`;
  hoverLabel.style.left = `${x}px`;
  hoverLabel.style.top = `${y}px`;
}

function replaceSceneCanvas(newCanvas = null) {
  const replacement = newCanvas || document.createElement("canvas");
  const sceneDescriptionId = canvas.getAttribute("aria-describedby");
  const sceneLabel = canvas.getAttribute("aria-label");

  replacement.id = "scene";
  replacement.style.width = "100%";
  replacement.style.height = "100%";
  replacement.style.display = "block";
  replacement.setAttribute("aria-label", sceneLabel || "Interactive 3D desktop portfolio");
  if (sceneDescriptionId) replacement.setAttribute("aria-describedby", sceneDescriptionId);

  canvas.replaceWith(replacement);
  canvas = replacement;
  if (sceneWrap && canvas.parentElement !== sceneWrap) sceneWrap.prepend(canvas);
}

function initRendererWithRetry() {
  const attempts = [
    {
      name: "detached-canvas",
      run: () => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        replaceSceneCanvas(renderer.domElement);
        return renderer;
      },
    },
    {
      name: "existing-canvas",
      run: () => new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }),
    },
    {
      name: "high-performance",
      run: () =>
        new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }),
    },
    {
      name: "replacement-canvas",
      run: () => {
        replaceSceneCanvas();
        return new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      },
    },
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      debugEvent(`Renderer attempt start: ${attempt.name}`);
      const renderer = attempt.run();
      debugEvent(`Renderer attempt success: ${attempt.name}`);
      return renderer;
    } catch (error) {
      lastError = error;
      const reason = error instanceof Error ? error.message : String(error);
      debugEvent(`Renderer attempt failed: ${attempt.name} | ${reason}`);
    }
  }

  webglDebug.lastError = lastError ? String(lastError?.message || lastError) : "Unknown error";
  throw lastError;
}

function setupEvents() {
  quickNavToggle?.addEventListener("click", () => {
    const expanded = quickNavShell.classList.toggle("is-open");
    quickNavToggle.setAttribute("aria-expanded", String(expanded));
  });

  panelContent.addEventListener("click", (event) => {
    const projectItem = event.target.closest(".project-index-item");
    if (projectItem != null && activeSectionId === "projects") {
      const index = parseInt(projectItem.dataset.projectIndex, 10);
      if (!isNaN(index)) openPanelItem(activeSectionId, index);
      return;
    }
    if (event.target.closest(".panel-card-github") || event.target.closest(".panel-card-vercel")) return;
    const card = event.target.closest(".panel-overview-card");
    if (card != null && activeSectionId != null) {
      const index = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(index)) openPanelItem(activeSectionId, index);
    }
  });

  panelClose.addEventListener("click", () => {
    if (activeItemIndex != null && activeSectionId !== "projects") {
      backToOverview();
    } else {
      setOverviewMode({ hidePanel: true });
    }
  });

  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPanel(button.dataset.section);
      quickNavShell?.classList.remove("is-open");
      quickNavToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (activeItemIndex != null && activeSectionId !== "projects") {
        backToOverview();
      } else {
        setOverviewMode({ hidePanel: true });
      }
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const direction = event.key === "ArrowRight" ? 1 : -1;
    if (!cycleItem(direction)) {
      cycleSection(direction);
    }
  });

}

function boot3D() {
  debugEvent("boot3D start");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0.9, 3.2, 7.9);

  let renderer = null;
  try {
    renderer = initRendererWithRetry();
  } catch (error) {
    const probeCanvas = document.createElement("canvas");
    const hasWebgl2 = Boolean(probeCanvas.getContext("webgl2"));
    const hasWebgl = Boolean(probeCanvas.getContext("webgl"));
    const reason = error instanceof Error ? error.message : String(error);
    webglDebug.lastError = reason;
    debugEvent(`Renderer init failed: ${reason}`);
    sceneOverlay.hidden = false;
    sceneOverlay.style.display = "grid";
    sceneOverlay.querySelector("p").textContent =
      `WebGL renderer failed. webgl2=${hasWebgl2 ? "yes" : "no"}, webgl=${hasWebgl ? "yes" : "no"}.`;
    updateStatus("WebGL unavailable.");
    openPanel("experience", { keepPanelHidden: true, skip3DFocus: true });
    return;
  }

  debugEvent("Renderer initialized successfully.");
  sceneOverlay.hidden = true;
  sceneOverlay.style.display = "none";

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.enablePan = false;
  controls.minDistance = 2.5;
  controls.maxDistance = 18;
  controls.zoomSpeed = 1.5;
  controls.rotateSpeed = 1.25;
  controls.zoomToCursor = true;
  controls.minAzimuthAngle = -1.5;
  controls.maxAzimuthAngle = 1.5;
  controls.minPolarAngle = 0.52;
  controls.maxPolarAngle = 1.42;
  controls.target.set(0.1, 0.74, -0.6);
  controls.update();

  state3d.camera = camera;
  state3d.controls = controls;
  state3d.renderer = renderer;
  state3d.raycaster = new THREE.Raycaster();
  state3d.pointer = new THREE.Vector2();
  state3d.desiredTarget = controls.target.clone();
  const shortViewport = window.innerHeight <= 500;
  state3d.desiredCameraPosition = shortViewport
    ? new THREE.Vector3(0.32, 1.55, 3.72)
    : new THREE.Vector3(0.55, 2.05, 5.2);
  state3d.homeTarget = state3d.desiredTarget.clone();
  state3d.homeCameraPosition = state3d.desiredCameraPosition.clone();

  buildScene(scene);

  if (prefersReducedMotion.matches) {
    state3d.intro = null;
    camera.position.copy(state3d.homeCameraPosition);
    controls.target.copy(state3d.homeTarget);
    controls.enabled = true;
    controls.update();
  } else {
    state3d.intro = {
      active: true,
      start: performance.now(),
      duration: 2100,
      fromPosition: new THREE.Vector3(1.0, 3.3, 8.1),
      toPosition: state3d.homeCameraPosition.clone(),
      fromTarget: new THREE.Vector3(0.7, 1.45, 0.45),
      toTarget: state3d.homeTarget.clone(),
    };
    controls.enabled = false;
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize);
  resize();

  function pickRecord() {
    state3d.raycaster.setFromCamera(state3d.pointer, camera);
    const hitMeshes = state3d.interactiveRecords.map((record) => record.hitMesh);
    const hits = state3d.raycaster.intersectObjects(hitMeshes, false);
    if (!hits.length) return null;
    return state3d.interactiveRecords.find((record) => record.hitMesh === hits[0].object) || null;
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    state3d.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state3d.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onClick(event) {
    onPointerMove(event);
    const clickedRecord = pickRecord();
    if (!clickedRecord) {
      setOverviewMode({ hidePanel: true });
      return;
    }
    openPanel(clickedRecord.id);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("pointerleave", () => {
    hoveredRecord = null;
    hoverLabel.hidden = true;
    hoverLabel.style.display = "none";
    document.body.style.cursor = "default";
      updateStatus(sectionMap.get(activeSectionId)?.status || defaultStatus());
  });

  updateStatus("Cinematic intro...");
  setOverviewMode({ hidePanel: true, instant: false });

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    const now = performance.now();

    if (state3d.intro?.active) {
      const progress = Math.min((now - state3d.intro.start) / state3d.intro.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.lerpVectors(state3d.intro.fromPosition, state3d.intro.toPosition, eased);
      controls.target.lerpVectors(state3d.intro.fromTarget, state3d.intro.toTarget, eased);
      if (progress >= 1) {
        state3d.intro.active = false;
        controls.enabled = true;
        setOverviewMode({ hidePanel: true, instant: true });
      }
    } else {
      camera.position.lerp(state3d.desiredCameraPosition, 0.08);
      controls.target.lerp(state3d.desiredTarget, 0.1);
    }

    hoveredRecord = pickRecord();
    updateHoverLabel(hoveredRecord);

    state3d.interactiveRecords.forEach((record, index) => {
      const isHovered = hoveredRecord === record;
      const isActive = activeSectionId === record.id;
      const yFloat = Math.sin(elapsed * 1.15 + index * 0.6) * 0.006;
      record.floatObject.position.y = record.baseY + yFloat;

      const scaleTarget = isHovered ? 1.05 : isActive ? 1.02 : 1;
      record.floatObject.scale.copy(record.baseScale).multiplyScalar(scaleTarget);

      const emissiveTarget = isHovered ? 1.25 : isActive ? 0.92 : 0.56;
      record.highlightMaterials.forEach((material) => {
        material.emissiveIntensity += (emissiveTarget - material.emissiveIntensity) * 0.16;
      });
    });

    if (hoveredRecord) {
      document.body.style.cursor = "pointer";
      updateStatus(`Click ${hoveredRecord.objectName} to open ${sectionMap.get(hoveredRecord.id).label}.`);
    } else if (!state3d.intro?.active) {
      document.body.style.cursor = "default";
      const section = activeSectionId != null ? sectionMap.get(activeSectionId) : null;
      const status =
        section?.id === "projects"
          ? "Select a signal · ← → to scan · Esc to close."
          : section && activeItemIndex != null && section.items
          ? "Click a card for details · ← → to browse · ← or Esc for overview."
          : section?.status || defaultStatus();
      updateStatus(status);
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

setupEvents();
setPanelVisible(false);
boot3D();
