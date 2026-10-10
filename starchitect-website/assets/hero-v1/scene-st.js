// STARCHITECT hero · "The look-ahead". Orekit fan of 100 propagated approaches to a protected GEO asset.
// Overlay hooks inside the hero: [data-hx="readout"] fades in once the fan lands; [data-hx="count"] counts the 18.
import * as THREE from './three.module.min.js';
import {ramp, ease} from './ease.js';

export default async function create(canvas, {root}) {
  const hero = root.closest('[data-hx-hero]') || document;
  const ro = hero.querySelector('[data-hx="readout"]'), cnt = hero.querySelector('[data-hx="count"]');
  const R = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'low-power'});
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x060B17, 1);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 10, 1e7);
  const C = {earth: 0x0B1525, grid: 0x243450, ring: 0xD4A03B, leo: 0x2EB5C9, sat: 0x56C8D9, accent: 0xD4A03B, bone: 0xEFE9DD, glow: 0x2EB5C9};
  const RE = 6378, RG = 42164, eci = (x, y, z) => new THREE.Vector3(x, z, -y);
  {const g = new THREE.BufferGeometry(), p = []; let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
   for (let i = 0; i < 2200; i++) { const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar(2e6); p.push(v.x, v.y, v.z); }
   g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
   scene.add(new THREE.Points(g, new THREE.PointsMaterial({color: 0x8FA0B5, size: 1.6, sizeAttenuation: false, transparent: true, opacity: .5})));}
  const earth = new THREE.Group(); scene.add(earth);
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(RE, 96, 64), new THREE.MeshBasicMaterial({color: C.earth})));
  const gm = new THREE.LineBasicMaterial({color: C.grid, transparent: true, opacity: .6});
  for (let lat = -75; lat <= 75; lat += 15) { const pts = [], r = RE * 1.002 * Math.cos(lat * Math.PI / 180), y = RE * 1.002 * Math.sin(lat * Math.PI / 180);
    for (let a = 0; a <= 360; a += 3) pts.push(new THREE.Vector3(r * Math.cos(a * Math.PI / 180), y, r * Math.sin(a * Math.PI / 180)));
    earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm)); }
  for (let lon = 0; lon < 180; lon += 15) { const pts = [];
    for (let a = 0; a <= 360; a += 3) { const t = a * Math.PI / 180, l = lon * Math.PI / 180; pts.push(new THREE.Vector3(RE * 1.002 * Math.cos(t) * Math.cos(l), RE * 1.002 * Math.sin(t), RE * 1.002 * Math.cos(t) * Math.sin(l))); }
    earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm)); }
  for (let i = 0; i < 14; i++) earth.add(new THREE.Mesh(new THREE.SphereGeometry(RE * (1 + i * .012), 64, 48), new THREE.MeshBasicMaterial({color: C.glow, transparent: true, opacity: .05 * (1 - i / 14), side: THREE.BackSide, depthWrite: false})));
  earth.rotation.z = .41;
  const geo = []; for (let a = 0; a <= 360; a += .5) { const t = a * Math.PI / 180; geo.push(eci(RG * Math.cos(t), RG * Math.sin(t), 0)); }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(geo), new THREE.LineBasicMaterial({color: C.ring, transparent: true, opacity: .7})));
  const a = 6928.137, inc = 53 * Math.PI / 180;
  const kep = (raan, ta) => { raan *= Math.PI / 180; ta *= Math.PI / 180; const xo = a * Math.cos(ta), yo = a * Math.sin(ta); const x1 = xo, y1 = yo * Math.cos(inc), z1 = yo * Math.sin(inc);
    return eci(x1 * Math.cos(raan) - y1 * Math.sin(raan), x1 * Math.sin(raan) + y1 * Math.cos(raan), z1); };
  const sats = [], planes = [];
  for (let k = 0; k < 3; k++) { const raan = 120 * k, pts = []; for (let t = 0; t <= 360; t += 2) pts.push(kep(raan, t));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color: C.leo, transparent: true, opacity: .7})); scene.add(l); planes.push([l, pts.length]);
    for (let s = 0; s < 8; s++) { const m = new THREE.Mesh(new THREE.BoxGeometry(220, 220, 220), new THREE.MeshBasicMaterial({color: C.sat})); m.userData = {raan, ta0: 45 * s + 15 * k}; scene.add(m); sats.push(m); } }
  const fan = await (await fetch(new URL('./fan.json', import.meta.url))).json();
  const lon = -108 * Math.PI / 180, Pp = eci(RG * Math.cos(lon), RG * Math.sin(lon), 0);
  const rad = Pp.clone().normalize(), along = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), rad).normalize().negate(), up = new THREE.Vector3(0, 1, 0);
  const S = 230, lines = [];
  fan.forEach((r, i) => { const pts = r.t.map(q => Pp.clone().add(rad.clone().multiplyScalar(q[0] * S)).add(along.clone().multiplyScalar(q[1] * S)));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color: r.e ? C.accent : C.leo, transparent: true, opacity: r.e ? .95 : .3}));
    scene.add(l); lines.push([l, pts.length, i / fan.length]); });
  const wv = new THREE.Mesh(new THREE.SphereGeometry(6.3 * S, 28, 18), new THREE.MeshBasicMaterial({color: C.bone, wireframe: true, transparent: true, opacity: .26})); wv.position.copy(Pp); scene.add(wv);
  const asset = new THREE.Mesh(new THREE.OctahedronGeometry(420), new THREE.MeshBasicMaterial({color: C.bone})); asset.position.copy(Pp); scene.add(asset);
  const at = (r, al, u) => Pp.clone().add(rad.clone().multiplyScalar(r)).add(along.clone().multiplyScalar(al)).add(up.clone().multiplyScalar(u));
  const A = {pos: at(150000, -46000, 52000), look: new THREE.Vector3(0, 0, 0)};
  const B = {pos: at(26000, -15000, 7000), look: at(-16000, -1000, -1500)};
  const look = new THREE.Vector3();
  function resize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h;
    if (w > 900) cam.setViewOffset(w, h, -w * .22, -h * .02, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); }
  function renderAt(t) {
    const u = ramp(t, 0, 3.2, ease.starchitect);
    cam.position.lerpVectors(A.pos, B.pos, u); look.lerpVectors(A.look, B.look, u);
    cam.position.add(along.clone().multiplyScalar(Math.sin(t * .12) * 1800)).add(up.clone().multiplyScalar(Math.cos(t * .1) * 700)); cam.lookAt(look);
    const draw = ramp(t, .9, 3.6);
    lines.forEach(([l, n, k]) => l.geometry.setDrawRange(0, Math.max(2, Math.round(n * Math.min(1, Math.max(0, draw * 1.35 - k * .35))))));
    planes.forEach(([l, n]) => l.geometry.setDrawRange(0, Math.round(n * ramp(t, 0, 1.4))));
    sats.forEach(m => m.position.copy(kep(m.userData.raan, m.userData.ta0 + t * 6)));
    wv.material.opacity = .18 + .1 * Math.sin(t * 1.6); wv.rotation.y = t * .08; asset.rotation.y = t * .6;
    R.render(scene, cam);
    if (ro) { const r = ramp(t, 3.4, 3.8, ease.starchitect); ro.style.opacity = r; ro.style.translate = `0 ${2 * (1 - r)}px`; }
    if (cnt) cnt.textContent = String(Math.round(18 * ramp(t, 3.4, 4.6)));
  }
  return {renderAt, resize};
}
