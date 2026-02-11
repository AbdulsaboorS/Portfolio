const sectionOrder = ["experience", "projects", "activities", "skills", "interests"];

const sectionContent = {
  experience: {
    title: "Experience",
    subtitle: "Internships where I shipped measurable outcomes.",
    status: "Monitor selected: experience highlights loaded.",
    panel: `
      <section class="panel-block">
        <h3>Expedia Group - Product Manager Intern</h3>
        <div class="metric-grid">
          <article class="metric-tile">
            <p class="value">$210K+</p>
            <p class="label">Annual fraud-loss prevention</p>
          </article>
          <article class="metric-tile">
            <p class="value">12%</p>
            <p class="label">User churn reduction</p>
          </article>
          <article class="metric-tile">
            <p class="value">50K+</p>
            <p class="label">Users impacted</p>
          </article>
          <article class="metric-tile">
            <p class="value">4 teams</p>
            <p class="label">Aligned one week faster</p>
          </article>
        </div>
      </section>
      <section class="panel-block">
        <h3>HubSpot + Others</h3>
        <div class="metric-grid">
          <article class="metric-tile">
            <p class="value">$770K+</p>
            <p class="label">Projected annual savings</p>
          </article>
          <article class="metric-tile">
            <p class="value">20%</p>
            <p class="label">Ticket reduction</p>
          </article>
          <article class="metric-tile">
            <p class="value">6,000+</p>
            <p class="label">Weekly active users enabled</p>
          </article>
          <article class="metric-tile">
            <p class="value">$250K</p>
            <p class="label">Cost reduction at Oceaneering</p>
          </article>
        </div>
      </section>
    `,
  },
  projects: {
    title: "Side Projects",
    subtitle: "Building in public with a product + AI mindset.",
    status: "PC tower selected: side project lab opened.",
    panel: `
      <article class="project-card">
        <h3>Discord Feedback Bot</h3>
        <p>Built with Azure AI + Python NLP to analyze sentiment and trends in real time.</p>
        <p><strong>Result:</strong> 200+ MAU and 4.6/5 user satisfaction.</p>
      </article>
      <article class="project-card">
        <h3>Fantasy Football Bot</h3>
        <p>In progress: recommendations for waiver and lineup decisions with explainable logic.</p>
      </article>
      <article class="project-card">
        <h3>Spoiler Shield</h3>
        <p>In progress: spoiler filtering controls for sports/anime communities.</p>
      </article>
    `,
  },
  activities: {
    title: "Activities",
    subtitle: "Execution outside formal professional roles.",
    status: "Mouse selected: activities section opened.",
    panel: `
      <section class="panel-block">
        <h3>Leadership and service</h3>
        <p>
          Vice President at United Mission Relief. Coordinated service events supporting
          1,000+ unhoused individuals.
        </p>
      </section>
      <section class="panel-block">
        <h3>Operational impact</h3>
        <p>
          Built a digital volunteer check-in and hour-tracking flow that reduced manual coordination by 40%.
        </p>
      </section>
    `,
  },
  skills: {
    title: "Skills",
    subtitle: "Technical, product, and execution skill stack.",
    status: "Keyboard selected: skill stack loaded.",
    panel: `
      <section class="panel-block">
        <h3>PM toolkit</h3>
        <div class="chip-row">
          <span class="chip">PRDs</span>
          <span class="chip">Roadmapping</span>
          <span class="chip">Prioritization</span>
          <span class="chip">User research</span>
          <span class="chip">Cross-functional leadership</span>
          <span class="chip">Agile delivery</span>
        </div>
      </section>
      <section class="panel-block">
        <h3>Technical stack</h3>
        <div class="chip-row">
          <span class="chip">JavaScript</span>
          <span class="chip">Python</span>
          <span class="chip">Java</span>
          <span class="chip">SQL</span>
          <span class="chip">R</span>
          <span class="chip">HTML/CSS</span>
          <span class="chip">Azure AI</span>
          <span class="chip">Power BI</span>
        </div>
      </section>
    `,
  },
  interests: {
    title: "Interests",
    subtitle: "The routines and passions that keep me sharp.",
    status: "Dumbbell selected: interests and lifestyle opened.",
    panel: `
      <section class="panel-block">
        <h3>Core interests</h3>
        <div class="chip-row">
          <span class="chip">Gym consistency</span>
          <span class="chip">Sports</span>
          <span class="chip">Anime</span>
          <span class="chip">Gaming</span>
          <span class="chip">Trading</span>
          <span class="chip">Faith-driven growth</span>
        </div>
      </section>
      <section class="panel-block">
        <h3>How this shows up in work</h3>
        <p>
          Discipline, consistency, and composure under pressure are the same traits I bring to product execution.
        </p>
      </section>
    `,
  },
};

