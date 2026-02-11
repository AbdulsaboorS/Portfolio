const sectionOrder = ["about", "experience", "projects", "education", "beyond", "contact"];

const sectionMeta = {
  about: {
    title: "Mindset",
    subtitle: "Hard working. Accomplished. Always improving.",
    scenePrompt: "Wall frame selected: mindset and personal philosophy.",
    render: () => `
      <section class="panel-block">
        <h3>Builder energy, PM execution</h3>
        <p>
          I am an MIS student at UH with a builder's mindset. I solve real problems, align people fast,
          and ship outcomes with discipline.
        </p>
      </section>
      <section class="panel-block">
        <h3>What people should feel here</h3>
        <p>
          Authenticity and polish. This space is designed to show confident execution, not just claims.
        </p>
        <div class="chip-row">
          <span class="chip">Discipline</span>
          <span class="chip">Consistency</span>
          <span class="chip">Curiosity</span>
          <span class="chip">Leadership</span>
          <span class="chip">Humor</span>
        </div>
      </section>
    `,
  },
  experience: {
    title: "Experience Metrics",
    subtitle: "High-impact internships and cross-functional wins.",
    scenePrompt: "Main monitor selected: impact metrics across roles.",
    render: () => `
      <section class="panel-block">
        <h3>Expedia Group · Product Manager Intern</h3>
        <div class="metric-grid">
          <article class="metric-tile">
            <span class="label">Fraud prevention impact</span>
            <p class="value">$210K+ / year</p>
          </article>
          <article class="metric-tile">
            <span class="label">User churn reduced</span>
            <p class="value">12%</p>
          </article>
          <article class="metric-tile">
            <span class="label">Users affected</span>
            <p class="value">50K+</p>
          </article>
          <article class="metric-tile">
            <span class="label">Team alignment speed</span>
            <p class="value">1 week faster</p>
          </article>
        </div>
      </section>
      <section class="panel-block">
        <h3>HubSpot · Product Manager Intern</h3>
        <div class="metric-grid">
          <article class="metric-tile">
            <span class="label">Projected savings</span>
            <p class="value">$770K+ / year</p>
          </article>
          <article class="metric-tile">
            <span class="label">Support tickets reduced</span>
            <p class="value">20%</p>
          </article>
          <article class="metric-tile">
            <span class="label">Platform users enabled</span>
            <p class="value">6,000+ WAU</p>
          </article>
          <article class="metric-tile">
            <span class="label">Adoption growth</span>
            <p class="value">+32%</p>
          </article>
        </div>
      </section>
      <section class="panel-block">
        <h3>Oceaneering + Extern</h3>
        <div class="metric-grid">
          <article class="metric-tile">
            <span class="label">Workflow time saved</span>
            <p class="value">20+ hrs / month</p>
          </article>
          <article class="metric-tile">
            <span class="label">Project cost reduction</span>
            <p class="value">$250K</p>
          </article>
          <article class="metric-tile">
            <span class="label">Retention lift</span>
            <p class="value">+6%</p>
          </article>
          <article class="metric-tile">
            <span class="label">Roadmap quality gain</span>
            <p class="value">+9%</p>
          </article>
        </div>
      </section>
    `,
  },
  projects: {
    title: "Projects Lab",
    subtitle: "Shipped projects and active builds in progress.",
    scenePrompt: "Secondary monitor selected: current and upcoming projects.",
    render: () => `
      <article class="project-card">
        <h3>AI-Powered Discord Chatbot for Feature Insights</h3>
        <p>
          Built and deployed a Discord bot that analyzed user feedback in real time
          using Azure AI sentiment analysis and Python NLP.
        </p>
        <p class="status">Status: shipped</p>
        <p class="meta">Result: 200+ MAU, 4.6/5 satisfaction score</p>
      </article>
      <article class="project-card">
        <h3>Fantasy Football Bot</h3>
        <p>
          In-progress build focused on helping users make better lineup and waiver decisions.
          Goal is to blend analytics with practical weekly recommendations.
        </p>
        <p class="status">Status: building now</p>
        <p class="meta">Theme: sports + product experimentation</p>
      </article>
      <article class="project-card">
        <h3>Spoiler Shield</h3>
        <p>
          In-progress concept to reduce accidental spoilers for anime and sports communities
          through smarter filtering and timing controls.
        </p>
        <p class="status">Status: concept + iteration</p>
        <p class="meta">Theme: user pain-point first, then feature execution</p>
      </article>
    `,
  },
  education: {
    title: "Education & Growth",
    subtitle: "University, coursework, and continuous learning.",
    scenePrompt: "Notebook selected: school foundation and learning path.",
    render: () => `
      <section class="panel-block">
        <h3>University of Houston · C.T. Bauer College of Business</h3>
        <p>BBA in Management Information Systems · GPA 3.81 · May 2026</p>
      </section>
      <section class="panel-block">
        <h3>Relevant coursework</h3>
        <div class="chip-row">
          <span class="chip">Product Management</span>
          <span class="chip">Systems Analysis & Design</span>
          <span class="chip">Database Systems</span>
          <span class="chip">Entrepreneurship</span>
          <span class="chip">Statistics</span>
          <span class="chip">Marketing</span>
        </div>
      </section>
      <section class="panel-block">
        <h3>Certifications and learning</h3>
        <div class="chip-row">
          <span class="chip">Azure AI Fundamentals</span>
          <span class="chip">Product Discovery Certificate</span>
          <span class="chip">Introduction to R</span>
        </div>
      </section>
    `,
  },
  beyond: {
    title: "Beyond Work",
    subtitle: "Personality, consistency, and values outside the job.",
    scenePrompt: "Shelf selected: hobbies, discipline, and character.",
    render: () => `
      <section class="panel-block">
        <h3>How I stay sharp</h3>
        <div class="chip-row">
          <span class="chip">Gym consistency</span>
          <span class="chip">Gaming</span>
          <span class="chip">Anime</span>
          <span class="chip">Sports</span>
          <span class="chip">Trading</span>
          <span class="chip">Faith-driven routine</span>
        </div>
      </section>
      <section class="panel-block">
        <h3>Community impact</h3>
        <p>
          As Vice President at United Mission Relief, I help coordinate service events reaching
          1,000+ unhoused individuals and led a digital check-in platform that reduced manual work by 40%.
        </p>
      </section>
      <section class="panel-block">
        <h3>Personal philosophy</h3>
        <p>
          Dependable over flashy. Show up daily, execute with discipline, and keep improving.
        </p>
      </section>
    `,
  },
  contact: {
    title: "Contact / Hire Me",
    subtitle: "Open to PM internships and full-time product roles.",
    scenePrompt: "Phone selected: ways to connect quickly.",
    render: () => `
      <section class="panel-block">
        <h3>Let's connect</h3>
        <ul class="contact-list">
          <li><a href="mailto:shaikhabdulsaboor1@gmail.com">Email · shaikhabdulsaboor1@gmail.com</a></li>
          <li><a href="https://www.linkedin.com/in/shaikhabdulsaboor/" target="_blank" rel="noreferrer">LinkedIn · /in/shaikhabdulsaboor</a></li>
          <li><a href="https://github.com/AbdulsaboorS" target="_blank" rel="noreferrer">GitHub · @AbdulsaboorS</a></li>
          <li><a href="resume-highlights.html">Resume highlights</a></li>
        </ul>
      </section>
      <section class="panel-block">
        <h3>What I am targeting</h3>
        <div class="chip-row">
          <span class="chip">Product Manager Internship</span>
          <span class="chip">Full-time PM roles</span>
          <span class="chip">AI + platform products</span>
        </div>
      </section>
    `,
  },
};

