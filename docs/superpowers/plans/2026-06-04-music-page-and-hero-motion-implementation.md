# Music Page And Hero Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add homepage title motion, tab blur/focus title switching, and a richer NetEase-powered music page without exposing third-party API keys in the static frontend.

**Architecture:** Reuse the existing `Argon` theme shell and extend the current `lq-*` layer instead of introducing a second page system. Keep playback on `MetingJS + APlayer` for the first release, move richer playlist discovery into a custom music-page UI, and route NetEase data through a small external proxy contract documented in-repo.

**Tech Stack:** Hexo 7, EJS, theme config in `source/_data/argon.yml`, vanilla JS in `themes/argon/source/argontheme.js`, CSS in `themes/argon/source/style.css`, Node test runner, optional Cloudflare Worker example

---

## File Structure Map

**Modify**

- `D:\blog\source\_data\argon.yml`
- `D:\blog\source\music\index.md`
- `D:\blog\themes\argon\layout\_partial\lq-home-hero.ejs`
- `D:\blog\themes\argon\layout\_partial\content-page.ejs`
- `D:\blog\themes\argon\source\argontheme.js`
- `D:\blog\themes\argon\source\style.css`
- `D:\blog\tests\layout-shell.test.mjs`

**Create**

- `D:\blog\docs\examples\netease-music-proxy\README.md`
- `D:\blog\docs\examples\netease-music-proxy\worker.js`

## Task 1: Add failing coverage for hero motion, tab title hooks, and music page structure

**Files:**

- Modify: `D:\blog\tests\layout-shell.test.mjs`

- [ ] Add a failing homepage assertion for motion hooks.

```js
test('home hero renders motion configuration hooks', () => {
  const html = readPublicFile('index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /data-title-motion=/)
  assert.match(html, /data-title-motion-interval=/)
  assert.match(html, /data-subtitle-reveal-delay=/)
  assert.match(css, /lq-title-char/)
  assert.match(css, /@keyframes lqTitleBounceIn/)
})
```

- [ ] Run the focused test file and confirm the new assertions fail.

Run: `node --test tests/layout-shell.test.mjs`

Expected: failure mentioning missing `data-title-motion` or `lq-title-char`.

- [ ] Add a failing assertion for tab-title copy hooks.

```js
test('layout exposes tab title blur and focus copy', () => {
  const html = readPublicFile('index.html')

  assert.match(html, /data-tab-blur-title=/)
  assert.match(html, /data-tab-focus-title=/)
})
```

- [ ] Add a failing assertion for the upgraded music page shell.

```js
test('music page renders the immersive music layout shell', () => {
  const html = readPublicFile('music/index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-music-page/)
  assert.match(html, /lq-music-hero/)
  assert.match(html, /lq-music-playlists/)
  assert.match(html, /data-music-api-base=/)
  assert.match(css, /lq-music-card/)
})
```

- [ ] Re-run the file and confirm all three new checks fail before implementation begins.

Run: `node --test tests/layout-shell.test.mjs`

Expected: FAIL, with the new homepage, tab-title, and music-page assertions all unmet.

## Task 2: Add config surface for motion, tab-title copy, and music-page data

**Files:**

- Modify: `D:\blog\source\_data\argon.yml`

- [ ] Add the new config keys with safe defaults.

```yml
home_title_motion_enabled: true
home_title_motion_interval: 90
home_subtitle_reveal_delay: 680
tab_blur_title: '离开了……'
tab_focus_title: '回来啦~'
music_page_intro: '这一页存放最近让我安静下来的声音。'
music_api_base: ''
music_page_fallback_playlist_id: '9724541268'
music_featured_playlists:
  - id: '9724541268'
    title: '默认歌单'
    tag: '常驻'
    description: '没有代理时先使用这张歌单。'
```

- [ ] Keep the current `lq_player` block untouched for fallback playback.

```yml
lq_player:
  title: '欢迎回家'
  artist: 'C x l'
  cover: '/img/nav_logo.png'
  audio: ''
  autoplay: false
  playlist: []
```

- [ ] Build once to ensure the YAML still parses.

Run: `npm run build`

Expected: `hexo generate` completes successfully.

## Task 3: Implement homepage title bounce-in motion in the existing hero partial

**Files:**

- Modify: `D:\blog\themes\argon\layout\_partial\lq-home-hero.ejs`
- Modify: `D:\blog\themes\argon\source\style.css`
- Modify: `D:\blog\themes\argon\source\argontheme.js`