const panelRoot = document.querySelector("#info-panel");
const panelHandle = document.querySelector("#panel-handle");
const panelClose = document.querySelector("#panel-close");
const panelTitle = document.querySelector("#panel-title");
const panelSubtitle = document.querySelector("#panel-subtitle");
const panelContent = document.querySelector("#panel-content");
const sceneStatus = document.querySelector("#scene-status");
const sceneCanvas = document.querySelector("#portfolio-scene");
const sceneOverlay = document.querySelector("#scene-overlay");
const hoverLabel = document.querySelector("#hover-label");
const quickButtons = Array.from(document.querySelectorAll(".quick-nav button"));
const tourToggle = document.querySelector("#tour-toggle");

const state = {
  activeSection: null,
  tourTimer: null,
  tourRunning: false,
  webglEnabled: false,
  sceneStatusDefault: "Drag to rotate, hover an object to preview, click to open details.",
  three: {
    THREE: null,
    OrbitControls: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: null,
    pointer: null,
    hitMeshes: [],
    meshToRecord: new Map(),
    recordBySection: new Map(),
    hoveredRecord: null,
    focusTarget: null,
    focusCamera: null,
    focusAnimating: false,
    intro: null,
    raf: null,
    tempWorld: null,
  },
};

function setSceneStatus(message) {
  sceneStatus.textContent = message;
}

function isPanelCollapsed() {
  return panelRoot.classList.contains("is-collapsed");
}

function setPanelCollapsed(collapsed) {
  panelRoot.classList.toggle("is-collapsed", collapsed);
  panelHandle.setAttribute("aria-expanded", String(!collapsed));
  panelHandle.textContent = collapsed ? "Open details" : "Hide details";
}

function openPanel() {
  if (isPanelCollapsed()) setPanelCollapsed(false);
}

