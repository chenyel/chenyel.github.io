import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const stylePath = new URL('../themes/argon/source/style.css', import.meta.url);

test('music page stylesheet contains the approved stage selectors', async () => {
  const css = await readFile(stylePath, 'utf8');

  const requiredSnippets = [
    '.lq-shell--music',
    '.lq-page-shell--music .lq-main-column',
    '.lq-music-stage {',
    '.lq-music-hero__player-shell',
    '.lq-music-stage__lyrics',
    '.lq-music-lyrics',
    '.lq-music-lyrics-stage__line--active',
    '.lq-music-lyrics__line.is-active',
    '@keyframes lqMusicLyricSweep',
    '@media (max-width: 991px)',
  ];

  for (const snippet of requiredSnippets) {
    assert.ok(css.includes(snippet), `Expected style.css to include: ${snippet}`);
  }
});
