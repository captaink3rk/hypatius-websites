// HYPATIUS hero · "Three platforms, one orbit". Crossfades in over the Earth photo: three orbits, one per platform
// in its own accent (STARCHITECT gold, ALIDADE teal, CRATON bronze), each satellite carrying a status tag.
// Overlay hooks: [data-hx="tag-0"], [data-hx="tag-1"], [data-hx="tag-2"] are placed by the scene (hidden until then).
import * as THREE from './three.module.min.js';
import {ramp, ease} from './ease.js';

export default async function create(canvas, {root}) {
  const hero = root.closest('[data-hx-hero]') || document;
  const tags = [0, 1, 2].map(i => hero.querySelector(`[data-hx="tag-${i}"]`));
  const R = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'low-power'});
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x060F1C, 1);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, 1, 10, 2e6);
  const RE = 6378;
  {const g = new THREE.BufferGeometry(), p = []; let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
   for (let i = 0; i < 2400; i++) { const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar(9e5); p.push(v.x, v.y, v.z); }
   g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
   scene.add(new THREE.Points(g, new THREE.PointsMaterial({color: 0x9FB0C8, size: 1.5, sizeAttenuation: false, transparent: true, opacity: .55})));}
  const earth = new THREE.Group(); scene.add(earth);
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(RE, 128, 96), new THREE.MeshBasicMaterial({color: 0x0B1929})));
  const gm = new THREE.LineBasicMaterial({color: 0x1F3354, transparent: true, opacity: .7});
  for (let lat = -80; lat <= 80; lat += 10) { const pts = [], r = RE * 1.001 * Math.cos(lat * Math.PI / 180), y = RE * 1.001 * Math.sin(lat * Math.PI / 180);
    for (let a = 0; a <= 360; a += 2) pts.push(new THREE.Vector3(r * Math.cos(a * Math.PI / 180), y, r * Math.sin(a * Math.PI / 180)));
    earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm)); }
  for (let lon = 0; lon < 180; lon += 10) { const pts = [];
    for (let a = 0; a <= 360; a += 2) { const t = a * Math.PI / 180, l = lon * Math.PI / 180; pts.push(new THREE.Vector3(RE * 1.001 * Math.cos(t) * Math.cos(l), RE * 1.001 * Math.sin(t), RE * 1.001 * Math.cos(t) * Math.sin(l))); }
    earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm)); }
  {const g = new THREE.BufferGeometry(), p = []; let s = 21; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
   for (let i = 0; i < 3500; i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, q = Math.sqrt(1 - u * u); if (Math.abs(u) > .75) continue; p.push(RE * 1.003 * q * Math.cos(th), RE * 1.003 * u, RE * 1.003 * q * Math.sin(th)); }
   g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
   earth.add(new THREE.Points(g, new THREE.PointsMaterial({color: 0x4FC3D9, size: 1.4, sizeAttenuation: false, transparent: true, opacity: .5})));}
  for (let i = 0; i < 16; i++) earth.add(new THREE.Mesh(new THREE.SphereGeometry(RE * (1 + i * .009), 96, 64), new THREE.MeshBasicMaterial({color: 0x3B7BD9, transparent: true, opacity: .055 * (1 - i / 16), side: THREE.BackSide, depthWrite: false})));
  earth.rotation.z = .35;
  const ORB = [{c: 0xD4A03B, r: RE * 1.9, inc: .42, raan: .3, sp: .03}, {c: 0x21E0CD, r: RE * 1.55, inc: -.5, raan: 1.2, sp: .04}, {c: 0xB08D57, r: RE * 2.3, inc: .16, raan: 2.4, sp: .02}];
  ORB.forEach(o => { const g = new THREE.Group(); g.rotation.set(o.inc, o.raan, 0); scene.add(g); o.g = g;
    const pts = []; for (let a = 0; a <= 360; a += 1) pts.push(new THREE.Vector3(o.r * Math.cos(a * Math.PI / 180), 0, o.r * Math.sin(a * Math.PI / 180)));
    o.geo = new THREE.BufferGeometry().setFromPoints(pts); o.n = pts.length;
    g.add(new THREE.Line(o.geo, new THREE.LineBasicMaterial({color: o.c, transparent: true, opacity: .75})));
    o.sat = new THREE.Mesh(new THREE.OctahedronGeometry(150), new THREE.MeshBasicMaterial({color: o.c})); g.add(o.sat);
    const gc = document.createElement('canvas'); gc.width = gc.height = 64; const x = gc.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, '#' + o.c.toString(16).padStart(6, '0')); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    o.halo = new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(gc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false})); o.halo.scale.set(1400, 1400, 1); g.add(o.halo); });
  const v = new THREE.Vector3(), sphere = new THREE.Sphere(new THREE.Vector3(), RE), hitV = new THREE.Vector3();
  const screen = o => { o.sat.getWorldPosition(v); v.project(cam); return [(v.x * .5 + .5) * canvas.clientWidth, (-v.y * .5 + .5) * canvas.clientHeight]; };
  const occluded = o => { o.sat.getWorldPosition(v); const d = v.clone().sub(cam.position); const hit = new THREE.Ray(cam.position, d.clone().normalize()).intersectSphere(sphere, hitV); return hit && hit.distanceTo(cam.position) < d.length(); };
  // Park each satellite where its tag reads well at the end of the fly-in.
  const TGT = [[.66, .84], [.84, .29], [.90, .66]];
  function solve() { cam.position.set(-7000, 7000, 36000); cam.lookAt(1500, -2500, 0); cam.updateMatrixWorld(); scene.updateMatrixWorld(true);
    ORB.forEach((o, i) => { let best = 1e9, ba = 0;
      for (let k = 0; k < 720; k++) { const a = k / 720 * Math.PI * 2; o.sat.position.set(o.r * Math.cos(a), 0, o.r * Math.sin(a)); o.g.updateMatrixWorld(true);
        if (occluded(o)) continue; const [x, y] = screen(o), dx = x / canvas.clientWidth - TGT[i][0], dy = y / canvas.clientHeight - TGT[i][1], e = dx * dx + dy * dy; if (e < best) { best = e; ba = a; } }
      o.a0 = ba - o.sp * 6; }); }
  function resize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h;
    if (w > 900) cam.setViewOffset(w, h, -w * .24, -h * .06, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); solve(); }
  function renderAt(t) {
    const u = ramp(t, 0, 3, ease.corporate);
    cam.position.set(-7000 + Math.sin(t * .04) * 900, 9000 - 2000 * u, 40000 - 4000 * u); cam.lookAt(1500, -2500, 0);
    earth.rotation.y = t * .012;
    ORB.forEach((o, i) => { const d = ramp(t, .5 + i * .25, 2.1 + i * .25, ease.corporate); o.geo.setDrawRange(0, Math.max(2, Math.round(o.n * d)));
      const a = o.a0 + t * o.sp; o.sat.position.set(o.r * Math.cos(a), 0, o.r * Math.sin(a)); o.halo.position.copy(o.sat.position); o.sat.visible = o.halo.visible = d >= 1; });
    R.render(scene, cam);
    ORB.forEach((o, i) => { const el = tags[i]; if (!el) return; const d = ramp(t, .5 + i * .25, 2.1 + i * .25);
      const [x, y] = screen(o), flip = x > canvas.clientWidth * .78; el.classList.toggle('flip', flip);
      el.style.left = (flip ? x - 16 - el.offsetWidth : x + 16) + 'px'; el.style.top = (y - 8) + 'px';
      el.style.opacity = (d >= 1 && !occluded(o)) ? ramp(t, 2.1 + i * .25, 2.5 + i * .25) : 0; });
  }
  return {renderAt, resize};
}