function renderSection(sectionId, options = {}) {
  const section = sectionContent[sectionId];
  if (!section) return;

  state.activeSection = sectionId;
  panelTitle.textContent = section.title;
  panelSubtitle.textContent = section.subtitle;
  panelContent.innerHTML = section.panel;

  if (!options.preserveStatus) {
    setSceneStatus(section.status);
  }

  quickButtons.forEach((button) => {
    const isActive = button.dataset.section === sectionId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function focusSceneOnSection(sectionId, instant = false) {
  if (!state.webglEnabled) return;
  const record = state.three.recordBySection.get(sectionId);
  if (!record) return;

  state.three.focusTarget.copy(record.focusTarget);
  state.three.focusCamera.copy(record.focusCamera);
  state.three.focusAnimating = !instant;

  if (instant) {
    state.three.camera.position.copy(record.focusCamera);
    state.three.controls.target.copy(record.focusTarget);
    state.three.controls.update();
  }
}

function setActiveSection(sectionId, options = {}) {
  renderSection(sectionId, options);

  if (options.expandPanel !== false) openPanel();
  if (options.focusPanel) panelRoot.focus();
  if (!options.skipFocus) focusSceneOnSection(sectionId, Boolean(options.instantFocus));
}

function cycleSection(direction) {
  const currentIndex = Math.max(sectionOrder.indexOf(state.activeSection), 0);
  const nextIndex = (currentIndex + direction + sectionOrder.length) % sectionOrder.length;
  setActiveSection(sectionOrder[nextIndex], { expandPanel: true, focusPanel: true });
}

function stopTour(resetStatus = true) {
  if (state.tourTimer) {
    window.clearInterval(state.tourTimer);
    state.tourTimer = null;
  }

  state.tourRunning = false;
  tourToggle.setAttribute("aria-pressed", "false");
  tourToggle.textContent = "Start guided tour";

  if (resetStatus) {
    setSceneStatus(state.sceneStatusDefault);
  }
}

function startTour() {
  if (state.tourRunning) {
    stopTour();
    return;
  }

  state.tourRunning = true;
  tourToggle.setAttribute("aria-pressed", "true");
  tourToggle.textContent = "Stop guided tour";
  setSceneStatus("Guided tour running: stepping through each desktop object.");

  let pointer = Math.max(sectionOrder.indexOf(state.activeSection), 0);
  setActiveSection(sectionOrder[pointer], { expandPanel: true, focusPanel: false });
  state.tourTimer = window.setInterval(() => {
    pointer = (pointer + 1) % sectionOrder.length;
    setActiveSection(sectionOrder[pointer], { expandPanel: true, focusPanel: false });
  }, 3300);
}

function onQuickButtonClick(event) {
  const sectionId = event.currentTarget.dataset.section;
  if (!sectionId) return;
  if (state.tourRunning) stopTour(false);
  setActiveSection(sectionId, { expandPanel: true, focusPanel: true });
}

function initLayoutEvents() {
  setPanelCollapsed(true);

  panelHandle.addEventListener("click", () => {
    setPanelCollapsed(!isPanelCollapsed());
  });

  panelClose.addEventListener("click", () => setPanelCollapsed(true));
  tourToggle.addEventListener("click", startTour);

  quickButtons.forEach((button) => button.addEventListener("click", onQuickButtonClick));

  document.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Escape"].includes(event.key)) return;

    if (event.key === "Escape") {
      setPanelCollapsed(true);
      if (state.tourRunning) stopTour();
      return;
    }

    if (state.tourRunning) stopTour(false);
    cycleSection(event.key === "ArrowRight" ? 1 : -1);
  });
}

function webglSupported() {
  try {
    const test = document.createElement("canvas");
    return Boolean(test.getContext("webgl2") || test.getContext("webgl"));
  } catch (error) {
    return false;
  }
}

async function loadThreeModules() {
  const sources = [
    {
      core: "https://esm.sh/three@0.162.0",
      controls: "https://esm.sh/three@0.162.0/examples/jsm/controls/OrbitControls.js",
    },
    {
      core: "https://unpkg.com/three@0.162.0/build/three.module.js?module",
      controls: "https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js?module",
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

function createTextTexture(THREE, text, options = {}) {
  const width = options.width ?? 1024;
  const height = options.height ?? 512;
  const background = options.background ?? "#101733";
  const foreground = options.foreground ?? "#eff4ff";
  const accent = options.accent ?? "#55d7bd";
  const subtitle = options.subtitle ?? "";

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#253155";
  context.lineWidth = 18;
  context.strokeRect(9, 9, width - 18, height - 18);

  context.textAlign = "center";
  context.fillStyle = accent;
  context.font = "700 46px Inter, sans-serif";
  context.fillText("CLICK HERE", width / 2, height * 0.33);

  context.fillStyle = foreground;
  context.font = "800 70px Inter, sans-serif";
  context.fillText(text, width / 2, height * 0.62);

  if (subtitle) {
    context.fillStyle = "#9fb2df";
    context.font = "500 32px Inter, sans-serif";
    context.fillText(subtitle, width / 2, height * 0.82);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function collectEmissiveMaterials(object) {
  const materials = [];
  object.traverse((child) => {
    if (!child.isMesh) return;
    const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
    childMaterials.forEach((material) => {
      if (material && "emissiveIntensity" in material) materials.push(material);
    });
  });
  return materials;
}

function registerInteractiveObject(section, label, hitMesh, focusTarget, focusOffset, anchorObject) {
  const record = {
    section,
    label,
    mesh: hitMesh,
    anchor: anchorObject,
    focusTarget,
    focusCamera: focusTarget.clone().add(focusOffset),
    materials: collectEmissiveMaterials(hitMesh),
    baseScale: hitMesh.scale.clone(),
  };

  state.three.hitMeshes.push(hitMesh);
  state.three.meshToRecord.set(hitMesh, record);
  state.three.recordBySection.set(section, record);
}

function buildDesktopScene(THREE) {
  const scene = state.three.scene;
  scene.fog = new THREE.Fog(0x070b14, 6, 18);

  const ambient = new THREE.AmbientLight(0x9ab2ff, 0.42);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 0.98);
  key.position.set(4.2, 5.8, 3.6);
  scene.add(key);

  const rim = new THREE.PointLight(0x4ea8ff, 1.05, 13, 2.2);
  rim.position.set(-2.9, 2.7, -1.9);
  scene.add(rim);

  const fill = new THREE.PointLight(0x49d4bc, 0.74, 9, 2.2);
  fill.position.set(2.1, 1.9, 1.9);
  scene.add(fill);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ color: 0x0d1324, roughness: 0.95, metalness: 0.02 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.9;
  scene.add(floor);

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(13, 4.8, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x1a2544, roughness: 0.84 })
  );
  backWall.position.set(0, 1.35, -4.35);
  scene.add(backWall);

  const sideWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 4.8, 9),
    new THREE.MeshStandardMaterial({ color: 0x151d36, roughness: 0.88 })
  );
  sideWall.position.set(-5.05, 1.35, -0.1);
  scene.add(sideWall);

  const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0x28385d,
    roughness: 0.7,
    metalness: 0.16,
  });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.15, 0.25, 2.5), deskMaterial);
  deskTop.position.set(0, -0.07, -0.45);
  scene.add(deskTop);

  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2846, roughness: 0.74 });
  [-2.35, 2.35].forEach((x) => {
    [-1.55, 0.55].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.95, 0.17), legMaterial);
      leg.position.set(x, -0.57, z);
      scene.add(leg);
    });
  });

  const monitorBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 1.15, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x1f2e50,
      roughness: 0.45,
      metalness: 0.25,
      emissive: 0x0b1222,
      emissiveIntensity: 0.2,
    })
  );
  monitorBody.position.set(-0.1, 0.94, -1.18);
  scene.add(monitorBody);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 0.93),
    new THREE.MeshStandardMaterial({
      map: createTextTexture(THREE, "EXPERIENCE", {
        subtitle: "PM internships and impact",
        accent: "#62b1ff",
      }),
      emissive: 0x1a3c6f,
      emissiveIntensity: 0.9,
      roughness: 0.25,
    })
  );
  monitorScreen.position.set(-0.1, 0.94, -1.13);
  scene.add(monitorScreen);

  const monitorStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.45, 20),
    new THREE.MeshStandardMaterial({ color: 0x243659, roughness: 0.55 })
  );
  monitorStand.position.set(-0.1, 0.48, -1.2);
  scene.add(monitorStand);

  const monitorBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.04, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1c2946, roughness: 0.6 })
  );
  monitorBase.position.set(-0.1, 0.24, -1.2);
  scene.add(monitorBase);

  const monitorAnchor = new THREE.Object3D();
  monitorAnchor.position.set(-0.1, 1.62, -1.2);
  scene.add(monitorAnchor);

  registerInteractiveObject(
    "experience",
    "Monitor: click for Experience",
    monitorBody,
    new THREE.Vector3(-0.1, 0.9, -1.2),
    new THREE.Vector3(2.25, 1.35, 2.8),
    monitorAnchor
  );

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 1.65, 1.05),
    new THREE.MeshStandardMaterial({
      color: 0x1b2f55,
      roughness: 0.56,
      metalness: 0.22,
      emissive: 0x09111f,
      emissiveIntensity: 0.2,
    })
  );
  tower.position.set(2.02, 0.58, -1.05);
  scene.add(tower);

  const towerPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 1.2),
    new THREE.MeshStandardMaterial({
      map: createTextTexture(THREE, "PROJECTS", {
        subtitle: "Side builds and experiments",
        accent: "#55e1bf",
        background: "#10213a",
      }),
      emissive: 0x1a4c56,
      emissiveIntensity: 0.64,
      roughness: 0.2,
    })
  );
  towerPanel.position.set(1.59, 0.58, -1.05);
  towerPanel.rotation.y = Math.PI / 2;
  scene.add(towerPanel);

  const towerAnchor = new THREE.Object3D();
  towerAnchor.position.set(2.02, 1.58, -1.05);
  scene.add(towerAnchor);

  registerInteractiveObject(
    "projects",
    "PC Tower: click for Side Projects",
    tower,
    new THREE.Vector3(2.0, 0.6, -1.05),
    new THREE.Vector3(2.35, 1.45, 2.2),
    towerAnchor
  );

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.09, 0.66),
    new THREE.MeshStandardMaterial({
      color: 0x1b2a49,
      roughness: 0.48,
      metalness: 0.18,
      emissive: 0x0b1631,
      emissiveIntensity: 0.2,
    })
  );
  keyboard.position.set(0.18, 0.08, -0.3);
  scene.add(keyboard);

  const keyboardLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.52, 0.3),
    new THREE.MeshStandardMaterial({
      map: createTextTexture(THREE, "SKILLS", {
        subtitle: "Tools and PM capabilities",
        accent: "#8cb5ff",
        background: "#111f3b",
      }),
      emissive: 0x1b325c,
      emissiveIntensity: 0.7,
      roughness: 0.25,
    })
  );
  keyboardLabel.position.set(0.18, 0.145, -0.29);
  keyboardLabel.rotation.x = -Math.PI / 2;
  scene.add(keyboardLabel);

  const keyboardAnchor = new THREE.Object3D();
  keyboardAnchor.position.set(0.18, 0.42, -0.3);
  scene.add(keyboardAnchor);

  registerInteractiveObject(
    "skills",
    "Keyboard: click for Skills",
    keyboard,
    new THREE.Vector3(0.2, 0.11, -0.3),
    new THREE.Vector3(2.1, 1.18, 2.05),
    keyboardAnchor
  );

  const mouseBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.02, 0.66),
    new THREE.MeshStandardMaterial({ color: 0x16223d, roughness: 0.92 })
  );
  mouseBase.position.set(1.3, 0.02, 0.07);
  scene.add(mouseBase);

  const mousePadLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.22),
    new THREE.MeshStandardMaterial({
      map: createTextTexture(THREE, "ACTIVITIES", {
        subtitle: "Leadership and service",
        accent: "#58dcc2",
        background: "#0f2233",
      }),
      emissive: 0x1b4d5a,
      emissiveIntensity: 0.6,
      roughness: 0.25,
    })
  );
  mousePadLabel.position.set(1.3, 0.032, 0.07);
  mousePadLabel.rotation.x = -Math.PI / 2;
  scene.add(mousePadLabel);

  const mouse = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 28, 28),
    new THREE.MeshStandardMaterial({
      color: 0x233659,
      roughness: 0.38,
      metalness: 0.18,
      emissive: 0x091526,
      emissiveIntensity: 0.2,
    })
  );
  mouse.scale.set(1, 0.57, 1.32);
  mouse.position.set(1.29, 0.12, 0.08);
  scene.add(mouse);

  const mouseAnchor = new THREE.Object3D();
  mouseAnchor.position.set(1.3, 0.55, 0.08);
  scene.add(mouseAnchor);

  registerInteractiveObject(
    "activities",
    "Mouse: click for Activities",
    mouse,
    new THREE.Vector3(1.3, 0.15, 0.08),
    new THREE.Vector3(1.85, 1.15, 1.95),
    mouseAnchor
  );

  const dumbbellBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.05, 16),
    new THREE.MeshStandardMaterial({
      color: 0x25375c,
      roughness: 0.38,
      metalness: 0.68,
      emissive: 0x0a1222,
      emissiveIntensity: 0.2,
    })
  );
  dumbbellBar.rotation.z = Math.PI / 2;
  dumbbellBar.position.set(-1.72, 0.24, 0.22);
  scene.add(dumbbellBar);

  const dumbbellMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e2f55,
    roughness: 0.42,
    metalness: 0.45,
    emissive: 0x0a1632,
    emissiveIntensity: 0.2,
  });

  [-0.43, 0.43].forEach((offset) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 24), dumbbellMaterial);
    plate.rotation.z = Math.PI / 2;
    plate.position.set(-1.72 + offset, 0.24, 0.22);
    scene.add(plate);
  });

  const dumbbellTag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.28),
    new THREE.MeshStandardMaterial({
      map: createTextTexture(THREE, "INTERESTS", {
        subtitle: "Lifestyle and routines",
        accent: "#64b5ff",
        background: "#13233f",
      }),
      emissive: 0x1a3f62,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    })
  );
  dumbbellTag.position.set(-1.72, 0.65, 0.2);
  dumbbellTag.rotation.y = 0.2;
  scene.add(dumbbellTag);

  const dumbbellAnchor = new THREE.Object3D();
  dumbbellAnchor.position.set(-1.72, 0.92, 0.2);
  scene.add(dumbbellAnchor);

  registerInteractiveObject(
    "interests",
    "Dumbbell: click for Interests",
    dumbbellBar,
    new THREE.Vector3(-1.72, 0.25, 0.22),
    new THREE.Vector3(-2.0, 1.25, 2.4),
    dumbbellAnchor
  );

  const softAccentLine = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.03, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x4ec7ff,
      emissive: 0x1d5f92,
      emissiveIntensity: 1.2,
    })
  );
  softAccentLine.position.set(-2.3, 0.1, -1.64);
  scene.add(softAccentLine);
}