const panelTitle = document.querySelector("#panel-title");
const panelSubtitle = document.querySelector("#panel-subtitle");
const panelContent = document.querySelector("#panel-content");
const panelRoot = document.querySelector("#content-panel");
const sceneStatus = document.querySelector("#scene-status");
const quickButtons = Array.from(document.querySelectorAll(".quick-nav button"));
const tourToggleButton = document.querySelector("#tour-toggle");
const sceneOverlay = document.querySelector("#scene-overlay");
const sceneCanvas = document.querySelector("#portfolio-scene");

const state = {
  activeSection: "about",
  tourTimer: null,
  tourRunning: false,
  hotspots: [],
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
  rafId: null,
  raycaster: null,
  pointer: null,
  hoveredHotspot: null,
};

function setSceneStatus(message) {
  sceneStatus.textContent = message;
}

function setActiveSection(sectionId, options = {}) {
  const section = sectionMeta[sectionId];
  if (!section) return;

  state.activeSection = sectionId;
  panelTitle.textContent = section.title;
  panelSubtitle.textContent = section.subtitle;
  panelContent.innerHTML = section.render();
  setSceneStatus(section.scenePrompt);

  quickButtons.forEach((button) => {
    const isActive = button.dataset.section === sectionId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });

  syncHotspotVisualState();

  if (options.focusPanel) {
    panelRoot.focus();
  }
}

