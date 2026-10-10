// ALIDADE hero · "Take a bearing". The A (original art, never recoloured) floats in a bearing ring over a sea of
// opportunities; the sighting arm sweeps, locks onto one, and the scored card appears beside it.
// Overlay hooks: [data-hx="card"] and [data-hx="bearing"] are placed by the scene; [data-hx="pwin"] counts to 72.
import * as THREE from './three.module.min.js';
import {ramp, ease} from './ease.js';

export default async function create(canvas, {root}) {
  const hero = root.closest('[data-hx-hero]') || document;
  const card = hero.querySelector('[data-hx="card"]'), brg = hero.querySelector('[data-hx="bearing"]'), pw = hero.querySelector('[data-hx="pwin"]');
  const R = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'low-power'});
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x060D1B, 1);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x060D1B, 30, 120);
  const cam = new THREE.PerspectiveCamera(38, 1, .1, 500);
  const NX = 160, NZ = 110, sea = new THREE.BufferGeometry(), pos = new Float32Array(NX * NZ * 3);
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) { const k = (i * NZ + j) * 3; pos[k] = (i - NX / 2) * .7; pos[k + 2] = -j * .7 + 6; }
  sea.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(sea, new THREE.PointsMaterial({color: 0x7D92B5, size: .07, transparent: true, opacity: .55})));
  let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const opps = [];
  for (let i = 0; i < 34; i++) { const x = (rnd() - .35) * 60, z = -6 - rnd() * 60, h = .6 + rnd() * 2.2;
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, h, z)]), new THREE.LineBasicMaterial({color: 0x93A4BD, transparent: true, opacity: .5})); scene.add(l);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), new THREE.MeshBasicMaterial({color: 0xEFF5FE, transparent: true, opacity: .8})); dot.position.set(x, h, z); scene.add(dot);
    opps.push({x, z, h, l, dot}); }
  const target = opps.reduce((b, o) => (Math.abs(o.x - 3) + Math.abs(o.z + 9) < Math.abs(b.x - 3) + Math.abs(b.z + 9) ? o : b));
  const inst = new THREE.Group(); inst.position.set(10, 6.4, -14); inst.rotation.x = .18; scene.add(inst);
  const ring = new THREE.Group(); inst.add(ring);
  const tick = []; for (let d = 0; d < 360; d += 2) { const a = d * Math.PI / 180, r0 = 4.2, r1 = d % 10 === 0 ? 4.75 : 4.45; tick.push(new THREE.Vector3(r0 * Math.cos(a), 0, r0 * Math.sin(a)), new THREE.Vector3(r1 * Math.cos(a), 0, r1 * Math.sin(a))); }
  ring.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tick), new THREE.LineBasicMaterial({color: 0x93A4BD, transparent: true, opacity: .6})));
  const circ = r => { const p = []; for (let a = 0; a <= 360; a += 2) p.push(new THREE.Vector3(r * Math.cos(a * Math.PI / 180), 0, r * Math.sin(a * Math.PI / 180))); return new THREE.BufferGeometry().setFromPoints(p); };
  ring.add(new THREE.Line(circ(4.2), new THREE.LineBasicMaterial({color: 0x21E0CD, transparent: true, opacity: .8})));
  ring.add(new THREE.Line(circ(5.3), new THREE.LineBasicMaterial({color: 0x14B8A6, transparent: true, opacity: .35})));
  const armG = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  scene.add(new THREE.Line(armG, new THREE.LineBasicMaterial({color: 0x21E0CD, transparent: true, opacity: .9})));
  const lockRing = new THREE.Mesh(new THREE.RingGeometry(.5, .56, 48), new THREE.MeshBasicMaterial({color: 0x21E0CD, transparent: true, opacity: 0, side: THREE.DoubleSide}));
  lockRing.rotation.x = -Math.PI / 2; lockRing.position.set(target.x, .02, target.z); scene.add(lockRing);
  const tex = await new THREE.TextureLoader().loadAsync(new URL('./alidade-mark-512.png', import.meta.url).href); tex.colorSpace = THREE.SRGBColorSpace;
  const A = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true, depthWrite: false})); A.scale.set(4.4, 4.5, 1); A.position.y = .3; A.renderOrder = 1; inst.add(A);
  const gc = document.createElement('canvas'); gc.width = gc.height = 256;
  {const g = gc.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(33,224,205,.45)'); gr.addColorStop(1, 'rgba(33,224,205,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);}
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending})); glow.scale.set(12, 12, 1); glow.renderOrder = -1; inst.add(glow);
  const v = new THREE.Vector3(), tb = Math.atan2(target.z - inst.position.z, target.x - inst.position.x);
  const screen = p => { v.copy(p).project(cam); return [(v.x * .5 + .5) * canvas.clientWidth, (-v.y * .5 + .5) * canvas.clientHeight]; };
  function resize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h;
    if (w > 900) cam.setViewOffset(w, h, -w * .14, 0, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); }
  const tipV = new THREE.Vector3(), baseV = new THREE.Vector3();
  function renderAt(t) {
    const p = sea.attributes.position.array;
    for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) { const k = (i * NZ + j) * 3; p[k + 1] = Math.sin(p[k] * .18 + t * .6) * .28 + Math.cos(p[k + 2] * .22 + t * .45) * .22; }
    sea.attributes.position.needsUpdate = true;
    cam.position.set(Math.sin(t * .05) * 1.2, 5.2 + Math.sin(t * .07) * .25, 16); cam.lookAt(4, 3.2, -14);
    const sw = ramp(t, .6, 3.2, ease.alidade), ang = tb - 1.9 * (1 - sw);
    ring.rotation.y = -ang;
    const o = inst.position, L = Math.hypot(target.x - o.x, target.z - o.z);
    armG.setFromPoints([baseV.set(o.x, o.y - .6, o.z), tipV.set(o.x + Math.cos(ang) * L, 0, o.z + Math.sin(ang) * L)]);
    const lock = ramp(t, 3.2, 3.52, ease.alidade);
    lockRing.material.opacity = lock * (.6 + .4 * Math.sin(t * 3)); lockRing.scale.setScalar(1 + .25 * Math.sin(t * 3));
    opps.forEach(q => { const on = q === target && lock > 0; q.l.material.color.set(on ? 0x21E0CD : 0x93A4BD); q.l.material.opacity = q === target ? .5 + .5 * lock : .38; q.dot.material.color.set(on ? 0x21E0CD : 0xEFF5FE); });
    A.position.y = .3 + Math.sin(t * .8) * .12; glow.material.opacity = .7 + .3 * Math.sin(t * .9);
    R.render(scene, cam);
    if (card) { const [cx, cy] = screen(v.set(target.x, target.h, target.z)); const k = ramp(t, 3.5, 3.82, ease.alidade);
      card.style.left = (cx + 26) + 'px'; card.style.top = (cy - 40) + 'px'; card.style.opacity = k; card.style.translate = `${-10 * (1 - k)}px 0`; }
    if (pw) pw.textContent = String(Math.round(72 * ramp(t, 3.5, 4.4)));
    if (brg) { const [bx, by] = screen(v.set(o.x - 9.2, o.y + .4, o.z)); brg.style.left = bx + 'px'; brg.style.top = by + 'px'; brg.style.opacity = lock; }
  }
  return {renderAt, resize};
}
