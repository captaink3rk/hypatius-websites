// CRATON hero · "Core sample". Fourteen strata, one per SF 1408 area; a bronze core drills down through all of them.
// Overlay hooks: [data-hx="gauge"] fades in, [data-hx="areas"] counts layers on record (00 to 14).
import * as THREE from './three.module.min.js';
import {ramp, ease} from './ease.js';

export default async function create(canvas, {root}) {
  const hero = root.closest('[data-hx-hero]') || document;
  const gauge = hero.querySelector('[data-hx="gauge"]'), areas = hero.querySelector('[data-hx="areas"]');
  const R = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'low-power'});
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x0F1216, 1);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x0F1216, 26, 60);
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 200);
  scene.add(new THREE.HemisphereLight(0xC9CFD6, 0x0F1216, .9));
  const key = new THREE.DirectionalLight(0xF1F3F5, 1.5); key.position.set(-6, 12, 10); scene.add(key);
  const warm = new THREE.DirectionalLight(0xD9B985, .6); warm.position.set(10, 2, -6); scene.add(warm);
  const grp = new THREE.Group(); scene.add(grp);
  const N = 14, W = 16, D = 10, SX = 56, SZ = 32;
  const hf = (x, z, k) => .32 * Math.sin(x * .42 + k * .9) + .22 * Math.cos(z * .55 + k * 1.7) + .12 * Math.sin((x + z) * .9 + k);
  const tones = [0x1F2731, 0x2C3744, 0x3A4553, 0x26303B, 0x4A5566, 0x323D4A];
  const layers = [], seams = []; let base = 0;
  for (let k = 0; k < N; k++) {
    const th = .42 + .18 * ((k * 7) % 5) / 4;
    const g = new THREE.BoxGeometry(W, 1, D, SX, 1, SZ), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), top = p.getY(i) > 0; p.setY(i, top ? base + th + hf(x, z, k) * .6 : base + (k ? hf(x, z, k - 1) * .6 : 0)); }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({color: tones[k % tones.length], roughness: .92, metalness: .05, flatShading: true, transparent: true}));
    grp.add(m); layers.push({m, base, th});
    const pts = []; for (let i = 0; i <= SX; i++) { const x = -W / 2 + W * i / SX; pts.push(new THREE.Vector3(x, base + th + hf(x, D / 2, k) * .6 + .004, D / 2 + .01)); }
    const sl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color: 0xB08D57, transparent: true, opacity: .18})); grp.add(sl); seams.push(sl);
    base += th;
  }
  const H = base, coreX = 1.4, coreZ = D / 2;
  const core = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, 1, 40, 1, true), new THREE.MeshStandardMaterial({color: 0xB08D57, metalness: .65, roughness: .35, side: THREE.DoubleSide})); grp.add(core);
  const bit = new THREE.Mesh(new THREE.TorusGeometry(.42, .05, 10, 48), new THREE.MeshBasicMaterial({color: 0xD9B985})); bit.rotation.x = Math.PI / 2; grp.add(bit);
  const ticks = layers.map(L => { const t = new THREE.Mesh(new THREE.TorusGeometry(.48, .018, 6, 48), new THREE.MeshBasicMaterial({color: 0xD9B985, transparent: true, opacity: 0}));
    t.rotation.x = Math.PI / 2; t.position.set(coreX, L.base + L.th, coreZ); grp.add(t); return t; });
  grp.position.y = -H / 2;
  function resize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h;
    if (w > 900) cam.setViewOffset(w, h, -w * .2, h * .02, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); }
  function renderAt(t) {
    // CRATON motion rule: restrained and purposeful, no decorative loops. The camera eases to rest
    // as the drill lands, and the scene stops rendering once settled.
    const ts = Math.min(t, 5.2), a = .62 + Math.sin(ts * .07) * .08; cam.position.set(Math.sin(a) * 34, 10.5 + Math.sin(ts * .05) * .4, Math.cos(a) * 34); cam.lookAt(0, -.6, 0);
    layers.forEach((L, k) => { const u = ramp(t, .1 + k * .05, .7 + k * .05, ease.corporate); L.m.position.y = (1 - u) * 1.4; L.m.material.opacity = u; seams[k].position.y = L.m.position.y; });
    const d = ramp(t, 1.4, 4.2, ease.corporate), top = H + .6, bot = top - (top + .05) * d;
    core.scale.y = Math.max(.001, top - bot); core.position.set(coreX, (top + bot) / 2, coreZ); bit.position.set(coreX, bot, coreZ); bit.rotation.z = ts * 4;
    let n = 0; ticks.forEach((tk, k) => { const hit = bot <= layers[k].base + layers[k].th; if (hit) n++; tk.material.opacity = hit ? .9 : 0; seams[k].material.opacity = hit ? .85 : .18; });
    R.render(scene, cam);
    if (areas) areas.textContent = String(n).padStart(2, '0');
    if (gauge) gauge.style.opacity = ramp(t, 1.2, 1.6, ease.corporate);
    return t >= 5.2;
  }
  return {renderAt, resize};
}