function cycleSection(step) {
  const currentIndex = sectionOrder.indexOf(state.activeSection);
  const nextIndex = (currentIndex + step + sectionOrder.length) % sectionOrder.length;
  setActiveSection(sectionOrder[nextIndex], { focusPanel: true });
}

function stopGuidedTour() {
  if (state.tourTimer) {
    window.clearInterval(state.tourTimer);
    state.tourTimer = null;
  }

  state.tourRunning = false;
  tourToggleButton.setAttribute("aria-pressed", "false");
  tourToggleButton.textContent = "Start guided tour";
  setSceneStatus(sectionMeta[state.activeSection].scenePrompt);
}

function startGuidedTour() {
  if (state.tourRunning) {
    stopGuidedTour();
    return;
  }

  state.tourRunning = true;
  tourToggleButton.setAttribute("aria-pressed", "true");
  tourToggleButton.textContent = "Stop guided tour";
  setSceneStatus("Guided tour running. Sit back or click any section to jump.");

  let cursor = sectionOrder.indexOf(state.activeSection);
  state.tourTimer = window.setInterval(() => {
    cursor = (cursor + 1) % sectionOrder.length;
    setActiveSection(sectionOrder[cursor], { focusPanel: false });
  }, 4200);
}

function enableFallbackMode(message) {
  setSceneStatus(message);
  sceneOverlay.hidden = false;
  sceneCanvas.setAttribute("aria-hidden", "true");
}

function isWebGLSupported() {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
    );
  } catch (error) {
    return false;
  }
}

async function importThreeModules() {
  const sources = [
    {
      core: "https://esm.sh/three@0.160.0",
      controls: "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js",
    },
    {
      core: "https://unpkg.com/three@0.160.0/build/three.module.js?module",
      controls: "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js?module",
    },
  ];

  let lastError = null;
  for (const source of sources) {
    try {
      const threeModule = await import(source.core);
      const controlsModule = await import(source.controls);
      return { THREE: threeModule, OrbitControls: controlsModule.OrbitControls };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function createRoomScene(THREE) {
  const { scene } = state;

  scene.background = new THREE.Color(0x070a12);
  scene.fog = new THREE.Fog(0x070a12, 6, 17);

  const ambient = new THREE.AmbientLight(0x97a8ff, 0.42);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x8fb6ff, 0.95);
  keyLight.position.set(4, 5.5, 3);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x57d0ff, 0.65, 12, 2);
  rimLight.position.set(-2.7, 2.7, -2.4);
  scene.add(rimLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0x11172a, roughness: 0.88, metalness: 0.1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.88;
  scene.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x171f36, roughness: 0.9 });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallMaterial);
  backWall.position.set(0, 1.2, -4.3);
  scene.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 8.8), wallMaterial);
  sideWall.position.set(-5.3, 1.2, -0.1);
  scene.add(sideWall);

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(4.25, 0.34, 1.95),
    new THREE.MeshStandardMaterial({ color: 0x222e46, roughness: 0.62, metalness: 0.2 })
  );
  desk.position.set(0, -0.16, -0.72);
  scene.add(desk);

  const deskLegMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2236, roughness: 0.65 });
  [-1.95, 1.95].forEach((x) => {
    [-1.45, -0.08].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.72, 0.15), deskLegMaterial);
      leg.position.set(x, -0.61, z);
      scene.add(leg);
    });
  });

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.03, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x101726, roughness: 0.75 })
  );
  keyboard.position.set(0.1, 0.03, -0.12);
  scene.add(keyboard);

  const animeLightStrip = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.03, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x66c0ff,
      emissive: 0x154f88,
      emissiveIntensity: 1.25,
    })
  );
  animeLightStrip.position.set(-1.56, 0.09, -1.66);
  scene.add(animeLightStrip);
}

function addHotspot({ THREE, section, label, position, color }) {
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 24, 24),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.1,
    })
  );
  marker.position.copy(position);
  marker.userData = { section, label, baseScale: 1 };
  state.scene.add(marker);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.012, 10, 36),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.65,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(position);
  ring.position.y -= 0.03;
  state.scene.add(ring);

  state.hotspots.push({ section, label, marker, ring, color });
}

