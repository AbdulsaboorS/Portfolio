import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/+esm";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js/+esm";

const panel = document.getElementById("panel");
const panelToggle = document.getElementById("panel-toggle");
const panelTitle = document.getElementById("panel-title");
const panelSubtitle = document.getElementById("panel-subtitle");
const panelContent = document.getElementById("panel-content");
let canvas = document.getElementById("scene");
const sceneWrap = document.querySelector(".scene-wrap");
const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));
const tourButton = document.getElementById("start-tour");
const sceneStatus = document.getElementById("scene-status");
const sceneOverlay = document.getElementById("scene-overlay");
const hoverLabel = document.getElementById("hover-label");

const sectionData = [
  {
    id: "experience",
    objectName: "monitor",
    label: "Experience",
    subtitle: "Internships and measurable product impact",
    status: "Monitor selected - experience details loaded.",
    html: `
      <p><strong>Metric dashboard:</strong> product outcomes shipped across internships.</p>
      <div class="metric-grid">
        <div class="metric-tile"><strong>$210K+</strong><span>Expedia annual fraud loss prevention</span></div>
        <div class="metric-tile"><strong>12%</strong><span>churn reduction through anomaly detection MVP</span></div>
        <div class="metric-tile"><strong>$770K+</strong><span>HubSpot projected annual savings from AI RFP automation</span></div>
        <div class="metric-tile"><strong>20%</strong><span>IT support ticket reduction via Helpdesk AI improvements</span></div>
        <div class="metric-tile"><strong>$250K</strong><span>Oceaneering project cost reduction</span></div>
        <div class="metric-tile"><strong>+6%</strong><span>Extern retention improvement via onboarding personalization</span></div>
      </div>
      <p><span class="badge">Disciplined</span><span class="badge">Dependable</span><span class="badge">Execution-first</span></p>
    `,
  },
  {
    id: "projects",
    objectName: "pc tower",
    label: "Projects",
    subtitle: "Side builds and product experiments",
    status: "PC tower selected - side projects loaded.",
    html: `
      <p><strong>Current focus:</strong> Fantasy Football Bot + Spoiler Shield (in progress).</p>
      <ul>
        <li><strong>Discord Sentiment Bot:</strong> 200+ MAU, Azure AI + Python + NLP pipeline, 4.6/5 user satisfaction.</li>
        <li>Rapid prototype loops with PRDs, user interviews, and measurable outcomes.</li>
        <li>Building with a PM lens: define user value, instrument data, iterate fast.</li>
      </ul>
      <p><span class="badge">AI x PM</span><span class="badge">Rapid MVPs</span><span class="badge">Data-informed</span></p>
    `,
  },
  {
    id: "activities",
    objectName: "mouse",
    label: "Activities",
    subtitle: "Leadership and impact outside formal roles",
    status: "Mouse selected - activities loaded.",
    html: `
      <ul>
        <li>Vice President at <strong>United Mission Relief</strong>.</li>
        <li>Help coordinate service events reaching <strong>1,000+ unhoused individuals</strong>.</li>
        <li>Built a digital volunteer check-in flow that reduced coordination work by <strong>40%</strong>.</li>
      </ul>
      <p><span class="badge">Community</span><span class="badge">Leadership</span><span class="badge">Operations</span></p>
    `,
  },
  {
    id: "skills",
    objectName: "keyboard",
    label: "Skills",
    subtitle: "PM systems, technical fluency, and execution",
    status: "Keyboard selected - skills loaded.",
    html: `
      <p><strong>PM skills:</strong> Agile, PRDs, user research, roadmaps, prioritization, customer discovery, OKRs.</p>
      <p><strong>Tools:</strong> Figma, Jira, Confluence, Asana, Miro, Slack, Looker, Amplitude, Tableau, Power BI.</p>
      <p><strong>Technical:</strong> JavaScript, Python, Java, HTML/CSS, SQL, R.</p>
      <p><span class="badge">Product Strategy</span><span class="badge">Cross-functional</span><span class="badge">Builder mindset</span></p>
    `,
  },
  {
    id: "interests",
    objectName: "dumbbell",
    label: "Interests",
    subtitle: "Lifestyle, discipline, and what keeps me sharp",
    status: "Dumbbell selected - interests loaded.",
    html: `
      <ul>
        <li><strong>Faith:</strong> values-driven consistency and self-improvement.</li>
        <li><strong>Fitness:</strong> gym discipline and nutrition routine.</li>
        <li><strong>Gaming & Anime:</strong> creativity, systems thinking, and fun.</li>
        <li><strong>Trading:</strong> analytical decisions and emotional control.</li>
      </ul>
      <p><span class="badge">Consistency</span><span class="badge">Discipline</span><span class="badge">Curiosity</span></p>
    `,
  },
];

