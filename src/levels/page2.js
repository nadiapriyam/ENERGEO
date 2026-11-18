// try/level-2/: Level 2 on its own page, in the same style as Level 1.
import './base.css';
import { LEVELS } from './copyLevels.js';
import './level2.js';

const tag = document.getElementById('level-tag');
tag.textContent = LEVELS.level2;
tag.append(Object.assign(document.createElement('span'), { className: 'level-note', textContent: LEVELS.soundOn }));
