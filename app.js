import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/+esm";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js/+esm";

const panel = document.getElementById("detail-panel");
const panelClose = document.getElementById("panel-close");
const panelTitle = document.getElementById("panel-title");
const panelSubtitle = document.getElementById("panel-subtitle");
const panelContent = document.getElementById("panel-content");
let canvas = document.getElementById("scene");
const sceneWrap = document.querySelector(".scene-wrap");
const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));
const sceneStatus = document.getElementById("scene-status");
const sceneOverlay = document.getElementById("scene-overlay");
const hoverLabel = document.getElementById("hover-label");

sceneOverlay.hidden = true;
sceneOverlay.style.display = "none";
hoverLabel.hidden = true;
hoverLabel.style.display = "none";

const sectionData = [
  {
    id: "experience",
    objectName: "monitor",
    label: "Experience",
    subtitle: "Internship outcomes",
    status: "Monitor selected: experience loaded.",
    html: `
      <div class="metric-grid">
        <div class="metric-tile"><strong>$210K+</strong><span>annual fraud loss prevented</span></div>
        <div class="metric-tile"><strong>12%</strong><span>churn reduction</span></div>
        <div class="metric-tile"><strong>$770K+</strong><span>projected annual savings</span></div>
        <div class="metric-tile"><strong>20%</strong><span>support tickets reduced</span></div>
      </div>
      <p><span class="badge">Expedia</span><span class="badge">HubSpot</span><span class="badge">Oceaneering</span></p>
    `,
  },
  {
    id: "projects",
    objectName: "side monitor",
    label: "Projects",
    subtitle: "Builds in progress",
    status: "Side monitor selected: projects loaded.",
    html: `
      <ul>
        <li><strong>Discord feedback bot:</strong> 200+ MAU, 4.6/5 satisfaction.</li>
        <li><strong>Fantasy Football Bot:</strong> weekly recommendation engine in progress.</li>
        <li><strong>Spoiler Shield:</strong> spoiler filtering concept in progress.</li>
      </ul>
      <p><span class="badge">AI x PM</span><span class="badge">Rapid MVPs</span></p>
    `,
  },
  {
    id: "activities",
    objectName: "quick nav",
    label: "Activities",
    subtitle: "Leadership and service",
    status: "Activities loaded.",
    html: `
      <ul>
        <li>Vice President at United Mission Relief.</li>
        <li>Service events supporting 1,000+ unhoused individuals.</li>
        <li>Built volunteer check-in platform reducing manual work by 40%.</li>
      </ul>
    `,
  },
  {
    id: "skills",
    objectName: "pc tower",
    label: "Skills",
    subtitle: "PM + technical stack",
    status: "PC tower selected: skills loaded.",
    html: `
      <p><strong>PM:</strong> PRDs, prioritization, user research, roadmapping, agile delivery.</p>
      <p><strong>Tools:</strong> Figma, Jira, Confluence, Amplitude, Power BI, Tableau.</p>
      <p><strong>Technical:</strong> JavaScript, Python, Java, SQL, R.</p>
    `,
  },
  {
    id: "interests",
    objectName: "quick nav",
    label: "Interests",
    subtitle: "Routine and lifestyle",
    status: "Interests loaded.",
    html: `
      <ul>
        <li>Faith-driven consistency and growth.</li>
        <li>Gym discipline and nutrition.</li>
        <li>Sports, anime, gaming, and trading.</li>
      </ul>
    `,
  },
];

const sectionMap = new Map(sectionData.map((entry) => [entry.id, entry]));
const sectionOrder = sectionData.map((entry) => entry.id);
const webglDebug = { events: [], lastError: null };
window.__portfolioWebGLDebug = webglDebug;

let activeSectionId = null;
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

