// Stages 2 and 3b: directional contributions m_j in space, all drawn from one point because they carry no position.
// 3D design note: the contributions are directions in R³, so a plane cannot show them faithfully; orbiting shows
// that the total is 0 from every side. The camera is orthographic, so lengths along the screen are not foreshortened
// by distance. Optional head-to-tail chain: the contributions laid end to end, ending where the total points.
// A previewed change (stage 3b) is drawn as faint ghosts and never replaces the configuration.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const token = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888';
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆'];

export function createEnsemble3d({ onOrbit } = {}) {
  const el = document.createElement('div');
  el.className = 'scene3d ensemble';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Directional contributions drawn from one point. Drag to turn the view.');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    el.innerHTML = '<p class="fallback">This view needs WebGL, which is unavailable here. The readouts beside it give every contribution and the total.</p>';
    return { el, update() {}, destroy() {}, available: false };
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  el.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  camera.position.set(5.5, 3.2, 7);
  camera.lookAt(0, 0, 0);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.addEventListener('start', () => onOrbit?.());

  const mats = { axis: new THREE.LineBasicMaterial(), chain: new THREE.LineBasicMaterial(), total: new THREE.LineDashedMaterial({ dashSize: 0.12, gapSize: 0.08 }) };
  const arrows = [];
  const ghosts = [];
  const make = () => {
    const a = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0x000000, 0.28, 0.14);
    scene.add(a);
    return a;
  };
  // R³ axes, drawn faintly for orientation only
  const A = 2.6;
  const axisGeom = new THREE.BufferGeometry().setFromPoints([[-A, 0, 0], [A, 0, 0], [0, -A, 0], [0, A, 0], [0, 0, -A], [0, 0, A]].map((p) => new THREE.Vector3(...p)));
  const axes = new THREE.LineSegments(axisGeom, mats.axis);
  scene.add(axes);
  const chainGeom = new THREE.BufferGeometry();
  const chain = new THREE.Line(chainGeom, mats.chain);
  scene.add(chain);
  const totalGeom = new THREE.BufferGeometry();
  const total = new THREE.Line(totalGeom, mats.total);
  scene.add(total);

  const labels = [];
  const overlay = (cls) => {
    const d = document.createElement('div');
    d.className = `lbl ${cls}`;
    el.append(d);
    return d;
  };
  const ring = overlay('zero-ring-3d');
  const totalLbl = overlay('total-lbl');
  totalLbl.textContent = 'Σ mⱼ';

  let colors = {};
  const paint = () => {
    scene.background = new THREE.Color(token('--surface'));
    colors = { ink: new THREE.Color(token('--ink')), ink2: new THREE.Color(token('--ink-2')), ink3: new THREE.Color(token('--ink-3')), rule: new THREE.Color(token('--rule')) };
    mats.axis.color.copy(colors.rule);
    mats.chain.color.copy(colors.ink3);
    mats.total.color.copy(colors.ink);
    last && update(last);
  };

  let last = null;
  function update(m) {
    last = m;
    const { ms, selected = -1, adjust = -1, showChain = false, preview = null, zero } = m;
    while (arrows.length < ms.length) arrows.push(make());
    while (ghosts.length < ms.length) ghosts.push(make());
    while (labels.length < ms.length) labels.push(overlay('m-lbl'));
    ms.forEach((v, j) => {
      const vec = new THREE.Vector3(v[0], v[2], -v[1]); // math (x, y, z) → three (x, z, −y), z up
      const L = vec.length();
      const a = arrows[j];
      a.visible = L > 1e-6;
      if (a.visible) {
        a.setDirection(vec.clone().normalize());
        a.setLength(L, Math.min(0.3, L * 0.3), Math.min(0.15, L * 0.15));
      }
      a.setColor(j === selected ? colors.ink : j === adjust ? colors.ink3 : colors.ink2);
      labels[j].textContent = `m${SUB[j]}${j === adjust ? ' adjusts' : ''}`;
      labels[j].dataset.at = JSON.stringify([vec.x * 1.12, vec.y * 1.12, vec.z * 1.12]);
      labels[j].classList.toggle('selected', j === selected);
    });
    for (let j = ms.length; j < arrows.length; j++) {
      arrows[j].visible = false;
      ghosts[j].visible = false;
      labels[j].textContent = '';
    }
    ghosts.forEach((g, j) => {
      const p = preview?.[j];
      g.visible = !!p;
      if (!p) return;
      const vec = new THREE.Vector3(p[0], p[2], -p[1]);
      g.setDirection(vec.clone().normalize());
      g.setLength(vec.length(), 0.22, 0.1);
      g.setColor(colors.ink3);
      g.line.material.transparent = true;
      g.line.material.opacity = 0.55;
    });
    const shown = preview ?? ms;
    const pts = [new THREE.Vector3()];
    let acc = new THREE.Vector3();
    for (const v of shown) {
      acc = acc.clone().add(new THREE.Vector3(v[0], v[2], -v[1]));
      pts.push(acc.clone());
    }
    chainGeom.setFromPoints(pts);
    chain.visible = showChain;
    const sum = pts[pts.length - 1];
    totalGeom.setFromPoints([new THREE.Vector3(), sum]);
    total.computeLineDistances();
    total.visible = sum.length() > 1e-6;
    totalLbl.dataset.at = JSON.stringify([sum.x * 1.15, sum.y * 1.15 + 0.15, sum.z * 1.15]);
    totalLbl.style.visibility = total.visible ? 'visible' : 'hidden';
    ring.dataset.state = zero;
  }

  function resize() {
    const w = el.clientWidth || 400;
    const hgt = el.clientHeight || 340;
    renderer.setSize(w, hgt, false);
    const aspect = w / hgt;
    camera.left = -3 * aspect;
    camera.right = 3 * aspect;
    camera.top = 3;
    camera.bottom = -3;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();
  paint();

  const tmp = new THREE.Vector3();
  const place = (d, at) => {
    tmp.set(...at).project(camera);
    d.style.transform = `translate(${((tmp.x + 1) / 2) * el.clientWidth}px, ${((1 - tmp.y) / 2) * el.clientHeight}px) translate(-50%, -50%)`;
  };
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    for (const d of labels) if (d.dataset.at) place(d, JSON.parse(d.dataset.at));
    if (totalLbl.dataset.at) place(totalLbl, JSON.parse(totalLbl.dataset.at));
    place(ring, [0, 0, 0]);
  });
  const themeObs = new MutationObserver(paint);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', paint);

  return {
    el,
    available: true,
    update,
    destroy() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      themeObs.disconnect();
      mq.removeEventListener('change', paint);
      controls.dispose();
      renderer.dispose();
    },
  };
}
