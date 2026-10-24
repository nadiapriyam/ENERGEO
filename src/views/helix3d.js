// The wound curve w(t) = f(t) e^{−2πikt} laid out along a time axis: (t, Re w, Im w).
// Seen from the side, time is visible. Seen end-on (looking down the time axis), it is exactly the winding
// picture of the 2D view, and the line through the centroid collapses to the coefficient's point.
// Orthographic camera, so the end view is the true projection. three.js coordinates: X = time, Y = Im, Z = Re.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const token = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888';
const LT = 7; // length of the time axis in scene units

export function createHelix3d() {
  const el = document.createElement('div');
  el.className = 'scene3d';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'The wound curve along a time axis. Drag to orbit.');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    el.innerHTML = '<p class="fallback">This view needs WebGL, which is unavailable here. The 2D winding view shows the same curve seen end-on.</p>';
    return { el, update() {}, view() {}, destroy() {}, available: false };
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  el.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;

  const mats = {
    curve: new THREE.LineBasicMaterial(),
    axis: new THREE.LineBasicMaterial(),
    centroid: new THREE.LineBasicMaterial(),
    tick: new THREE.LineBasicMaterial(),
  };
  const paint = () => {
    scene.background = new THREE.Color(token('--surface'));
    mats.curve.color.set(token('--ink-2'));
    mats.axis.color.set(token('--rule'));
    mats.centroid.color.set(token('--ink'));
    mats.tick.color.set(token('--ink-3'));
  };
  paint();

  const P = (t, re, im, s) => new THREE.Vector3((t - 0.5) * LT, im * s, re * s);
  const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([P(0, 0, 0, 1), P(1, 0, 0, 1)]), mats.axis);
  scene.add(axis);
  const curveGeom = new THREE.BufferGeometry();
  const curve = new THREE.Line(curveGeom, mats.curve);
  scene.add(curve);
  const cenGeom = new THREE.BufferGeometry();
  const cen = new THREE.Line(cenGeom, mats.centroid);
  scene.add(cen);

  const labels = {};
  const label = (key, text, cls = '') => {
    const d = document.createElement('div');
    d.className = `lbl ${cls}`;
    d.textContent = text;
    el.append(d);
    labels[key] = { el: d, at: new THREE.Vector3() };
  };
  label('t', 't', 'axis');
  label('c', '⟨f, eₖ⟩');
  labels.t.at.copy(P(1.06, 0, 0, 1));

  let scale = 0.7;
  function update({ wound }) {
    const maxR = Math.max(...wound.re.map(Math.abs), ...wound.im.map(Math.abs), 1);
    scale = 2.6 / maxR;
    curveGeom.setFromPoints(wound.t.map((t, i) => P(t, wound.re[i], wound.im[i], scale)));
    const [cr, ci] = wound.centroid;
    cenGeom.setFromPoints([P(0, cr, ci, scale), P(1, cr, ci, scale)]);
    labels.c.at.copy(P(1.04, cr, ci, scale));
  }

  const PRESETS = {
    side: new THREE.Vector3(0.6, 2.2, 12),
    end: new THREE.Vector3(-14, 0.0001, 0.0001),
  };
  function view(name) {
    camera.position.copy(PRESETS[name]);
    camera.up.set(0, 1, 0);
    controls.target.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    controls.update();
  }
  view('side');

  function resize() {
    const w = el.clientWidth || 400;
    const hgt = el.clientHeight || 300;
    renderer.setSize(w, hgt, false);
    const aspect = w / hgt;
    camera.left = -4.6 * aspect;
    camera.right = 4.6 * aspect;
    camera.top = 4.6;
    camera.bottom = -4.6;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  const tmp = new THREE.Vector3();
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    const w = el.clientWidth;
    const hgt = el.clientHeight;
    for (const { el: d, at } of Object.values(labels)) {
      tmp.copy(at).project(camera);
      d.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * hgt}px) translate(-50%, -50%)`;
    }
  });
  const themeObs = new MutationObserver(paint);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', paint);

  return {
    el,
    available: true,
    update,
    view,
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