- [ ] Update the hero partial to expose motion attributes only on the homepage.

```ejs
<div
  class="banner-title text-white"
  data-title-motion="<%= is_home() && theme.home_title_motion_enabled !== false ? 'chars' : 'none' %>"
  data-title-motion-interval="<%= theme.home_title_motion_interval || 90 %>"
  data-subtitle-reveal-delay="<%= theme.home_subtitle_reveal_delay || 680 %>"
>
  <span class="banner-title-inner"><%= heroTitle %></span>
  <% if (heroSubtitle) { %>
    <span class="banner-subtitle d-block"><%= heroSubtitle %></span>
  <% } %>
</div>
```

- [ ] Add the character and subtitle animation styles.

```css
.lq-title-char {
  display: inline-block;
  opacity: 0;
  transform: translate3d(0, 0.8rem, 0) scale(0.92);
}

.lq-title-char.is-in {
  animation: lqTitleBounceIn 560ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.banner-subtitle.is-pending {
  opacity: 0;
  transform: translate3d(0, 0.75rem, 0);
}

.banner-subtitle.is-in {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition: opacity 420ms ease, transform 420ms ease;
}

@keyframes lqTitleBounceIn {
  0% { opacity: 0; transform: translate3d(0, 0.8rem, 0) scale(0.92); }
  60% { opacity: 1; transform: translate3d(0, -0.18rem, 0) scale(1.03); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
```

- [ ] Replace the old text-only typewriter init with a homepage-safe span animation helper.

```js
function initHeroTitleMotion() {
  var title = document.querySelector('.banner-title[data-title-motion="chars"]');
  if (!title || prefersReducedMotion()) return;

  var titleInner = title.querySelector('.banner-title-inner');
  var subtitle = title.querySelector('.banner-subtitle');
  if (!titleInner) return;

  var text = titleInner.textContent || '';
  var interval = Number(title.getAttribute('data-title-motion-interval') || 90);
  var subtitleDelay = Number(title.getAttribute('data-subtitle-reveal-delay') || 680);

  titleInner.textContent = '';
  Array.from(text).forEach(function (char, index) {
    var span = document.createElement('span');
    span.className = 'lq-title-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    titleInner.appendChild(span);
    setTimeout(function () { span.classList.add('is-in'); }, index * interval);
  });

  if (subtitle) {
    subtitle.classList.add('is-pending');
    setTimeout(function () {
      subtitle.classList.add('is-in');
      subtitle.classList.remove('is-pending');
    }, text.length * interval + subtitleDelay);
  }
}
```

- [ ] Re-run generation and tests to flip the homepage motion checks green.

Run: `npm run build`

Run: `node --test tests/layout-shell.test.mjs`

Expected: homepage motion assertions PASS; tab-title and music-page assertions may still fail.

## Task 4: Implement tab blur/focus title switching with PJAX-safe resets

**Files:**

- Modify: `D:\blog\themes\argon\layout\_partial\lq-home-hero.ejs`
- Modify: `D:\blog\themes\argon\source\argontheme.js`

- [ ] Expose the blur and focus copy on a stable element already present on every page.

```ejs
<section
  id="banner"
  class="banner section section-lg section-shaped <%= is_home() ? 'lq-home-hero' : 'lq-page-hero' %>"
  data-tab-blur-title="<%= theme.tab_blur_title || '离开了……' %>"
  data-tab-focus-title="<%= theme.tab_focus_title || '回来啦~' %>"
  data-page-title="<%= page.title || config.title %>"
>
```

- [ ] Add a focused title manager that restores the real page title after blur/focus cycles.

```js
var tabTitleTimer = null;
var originalDocumentTitle = document.title;

function syncPageTitleSource() {
  var banner = document.getElementById('banner');
  originalDocumentTitle = document.title;
  if (banner && banner.getAttribute('data-page-title')) {
    originalDocumentTitle = document.title;
  }
}

function initTabTitleState() {
  var banner = document.getElementById('banner');
  if (!banner || typeof document.hidden === 'undefined') return;

  var blurTitle = banner.getAttribute('data-tab-blur-title') || '离开了……';
  var focusTitle = banner.getAttribute('data-tab-focus-title') || '回来啦~';
  clearTimeout(tabTitleTimer);
  syncPageTitleSource();

  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  function handleVisibilityChange() {
    clearTimeout(tabTitleTimer);
    if (document.hidden) {
      document.title = blurTitle;
      return;
    }
    document.title = focusTitle;
    tabTitleTimer = setTimeout(function () {
      document.title = originalDocumentTitle;
    }, 900);
  }
}
```

