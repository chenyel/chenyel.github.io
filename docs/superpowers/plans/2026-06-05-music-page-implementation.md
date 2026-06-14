# /music 页面改造 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/music` 页面改造成无左右状态栏的双区块沉浸音乐页，只在该页隐藏右下角全局播放器，并清理所有代理/兜底式过渡文案。

**Architecture:** 继续沿用 `themes/argon` 的现有音乐页播放器逻辑，把 `/music` 识别为页面级特例。布局控制放在 `layout.ejs` 和 `lq-player.ejs`，内容结构放在 `content-page.ejs`，视觉和歌词舞台放在 `style.css`，文本与交互状态切换放在 `argontheme.js`。验证使用 Node 内置测试运行器读取构建后的 `public/music/index.html` 与源文件文本，避免额外引入测试框架。

**Tech Stack:** Hexo 7、EJS、CSS、原生前端脚本、Node `node:test`、`assert/strict`

---

### Task 1: 页面壳子与全局播放器显隐

**Files:**
- Create: `tests/music-page-shell.test.mjs`
- Modify: `themes/argon/layout/layout.ejs`
- Modify: `themes/argon/layout/_partial/lq-player.ejs`
- Test: `tests/music-page-shell.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function buildSite() {
  execFileSync('npm', ['run', 'clean'], { cwd: 'D:/blog', stdio: 'pipe' });
  execFileSync('npm', ['run', 'build'], { cwd: 'D:/blog', stdio: 'pipe' });
}

function readHtml(path) {
  return readFileSync(path, 'utf8');
}

test('music page drops shell sidebars but home page keeps the floating player', () => {
  buildSite();

  const musicHtml = readHtml('D:/blog/public/music/index.html');
  const homeHtml = readHtml('D:/blog/public/index.html');

  assert.match(musicHtml, /lq-page-shell--music/);
  assert.doesNotMatch(musicHtml, /id="leftbar"/);
  assert.doesNotMatch(musicHtml, /class="lq-rightbar"/);
  assert.doesNotMatch(musicHtml, /class="lq-player /);

  assert.match(homeHtml, /class="lq-player /);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/music-page-shell.test.mjs`

Expected: FAIL because `public/music/index.html` still contains `id="leftbar"`, `.lq-rightbar`, and `.lq-player`.

- [ ] **Step 3: Write minimal implementation**

Update `themes/argon/layout/layout.ejs` so `/music` pages add a dedicated shell class and skip left/right columns:

```ejs
<% const isTagLanding = is_page() && page && page.path === 'tags/index.html'; %>
<% const isMusicPage = is_page() && page && page.lq_music_page; %>

<div id="lq-page-shell" class="<%= is_home() ? 'lq-home-shell' : 'lq-shell-wrap' %> <%= isTagLanding ? 'lq-page-shell--tag-tree' : '' %> <%= isMusicPage ? 'lq-page-shell--music' : '' %>">
  <div class="lq-shell <%= isTagLanding ? 'lq-shell--tag-tree' : '' %> <%= isMusicPage ? 'lq-shell--music' : '' %>">
    <% if (!isMusicPage) { %>
      <div class="lq-left-column">
        <%- include('sidebar.ejs') %>
      </div>
    <% } %>

    <div class="lq-main-column">
      ...
    </div>

    <% if (!isMusicPage) { %>
      <div class="lq-right-column">
        <%- include('_partial/lq-rightbar.ejs') %>
      </div>
    <% } %>
  </div>
</div>
```

Update `themes/argon/layout/_partial/lq-player.ejs` so the floating player stays enabled site-wide but skips `/music`:

```ejs
<% const isMusicPage = is_page() && page && page.lq_music_page; %>
<% if (theme.show_lq_player !== false && !isMusicPage) { %>
  ...
<% } %>
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build
node --test tests/music-page-shell.test.mjs
```

