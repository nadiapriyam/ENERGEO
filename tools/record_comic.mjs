// Records the whole story of the levels as a comic (docs/levels_spec.md, "All three levels: the whole story as a comic,
// on the side"). It plays every level once in a browser, on try/?record, where each part that ends is kept
// (src/levels/record.js); then it photographs each part's picture and writes down its lines, verbatim:
//   src/levels/comic/l<level>-<nn>.webp   one picture per part
//   src/levels/comic/comic.json           the parts in order, with their lines
// Levels 1 and 2 are played the way a learner plays them (on try/?record, Next presses itself); Level 3 fast-forwards
// to its end (try/?from=end), which does each interaction for it. It also counts each level's Next presses, which set
// how far each press fills the level's bar (reader.js). Run after any change to the levels: npm run comic (it builds first).
// Needs Playwright with Chromium, and Python with Pillow (to write WebP).
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/levels/comic');
const PORT = 4399;
const BASE = `http://localhost:${PORT}/try/`;

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch { /* already gone */ } };
process.on('exit', stop);
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(BASE)).ok) break; } catch { /* not up yet */ }
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch();
const errors = [];
const open = async (url) => {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  return page;
};

/** Every recorded part of one level, then the level's last part (still on screen), photographed and written down. */
async function collect(page, level, lesson, prefix) {
  const count = await page.evaluate(([level, lesson]) => {
    const recorded = [...document.querySelectorAll('#story-record .recorded-part')].filter((p) => p.dataset.level === level);
    const root = document.getElementById(lesson);
    const live = [root.querySelector(':scope > .figure'), root.querySelector(':scope > .notes')].filter((n) => n && n.childElementCount && n.offsetHeight);
    const last = document.createElement('div');
    last.dataset.alt = root.querySelector(':scope > .figure svg[aria-label]')?.getAttribute('aria-label') ?? '';
    last.append(...live.map((n) => n.cloneNode(true)), Object.assign(document.createElement('div'), { className: 'recorded-words' }));
    last.lastChild.append(...[...root.querySelector(':scope > .prompt').children].map((n) => n.cloneNode(true)));
    window.__comic = [...recorded, last];
    return window.__comic.length;
  }, [level, lesson]);
  const parts = [];
  for (let i = 0; i < count; i++) {
    const info = await page.evaluate((i) => {
      const part = window.__comic[i];
      const stage = Object.assign(document.createElement('div'), { id: 'comic-stage' });
      stage.style.cssText = 'position:absolute;left:0;top:0;width:680px;background:#fff;z-index:99999';
      const freeze = document.createElement('style');
      freeze.textContent = '#comic-stage *{transition:none!important;animation-delay:-60s!important;animation-iteration-count:1!important}';
      stage.append(freeze, ...[...part.children].filter((n) => !n.classList.contains('recorded-words')).map((n) => n.cloneNode(true)));
      document.body.append(stage);
      scrollTo(0, 0);
      const words = [...part.querySelector('.recorded-words').children].flatMap((n) => {
        if (n.classList.contains('speaker')) return [{ kind: 'speaker', who: n.dataset.who, bubbles: [...n.querySelectorAll('.bubble')].map((b) => ({ text: b.textContent.trim(), thought: b.classList.contains('thought') })) }];
        if (n.tagName === 'BUTTON' || n.classList.contains('choices') || n.classList.contains('hint')) return [];
        const text = n.textContent.replace(/\s+/g, ' ').trim();
        return text ? [{ kind: 'line', text, cls: [...n.classList].filter((c) => ['lead', 'final', 'feedback', 'caption', 'mri-sentence'].includes(c)) }] : [];
      });
      return { alt: part.dataset.alt, words };
    }, i);
    await page.waitForTimeout(120);
    const name = `${prefix}-${String(i + 1).padStart(2, '0')}`;
    const png = path.join(OUT, `${name}.png`);
    const box = await page.locator('#comic-stage').boundingBox();
    await page.locator('#comic-stage').screenshot({ path: png });
    await page.evaluate(() => document.getElementById('comic-stage').remove());
    const webp = spawnSync('python3', ['-c', 'import sys; from PIL import Image; im = Image.open(sys.argv[1]).convert("RGB"); im.save(sys.argv[2], "WEBP", quality=80, method=6)', png, path.join(OUT, `${name}.webp`)]);
    if (webp.status !== 0) throw new Error(`WebP: ${webp.stderr}`);
    rmSync(png);
    parts.push({ img: `${name}.webp`, w: Math.round(box.width), h: Math.round(box.height), alt: info.alt, words: info.words });
  }
  return parts;
}

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith('.webp')) rmSync(path.join(OUT, f));