function setPanelVisible(visible) {
  panel.classList.toggle("is-hidden", !visible);
  panel.setAttribute("aria-hidden", String(!visible));
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

  if (!options.keepPanelHidden) {
    setPanelVisible(true);
    panel.focus();
  }

  if (!options.skip3DFocus) {
    focusSectionIn3D(id);
  }
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

  updateStatus("Overview mode. Click a desk object to explore.");
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
    ctx.fillStyle = "#ffffff";
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
  bg.addColorStop(0, "#f6fbff");
  bg.addColorStop(1, "#e0ecff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  ctx.fillStyle = "rgba(35, 79, 140, 0.11)";
  ctx.fillRect(20, 20, textureCanvas.width - 40, textureCanvas.height - 40);

  ctx.fillStyle = "#1c4382";
  ctx.textAlign = "center";
  ctx.font = "800 80px Inter, sans-serif";
  ctx.fillText("PROJECTS", textureCanvas.width / 2, 150);

  ctx.fillStyle = "#4a678f";
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText("build focus", textureCanvas.width / 2, 205);

  const cards = [
    { title: "Fantasy Football Bot", detail: "in progress" },
    { title: "Spoiler Shield", detail: "in progress" },
    { title: "Discord Insight Bot", detail: "200+ MAU" },
  ];

  cards.forEach((card, index) => {
    const x = 58;
    const y = 300 + index * 245;
    drawRoundedRect(ctx, x, y, 652, 190, 22);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#9eb6db";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#204476";
    ctx.font = "700 46px Inter, sans-serif";
    ctx.fillText(card.title, x + 326, y + 92);

    ctx.fillStyle = "#5c779d";
    ctx.font = "600 30px Inter, sans-serif";
    ctx.fillText(card.detail, x + 326, y + 145);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#456895";
  ctx.font = "600 29px Inter, sans-serif";
  ctx.fillText("Click side monitor for details", textureCanvas.width / 2, 1186);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
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
  scene.fog = new THREE.Fog(0x0b1730, 7, 26);

  const ambient = new THREE.AmbientLight(0xa4c2ff, 0.68);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xe8f4ff, 1.34);
  keyLight.position.set(0.9, 5.8, 4.8);
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

  const blueFill = new THREE.PointLight(0x5aa8ff, 1.7, 14, 2.1);
  blueFill.position.set(0, 2.3, -1.7);
  scene.add(blueFill);

  const cyanFill = new THREE.PointLight(0x67d6ff, 1.2, 12, 2.2);
  cyanFill.position.set(-3.2, 2, 0.8);
  scene.add(cyanFill);

  const frontFill = new THREE.PointLight(0xa9d2ff, 0.7, 10, 2.1);
  frontFill.position.set(0, 1.4, 2.6);
  scene.add(frontFill);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 72),
    new THREE.MeshStandardMaterial({ color: 0x0a1221, roughness: 0.94, metalness: 0.04 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.92;
  floor.receiveShadow = true;
  scene.add(floor);

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(11, 3.4, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x14284c, roughness: 0.82 })
  );
  backWall.position.set(0, 1.1, -4);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.18, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x1b2a43, roughness: 0.66, metalness: 0.14 })
  );
  desk.position.set(0, -0.12, -0.55);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  const deskMat = new THREE.Mesh(
    new THREE.BoxGeometry(4.3, 0.02, 1.55),
    new THREE.MeshStandardMaterial({ color: 0x121d31, roughness: 0.85 })
  );
  deskMat.position.set(0, -0.02, -0.45);
  deskMat.receiveShadow = true;
  scene.add(deskMat);

  const deskLegMaterial = new THREE.MeshStandardMaterial({ color: 0x1b2a44, roughness: 0.75 });
  [-2.55, 2.55].forEach((x) => {
    [-1.45, 0.35].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.88, 0.12), deskLegMaterial);
      leg.position.set(x, -0.57, z);
      scene.add(leg);
    });
  });

  const floorGlow = new THREE.Mesh(
    new THREE.RingGeometry(1.75, 2.65, 64),
    new THREE.MeshBasicMaterial({ color: 0x4f99e5, transparent: true, opacity: 0.34 })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.set(0, -0.905, -0.62);
  scene.add(floorGlow);

  const monitorGroup = new THREE.Group();
  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 1.2, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x1b2740,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x0e1d3a,
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
  monitorScreen.position.z = 0.043;
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
    new THREE.BoxGeometry(0.62, 0.04, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x131d31, roughness: 0.66 })
  );
  monitorBase.position.set(0, -0.98, -0.02);
  monitorGroup.add(monitorBase);

  monitorGroup.position.set(0, 0.93, -1.26);
  applyShadows(monitorGroup);
  scene.add(monitorGroup);

  const sideMonitor = new THREE.Group();
  const sideMonitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.36, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x1c2a47,
      roughness: 0.42,
      metalness: 0.2,
      emissive: 0x11284a,
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
  sideMonitorScreen.position.z = 0.04;
  sideMonitor.add(sideMonitorScreen);

  const sideMonitorStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.04, 0.34, 18),
    new THREE.MeshStandardMaterial({ color: 0x1c2c48, roughness: 0.55, metalness: 0.22 })
  );
  sideMonitorStand.position.set(0, -0.88, 0);
  sideMonitor.add(sideMonitorStand);

  const sideMonitorBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.03, 0.22),
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
    new THREE.BoxGeometry(0.94, 1.76, 1.12),
    new THREE.MeshStandardMaterial({
      color: 0x1d2d4b,
      roughness: 0.34,
      metalness: 0.34,
      emissive: 0x16345f,
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
        color: 0xa6d4ff,
        emissive: 0x4fa6ff,
        emissiveIntensity: 1.35,
        roughness: 0.25,
      })
    );
    fanRing.position.set(0, y, 0.58);
    pcTower.add(fanRing);

    const fanCore = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 22),
      new THREE.MeshStandardMaterial({ color: 0x1b2f50, emissive: 0x2f6db4, emissiveIntensity: 0.8 })
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

  pcTower.position.set(2.2, 0.58, -0.95);
  applyShadows(pcTower);
  scene.add(pcTower);


  const expHit = createHitMesh(2.55, 1.4, 0.6, new THREE.Vector3(0, 0.92, -1.2));
  const projHit = createHitMesh(0.92, 1.5, 0.6, new THREE.Vector3(-1.45, 0.87, -0.95));
  const skillsHit = createHitMesh(1.14, 1.92, 1.34, new THREE.Vector3(2.2, 0.58, -0.95));

  scene.add(expHit, projHit, skillsHit);

  addInteractiveRecord({
    id: "experience",
    objectName: "monitor",
    hitMesh: expHit,
    floatObject: monitorGroup,
    labelAnchor: new THREE.Vector3(0, 1.8, -1.2),
    focusTarget: new THREE.Vector3(0, 0.9, -1.2),
    focusCameraPosition: new THREE.Vector3(1.8, 1.65, 2.9),
    highlightMaterials: collectEmissiveMaterials([monitorGroup]),
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
  });

  addInteractiveRecord({
    id: "skills",
    objectName: "pc tower",
    hitMesh: skillsHit,
    floatObject: pcTower,
    labelAnchor: new THREE.Vector3(2.2, 1.66, -0.95),
    focusTarget: new THREE.Vector3(2.2, 0.68, -0.95),
    focusCameraPosition: new THREE.Vector3(2.35, 1.66, 2.36),
    highlightMaterials: collectEmissiveMaterials([pcTower]),
  });
}