function updateHoverLabel() {
  const hovered = state.three.hoveredRecord;
  if (!hovered || !state.webglEnabled) {
    hoverLabel.hidden = true;
    return;
  }

  const vector = hovered.anchor.getWorldPosition(state.three.tempWorld);
  vector.project(state.three.camera);

  if (vector.z > 1) {
    hoverLabel.hidden = true;
    return;
  }

  const x = (vector.x * 0.5 + 0.5) * sceneCanvas.clientWidth;
  const y = (-vector.y * 0.5 + 0.5) * sceneCanvas.clientHeight;

  hoverLabel.hidden = false;
  hoverLabel.textContent = hovered.label;
  hoverLabel.style.left = `${x}px`;
  hoverLabel.style.top = `${y}px`;
}

function updateObjectHighlighting(elapsedSeconds) {
  state.three.recordBySection.forEach((record) => {
    const isHovered = state.three.hoveredRecord === record;
    const isActive = state.activeSection === record.section;
    const pulse = 1 + Math.sin(elapsedSeconds * 2.2) * 0.04;
    const targetIntensity = isHovered ? 1.35 : isActive ? 0.88 : 0.2;

    record.materials.forEach((material) => {
      material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.12;
    });

    const baseScale = isHovered ? 1.04 : isActive ? 1.02 : 1;
    record.mesh.scale.copy(record.baseScale).multiplyScalar(baseScale * pulse);
  });
}