function createSceneProps(THREE) {
  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.84, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x22314f, roughness: 0.45, metalness: 0.15 })
  );
  monitor.position.set(0, 0.63, -1.32);
  state.scene.add(monitor);

  const monitorGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.26, 0.69),
    new THREE.MeshStandardMaterial({
      color: 0x183b66,
      emissive: 0x255a9a,
      emissiveIntensity: 0.98,
      roughness: 0.4,
    })
  );
  monitorGlow.position.set(0, 0.63, -1.28);
  state.scene.add(monitorGlow);

  const tablet = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.52, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1b2840, roughness: 0.42, metalness: 0.2 })
  );
  tablet.rotation.x = -0.55;
  tablet.position.set(1.25, 0.2, -0.95);
  state.scene.add(tablet);

  const notebook = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.06, 0.56),
    new THREE.MeshStandardMaterial({ color: 0x2d3a59, roughness: 0.9 })
  );
  notebook.position.set(-1.2, 0.05, -0.55);
  notebook.rotation.y = 0.22;
  state.scene.add(notebook);

  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.14, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x1f2a45, roughness: 0.76 })
  );
  shelf.position.set(2.75, 0.88, -2.28);
  state.scene.add(shelf);

  const dumbbell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.42, 16),
    new THREE.MeshStandardMaterial({ color: 0x1e2640, roughness: 0.45 })
  );
  dumbbell.rotation.z = Math.PI / 2;
  dumbbell.position.set(2.62, 1.03, -2.22);
  state.scene.add(dumbbell);

  const phone = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.42, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x10192b,
      emissive: 0x13445f,
      emissiveIntensity: 0.9,
    })
  );
  phone.position.set(1.55, 0.09, -0.38);
  phone.rotation.x = -0.42;
  phone.rotation.z = -0.28;
  state.scene.add(phone);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.56, 0.78, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2a3758, roughness: 0.6, metalness: 0.1 })
  );
  frame.position.set(-2.25, 1.58, -4.16);
  state.scene.add(frame);

  const frameFill = new THREE.Mesh(
    new THREE.PlaneGeometry(1.33, 0.58),
    new THREE.MeshStandardMaterial({
      color: 0x0f1631,
      emissive: 0x1f3c66,
      emissiveIntensity: 0.95,
    })
  );
  frameFill.position.set(-2.25, 1.58, -4.12);
  state.scene.add(frameFill);

  addHotspot({
    THREE,
    section: "experience",
    label: "main monitor",
    position: new THREE.Vector3(0, 0.68, -1.08),
    color: 0x58a8ff,
  });

  addHotspot({
    THREE,
    section: "projects",
    label: "secondary monitor",
    position: new THREE.Vector3(1.18, 0.28, -0.8),
    color: 0x52f0cf,
  });

  addHotspot({
    THREE,
    section: "education",
    label: "desk notebook",
    position: new THREE.Vector3(-1.15, 0.17, -0.47),
    color: 0x9ea7ff,
  });

  addHotspot({
    THREE,
    section: "beyond",
    label: "hobby shelf",
    position: new THREE.Vector3(2.72, 1.13, -2.16),
    color: 0xff9f7f,
  });

  addHotspot({
    THREE,
    section: "contact",
    label: "phone glow",
    position: new THREE.Vector3(1.53, 0.22, -0.35),
    color: 0x90ffcf,
  });

  addHotspot({
    THREE,
    section: "about",
    label: "mindset frame",
    position: new THREE.Vector3(-2.25, 1.65, -3.96),
    color: 0xffb6d9,
  });
}

function syncHotspotVisualState() {
  state.hotspots.forEach((hotspot) => {
    const isActive = hotspot.section === state.activeSection;
    hotspot.ring.material.opacity = isActive ? 1 : 0.55;
  });
}