Expected: PASS with one passing test and `public/music/index.html` no longer containing the sidebar or floating player markup.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/music-page-shell.test.mjs themes/argon/layout/layout.ejs themes/argon/layout/_partial/lq-player.ejs
git commit -m "feat: isolate music page shell"
```

Expected: If the workspace is git-backed, commit succeeds. If `D:/blog` is still missing `.git`, note the skipped commit in the work log and continue.

### Task 2: 音乐页结构与文案清理

**Files:**
- Create: `tests/music-page-copy.test.mjs`
- Modify: `themes/argon/layout/_partial/content-page.ejs`
- Modify: `source/_data/argon.yml`
- Test: `tests/music-page-copy.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function buildMusicPage() {
  execFileSync('npm', ['run', 'build'], { cwd: 'D:/blog', stdio: 'pipe' });
  return readFileSync('D:/blog/public/music/index.html', 'utf8');
}

test('music page exposes a dual-panel stage and removes transition copy', () => {
  const html = buildMusicPage();

  assert.match(html, /class="lq-music-stage"/);
  assert.match(html, /class="lq-music-stage__player"/);
  assert.match(html, /class="lq-music-stage__lyrics"/);
  assert.match(html, /data-music-lyrics-stage/);

  assert.doesNotMatch(html, /Fallback Player|Coming Soon|Now Loading/i);
  assert.doesNotMatch(html, /代理|兜底|接入前|fallback|coming soon/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/music-page-copy.test.mjs`

Expected: FAIL because the current template still renders `Fallback Player`, `Now Loading`, `Coming Soon`, and the old fallback block.

- [ ] **Step 3: Write minimal implementation**

Rebuild the music page body in `themes/argon/layout/_partial/content-page.ejs` so the hero becomes the real dual-panel stage and the lower fallback section is removed. Keep the existing data hooks that `argontheme.js` already uses:

```ejs
<article class="post post-full card bg-white shadow-sm border-0 lq-page-card lq-music-page">
  <section class="lq-music-stage lq-music-hero" data-music-api-base="<%= music_api_base_url %>" data-fallback-playlist-id="<%= fallback_playlist_id %>">
    <div class="lq-music-stage__backdrop lq-music-hero__aurora" aria-hidden="true"></div>

    <div class="lq-music-stage__player lq-music-hero__player" data-lq-music-state>
      <div class="lq-music-stage__player-shell lq-music-hero__player-shell">
        <p class="lq-music-player-label">正在准备</p>
        <h1 class="lq-music-player-title">把今天想听的歌放在这里</h1>
        <p class="lq-music-player-copy">切歌、看歌词、整理最近循环的声音，都在这一页完成。</p>
        <div class="lq-music-player-main">
          <div class="lq-music-player-cover-wrap">
            <img class="lq-music-player-cover" data-music-cover src="/img/nav_logo.png" alt="music cover">
          </div>
          <div class="lq-music-player-stack">
            <div class="lq-music-player-progress">
              <input class="lq-music-player-range" type="range" min="0" max="100" value="0" step="0.1" data-music-progress>
              <div class="lq-music-player-times">
                <span data-music-current-time>00:00</span>
                <span data-music-duration>00:00</span>
              </div>
            </div>
            <div class="lq-music-player-controls">
              <div class="lq-music-player-buttons">
                <button class="lq-music-control" type="button" data-music-action="prev" aria-label="上一首"><i class="fa fa-step-backward" aria-hidden="true"></i></button>
                <button class="lq-music-control lq-music-control--primary" type="button" data-music-action="toggle" aria-label="播放或暂停"><i class="fa fa-play" aria-hidden="true"></i></button>
                <button class="lq-music-control" type="button" data-music-action="next" aria-label="下一首"><i class="fa fa-step-forward" aria-hidden="true"></i></button>
              </div>
            </div>
            <audio class="lq-music-audio" data-music-audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>

    <div class="lq-music-stage__lyrics" data-music-lyrics-stage>
      <div class="lq-music-lyrics-stage__meta">
        <p class="lq-music-kicker">Lyrics Stage</p>
        <h2 class="lq-music-stage__lyrics-title">歌词会跟着旋律一起亮起来</h2>
      </div>
      <div class="lq-music-lyrics-stage__viewport lq-music-lyrics" data-music-lyrics>
        <p class="lq-music-lyrics__placeholder">播放开始后，这里会同步显示当前歌词。</p>
      </div>
    </div>
  </section>

  <section class="lq-music-console">
    <div class="lq-music-tabs" role="tablist" aria-label="Music panels">
      <button class="lq-music-tab is-active" type="button" data-music-tab="playlist">歌单</button>
      <button class="lq-music-tab" type="button" data-music-tab="queue">曲目</button>
    </div>
    <div class="lq-music-panels">
      <div class="lq-music-panel is-active" data-music-panel="playlist">
        <div class="lq-music-playlists" id="music-playlists" data-music-playlists>...</div>
      </div>
      <div class="lq-music-panel" data-music-panel="queue">
        <div class="lq-music-tracklist" data-music-tracklist>
          <p class="lq-music-tracklist__placeholder">切换到一张歌单后，这里会列出当前曲目。</p>
        </div>
      </div>
    </div>
  </section>
</article>
```

Replace the music copy in `source/_data/argon.yml`:

```yml
music_page_intro: '这一页存放最近让我安静下来的声音。'
music_featured_playlists:
  - id: '8948680268'
    title: '我喜欢'
    tag: '常听'
    description: '把最近循环的歌整理成一张顺手就能播放的歌单。'
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build
node --test tests/music-page-copy.test.mjs
```

Expected: PASS with no banned transition copy in `public/music/index.html`.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/music-page-copy.test.mjs themes/argon/layout/_partial/content-page.ejs source/_data/argon.yml
git commit -m "feat: rebuild music page structure and copy"
```

Expected: If the workspace is git-backed, commit succeeds. Otherwise record the skipped commit and continue.

### Task 3: 双区块样式、背景层和歌词舞台

**Files:**
- Create: `tests/music-page-style.test.mjs`
- Modify: `themes/argon/source/style.css`
- Test: `tests/music-page-style.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('D:/blog/themes/argon/source/style.css', 'utf8');

test('music page css defines isolated shell, stage layout, and lyric sweep animation', () => {
  assert.match(css, /\.lq-shell--music/);
  assert.match(css, /\.lq-page-shell--music \.lq-main-column/);
  assert.match(css, /\.lq-music-stage\s*\{/);
  assert.match(css, /\.lq-music-stage__lyrics/);
  assert.match(css, /\.lq-music-lyrics-stage__line--active/);
  assert.match(css, /@keyframes lqMusicLyricSweep/);
  assert.match(css, /@media \(max-width: 991px\)/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/music-page-style.test.mjs`

Expected: FAIL because the new shell selectors, stage selectors, and lyric sweep animation do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Add a music-page-specific shell section near the layout rules in `themes/argon/source/style.css`:

```css
.lq-shell--music{
  grid-template-columns: minmax(0, 1fr);
}

.lq-page-shell--music .lq-main-column{
  width: min(1480px, calc(100vw - 72px));
  margin: 0 auto;
  padding-top: 28px;
}

.lq-page-shell--music .page-information-card-container{
  display: none;
}
```

Replace the old music-page block with a dedicated stage and lyric theatre:

```css
.lq-music-page{
  padding: 34px;
  background:
    radial-gradient(circle at 8% 12%, rgba(255, 212, 232, 0.68), transparent 30%),
    radial-gradient(circle at 88% 16%, rgba(178, 226, 255, 0.52), transparent 32%),
    linear-gradient(180deg, rgba(255, 251, 253, 0.98), rgba(244, 249, 255, 0.98));
}

.lq-music-stage{
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(360px, 0.94fr);
  gap: 28px;
  padding: 30px;
  border-radius: 34px;
  overflow: hidden;
}

.lq-music-stage__player-shell{
  min-height: 100%;
  padding: 30px;
  border-radius: 28px;
  background: rgba(40, 32, 48, 0.86);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 32px 56px rgba(58, 38, 53, 0.28);
}

.lq-music-stage__lyrics{
  position: relative;
  padding: 30px 28px;
  border-radius: 28px;
  background: rgba(255,255,255,0.58);
  border: 1px solid rgba(193, 143, 168, 0.14);
  backdrop-filter: blur(18px);
}

.lq-music-lyrics-stage__viewport{
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 420px;
  gap: 16px;
}

.lq-music-lyrics__line{
  position: relative;
  background: transparent;
  color: rgba(74, 57, 70, 0.48);
  font-size: 1rem;
  transform: scale(0.94);
  filter: blur(0.2px);
  transition: transform 260ms ease, color 260ms ease, opacity 260ms ease, filter 260ms ease;
}

.lq-music-lyrics-stage__line--active,
.lq-music-lyrics__line.is-active{
  color: #2c1e2b;
  transform: scale(1);
  filter: none;
  text-shadow: 0 0 24px rgba(255,255,255,0.45);
}

.lq-music-lyrics__line.is-active::after{
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.52) 48%, transparent 100%);
  transform: translateX(-100%);
  animation: lqMusicLyricSweep 1400ms ease forwards;
}

@keyframes lqMusicLyricSweep{
  from { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

@media (max-width: 991px){
  .lq-page-shell--music .lq-main-column{
    width: calc(100vw - 32px);
    padding-top: 18px;
  }

  .lq-music-stage{
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .lq-music-lyrics-stage__viewport{
    min-height: 280px;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/music-page-style.test.mjs`

Expected: PASS with the new stage selectors and `@keyframes lqMusicLyricSweep` found in `style.css`.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/music-page-style.test.mjs themes/argon/source/style.css
git commit -m "feat: style immersive music page"
```

Expected: If the workspace is git-backed, commit succeeds. Otherwise record the skipped commit and continue.

### Task 4: 文案状态与歌词舞台联动脚本

**Files:**
- Create: `tests/music-page-behavior.test.mjs`
- Modify: `themes/argon/source/argontheme.js`
- Test: `tests/music-page-behavior.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const js = readFileSync('D:/blog/themes/argon/source/argontheme.js', 'utf8');

test('music page script uses the final chinese copy and lyric-stage hooks', () => {
  assert.match(js, /正在播放/);
  assert.match(js, /点击播放就开始/);
  assert.match(js, /切换到这张歌单/);
  assert.match(js, /lq-music-lyrics-stage__line--active/);

  assert.doesNotMatch(js, /下方还有兜底播放器|下方保留兜底播放器|Playlist Ready|Loading Playlist|Ready To Play|Now Playing/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/music-page-behavior.test.mjs`

Expected: FAIL because `argontheme.js` still contains `Playlist Ready`, `Loading Playlist`, `Ready To Play`, and `兜底播放器` labels.

- [ ] **Step 3: Write minimal implementation**

Update the user-facing strings in `themes/argon/source/argontheme.js`:

```js
if (label) {
  label.textContent = options.label || "歌单已就绪";
}
if (title) {
  title.textContent = item.title || "把今天想听的歌放在这里";
}
if (copy) {
  copy.textContent = item.description || "切歌、看歌词、整理最近循环的声音，都在这一页完成。";
}
if (jump) {
  jump.textContent = options.jumpLabel || "切换到这张歌单";
  jump.setAttribute("href", options.jumpHref || "#music-playlists");
}
```

Adjust playback and playlist state transitions:

```js
setHeroState(cardData, {
  copy: cardData.description || "歌单已经切过来了，准备开始播放。",
  jumpLabel: "切换到这张歌单",
  label: "歌单载入中",
  title: cardData.title || "歌单已就绪"
});

setHeroState({
  id: state.playlistId,
  tag: playlistMeta.tag,
  title: playlistMeta.title || "歌单已就绪",
  description: playlistMeta.description,
  trackCount: String(state.tracks.length || "")
}, {
  cover: track.cover || playlistMeta.cover || "/img/nav_logo.png",
  copy: `${track.artist}${playlistMeta.description ? " · " + playlistMeta.description : ""}`,
  jumpLabel: "切换到这张歌单",
  label: audio.paused ? "已暂停" : "正在播放",
  title: track.title
});

if (options.autoplay) {
  try {
    await audio.play();
  } catch (error) {
    updatePlayButton(false);
    if (playerLabel) {
      playerLabel.textContent = "点击播放就开始";
    }
  }
}
```

Promote the lyric-stage wrapper so the active line can receive the stronger state class:

```js
lyricsHost.innerHTML = state.tracks[state.currentIndex].lyrics.map((line, index) => {
  const isActive = index === state.activeLyricIndex;
  return `<button class="lq-music-lyrics__line${isActive ? " is-active lq-music-lyrics-stage__line--active" : ""}" type="button" data-lyric-index="${index}" data-lyric-time="${Number(line.time || 0)}">${escapeLqMusicHtml(line.text)}</button>`;
}).join("");
```

Also switch the default tab state to keep the lower section focused on playlist selection first:

```js
setLqMusicTabState(page, "playlist");
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build
node --test tests/music-page-behavior.test.mjs
```

Expected: PASS with the old fallback/English labels removed from `argontheme.js`.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/music-page-behavior.test.mjs themes/argon/source/argontheme.js
git commit -m "feat: polish music page interaction copy"
```

Expected: If the workspace is git-backed, commit succeeds. Otherwise record the skipped commit and continue.

### Task 5: 集成验证与交付检查

**Files:**
- Modify: `public/music/index.html` (generated output, verification only)
- Test: `tests/music-page-shell.test.mjs`
- Test: `tests/music-page-copy.test.mjs`
- Test: `tests/music-page-style.test.mjs`
- Test: `tests/music-page-behavior.test.mjs`

- [ ] **Step 1: Run the full verification suite**

Run:

```bash
npm run clean
npm run build
node --test tests/music-page-shell.test.mjs tests/music-page-copy.test.mjs tests/music-page-style.test.mjs tests/music-page-behavior.test.mjs
```

Expected: `hexo generate` exits with code 0, all four tests PASS.

- [ ] **Step 2: Inspect the generated music page for required markers**

Run:

```bash
node -e "const fs=require('fs');const html=fs.readFileSync('D:/blog/public/music/index.html','utf8');console.log(JSON.stringify({musicShell:/lq-page-shell--music/.test(html),playerHidden:!/class=\\\"lq-player /.test(html),lyricsStage:/data-music-lyrics-stage/.test(html),bannedCopy:/代理|兜底|fallback|coming soon/i.test(html)},null,2));"
```

Expected:

```json
{
  "musicShell": true,
  "playerHidden": true,
  "lyricsStage": true,
  "bannedCopy": false
}
```

- [ ] **Step 3: Manually verify non-music page floating-player recovery**

Run:

```bash
node -e "const fs=require('fs');const home=fs.readFileSync('D:/blog/public/index.html','utf8');console.log(/class=\\\"lq-player /.test(home));"
```

Expected: `true`

- [ ] **Step 4: Document the shipped behavior in the work summary**

Use this checklist in the final implementation handoff:

```md
- `/music` 页面不再渲染左右状态栏。
- `/music` 页面不再渲染右下角全局播放器。
- 其他页面仍然保留右下角全局播放器。
- 音乐页主区为双区块布局。
- 歌词区具备当前句高亮与流光动效。
- 所有代理/兜底/coming soon 文案已清理。
```

- [ ] **Step 5: Commit**

Run:

```bash
git add themes/argon/layout/layout.ejs themes/argon/layout/_partial/lq-player.ejs themes/argon/layout/_partial/content-page.ejs themes/argon/source/style.css themes/argon/source/argontheme.js source/_data/argon.yml tests/music-page-shell.test.mjs tests/music-page-copy.test.mjs tests/music-page-style.test.mjs tests/music-page-behavior.test.mjs
git commit -m "feat: redesign music page experience"
```

Expected: If the workspace is git-backed, commit succeeds. Otherwise record the skipped commit and deliver the verified file list plus command output summary.