- [ ] Re-run generation and tests to make the tab-title checks pass without regressing the shell.

Run: `npm run build`

Run: `node --test tests/layout-shell.test.mjs`

Expected: tab-title assertions PASS; music-page assertions may still fail.

## Task 5: Replace the single-tag music page body with an immersive shell and fallback player

**Files:**

- Modify: `D:\blog\source\music\index.md`
- Modify: `D:\blog\themes\argon\layout\_partial\content-page.ejs`
- Modify: `D:\blog\themes\argon\source\style.css`

- [ ] Mark the music page with frontmatter the theme can detect.

```md
---
title: 音乐
layout: page
lq_music_page: true
---

{% meting "9724541268" "netease" "playlist" "autoplay" "mutex:false" "listmaxheight:400px" "preload:none" "theme:#ad7a86"%}
```

- [ ] Branch inside `content-page.ejs` so the music page renders a custom shell before the fallback `meting` content.

```ejs
<% if (page.lq_music_page) { %>
  <article class="post post-full card bg-white shadow-sm border-0 lq-page-card lq-music-page">
    <section
      class="lq-music-hero"
      data-music-api-base="<%= theme.music_api_base || '' %>"
      data-fallback-playlist-id="<%= theme.music_page_fallback_playlist_id || '9724541268' %>"
    >
      <div class="lq-music-hero__copy">
        <p class="lq-music-kicker">Music</p>
        <h1 class="lq-music-title"><%= page.title %></h1>
        <p class="lq-music-intro"><%= theme.music_page_intro || '' %></p>
      </div>
      <div class="lq-music-hero__player" data-music-player-host></div>
    </section>
    <section class="lq-music-playlists" data-music-playlists></section>
    <div class="lq-music-fallback" data-music-fallback>
      <%- argon_preprocess_article(post.content, theme, false) %>
    </div>
  </article>
<% } else { %>
  <!-- existing page markup -->
<% } %>
```

- [ ] Add page-specific styles for the hero and card wall.

```css
.lq-music-page { overflow: hidden; }
.lq-music-hero { display: grid; gap: 2rem; grid-template-columns: 1.1fr 0.9fr; }
.lq-music-playlists { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.lq-music-card { border-radius: 24px; padding: 1rem; background: rgba(255,255,255,0.82); transition: transform 220ms ease, box-shadow 220ms ease; }
.lq-music-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(64, 43, 53, 0.12); }
```

- [ ] Build and run tests to confirm the music-page HTML shell now exists.

Run: `npm run build`

Run: `node --test tests/layout-shell.test.mjs`

Expected: music-page structure assertions now pass in HTML; client-side data population is still pending.

## Task 6: Hydrate the music page from config and optional proxy data

**Files:**

- Modify: `D:\blog\themes\argon\source\argontheme.js`
- Modify: `D:\blog\themes\argon\source\style.css`

- [ ] Add a tiny music-page bootstrap that renders fallback cards from config first.

```js
function getFeaturedPlaylists() {
  var banner = document.querySelector('.lq-music-hero');
  if (!banner) return [];
  return (window.argonMusicPlaylists || []).slice();
}

function renderMusicCards(items) {
  var host = document.querySelector('[data-music-playlists]');
  if (!host) return;
  host.innerHTML = items.map(function (item) {
    return '<button class="lq-music-card" type="button" data-playlist-id="' + item.id + '">' +
      '<div class="lq-music-card__title">' + item.title + '</div>' +
      '<div class="lq-music-card__tag">' + (item.tag || '') + '</div>' +
      '<p class="lq-music-card__desc">' + (item.description || '') + '</p>' +
    '</button>';
  }).join('');
}
```

- [ ] Fetch richer playlist data only when `music_api_base` is configured.