function setHoveredRecord(record) {
  if (record === state.three.hoveredRecord) return;

  state.three.hoveredRecord = record;
  if (record) {
    sceneCanvas.style.cursor = "pointer";
    setSceneStatus(`${record.label}`);
  } else {
    sceneCanvas.style.cursor = "grab";
    setSceneStatus(state.tourRunning ? "Guided tour running." : state.sceneStatusDefault);
  }
}

function pickInteractiveRecord(event) {
  const rect = sceneCanvas.getBoundingClientRect();
  state.three.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.three.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  state.three.raycaster.setFromCamera(state.three.pointer, state.three.camera);

  const hits = state.three.raycaster.intersectObjects(state.three.hitMeshes, false);
  if (!hits.length) return null;
  return state.three.meshToRecord.get(hits[0].object) ?? null;
}

function bindScenePointerEvents() {
  sceneCanvas.addEventListener("pointermove", (event) => {
    const record = pickInteractiveRecord(event);
    setHoveredRecord(record);
  });

  sceneCanvas.addEventListener("pointerleave", () => {
    setHoveredRecord(null);
  });

  sceneCanvas.addEventListener("click", (event) => {
    const record = pickInteractiveRecord(event);
    if (!record) return;
    if (state.tourRunning) stopTour(false);
    setActiveSection(record.section, { expandPanel: true, focusPanel: true });
  });
}