function updateHoverLabel(record) {
  if (!record) {
    hoverLabel.hidden = true;
    hoverLabel.style.display = "none";
    return;
  }

  state3d.tempVector.copy(record.labelAnchor).project(state3d.camera);
  const x = (state3d.tempVector.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (-state3d.tempVector.y * 0.5 + 0.5) * canvas.clientHeight;

  hoverLabel.hidden = false;
  hoverLabel.style.display = "block";
  hoverLabel.textContent = `${sectionMap.get(record.id).label}`;
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
  panelClose.addEventListener("click", () => setOverviewMode({ hidePanel: true }));

  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPanel(button.dataset.section);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOverviewMode({ hidePanel: true });
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    cycleSection(event.key === "ArrowRight" ? 1 : -1);
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
  controls.enablePan = false;
  controls.minDistance = 2.5;
  controls.maxDistance = 18;
  controls.minAzimuthAngle = -1.4;
  controls.maxAzimuthAngle = 1.4;
  controls.minPolarAngle = 0.62;
  controls.maxPolarAngle = 1.38;
  controls.target.set(0.1, 0.74, -0.6);
  controls.update();

  state3d.camera = camera;
  state3d.controls = controls;
  state3d.renderer = renderer;
  state3d.raycaster = new THREE.Raycaster();
  state3d.pointer = new THREE.Vector2();
  state3d.desiredTarget = controls.target.clone();
  state3d.desiredCameraPosition = new THREE.Vector3(0.55, 2.05, 5.2);
  state3d.homeTarget = state3d.desiredTarget.clone();
  state3d.homeCameraPosition = state3d.desiredCameraPosition.clone();

  buildScene(scene);

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
    updateStatus(sectionMap.get(activeSectionId)?.status || "Overview mode. Click a desk object to explore.");
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
      updateStatus(sectionMap.get(activeSectionId)?.status || "Overview mode. Click a desk object to explore.");
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