const sectionMap = new Map(sectionData.map((entry) => [entry.id, entry]));
const sectionOrder = sectionData.map((entry) => entry.id);
const webglDebug = { events: [], lastError: null };

window.__portfolioWebGLDebug = webglDebug;

let activeSectionId = null;
let tourTimer = null;
let hoveredRecord = null;

const state3d = {
  controls: null,
  camera: null,
  renderer: null,
  raycaster: null,
  pointer: null,
  interactiveRecords: [],
  interactiveBySection: new Map(),
  desiredTarget: null,
  desiredCameraPosition: null,
  intro: null,
  tempVector: new THREE.Vector3(),
};

function updateStatus(message) {
  if (sceneStatus) sceneStatus.textContent = message;
}

function debugEvent(message) {
  const line = `${new Date().toISOString()} | ${message}`;
  webglDebug.events.push(line);
  console.log(`[portfolio-webgl] ${message}`);
}

function setPanelCollapsed(collapsed) {
  panel.classList.toggle("is-collapsed", collapsed);
  panelToggle.setAttribute("aria-expanded", String(!collapsed));
  panelToggle.textContent = collapsed ? "Open details" : "Hide details";
}

function markActiveButton(id) {
  sectionButtons.forEach((button) => {
    const isActive = button.dataset.section === id;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function focusSectionIn3D(id) {
  const record = state3d.interactiveBySection.get(id);
  if (!record) return;
  state3d.desiredTarget.copy(record.focusTarget);
  state3d.desiredCameraPosition.copy(record.focusCameraPosition);
}

function openPanel(id, options = {}) {
  const selected = sectionMap.get(id);
  if (!selected) return;

  activeSectionId = id;
  panelTitle.textContent = selected.label;
  panelSubtitle.textContent = selected.subtitle;
  panelContent.innerHTML = selected.html;
  markActiveButton(id);
  updateStatus(selected.status);

  if (!options.keepCollapsed) {
    setPanelCollapsed(false);
  }

  if (!options.skip3DFocus) {
    focusSectionIn3D(id);
  }
}

function stopTour(resetLabel = true) {
  if (tourTimer) {
    clearInterval(tourTimer);
    tourTimer = null;
  }

  if (tourButton && resetLabel) {
    tourButton.textContent = "Start guided tour";
  }
}

function cycleSection(direction) {
  const currentIndex = Math.max(sectionOrder.indexOf(activeSectionId), 0);
  const nextIndex = (currentIndex + direction + sectionOrder.length) % sectionOrder.length;
  openPanel(sectionOrder[nextIndex]);
}

function createLabelTexture(title, subtitle, accent = "#64b0ff") {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 1024;
  labelCanvas.height = 512;
  const context = labelCanvas.getContext("2d");

  context.fillStyle = "#101726";
  context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
  context.strokeStyle = "#2a3e6a";
  context.lineWidth = 14;
  context.strokeRect(10, 10, labelCanvas.width - 20, labelCanvas.height - 20);

  context.textAlign = "center";
  context.fillStyle = accent;
  context.font = "700 56px Inter, sans-serif";
  context.fillText("CLICK HERE", labelCanvas.width / 2, labelCanvas.height * 0.3);

  context.fillStyle = "#eef4ff";
  context.font = "800 82px Inter, sans-serif";
  context.fillText(title.toUpperCase(), labelCanvas.width / 2, labelCanvas.height * 0.58);

  context.fillStyle = "#a7b8df";
  context.font = "500 33px Inter, sans-serif";
  context.fillText(subtitle, labelCanvas.width / 2, labelCanvas.height * 0.8);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildScene(scene) {
  scene.fog = new THREE.Fog(0x05070c, 8, 22);

  const ambient = new THREE.HemisphereLight(0x99b8ff, 0x080e1a, 0.95);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(5, 7, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0x6fa8ff, 20, 18, 2.2);
  rim.position.set(-3, 2.5, -1);
  scene.add(rim);

  const fill = new THREE.PointLight(0x42d9bc, 9, 9, 1.8);
  fill.position.set(2.5, 2, 2);
  scene.add(fill);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(8.2, 72),
    new THREE.MeshStandardMaterial({ color: 0x0c111d, roughness: 0.96, metalness: 0.03 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(5.3, 0.25, 2.4),
    new THREE.MeshStandardMaterial({ color: 0x1f2f52, roughness: 0.7, metalness: 0.15 })
  );
  deskTop.position.set(0, -0.15, -0.35);
  scene.add(deskTop);

  const deskLegMaterial = new THREE.MeshStandardMaterial({ color: 0x172542, roughness: 0.78 });
  [-2.35, 2.35].forEach((x) => {
    [-1.4, 0.65].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.86, 0.16), deskLegMaterial);
      leg.position.set(x, -0.68, z);
      scene.add(leg);
    });
  });

  const records = [];
  const addInteractive = ({ id, objectName, mesh, focusTarget, focusCameraPosition, labelAnchor }) => {
    mesh.userData.sectionId = id;
    mesh.userData.objectName = objectName;
    scene.add(mesh);
    records.push({
      id,
      objectName,
      mesh,
      focusTarget,
      focusCameraPosition,
      labelAnchor,
      baseY: mesh.position.y,
      baseScale: mesh.scale.clone(),
    });
    state3d.interactiveBySection.set(id, records[records.length - 1]);
  };

  const monitorGroup = new THREE.Group();
  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.2, 0.09),
    new THREE.MeshStandardMaterial({ color: 0x23385f, roughness: 0.42, metalness: 0.25 })
  );
  monitorGroup.add(monitorFrame);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.76, 0.95),
    new THREE.MeshStandardMaterial({
      map: createLabelTexture("Experience", "Internships and impact", "#75a9ff"),
      emissive: 0x1f4a7d,
      emissiveIntensity: 0.95,
      roughness: 0.3,
    })
  );
  monitorScreen.position.z = 0.052;
  monitorGroup.add(monitorScreen);

  const monitorStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.44, 20),
    new THREE.MeshStandardMaterial({ color: 0x223659, roughness: 0.6 })
  );
  monitorStand.position.set(0, -0.72, -0.02);
  monitorGroup.add(monitorStand);

  const monitorBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.04, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 0.65 })
  );
  monitorBase.position.set(0, -0.94, -0.02);
  monitorGroup.add(monitorBase);

  monitorGroup.position.set(-0.15, 0.88, -1.07);
  addInteractive({
    id: "experience",
    objectName: "monitor",
    mesh: monitorGroup,
    focusTarget: new THREE.Vector3(-0.15, 0.8, -1.08),
    focusCameraPosition: new THREE.Vector3(2.2, 1.8, 2.3),
    labelAnchor: new THREE.Vector3(-0.15, 1.72, -1.05),
  });

  const pcTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.7, 1.02),
    new THREE.MeshStandardMaterial({
      color: 0x1f3358,
      roughness: 0.5,
      metalness: 0.24,
      emissive: 0x0a1424,
      emissiveIntensity: 0.5,
    })
  );
  pcTower.position.set(2.0, 0.58, -0.98);
  addInteractive({
    id: "projects",
    objectName: "pc tower",
    mesh: pcTower,
    focusTarget: new THREE.Vector3(2.0, 0.58, -0.98),
    focusCameraPosition: new THREE.Vector3(2.9, 1.75, 2.0),
    labelAnchor: new THREE.Vector3(2.0, 1.65, -0.98),
  });

  const pcLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.64, 1.22),
    new THREE.MeshStandardMaterial({
      map: createLabelTexture("Projects", "Side builds", "#51dfbf"),
      emissive: 0x1a4d5a,
      emissiveIntensity: 0.85,
      roughness: 0.25,
    })
  );
  pcLabel.position.set(1.53, 0.58, -0.98);
  pcLabel.rotation.y = Math.PI / 2;
  scene.add(pcLabel);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.09, 0.72),
    new THREE.MeshStandardMaterial({
      color: 0x1c2c4a,
      roughness: 0.55,
      metalness: 0.16,
      emissive: 0x0f1e38,
      emissiveIntensity: 0.48,
    })
  );
  keyboard.position.set(0.26, 0.06, -0.18);
  addInteractive({
    id: "skills",
    objectName: "keyboard",
    mesh: keyboard,
    focusTarget: new THREE.Vector3(0.26, 0.08, -0.18),
    focusCameraPosition: new THREE.Vector3(2.35, 1.2, 1.85),
    labelAnchor: new THREE.Vector3(0.26, 0.5, -0.18),
  });

  const keyboardLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.28),
    new THREE.MeshStandardMaterial({
      map: createLabelTexture("Skills", "Tools and PM stack", "#89b6ff"),
      emissive: 0x1e3a63,
      emissiveIntensity: 0.76,
      roughness: 0.2,
    })
  );
  keyboardLabel.position.set(0.26, 0.112, -0.18);
  keyboardLabel.rotation.x = -Math.PI / 2;
  scene.add(keyboardLabel);

  const mouse = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 26, 26),
    new THREE.MeshStandardMaterial({
      color: 0x23395f,
      roughness: 0.4,
      metalness: 0.18,
      emissive: 0x102240,
      emissiveIntensity: 0.44,
    })
  );
  mouse.position.set(1.34, 0.12, 0.02);
  mouse.scale.set(1, 0.58, 1.3);
  addInteractive({
    id: "activities",
    objectName: "mouse",
    mesh: mouse,
    focusTarget: new THREE.Vector3(1.34, 0.12, 0.02),
    focusCameraPosition: new THREE.Vector3(2.0, 1.15, 1.7),
    labelAnchor: new THREE.Vector3(1.34, 0.58, 0.02),
  });

  const mousePad = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.02, 0.72),
    new THREE.MeshStandardMaterial({ color: 0x13233f, roughness: 0.92 })
  );
  mousePad.position.set(1.34, 0.01, 0.02);
  scene.add(mousePad);

  const dumbbellBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.08, 18),
    new THREE.MeshStandardMaterial({
      color: 0x22375f,
      roughness: 0.46,
      metalness: 0.56,
      emissive: 0x13284a,
      emissiveIntensity: 0.42,
    })
  );
  dumbbellBar.rotation.z = Math.PI / 2;
  dumbbellBar.position.set(-1.72, 0.2, 0.26);
  addInteractive({
    id: "interests",
    objectName: "dumbbell",
    mesh: dumbbellBar,
    focusTarget: new THREE.Vector3(-1.72, 0.2, 0.26),
    focusCameraPosition: new THREE.Vector3(-2.2, 1.35, 2.2),
    labelAnchor: new THREE.Vector3(-1.72, 0.82, 0.26),
  });

  [-0.43, 0.43].forEach((offset) => {
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.18, 24),
      new THREE.MeshStandardMaterial({ color: 0x1f3154, roughness: 0.46, metalness: 0.5 })
    );
    plate.rotation.z = Math.PI / 2;
    plate.position.set(-1.72 + offset, 0.2, 0.26);
    scene.add(plate);
  });

  const dumbbellLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.86, 0.25),
    new THREE.MeshStandardMaterial({
      map: createLabelTexture("Interests", "Lifestyle and routine", "#6fb4ff"),
      emissive: 0x1b456d,
      emissiveIntensity: 0.72,
      roughness: 0.2,
    })
  );
  dumbbellLabel.position.set(-1.72, 0.64, 0.25);
  dumbbellLabel.rotation.y = 0.22;
  scene.add(dumbbellLabel);

  const accentStrip = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.03, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x56b7ff, emissive: 0x24639a, emissiveIntensity: 1.1 })
  );
  accentStrip.position.set(-2.3, 0.07, -1.55);
  scene.add(accentStrip);

  state3d.interactiveRecords = records;
}