function updateSceneSize() {
  if (!state.webglEnabled) return;
  const width = sceneCanvas.clientWidth;
  const height = sceneCanvas.clientHeight;
  if (!width || !height) return;

  state.three.camera.aspect = width / height;
  state.three.camera.updateProjectionMatrix();
  state.three.renderer.setSize(width, height, false);
}

function runCinematicIntro(now) {
  if (!state.three.intro?.active) return false;

  const intro = state.three.intro;
  const raw = Math.min((now - intro.start) / intro.duration, 1);
  const eased = 1 - Math.pow(1 - raw, 3);

  state.three.camera.position.lerpVectors(intro.startPos, intro.endPos, eased);
  state.three.controls.target.lerpVectors(intro.startTarget, intro.endTarget, eased);
  state.three.controls.update();

  if (raw >= 1) {
    intro.active = false;
    state.three.controls.enabled = true;
    setSceneStatus(state.sceneStatusDefault);
  }

  return true;
}

function animateScene(startTime) {
  const { THREE } = state.three;
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsed = clock.getElapsedTime();
    const now = startTime + elapsed * 1000;

    const introRunning = runCinematicIntro(now);
    if (!introRunning && state.three.focusAnimating) {
      state.three.camera.position.lerp(state.three.focusCamera, 0.09);
      state.three.controls.target.lerp(state.three.focusTarget, 0.11);
      const distance =
        state.three.camera.position.distanceTo(state.three.focusCamera) +
        state.three.controls.target.distanceTo(state.three.focusTarget);
      if (distance < 0.02) state.three.focusAnimating = false;
    }

    updateObjectHighlighting(elapsed);
    state.three.controls.update();
    updateHoverLabel();
    state.three.renderer.render(state.three.scene, state.three.camera);
    state.three.raf = window.requestAnimationFrame(tick);
  };

  state.three.raf = window.requestAnimationFrame(tick);
}

