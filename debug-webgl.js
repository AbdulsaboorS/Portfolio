import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/+esm";

const canvas = document.getElementById("debug-canvas");
const logEl = document.getElementById("debug-log");
const copyButton = document.getElementById("copy-log");
const probeWebgl2 = document.getElementById("probe-webgl2");
const probeWebgl = document.getElementById("probe-webgl");
const probeExp = document.getElementById("probe-exp");

const logLines = [];

function pushLog(message, level = "info") {
  const line = `${new Date().toISOString()} | ${message}`;
  logLines.push(line);

  const item = document.createElement("li");
  item.textContent = line;
  if (level !== "info") item.classList.add(level);
  logEl.appendChild(item);
  logEl.scrollTop = logEl.scrollHeight;

  if (level === "err") console.error(message);
  else if (level === "warn") console.warn(message);
  else console.log(message);
}

function updateProbeBadges() {
  const test = document.createElement("canvas");
  const hasWebgl2 = !!test.getContext("webgl2");
  const hasWebgl = !!test.getContext("webgl");
  const hasExp = !!test.getContext("experimental-webgl");

  probeWebgl2.textContent = `webgl2: ${hasWebgl2 ? "yes" : "no"}`;
  probeWebgl.textContent = `webgl: ${hasWebgl ? "yes" : "no"}`;
  probeExp.textContent = `experimental: ${hasExp ? "yes" : "no"}`;

  pushLog(`Probe supports webgl2=${hasWebgl2}, webgl=${hasWebgl}, experimental=${hasExp}`, "ok");
}

function createRendererWithRecovery() {
  const attempts = [
    () => new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }),
    () =>
      new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }),
  ];

  let lastError = null;
  for (let i = 0; i < attempts.length; i += 1) {
    try {
      pushLog(`Renderer attempt ${i + 1} on original canvas...`);
      return attempts[i]();
    } catch (error) {
      lastError = error;
      pushLog(`Attempt ${i + 1} failed: ${String(error?.message || error)}`, "warn");
    }
  }

  // Recovery: replace canvas and retry.
  const replacement = document.createElement("canvas");
  replacement.id = "debug-canvas";
  replacement.style.cssText = canvas.style.cssText;
  replacement.className = canvas.className;
  replacement.setAttribute("aria-label", canvas.getAttribute("aria-label") || "WebGL debug canvas");
  canvas.replaceWith(replacement);

  for (let i = 0; i < attempts.length; i += 1) {
    try {
      pushLog(`Renderer retry ${i + 1} on replacement canvas...`);
      return new THREE.WebGLRenderer({
        canvas: replacement,
        antialias: true,
        alpha: true,
      });
    } catch (error) {
      lastError = error;
      pushLog(`Replacement retry ${i + 1} failed: ${String(error?.message || error)}`, "warn");
    }
  }

  throw lastError;
}

function attachCopyHandler() {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(logLines.join("\n"));
      pushLog("Copied logs to clipboard.", "ok");
    } catch (error) {
      pushLog(`Clipboard copy failed: ${String(error?.message || error)}`, "warn");
    }
  });
}

function boot() {
  attachCopyHandler();
  updateProbeBadges();
  pushLog(`UserAgent: ${navigator.userAgent}`);
  pushLog(`URL: ${window.location.href}`);

  let renderer = null;
  try {
    renderer = createRendererWithRecovery();
  } catch (error) {
    pushLog(`Renderer creation failed after all retries: ${String(error?.message || error)}`, "err");
    pushLog("Result: FAIL", "err");
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const context = renderer.getContext();
  const contextType = context instanceof WebGL2RenderingContext ? "webgl2" : "webgl";
  pushLog(`Renderer created successfully with context: ${contextType}`, "ok");

  try {
    const debugExt = context.getExtension("WEBGL_debug_renderer_info");
    if (debugExt) {
      const unmaskedRenderer = context.getParameter(debugExt.UNMASKED_RENDERER_WEBGL);
      const unmaskedVendor = context.getParameter(debugExt.UNMASKED_VENDOR_WEBGL);
      pushLog(`GPU Vendor: ${unmaskedVendor}`, "ok");
      pushLog(`GPU Renderer: ${unmaskedRenderer}`, "ok");
    } else {
      pushLog("WEBGL_debug_renderer_info unavailable (normal in some browsers).", "warn");
    }
  } catch (error) {
    pushLog(`Could not read GPU info: ${String(error?.message || error)}`, "warn");
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090f1e);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(2.6, 1.9, 3.1);

  const hemi = new THREE.HemisphereLight(0x9bb8ff, 0x0a1225, 0.95);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(2.8, 3.8, 2.3);
  scene.add(key);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0e172d, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.8;
  scene.add(floor);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x6e8fff,
      emissive: 0x203f76,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.2,
    })
  );
  cube.position.y = 0.1;
  scene.add(cube);

  function resize() {
    const target = renderer.domElement;
    const width = target.clientWidth;
    const height = target.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener("resize", resize);
  resize();

  pushLog("Animating test scene...", "ok");
  let startedFrames = 0;
  function frame() {
    startedFrames += 1;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.015;
    renderer.render(scene, camera);
    if (startedFrames === 3) pushLog("Render loop confirmed.", "ok");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  pushLog("Result: PASS", "ok");
}

boot();