function updateHoverLabel(record) {
  if (!record) {
    hoverLabel.hidden = true;
    return;
  }

  state3d.tempVector.copy(record.labelAnchor).project(state3d.camera);
  const x = (state3d.tempVector.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (-state3d.tempVector.y * 0.5 + 0.5) * canvas.clientHeight;

  hoverLabel.hidden = false;
  hoverLabel.textContent = `Click ${record.objectName} for ${sectionMap.get(record.id).label}`;
  hoverLabel.style.left = `${x}px`;
  hoverLabel.style.top = `${y}px`;
}

function setupBaseEvents() {
  panelToggle.addEventListener("click", () => {
    setPanelCollapsed(!panel.classList.contains("is-collapsed"));
  });

  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stopTour();
      openPanel(button.dataset.section);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
    stopTour();
    cycleSection(event.key === "ArrowRight" ? 1 : -1);
  });

  if (tourButton) {
    tourButton.addEventListener("click", () => {
      if (tourTimer) {
        stopTour();
        return;
      }

      const sequence = sectionOrder.slice();
      let index = 0;
      tourButton.textContent = "Stop guided tour";
      openPanel(sequence[index]);

      tourTimer = setInterval(() => {
        index += 1;
        if (index >= sequence.length) {
          stopTour();
          return;
        }
        openPanel(sequence[index]);
      }, 2600);
    });
  }
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
  if (sceneDescriptionId) {
    replacement.setAttribute("aria-describedby", sceneDescriptionId);
  }

  canvas.replaceWith(replacement);
  canvas = replacement;

  if (sceneWrap && canvas.parentElement !== sceneWrap) {
    sceneWrap.prepend(canvas);
  }
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
      name: "existing-canvas-high-performance",
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

  // Final recovery: brand new canvas, then retries.
  replaceSceneCanvas();

  for (let i = 0; i < 2; i += 1) {
    try {
      const attemptName = `post-replacement-retry-${i + 1}`;
      debugEvent(`Renderer attempt start: ${attemptName}`);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      debugEvent(`Renderer attempt success: ${attemptName}`);
      return renderer;
    } catch (error) {
      lastError = error;
      const reason = error instanceof Error ? error.message : String(error);
      debugEvent(`Renderer attempt failed: post-replacement-retry-${i + 1} | ${reason}`);
    }
  }

  webglDebug.lastError = lastError ? String(lastError?.message || lastError) : "Unknown error";
  throw lastError;
}

