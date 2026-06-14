import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const scriptPath = new URL('../themes/argon/source/argontheme.js', import.meta.url);

test('music page script uses final copy and lyric-stage hooks', async () => {
  const js = await readFile(scriptPath, 'utf8');

  const requiredSnippets = [
    '正在播放',
    '点击播放就开始',
    '切换到这张歌单',
    '播放这张歌单',
    'lq-music-lyrics-stage__line--active',
    'playerJump?.addEventListener("click"',
    'setLqMusicTabState(page, "playlist")',
  ];

  for (const snippet of requiredSnippets) {
    assert.ok(js.includes(snippet), `Expected argontheme.js to include: ${snippet}`);
  }

  assert.doesNotMatch(
    js,
    /下方还有兜底播放器|下方保留兜底播放器|Playlist Ready|Loading Playlist|Ready To Play|Now Playing|lyricsHost\.closest\('\.lq-music-panel\.is-active'\)/
  );
});
