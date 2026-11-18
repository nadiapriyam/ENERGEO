// try/: Level 1 on its own page, in its own style. When its last line is shown, a link to Level 2 appears.
import './base.css';
import { LEVELS } from './copyLevels.js';
import './level1.js';

document.getElementById('level-tag').textContent = LEVELS.level1;
const next = document.getElementById('next-level');
next.textContent = LEVELS.next;
document.getElementById('level-1-lesson').addEventListener('level-finished', () => {
  next.hidden = false;
  requestAnimationFrame(() => next.classList.add('in'));
});