function boot3D() {
  debugEvent("boot3D start");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(6.4, 3.8, 7.4);

  let renderer = null;
  try {
    renderer = initRendererWithRetry();
  } catch (error) {
    const probeCanvas = document.createElement("canvas");
    const freshCanvasWebGL2 = Boolean(probeCanvas.getContext("webgl2"));
    const freshCanvasWebGL = Boolean(probeCanvas.getContext("webgl"));
    const reason = error instanceof Error ? error.message : String(error);
    webglDebug.lastError = reason;
    console.error("WebGL renderer initialization failed:", error);
    debugEvent(`Renderer init failed after retries: ${reason}`);
    updateStatus("WebGL initialization failed. Quick-access mode active.");
    sceneOverlay.hidden = false;
    sceneOverlay.querySelector("p").textContent =
      `WebGL renderer failed. webgl2=${freshCanvasWebGL2 ? "yes" : "no"}, webgl=${
        freshCanvasWebGL ? "yes" : "no"
      }. Inspect window.__portfolioWebGLDebug in console.`;
    openPanel("experience", { keepCollapsed: true, skip3DFocus: true });
    return;
  }

  debugEvent("Renderer initialized successfully.");

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 11;
  controls.maxPolarAngle = Math.PI / 2.08;
  controls.minPolarAngle = 0.62;
  controls.minAzimuthAngle = -1.35;
  controls.maxAzimuthAngle = 1.35;
  controls.target.set(0.1, 0.75, -0.4);
  controls.update();

  state3d.camera = camera;
  state3d.controls = controls;
  state3d.renderer = renderer;
  state3d.raycaster = new THREE.Raycaster();
  state3d.pointer = new THREE.Vector2();
  state3d.desiredTarget = controls.target.clone();
  state3d.desiredCameraPosition = camera.position.clone();

  buildScene(scene);

  const homeTarget = new THREE.Vector3(0.1, 0.75, -0.4);
  const homeCamera = new THREE.Vector3(3.8, 2.35, 5.2);
  state3d.desiredTarget.copy(homeTarget);
  state3d.desiredCameraPosition.copy(homeCamera);
  state3d.intro = {
    active: true,
    start: performance.now(),
    duration: 2200,
    fromPosition: new THREE.Vector3(6.4, 3.8, 7.4),
    toPosition: homeCamera.clone(),
    fromTarget: new THREE.Vector3(1.2, 1.5, 0.2),
    toTarget: homeTarget.clone(),
  };
  controls.enabled = false;

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize);
  resize();

  function pickRecord() {
    state3d.raycaster.setFromCamera(state3d.pointer, camera);
    const hits = state3d.raycaster.intersectObjects(
      state3d.interactiveRecords.map((record) => record.mesh),
      false
    );
    if (!hits.length) return null;
    return state3d.interactiveRecords.find((record) => record.mesh === hits[0].object) || null;
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    state3d.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state3d.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onClick() {
    if (!hoveredRecord) return;
    stopTour();
    openPanel(hoveredRecord.id);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("pointerleave", () => {
    hoveredRecord = null;
    updateHoverLabel(null);
    document.body.style.cursor = "default";
  });

  updateStatus("Cinematic intro running...");
  openPanel("experience", { keepCollapsed: true, skip3DFocus: true });

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    const now = performance.now();

    if (state3d.intro?.active) {
      const progress = Math.min((now - state3d.intro.start) / state3d.intro.duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      camera.position.lerpVectors(state3d.intro.fromPosition, state3d.intro.toPosition, eased);
      controls.target.lerpVectors(state3d.intro.fromTarget, state3d.intro.toTarget, eased);
      if (progress >= 1) {
        state3d.intro.active = false;
        controls.enabled = true;
        updateStatus("Command desk online. Hover an object and click to explore.");
      }
    } else {
      camera.position.lerp(state3d.desiredCameraPosition, 0.08);
      controls.target.lerp(state3d.desiredTarget, 0.1);
    }

    hoveredRecord = pickRecord();
    updateHoverLabel(hoveredRecord);

    state3d.interactiveRecords.forEach((record, index) => {
      const selected = record.id === activeSectionId;
      const hovered = record === hoveredRecord;
      record.mesh.position.y = record.baseY + Math.sin(elapsed * 1.25 + index * 0.7) * 0.01;
      const targetScale = hovered ? 1.05 : selected ? 1.02 : 1;
      record.mesh.scale.lerp(record.baseScale.clone().multiplyScalar(targetScale), 0.15);

      record.mesh.traverse((child) => {
        if (!child.isMesh) return;
        const materialList = Array.isArray(child.material) ? child.material : [child.material];
        materialList.forEach((material) => {
          if (!("emissiveIntensity" in material)) return;
          const targetIntensity = hovered ? 1.05 : selected ? 0.75 : 0.45;
          material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.14;
        });
      });
    });

    if (hoveredRecord) {
      document.body.style.cursor = "pointer";
      updateStatus(`Hovering ${hoveredRecord.objectName} - click to open ${sectionMap.get(hoveredRecord.id).label}.`);
    } else if (!state3d.intro?.active) {
      document.body.style.cursor = "default";
      updateStatus(sectionMap.get(activeSectionId)?.status || "Command desk online.");
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

setupBaseEvents();
setPanelCollapsed(true);
boot3D();