async function init3DScene() {
  if (!webglSupported()) {
    sceneOverlay.hidden = false;
    setSceneStatus("WebGL unavailable. Quick-access mode is active.");
    return;
  }

  try {
    const loaded = await loadThreeModules();
    state.three.THREE = loaded.THREE;
    state.three.OrbitControls = loaded.OrbitControls;
    state.webglEnabled = true;
  } catch (error) {
    console.error("Could not load 3D modules:", error);
    sceneOverlay.hidden = false;
    setSceneStatus("3D modules failed to load. Quick-access mode is active.");
    return;
  }

  const { THREE, OrbitControls } = state.three;

  state.three.scene = new THREE.Scene();
  state.three.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  state.three.renderer = new THREE.WebGLRenderer({
    canvas: sceneCanvas,
    antialias: true,
    alpha: true,
  });
  state.three.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  state.three.renderer.outputColorSpace = THREE.SRGBColorSpace;

  const homeCamera = new THREE.Vector3(3.25, 2.2, 5.3);
  const homeTarget = new THREE.Vector3(0.1, 0.66, -0.55);
  const introCamera = new THREE.Vector3(6.3, 3.7, 7.1);
  const introTarget = new THREE.Vector3(0.9, 1.3, -0.05);

  state.three.camera.position.copy(homeCamera);

  state.three.controls = new OrbitControls(state.three.camera, sceneCanvas);
  state.three.controls.enableDamping = true;
  state.three.controls.enablePan = false;
  state.three.controls.minDistance = 3;
  state.three.controls.maxDistance = 8;
  state.three.controls.minPolarAngle = 0.72;
  state.three.controls.maxPolarAngle = 1.42;
  state.three.controls.minAzimuthAngle = -1.3;
  state.three.controls.maxAzimuthAngle = 1.3;
  state.three.controls.target.copy(homeTarget);
  state.three.controls.update();

  state.three.controls.addEventListener("start", () => {
    state.three.focusAnimating = false;
  });

  state.three.raycaster = new THREE.Raycaster();
  state.three.pointer = new THREE.Vector2();
  state.three.focusTarget = homeTarget.clone();
  state.three.focusCamera = homeCamera.clone();
  state.three.tempWorld = new THREE.Vector3();

  buildDesktopScene(THREE);
  updateSceneSize();
  bindScenePointerEvents();
  sceneCanvas.style.cursor = "grab";
  window.addEventListener("resize", updateSceneSize);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    state.three.intro = {
      active: true,
      start: performance.now(),
      duration: 2600,
      startPos: introCamera,
      endPos: homeCamera,
      startTarget: introTarget,
      endTarget: homeTarget,
    };
    state.three.controls.enabled = false;
    state.three.camera.position.copy(introCamera);
    state.three.controls.target.copy(introTarget);
    setSceneStatus("Cinematic intro running...");
  } else {
    setSceneStatus(state.sceneStatusDefault);
  }

  animateScene(performance.now());
}

function init() {
  initLayoutEvents();
  renderSection("experience", { preserveStatus: true });
  setSceneStatus("Loading 3D desktop...");
  init3DScene();
}

init();