```js
function initMusicPage() {
  var hero = document.querySelector('.lq-music-hero');
  if (!hero) return;

  var apiBase = hero.getAttribute('data-music-api-base') || '';
  var fallbackId = hero.getAttribute('data-fallback-playlist-id') || '';
  renderMusicCards(getFeaturedPlaylists());

  if (!apiBase) return;

  fetch(apiBase.replace(/\/$/, '') + '/playlists')
    .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error('playlist fetch failed')); })
    .then(function (data) { renderMusicCards(Array.isArray(data) ? data : []); })
    .catch(function () {
      hero.classList.add('is-fallback');
      hero.setAttribute('data-fallback-active', fallbackId ? 'true' : 'false');
    });
}
```

- [ ] Add a hidden fallback-state style so proxy failures do not break layout.

```css
.lq-music-hero.is-fallback::after {
  content: '代理不可用，已切换到默认歌单。';
  display: inline-flex;
  margin-top: 1rem;
  color: rgba(79, 54, 64, 0.72);
}
```

- [ ] Re-run the full local verification loop.

Run: `npm run build`

Run: `node --test tests/layout-shell.test.mjs`

Expected: tests stay green after adding client-side hydration logic.

## Task 7: Document and scaffold the external NetEase proxy example

**Files:**

- Create: `D:\blog\docs\examples\netease-music-proxy\README.md`
- Create: `D:\blog\docs\examples\netease-music-proxy\worker.js`

- [ ] Write a short README that explains the security boundary and required environment variable.

```md
# NetEase Music Proxy Example

This example keeps the third-party `NETEASE_API_KEY` out of the static Hexo frontend.

Routes:

- `GET /playlists`
- `GET /playlist/:id`
- `GET /player/playlist/:id`
```

- [ ] Add a minimal Worker example that forwards requests with the secret key.

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/playlists') {
      return Response.json([
        { id: '9724541268', title: '默认歌单', tag: '常驻', description: '没有代理时的兜底歌单。' }
      ]);
    }

    if (url.pathname.startsWith('/playlist/')) {
      const id = url.pathname.split('/').pop();
      const upstream = await fetch('https://your-upstream.example/playlist/' + id, {
        headers: { Authorization: 'Bearer ' + env.NETEASE_API_KEY }
      });
      return new Response(upstream.body, upstream);
    }

    return new Response('Not found', { status: 404 });
  }
};
```

- [ ] Do a repository-level smoke check so the docs files exist where the plan expects them.

Run: `Get-ChildItem -Recurse docs\examples\netease-music-proxy`

Expected: `README.md` and `worker.js` are both listed.

## Task 8: Final verification and handoff

**Files:**

- Verify: `D:\blog\public\index.html`
- Verify: `D:\blog\public\music\index.html`
- Verify: `D:\blog\public\style.css`

- [ ] Clean and rebuild to avoid stale generated files.

Run: `npm run clean`

Run: `npm run build`

Expected: `hexo clean` and `hexo generate` both succeed.

- [ ] Run the test file one last time.

Run: `node --test tests/layout-shell.test.mjs`

Expected: PASS for homepage shell, homepage motion hooks, tab-title hooks, music page shell, and all existing shell checks.

- [ ] Verify the generated home page contains the new data attributes.

Run: `Select-String -Path public\index.html -Pattern 'data-title-motion|data-tab-blur-title'`

Expected: matches for both attributes in `public/index.html`.

- [ ] Verify the generated music page contains the immersive shell and fallback area.

Run: `Select-String -Path public\music\index.html -Pattern 'lq-music-page|lq-music-hero|lq-music-fallback'`

Expected: matches for all three selectors in `public/music/index.html`.

## Suggested execution order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7
8. Task 8

## Self-review

**Spec coverage**

- Homepage per-character motion: covered by Tasks 1, 3, and 8
- Blur/focus tab-title copy: covered by Tasks 1, 4, and 8
- Music page immersive hero + playlist wall: covered by Tasks 1, 5, 6, and 8
- Proxy security boundary: covered by Tasks 2 and 7
- Fallback behavior when proxy is unavailable: covered by Tasks 5, 6, and 8

**Placeholder scan**

- No `TODO`, `TBD`, or “implement later” placeholders remain
- Every verification step has an explicit command and expected outcome
- Every code-edit step includes a concrete snippet

**Type consistency**

- Homepage motion attributes use `data-title-motion`, `data-title-motion-interval`, and `data-subtitle-reveal-delay` consistently
- Tab-title attributes use `data-tab-blur-title` and `data-tab-focus-title` consistently
- Music-page DOM hooks use `lq-music-page`, `lq-music-hero`, `data-music-api-base`, and `data-music-playlists` consistently
