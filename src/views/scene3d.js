// R³ with three.js. Orthographic camera on purpose: the angle you see on screen is then exactly the
// orthographic projection that projectedAngle() computes, so the "screen angle" readout is the picture's truth.
// Math coordinates (x₁, x₂, x₃) with x₃ up map to three.js (X, Y, Z) = (x₁, x₃, −x₂), a proper rotation.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const toThree = ([a, b, c]) => new THREE.Vector3(a, c, -b);
const toMath = (v) => [v.x, -v.z, v.y];

function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
}

export function createScene3d({ onView, extent = 2.6 } = {}) {
  const el = document.createElement('div');
  el.className = 'scene3d';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'The pair u, v in three-dimensional space. Drag to orbit the camera.');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch {
    el.innerHTML = '<p class="fallback">This view needs WebGL, which is unavailable here. The readouts and contributions on this page still show every number the 3D view would.</p>';
    return { el, update() {}, setOrbit() {}, destroy() {}, available: false };
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  el.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  camera.position.copy(toThree([4.2, -5.2, 3.4]));
  camera.lookAt(0, 0, 0);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minZoom = 0.6;
  controls.maxZoom = 2.5;
  controls.autoRotateSpeed = 1.6;

  const mats = {
    ink: new THREE.MeshBasicMaterial(),
    ink2: new THREE.MeshBasicMaterial(),
    pos: new THREE.MeshBasicMaterial(),
    neg: new THREE.MeshBasicMaterial(),
    axis: new THREE.LineBasicMaterial(),
    residual: new THREE.LineDashedMaterial({ dashSize: 0.09, gapSize: 0.07 }),
    mark: new THREE.LineBasicMaterial(),
    plane: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }),
    planeEdge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 }),
    rotAxis: new THREE.LineDashedMaterial({ dashSize: 0.05, gapSize: 0.08 }),
  };
  function paint() {
    scene.background = new THREE.Color(token('--surface'));
    mats.ink.color.set(token('--ink'));
    mats.ink2.color.set(token('--ink-2'));
    mats.pos.color.set(token('--pos'));
    mats.neg.color.set(token('--neg'));
    mats.axis.color.set(token('--rule'));
    mats.residual.color.set(token('--ink-3'));
    mats.mark.color.set(token('--ink'));
    mats.plane.color.set(token('--ink-2'));
    mats.planeEdge.color.set(token('--ink-3'));
    mats.rotAxis.color.set(token('--ink-3'));
  }
  paint();

  // axes
  const axisLines = [];
  for (const d of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
    const g = new THREE.BufferGeometry().setFromPoints([toThree(d.map((x) => -extent * x)), toThree(d.map((x) => extent * x))]);
    const line = new THREE.Line(g, mats.axis);
    scene.add(line);
    axisLines.push(line);
  }

  // arrows: shaft (cylinder) + head (cone), built along +Y and oriented by quaternion
  const UP = new THREE.Vector3(0, 1, 0);
  function makeArrow(mat, radius = 0.035) {
    const group = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 16), mat);
    const head = new THREE.Mesh(new THREE.ConeGeometry(radius * 3.2, 0.22, 20), mat);
    group.add(shaft, head);
    scene.add(group);
    return {
      group,
      set(vec, withHead = true) {
        const v = toThree(vec);
        const len = v.length();
        group.visible = len > 1e-6;
        if (!group.visible) return;
        const hl = withHead ? Math.min(0.22, len * 0.4) : 0;
        shaft.scale.set(1, Math.max(1e-3, len - hl), 1);
        shaft.position.set(0, (len - hl) / 2, 0);
        head.visible = withHead;
        head.scale.set(1, hl / 0.22 || 1, 1);
        head.position.set(0, len - hl / 2, 0);
        group.quaternion.setFromUnitVectors(UP, v.clone().normalize());
      },
      setMat(m) {
        shaft.material = m;
        head.material = m;
      },
    };
  }
  const U = makeArrow(mats.ink);
  const V = makeArrow(mats.ink2);
  const shadow = makeArrow(mats.pos, 0.06);

  const residualGeom = new THREE.BufferGeometry();
  const residual = new THREE.Line(residualGeom, mats.residual);
  scene.add(residual);

  const markGeom = new THREE.BufferGeometry();
  const mark = new THREE.Line(markGeom, mats.mark);
  scene.add(mark);
  const originMarkGeom = new THREE.BufferGeometry();
  const originMark = new THREE.Line(originMarkGeom, mats.mark);
  scene.add(originMark);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mats.plane);
  const planeEdge = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([[-2, -2], [2, -2], [2, 2], [-2, 2]].map(([a, b]) => new THREE.Vector3(a, b, 0))),
    mats.planeEdge,
  );
  plane.add(planeEdge);
  scene.add(plane);

  const rotAxisGeom = new THREE.BufferGeometry();
  const rotAxis = new THREE.Line(rotAxisGeom, mats.rotAxis);
  scene.add(rotAxis);

  // HTML labels
  const labels = {};
  const label = (key, text, cls = '') => {
    const d = document.createElement('div');
    d.className = `lbl ${cls}`;
    d.textContent = text;
    el.append(d);
    labels[key] = { el: d, at: new THREE.Vector3() };
  };
  label('u', 'u');
  label('v', 'v');
  label('x1', 'x₁', 'axis');
  label('x2', 'x₂', 'axis');
  label('x3', 'x₃', 'axis');
  labels.x1.at.copy(toThree([extent + 0.15, 0, 0]));
  labels.x2.at.copy(toThree([0, extent + 0.15, 0]));
  labels.x3.at.copy(toThree([0, 0, extent + 0.15]));

  function cornerPoints(at, d1, d2, size = 0.16) {
    const a = toThree(at);
    const e1 = toThree(d1).normalize().multiplyScalar(size);
    const e2 = toThree(d2).normalize().multiplyScalar(size);
    return [a.clone().add(e1), a.clone().add(e1).add(e2), a.clone().add(e2)];
  }

  let last = null;
  function update(m) {
    last = m;
    U.set(m.u);
    V.set(m.v);
    const sh = m.r.shadow;
    shadow.setMat(m.r.inner >= 0 ? mats.pos : mats.neg);
    shadow.set(sh, false);
    residualGeom.setFromPoints([toThree(sh), toThree(m.v)]);
    residual.computeLineDistances();
    const shLen = Math.hypot(...sh);
    const resLen = Math.hypot(...m.r.residual);
    mark.visible = shLen > 0.12 && resLen > 0.12;
    if (mark.visible) markGeom.setFromPoints(cornerPoints(sh, sh.map((x) => -x), m.r.residual));
    originMark.visible = m.orthogonal;
    if (m.orthogonal) originMarkGeom.setFromPoints(cornerPoints([0, 0, 0], m.u, m.v, 0.24));
    plane.visible = !!m.showComplement;
    if (plane.visible) plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toThree(m.u).normalize());
    rotAxis.visible = !!m.rotationAxis;
    if (rotAxis.visible) {
      const a = m.rotationAxis;
      rotAxisGeom.setFromPoints([toThree(a.map((x) => -extent * 0.9 * x)), toThree(a.map((x) => extent * 0.9 * x))]);
      rotAxis.computeLineDistances();
    }
    labels.u.at.copy(toThree(m.u.map((x) => x * 1.12)));
    labels.v.at.copy(toThree(m.v.map((x) => x * 1.12)));
  }

  function resize() {
    const w = el.clientWidth || 400;
    const hgt = el.clientHeight || 300;
    renderer.setSize(w, hgt, false);
    const aspect = w / hgt;
    const half = 3.1;
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  const tmp = new THREE.Vector3();
  let lastDir = '';
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    const w = el.clientWidth;
    const hgt = el.clientHeight;
    for (const { el: d, at } of Object.values(labels)) {
      tmp.copy(at).project(camera);
      d.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * hgt}px) translate(-50%, -50%)`;
    }
    const dir = toMath(camera.position.clone().sub(controls.target).normalize());
    const key = dir.map((x) => x.toFixed(4)).join(',');
    if (key !== lastDir) {
      lastDir = key;
      onView?.(dir);
    }
  });

  const themeObs = new MutationObserver(paint);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', paint);

  let userInteracted = false;
  controls.addEventListener('start', () => {
    userInteracted = true;
    onView?.(null, 'interacted');
  });

  return {
    el,
    available: true,
    update,
    setOrbit(on) {
      controls.autoRotate = on;
    },
    turnCamera(deg) {
      const off = camera.position.clone().sub(controls.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), (deg * Math.PI) / 180);
      camera.position.copy(controls.target).add(off);
      camera.lookAt(controls.target);
      onView?.(null, 'interacted');
    },
    interacted: () => userInteracted,
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