// ── Levels 1 and 2, played
const p = await open(`${BASE}?record`);
const drag = async (sel, pts) => {
  const bb = await p.locator(sel).boundingBox();
  const vb = await p.$eval(sel, (e) => ({ width: e.viewBox.baseVal.width, height: e.viewBox.baseVal.height }));
  const s = pts.map((v) => [bb.x + (v.x / vb.width) * bb.width, bb.y + (v.y / vb.height) * bb.height]);
  await p.mouse.move(...s[0]); await p.mouse.down();
  for (let i = 1; i < s.length; i++) for (let k = 1; k <= 8; k++) { await p.mouse.move(s[i - 1][0] + ((s[i][0] - s[i - 1][0]) * k) / 8, s[i - 1][1] + ((s[i][1] - s[i - 1][1]) * k) / 8); await p.waitForTimeout(12); }
  await p.mouse.up();
};
const L1 = '#note-lesson > .figure .scene-board';
const until1 = (ph, ms = 30000) => p.waitForFunction((x) => [].concat(x).includes(window.__note?.phase), ph, { timeout: ms });
await until1('bow', 25000); await p.waitForTimeout(300);
await drag(L1, [{ x: 220, y: 300 }, { x: 220, y: 260 }, { x: 220, y: 340 }, { x: 220, y: 260 }, { x: 220, y: 340 }, { x: 220, y: 260 }, { x: 220, y: 340 }]);
await until1('lens1', 20000); await p.waitForTimeout(500);
const ring = () => p.evaluate(() => { const r = document.querySelector('#note-lesson > .figure .target-ring'); return { x: +r.getAttribute('cx'), y: +r.getAttribute('cy') }; });
const lens = () => p.evaluate(() => window.__note.lens);
await drag(L1, [await lens(), await ring()]);
await until1('lens2'); await p.waitForTimeout(900);
await drag(L1, [await lens(), await ring()]);
await until1('question', 30000); await p.waitForTimeout(400);
await p.click('#note-lesson > .prompt .choice:text-is("No")');
await until1('xray'); await p.waitForTimeout(400);
{ const l = await lens(); await drag(L1, [l, { x: l.x + 120, y: l.y + 40 }, { x: l.x + 260, y: l.y }]); }
await until1('notes'); await p.waitForTimeout(1400);
for (let k = 0; k < 4; k++) { await p.click(`#note-lesson .note.part-${k}`); await p.waitForTimeout(200); }
await p.click('#note-lesson button:text-is("Play them together")');
await until1('final', 30000); await p.waitForTimeout(2500);
await p.click('#next-level');
await p.waitForSelector('#mri-lesson .reader');
const until2 = (ph, ms = 30000) => p.waitForFunction((x) => [].concat(x).includes(window.__mri?.phase), ph, { timeout: ms });
const live = (t) => p.waitForFunction((t) => [...document.querySelectorAll('#mri-lesson > .prompt button')].some((b) => b.textContent === t && !b.disabled), t, { timeout: 60000 });
const press = async (t) => { await live(t); await p.waitForTimeout(300); await p.click(`#mri-lesson > .prompt button:text-is("${t}"):not([disabled])`); };
await p.waitForTimeout(1200);
await press('Slide your patient in'); await press('Zoom in'); await press('Closer');
await until2('play', 30000); await p.waitForTimeout(400);
const piece = async (id) => { const bb = await p.locator(`#mri-lesson > .figure [data-id="${id}"] .n-part`).boundingBox(); await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
for (const id of ['D0', 'D2']) { await piece(id); await p.waitForTimeout(700); }
await press('Not sure'); await until2('play2');
await piece('D1'); await p.waitForTimeout(1800);
await press('No');
await press('Nothing'); await press('Look inside'); await press('Look inside');
await press('Switch on the magnet');
await press('Take the scan');
await press('Yes');
await until2('final', 30000); await p.waitForTimeout(2500);
const steps = await p.evaluate(() => ({ 'level-1': window.__reader['level-1'].count, 'level-2': window.__reader['level-2'].count }));
const level1 = await collect(p, 'level-1', 'note-lesson', 'l1');
const level2 = await collect(p, 'level-2', 'mri-lesson', 'l2');

// ── Level 3, fast-forwarded to its end
const q = await open(`${BASE}?from=end&record`);
await q.waitForFunction(() => window.__prism?.reached.includes('end'), null, { timeout: 60000 });
await q.waitForTimeout(2500);
steps['level-3'] = await q.evaluate(() => window.__reader['level-3'].count);
const level3 = await collect(q, 'level-3', 'prism-lesson', 'l3');

await browser.close();
stop();
if (errors.length) throw new Error(`errors on the page: ${errors.join('; ')}`);
const comic = { levels: [{ id: 'level-1', steps: steps['level-1'], parts: level1 }, { id: 'level-2', steps: steps['level-2'], parts: level2 }, { id: 'level-3', steps: steps['level-3'], parts: level3 }] };
writeFileSync(path.join(OUT, 'comic.json'), `${JSON.stringify(comic, null, 1)}\n`);
console.log(`comic: ${level1.length} + ${level2.length} + ${level3.length} parts; Next presses ${Object.values(steps).join(' + ')}`);
process.exit(0);