function attachPointerHandlers() {
  state.raycaster = new state.THREE.Raycaster();
  state.pointer = new state.THREE.Vector2();

  const getIntersectedHotspot = (event) => {
    const rect = sceneCanvas.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const intersections = state.raycaster.intersectObjects(
      state.hotspots.map((hotspot) => hotspot.marker),
      false
    );
    if (!intersections.length) return null;
    return state.hotspots.find((hotspot) => hotspot.marker === intersections[0].object) || null;
  };

  sceneCanvas.addEventListener("pointermove", (event) => {
    const hotspot = getIntersectedHotspot(event);
    state.hoveredHotspot = hotspot;
    if (hotspot) {
      sceneCanvas.style.cursor = "pointer";
      setSceneStatus(`Click ${hotspot.label} to open ${sectionMeta[hotspot.section].title}.`);
      return;
    }
    sceneCanvas.style.cursor = "grab";
    setSceneStatus(sectionMeta[state.activeSection].scenePrompt);
  });

  sceneCanvas.addEventListener("pointerleave", () => {
    state.hoveredHotspot = null;
    sceneCanvas.style.cursor = "grab";
    setSceneStatus(sectionMeta[state.activeSection].scenePrompt);
  });

  sceneCanvas.addEventListener("click", (event) => {
    const hotspot = getIntersectedHotspot(event);
    if (!hotspot) return;
    setActiveSection(hotspot.section, { focusPanel: true });
    if (state.tourRunning) stopGuidedTour();
  });
}

function initLayoutEvents() {
  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveSection(button.dataset.section, { focusPanel: true });
      if (state.tourRunning) stopGuidedTour();
    });
  });

  tourToggleButton.addEventListener("click", startGuidedTour);

  window.addEventListener("keydown", (event) => {
    const tagName = document.activeElement?.tagName?.toLowerCase();
    if (tagName === "input" || tagName === "textarea") return;

    if (event.key === "ArrowRight") {
      cycleSection(1);
      if (state.tourRunning) stopGuidedTour();
    }
    if (event.key === "ArrowLeft") {
      cycleSection(-1);
      if (state.tourRunning) stopGuidedTour();
    }
  });
}

function handleResize() {
  if (!state.renderer || !state.camera) return;
  const width = sceneCanvas.clientWidth;
  const height = sceneCanvas.clientHeight;
  if (!width || !height) return;
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height, false);
}

function animateScene() {
  const { THREE } = state;
  const clock = new THREE.Clock();

  const frame = () => {
    const elapsed = clock.getElapsedTime();
    state.hotspots.forEach((hotspot, index) => {
      const pulse = 1 + Math.sin(elapsed * 2.5 + index * 0.8) * 0.11;
      const emphasis = hotspot.section === state.activeSection ? 1.25 : 1;
      hotspot.marker.scale.setScalar(pulse * emphasis);
      hotspot.ring.rotation.z += 0.008;
      hotspot.marker.material.emissiveIntensity =
        hotspot.section === state.activeSection ? 1.9 : 1.1;
    });

    state.controls.update();
    state.renderer.render(state.scene, state.camera);
    state.rafId = window.requestAnimationFrame(frame);
  };

  state.rafId = window.requestAnimationFrame(frame);
}

async function init3D() {
  if (!isWebGLSupported()) {
    enableFallbackMode("WebGL unavailable on this device. Quick-access mode is active.");
    return;
  }

  try {
    const loaded = await importThreeModules();
    state.THREE = loaded.THREE;

    const { THREE, OrbitControls } = loaded;
    state.scene = new THREE.Scene();
    state.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    state.camera.position.set(2.5, 1.8, 4.9);

    state.renderer = new THREE.WebGLRenderer({
      canvas: sceneCanvas,
      antialias: true,
      alpha: true,
    });
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.renderer.outputColorSpace = THREE.SRGBColorSpace;

    state.controls = new OrbitControls(state.camera, sceneCanvas);
    state.controls.enableDamping = true;
    state.controls.enablePan = false;
    state.controls.minDistance = 2.6;
    state.controls.maxDistance = 7.4;
    state.controls.minPolarAngle = 0.65;
    state.controls.maxPolarAngle = 1.45;
    state.controls.target.set(0.05, 0.45, -1.1);
    state.controls.update();

    createRoomScene(THREE);
    createSceneProps(THREE);
    syncHotspotVisualState();
    attachPointerHandlers();
    handleResize();
    animateScene();

    window.addEventListener("resize", handleResize);
  } catch (error) {
    console.error("3D scene failed to initialize:", error);
    enableFallbackMode("Could not load 3D modules. Quick-access mode is active.");
  }
}

function init() {
  initLayoutEvents();
  setActiveSection("about");
  init3D();
}

init();
