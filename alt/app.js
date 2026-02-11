import * as THREE from "https://esm.sh/three@0.162.0";
import { OrbitControls } from "https://esm.sh/three@0.162.0/examples/jsm/controls/OrbitControls.js";

const panelTitle = document.getElementById("panel-title");
const panelSubtitle = document.getElementById("panel-subtitle");
const panelContent = document.getElementById("panel-content");
const canvas = document.getElementById("scene");
const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));
const tourButton = document.getElementById("start-tour");
const sceneStatus = document.getElementById("scene-status");

const sectionData = [
  {
    id: "experience",
    label: "Experience",
    subtitle: "Internships + shipped impact",
    color: 0x6d7dff,
    geometry: () => new THREE.BoxGeometry(1.15, 1.15, 1.15),
    position: [0, 0.62, 0],
    html: `
      <p><strong>Metric dashboard:</strong> outcomes shipped across PM internships and analytics roles.</p>
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
    label: "Projects",
    subtitle: "Builder mindset in action",
    color: 0xffa84a,
    geometry: () => new THREE.DodecahedronGeometry(0.76),
    position: [2.6, 0.9, -1.3],
    html: `
      <p><strong>Current focus:</strong> Fantasy Football Bot + Spoiler Shield (in progress).</p>
      <ul>
        <li><strong>Discord Sentiment Bot:</strong> 200+ MAU, Azure AI + Python + NLP pipeline, 4.6/5 user satisfaction.</li>
        <li>Rapid prototype cycles using PRDs, user interviews, prioritization, and measurable outcomes.</li>
        <li>Building with a PM lens: define value, instrument data, iterate fast.</li>
      </ul>
      <p><span class="badge">AI x PM</span><span class="badge">Rapid MVPs</span><span class="badge">Data-informed</span></p>
    `,
  },
  {
    id: "education",
    label: "Education",
    subtitle: "University of Houston · MIS",
    color: 0x34d3a6,
    geometry: () => new THREE.CylinderGeometry(0.58, 0.58, 1.35, 20),
    position: [-2.5, 0.72, -1.5],
    html: `
      <p><strong>University of Houston, C.T. Bauer College of Business</strong></p>
      <ul>
        <li>B.B.A. Management Information Systems · <strong>May 2026</strong></li>
        <li>GPA: <strong>3.81</strong></li>
        <li>Coursework: Systems Analysis & Design, Product Management, Database Systems, Entrepreneurship, Statistics, Marketing</li>
      </ul>
      <p>I balance school with internships, product building, gym consistency, trading, faith, and community service.</p>
    `,
  },
  {
    id: "interests",
    label: "Interests & Lifestyle",
    subtitle: "What keeps me sharp",
    color: 0xff7a7a,
    geometry: () => new THREE.IcosahedronGeometry(0.72),
    position: [-2.8, 0.9, 1.8],
    html: `
      <ul>
        <li><strong>Faith:</strong> committed to Islamic fundamentals and giving back.</li>
        <li><strong>Fitness:</strong> consistent gym habits, nutrition, and discipline.</li>
        <li><strong>Gaming & Anime:</strong> creativity, systems thinking, and fun.</li>
        <li><strong>Trading:</strong> analytical decision-making and emotional control.</li>
      </ul>
      <p>Vice President at <strong>United Mission Relief</strong>, helping coordinate events reaching 1,000+ unhoused individuals.</p>
    `,
  },
  {
    id: "contact",
    label: "Let's Connect",
    subtitle: "Open to PM internships + full-time roles",
    color: 0x76a3ff,
    geometry: () => new THREE.TorusKnotGeometry(0.55, 0.18, 130, 18),
    position: [2.9, 1.1, 1.9],
    html: `
      <p>If you're hiring for product roles, I’d love to connect.</p>
      <ul>
        <li>Email: <a href="mailto:shaikhabdulsaboor1@gmail.com">shaikhabdulsaboor1@gmail.com</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/shaikhabdulsaboor/" target="_blank" rel="noreferrer">shaikhabdulsaboor</a></li>
        <li>GitHub: <a href="https://github.com/AbdulsaboorS" target="_blank" rel="noreferrer">AbdulsaboorS</a></li>
      </ul>
      <p><strong>Personal brand:</strong> hard working, accomplished, dependable — and still getting better every day.</p>
    `,
  },
];

const sectionMap = new Map(sectionData.map((entry) => [entry.id, entry]));
let activeSectionId = null;
let tourTimer = null;

function updateStatus(message) {
  if (sceneStatus) sceneStatus.textContent = message;
}

function markActiveButton(id) {
  sectionButtons.forEach((button) => {
    const isActive = button.dataset.section === id;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function openPanel(id) {
  const selected = sectionMap.get(id);
  if (!selected) return;

  activeSectionId = id;
  panelTitle.textContent = selected.label;
  panelSubtitle.textContent = selected.subtitle;
  panelContent.innerHTML = selected.html;
  markActiveButton(id);
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

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stopTour();
    openPanel(button.dataset.section);
  });
});

const hasWebGL = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));

if (!hasWebGL) {
  updateStatus("WebGL unavailable: using quick-access mode.");
  openPanel("experience");
} else {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05070c, 8, 25);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(4.8, 4.3, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 4;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.target.set(0, 1.2, 0);

  const hemi = new THREE.HemisphereLight(0x9dbbff, 0x081018, 1.15);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(5, 8, 4);
  scene.add(key);

  const rim = new THREE.PointLight(0x6d7dff, 25, 20, 2.2);
  rim.position.set(-3, 2.6, -1);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(7.4, 64),
    new THREE.MeshStandardMaterial({ color: 0x0c1018, roughness: 0.96, metalness: 0.03 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.02, 12, 120),
    new THREE.MeshBasicMaterial({ color: 0x3543aa })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);

  const hoverGlow = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.65, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
  );
  hoverGlow.rotation.x = -Math.PI / 2;
  hoverGlow.position.y = 0.03;
  scene.add(hoverGlow);

  const hotspotMaterial = (color) =>
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.36,
      roughness: 0.25,
      metalness: 0.3,
    });

  const hotspots = sectionData.map((entry) => {
    const mesh = new THREE.Mesh(entry.geometry(), hotspotMaterial(entry.color));
    mesh.position.set(...entry.position);
    mesh.userData = { sectionId: entry.id };
    scene.add(mesh);
    return mesh;
  });

  const hotspotById = new Map(hotspots.map((mesh) => [mesh.userData.sectionId, mesh]));

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onClick() {
    if (!hovered?.userData?.sectionId) return;
    stopTour();
    openPanel(hovered.userData.sectionId);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("click", onClick);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize);

  function frameHotspot(id) {
    const hotspot = hotspotById.get(id);
    if (!hotspot) return;

    controls.target.lerp(hotspot.position, 0.2);
  }

  function startTour() {
    const sequence = ["experience", "projects", "education", "interests", "contact"];
    let index = 0;
    stopTour(false);
    tourButton.textContent = "Stop guided tour";

    openPanel(sequence[index]);
    frameHotspot(sequence[index]);

    tourTimer = setInterval(() => {
      index += 1;
      if (index >= sequence.length) {
        stopTour();
        return;
      }

      openPanel(sequence[index]);
      frameHotspot(sequence[index]);
    }, 2200);
  }

  if (tourButton) {
    tourButton.addEventListener("click", () => {
      if (tourTimer) {
        stopTour();
      } else {
        startTour();
      }
    });
  }

  resize();
  updateStatus("Command room online.");
  openPanel("experience");

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(hotspots, false);
    hovered = hits[0]?.object ?? null;

    hotspots.forEach((mesh, index) => {
      mesh.rotation.y += 0.004 + index * 0.0006;
      mesh.position.y += Math.sin(elapsed * 1.3 + index) * 0.0009;
      const sectionId = mesh.userData.sectionId;
      const selected = sectionId === activeSectionId;
      const focusBoost = hovered === mesh ? 0.76 : selected ? 0.56 : 0.36;
      mesh.material.emissiveIntensity = focusBoost;
    });

    if (hovered) {
      hoverGlow.material.opacity = 0.75;
      hoverGlow.position.x = hovered.position.x;
      hoverGlow.position.z = hovered.position.z;
      document.body.style.cursor = "pointer";
    } else {
      hoverGlow.material.opacity = 0;
      document.body.style.cursor = "default";
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

if (tourButton && !hasWebGL) {
  tourButton.addEventListener("click", () => {
    const sequence = ["experience", "projects", "education", "interests", "contact"];
    let index = 0;

    stopTour(false);
    tourButton.textContent = "Stop guided tour";
    openPanel(sequence[index]);

    tourTimer = setInterval(() => {
      index += 1;
      if (index >= sequence.length) {
        stopTour();
        return;
      }

      openPanel(sequence[index]);
    }, 1800);
  });
}

document.addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;

  const ids = sectionData.map((item) => item.id);
  const current = Math.max(ids.indexOf(activeSectionId), 0);
  const offset = event.key === "ArrowRight" ? 1 : -1;
  const next = (current + offset + ids.length) % ids.length;

  stopTour();
  openPanel(ids[next]);
});
