# 科幻仪表加载页组件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `D:/blog` 的 `Hexo + argon` 主题中，把现有文案型 loader 升级为可复用的科幻仪表加载页组件，并支持全局配置、路径 override 和 front-matter 覆盖。

**Architecture:** 保留 `themes/argon/layout/_partial/lq-effects.ejs` 作为统一注入点，但把 loader 本体拆成独立配置构建器、独立 partial、独立 CSS 和独立 JS。配置合并放在 `themes/argon/scripts/` 下的辅助模块中，模板只消费最终配置，样式和脚本通过独立资源文件注入，验证使用 Node 内置测试运行器直接检查配置合并、源文件结构和构建后的 HTML。

**Tech Stack:** Hexo 7、EJS、CSS、原生前端脚本、Node `node:test`、`assert/strict`

---

## File Map

- Create: `themes/argon/scripts/lq-loader-config.js`
  - 负责默认配置、深合并、路径归一化、override 解析、front-matter 合并
- Create: `themes/argon/layout/_partial/loaders/lq-divergence-loader.ejs`
  - 负责科幻仪表 loader 的 HTML 结构
- Create: `themes/argon/source/css/lq-divergence-loader.css`
  - 负责 loader 独立样式和完成/退场动画
- Create: `themes/argon/source/js/lq-divergence-loader.js`
  - 负责随机数字、状态机、完成态、退场逻辑
- Create: `tests/lq-loader-config.test.mjs`
  - 验证配置优先级与路径覆盖
- Create: `tests/lq-loader-build.test.mjs`
  - 验证构建后的页面包含 loader 结构、配置和资源引用
- Create: `tests/lq-loader-runtime.test.mjs`
  - 验证前端脚本的状态机和文案切换
- Modify: `themes/argon/scripts/functions.js`
  - 注册 `resolve_lq_loader` helper
- Modify: `themes/argon/layout/_partial/lq-effects.ejs`
  - 从 helper 获取最终配置并挂载 loader partial
- Modify: `themes/argon/layout/header.ejs`
  - 条件注入 loader CSS
- Modify: `themes/argon/layout/footer.ejs`
  - 条件注入 loader JS
- Modify: `source/_data/argon.yml`
  - 升级 `lq_loader` 默认配置结构

### Task 1: 配置构建器与 helper 注册

**Files:**
- Create: `themes/argon/scripts/lq-loader-config.js`
- Create: `tests/lq-loader-config.test.mjs`
- Modify: `themes/argon/scripts/functions.js`
- Test: `tests/lq-loader-config.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  DEFAULT_LOADER_CONFIG,
  buildLoaderConfig,
  normalizeLoaderPath,
} = require('../themes/argon/scripts/lq-loader-config.js');

test('normalizeLoaderPath collapses slashes and index routes', () => {
  assert.equal(normalizeLoaderPath('/about'), '/about');
  assert.equal(normalizeLoaderPath('/about/'), '/about');
  assert.equal(normalizeLoaderPath('about/index.html'), '/about');
  assert.equal(normalizeLoaderPath('/'), '/');
});

test('buildLoaderConfig merges global config, path overrides, and front-matter overrides in order', () => {
  const config = buildLoaderConfig({
    theme: {
      show_lq_loader: true,
      lq_loader: {
        brand: 'Global Brand',
        title: 'Global Title',
        subtitle: 'Global Subtitle',
        palette: {
          accent: '#77e7f1',
          backdrop: '#050a12',
        },
        meter: {
          interval: 190,
        },
        overrides: {
          '/about': {
            title: 'About Override',
            subtitle: 'About Subtitle',
            palette: {
              accent: '#99f6ff',
            },
          },
        },
      },
    },
    entry: {
      path: 'about/index.html',
      lq_loader: {
        title: 'Front Matter Title',
        complete_text: 'Archive synchronized',
      },
    },
  });

  assert.equal(config.enabled, true);
  assert.equal(config.title, 'Front Matter Title');
  assert.equal(config.subtitle, 'About Subtitle');
  assert.equal(config.complete_text, 'Archive synchronized');
  assert.equal(config.palette.accent, '#99f6ff');
  assert.equal(config.palette.backdrop, '#050a12');
  assert.equal(config.meter.interval, 190);
  assert.equal(config.mode, DEFAULT_LOADER_CONFIG.mode);
});

test('buildLoaderConfig disables the component when the global switch is off', () => {
  const config = buildLoaderConfig({
    theme: {
      show_lq_loader: false,
      lq_loader: {
        title: 'Disabled loader',
      },
    },
    entry: {
      path: 'index.html',
    },
  });

  assert.equal(config.enabled, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/lq-loader-config.test.mjs`

Expected: FAIL with `Cannot find module '../themes/argon/scripts/lq-loader-config.js'`.

- [ ] **Step 3: Write minimal implementation**

Create `themes/argon/scripts/lq-loader-config.js`:

```js
const DEFAULT_LOADER_CONFIG = {
  enabled: true,
  mode: 'divergence',
  scope: 'site',
  minimum_duration: 900,
  repeat_visit_duration: 320,
  complete_hold_duration: 520,
  brand: 'CHENYE ARCHIVE',
  title: 'Synchronizing Memory',
  subtitle: '正在校准进入这片个人世界的入口',
  complete_text: 'Archive synchronized',
  palette: {
    accent: '#8be9ff',
    accent_soft: 'rgba(139, 233, 255, 0.18)',
    backdrop: '#060b12',
    line: 'rgba(139, 233, 255, 0.16)',
    text: '#eefbff',
  },
  meter: {
    major_digits: ['0', '1', '2', '3'],
    digits: 6,
    interval: 180,
    decimal_separator: '.',
  },
  overrides: {},
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneDeep(value) {
  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneDeep(item)]));
  }
  return value;
}

function mergeDeep(base, patch) {
  const next = cloneDeep(base);
  if (!isPlainObject(patch)) {
    return next;
  }
  Object.entries(patch).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(next[key])) {
      next[key] = mergeDeep(next[key], value);
      return;
    }
    next[key] = cloneDeep(value);
  });
  return next;
}

function normalizeLoaderPath(input = '') {
  const value = String(input || '').trim().replace(/\\/g, '/');
  if (!value || value === 'index.html' || value === '/index.html') {
    return '/';
  }
  const withSlash = value.startsWith('/') ? value : `/${value}`;
  const withoutIndex = withSlash.replace(/\/index\.html$/, '');
  const compacted = withoutIndex.replace(/\/+$/, '');
  return compacted || '/';
}

function pickPathOverride(overrides, inputPath) {
  if (!isPlainObject(overrides)) {
    return {};
  }
  const normalizedPath = normalizeLoaderPath(inputPath);
  return Object.entries(overrides).reduce((match, [key, value]) => {
    return normalizeLoaderPath(key) === normalizedPath ? value : match;
  }, {});
}

function buildLoaderConfig({ theme = {}, entry = {} } = {}) {
  const rootConfig = mergeDeep(DEFAULT_LOADER_CONFIG, theme.lq_loader || {});
  const pathOverride = pickPathOverride(rootConfig.overrides, entry.path);
  const frontMatterOverride = isPlainObject(entry.lq_loader) ? entry.lq_loader : {};
  const merged = mergeDeep(mergeDeep(rootConfig, pathOverride), frontMatterOverride);
  merged.enabled = theme.show_lq_loader !== false && merged.enabled !== false;
  merged.current_path = normalizeLoaderPath(entry.path || '/');
  return merged;
}

module.exports = {
  DEFAULT_LOADER_CONFIG,
  buildLoaderConfig,
  mergeDeep,
  normalizeLoaderPath,
};
```

Update `themes/argon/scripts/functions.js` near the top:

```js
const { buildLoaderConfig } = require('./lq-loader-config');
```

Register a new helper in `themes/argon/scripts/functions.js`:

```js
hexo.extend.helper.register('resolve_lq_loader', function (theme, entry) {
  return buildLoaderConfig({
    theme,
    entry,
  });
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/lq-loader-config.test.mjs
```

Expected: PASS with three passing tests covering path normalization, override precedence, and the global enable flag.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/lq-loader-config.test.mjs themes/argon/scripts/lq-loader-config.js themes/argon/scripts/functions.js
git commit -m "feat: add reusable loader config builder"
```

Expected: If `D:/blog` is git-backed, commit succeeds. If `D:/blog/.git` is still missing, record the skipped commit and continue.

### Task 2: Loader partial、装配入口与主题配置

**Files:**
- Create: `themes/argon/layout/_partial/loaders/lq-divergence-loader.ejs`
- Create: `tests/lq-loader-build.test.mjs`
- Modify: `themes/argon/layout/_partial/lq-effects.ejs`
- Modify: `source/_data/argon.yml`
- Test: `tests/lq-loader-build.test.mjs`

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

test('generated home page includes divergence loader markup and runtime config', () => {
  buildSite();

  const html = readFileSync('D:/blog/public/index.html', 'utf8');

  assert.match(html, /id="lq-divergence-loader"/);
  assert.match(html, /class="lq-divergence-loader__meter"/);
  assert.match(html, /class="lq-divergence-loader__status"/);
  assert.match(html, /id="lq-loader-config"/);
  assert.match(html, /Synchronizing Memory/);
  assert.match(html, /正在校准进入这片个人世界的入口/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/lq-loader-build.test.mjs`

Expected: FAIL because `public/index.html` still contains the current `.lq-loader` card and does not contain `#lq-divergence-loader` or `#lq-loader-config`.

- [ ] **Step 3: Write minimal implementation**

Create `themes/argon/layout/_partial/loaders/lq-divergence-loader.ejs`:

```ejs
<%
  const meterDigits = Number(loaderConfig.meter && loaderConfig.meter.digits || 6);
  const meterFrames = Array.from({ length: meterDigits });
%>
<div
  id="lq-divergence-loader"
  class="lq-divergence-loader"
  data-loader-state="idle"
  style="
    --lq-loader-accent: <%= loaderConfig.palette.accent %>;
    --lq-loader-accent-soft: <%= loaderConfig.palette.accent_soft %>;
    --lq-loader-backdrop: <%= loaderConfig.palette.backdrop %>;
    --lq-loader-line: <%= loaderConfig.palette.line %>;
    --lq-loader-text: <%= loaderConfig.palette.text %>;
  "
>
  <div class="lq-divergence-loader__backdrop"></div>
  <div class="lq-divergence-loader__grid"></div>
  <div class="lq-divergence-loader__scanline"></div>

  <div class="lq-divergence-loader__panel">
    <p class="lq-divergence-loader__brand"><%= loaderConfig.brand %></p>
    <h2 class="lq-divergence-loader__title"><%= loaderConfig.title %></h2>

    <div class="lq-divergence-loader__meter" role="img" aria-label="divergence meter">
      <span class="lq-divergence-loader__digit lq-divergence-loader__digit--major">0</span>
      <span class="lq-divergence-loader__digit lq-divergence-loader__digit--separator"><%= loaderConfig.meter.decimal_separator %></span>
      <% meterFrames.forEach(function () { %>
        <span class="lq-divergence-loader__digit">0</span>
      <% }) %>
    </div>

    <p class="lq-divergence-loader__status"><%= loaderConfig.subtitle %></p>
  </div>
</div>
```

Replace the loader section in `themes/argon/layout/_partial/lq-effects.ejs` with:

```ejs
<%
  const currentEntry = (typeof post !== 'undefined' && post) || (typeof page !== 'undefined' && page) || {};
  const loaderConfig = resolve_lq_loader(theme, currentEntry);
  const cursor = theme.lq_cursor || {};
  const snow = theme.lq_snow || {};
  const effectsConfig = {
    loader: loaderConfig,
    cursor: {
      enabled: theme.show_lq_cursor_fx !== false,
      desktopOnly: cursor.desktop_only !== false,
      defaultCursor: cursor.default_cursor || '/img/cursor-default.svg',
      pointerCursor: cursor.pointer_cursor || '/img/cursor-pointer.svg',
      trailCount: Number(cursor.trail_count || 10),
      trailSize: Number(cursor.trail_size || 12),
      trailColor: cursor.trail_color || 'rgba(255,255,255,0.72)',
    },
    snow: {
      enabled: theme.show_lq_snow !== false,
      count: Number(snow.count || 42),
      speed: Number(snow.speed || 0.85),
      maxSize: Number(snow.max_size || 3.2),
      opacity: Number(snow.opacity || 0.78),
      drift: Number(snow.drift || 0.32),
    },
  };
  const effectsConfigJson = JSON.stringify(effectsConfig).replace(/</g, '\\u003c');
%>
<% if (loaderConfig.enabled && loaderConfig.mode === 'divergence') { %>
  <%- include('loaders/lq-divergence-loader.ejs', { loaderConfig: loaderConfig }) %>
<% } %>
<% if (theme.show_lq_snow !== false) { %>
  <canvas class="lq-snow-canvas" aria-hidden="true"></canvas>
<% } %>
<% if (theme.show_lq_cursor_fx !== false) { %>
  <div class="lq-cursor-trail" aria-hidden="true"></div>
<% } %>
<script id="lq-loader-config" type="application/json"><%- JSON.stringify(loaderConfig).replace(/</g, '\\u003c') %></script>
<script id="lq-effects-config" type="application/json"><%- effectsConfigJson %></script>
```

Update `source/_data/argon.yml` so `lq_loader` becomes:

```yml
show_lq_loader: true
lq_loader:
  mode: 'divergence'
  scope: 'site'
  minimum_duration: 900
  repeat_visit_duration: 320
  complete_hold_duration: 520
  brand: 'CHENYE ARCHIVE'
  title: 'Synchronizing Memory'
  subtitle: '正在校准进入这片个人世界的入口'
  complete_text: 'Archive synchronized'
  palette:
    accent: '#8be9ff'
    accent_soft: 'rgba(139, 233, 255, 0.18)'
    backdrop: '#060b12'
    line: 'rgba(139, 233, 255, 0.16)'
    text: '#eefbff'
  meter:
    major_digits:
      - '0'
      - '1'
      - '2'
      - '3'
    digits: 6
    interval: 180
    decimal_separator: '.'
  overrides: {}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build
node --test tests/lq-loader-build.test.mjs
```

Expected: PASS and `public/index.html` contains the new loader root, meter digits, status line, and serialized runtime config.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/lq-loader-build.test.mjs themes/argon/layout/_partial/loaders/lq-divergence-loader.ejs themes/argon/layout/_partial/lq-effects.ejs source/_data/argon.yml
git commit -m "feat: mount divergence loader component"
```

Expected: If `D:/blog` is git-backed, commit succeeds. Otherwise record the skipped commit and continue.

### Task 3: 独立样式与 CSS 资源注入

**Files:**
- Create: `themes/argon/source/css/lq-divergence-loader.css`
- Modify: `themes/argon/layout/header.ejs`
- Test: `tests/lq-loader-build.test.mjs`

- [ ] **Step 1: Extend the failing test to check CSS asset wiring**

Append this test to `tests/lq-loader-build.test.mjs`:

```js
test('generated home page links the divergence loader stylesheet', () => {
  const html = readFileSync('D:/blog/public/index.html', 'utf8');
  assert.match(html, /href="\/css\/lq-divergence-loader\.css"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/lq-loader-build.test.mjs`

Expected: FAIL because the generated HTML does not yet link `/css/lq-divergence-loader.css`.

- [ ] **Step 3: Write minimal implementation**

Create `themes/argon/source/css/lq-divergence-loader.css`:

```css
html.lq-loader-active,
html.lq-loader-active body {
  overflow: hidden;
}

.lq-divergence-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lq-loader-backdrop);
  color: var(--lq-loader-text);
  opacity: 1;
  visibility: visible;
  transition: opacity 0.42s ease, visibility 0.42s ease;
}

.lq-divergence-loader.is-hidden {
  opacity: 0;
  visibility: hidden;
}

.lq-divergence-loader__backdrop,
.lq-divergence-loader__grid,
.lq-divergence-loader__scanline {
  position: absolute;
  inset: 0;
}

.lq-divergence-loader__backdrop {
  background:
    radial-gradient(circle at 50% 42%, rgba(139, 233, 255, 0.14), transparent 26%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05), transparent 42%),
    linear-gradient(180deg, #081019 0%, #04070d 100%);
}

.lq-divergence-loader__grid {
  background:
    linear-gradient(var(--lq-loader-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--lq-loader-line) 1px, transparent 1px);
  background-size: 42px 42px;
  opacity: 0.26;
}

.lq-divergence-loader__scanline {
  background: linear-gradient(180deg, transparent 0%, rgba(139, 233, 255, 0.08) 50%, transparent 100%);
  mix-blend-mode: screen;
  animation: lqLoaderScanline 2.8s linear infinite;
}

.lq-divergence-loader__panel {
  position: relative;
  z-index: 1;
  width: min(920px, calc(100vw - 32px));
  padding: 32px 28px 26px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(3, 8, 14, 0.78);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
}

.lq-divergence-loader__brand {
  margin: 0 0 10px;
  letter-spacing: 0.32em;
  font-size: 12px;
  color: rgba(238, 251, 255, 0.72);
}

.lq-divergence-loader__title {
  margin: 0 0 18px;
  font-size: clamp(22px, 4vw, 42px);
  font-weight: 600;
  letter-spacing: 0.06em;
}

.lq-divergence-loader__meter {
  display: grid;
  grid-template-columns: 1.35fr 0.5fr repeat(6, 1fr);
  min-height: clamp(112px, 20vw, 180px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.56);
}

.lq-divergence-loader__digit {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  font-family: Consolas, Menlo, Monaco, monospace;
  font-size: clamp(44px, 9vw, 128px);
  color: rgba(238, 251, 255, 0.94);
  text-shadow: 0 0 12px rgba(139, 233, 255, 0.34), 0 0 26px rgba(139, 233, 255, 0.18);
}

.lq-divergence-loader__digit--major {
  font-size: clamp(52px, 10vw, 138px);
}

.lq-divergence-loader__digit--separator {
  font-size: clamp(36px, 6vw, 88px);
}

.lq-divergence-loader__digit:last-child {
  border-right: 0;
}

.lq-divergence-loader__status {
  margin: 18px 0 0;
  font-size: 14px;
  letter-spacing: 0.18em;
  color: rgba(238, 251, 255, 0.76);
}

.lq-divergence-loader[data-loader-state='complete'] .lq-divergence-loader__status {
  color: var(--lq-loader-accent);
}

@keyframes lqLoaderScanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@media (max-width: 768px) {
  .lq-divergence-loader__panel {
    padding: 24px 18px 20px;
  }

  .lq-divergence-loader__meter {
    min-height: 96px;
  }

  .lq-divergence-loader__status {
    letter-spacing: 0.12em;
  }
}
```

Insert this block after `<%- css('/style.css') %>` in `themes/argon/layout/header.ejs`:

```ejs
<% if (theme.show_lq_loader !== false && (((theme.lq_loader || {}).mode) || 'divergence') === 'divergence') { %>
  <%- css('/css/lq-divergence-loader.css') %>
<% } %>
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build
node --test tests/lq-loader-build.test.mjs
```

Expected: PASS and the generated home page now links `/css/lq-divergence-loader.css`.

- [ ] **Step 5: Commit**

Run:

```bash
git add themes/argon/source/css/lq-divergence-loader.css themes/argon/layout/header.ejs tests/lq-loader-build.test.mjs
git commit -m "feat: add divergence loader styles"
```

Expected: If `D:/blog` is git-backed, commit succeeds. Otherwise record the skipped commit and continue.

### Task 4: 前端状态机、脚本注入与运行时验证

**Files:**
- Create: `themes/argon/source/js/lq-divergence-loader.js`
- Create: `tests/lq-loader-runtime.test.mjs`
- Modify: `themes/argon/layout/footer.ejs`
- Test: `tests/lq-loader-runtime.test.mjs`
- Test: `tests/lq-loader-build.test.mjs`

- [ ] **Step 1: Write the failing runtime test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function createClassList() {
  const values = new Set();
  return {
    add(value) {
      values.add(value);
    },
    remove(value) {
      values.delete(value);
    },
    has(value) {
      return values.has(value);
    },
  };
}

test('loader runtime transitions through running, complete, and hidden states', () => {
  const source = readFileSync('D:/blog/themes/argon/source/js/lq-divergence-loader.js', 'utf8');

  const digits = Array.from({ length: 8 }, () => ({ textContent: '0' }));
  const status = { textContent: '' };
  let removed = false;

  const loader = {
    dataset: { loaderState: 'idle' },
    classList: createClassList(),
    querySelectorAll(selector) {
      return selector === '.lq-divergence-loader__digit' ? digits : [];
    },
    querySelector(selector) {
      return selector === '.lq-divergence-loader__status' ? status : null;
    },
    remove() {
      removed = true;
    },
  };

  const documentElement = {
    classList: createClassList(),
  };

  const configNode = {
    textContent: JSON.stringify({
      enabled: true,
      subtitle: '正在校准进入这片个人世界的入口',
      complete_text: 'Archive synchronized',
      minimum_duration: 0,
      complete_hold_duration: 0,
      meter: {
        major_digits: ['0', '1', '2', '3'],
        interval: 10,
      },
    }),
  };

  const listeners = {};

  const context = {
    Math,
    JSON,
    console,
    document: {
      readyState: 'loading',
      documentElement,
      getElementById(id) {
        if (id === 'lq-divergence-loader') return loader;
        if (id === 'lq-loader-config') return configNode;
        return null;
      },
    },
    window: {
      setInterval(fn) {
        fn();
        return 1;
      },
      clearInterval() {},
      setTimeout(fn) {
        fn();
        return 1;
      },
      addEventListener(name, fn) {
        listeners[name] = fn;
      },
    },
  };

  vm.createContext(context);
  vm.runInContext(source, context);

  assert.equal(loader.dataset.loaderState, 'running');
  assert.equal(status.textContent, '正在校准进入这片个人世界的入口');

  listeners.load();

  assert.equal(loader.dataset.loaderState, 'hidden');
  assert.equal(status.textContent, 'Archive synchronized');
  assert.equal(documentElement.classList.has('lq-loader-active'), false);
  assert.equal(removed, true);
});
```

Append this asset assertion to `tests/lq-loader-build.test.mjs`:

```js
test('generated home page links the divergence loader script', () => {
  const html = readFileSync('D:/blog/public/index.html', 'utf8');
  assert.match(html, /src="\/js\/lq-divergence-loader\.js\?v=/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/lq-loader-runtime.test.mjs
node --test tests/lq-loader-build.test.mjs
```

Expected: FAIL because the runtime script file does not exist yet and the built HTML does not reference `/js/lq-divergence-loader.js`.

- [ ] **Step 3: Write minimal implementation**

Create `themes/argon/source/js/lq-divergence-loader.js`:

```js
(function () {
  const loader = document.getElementById('lq-divergence-loader');
  const configNode = document.getElementById('lq-loader-config');
  const html = document.documentElement;

  if (!loader || !configNode || !html) {
    return;
  }

  const config = JSON.parse(configNode.textContent || '{}');
  if (config.enabled === false) {
    loader.remove();
    return;
  }

  const status = loader.querySelector('.lq-divergence-loader__status');
  const digits = Array.from(loader.querySelectorAll('.lq-divergence-loader__digit')).filter((node) => {
    return !node.classList || !node.classList.contains || !node.classList.contains('lq-divergence-loader__digit--separator');
  });
  const pool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const majorPool = (config.meter && config.meter.major_digits) || ['0', '1', '2', '3'];
  const interval = Number((config.meter && config.meter.interval) || 180);
  const minimumDuration = Number(config.minimum_duration || 0);
  const completeHoldDuration = Number(config.complete_hold_duration || 420);
  const repeatVisitDuration = Number(config.repeat_visit_duration || minimumDuration);
  const hasVisited = window.sessionStorage && window.sessionStorage.getItem('lq-loader-visited') === '1';
  const gateDuration = hasVisited ? repeatVisitDuration : minimumDuration;
  const startedAt = Date.now();
  let finishedLoading = false;
  let ticker = null;

  function randomOf(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function tick() {
    digits.forEach((digit, index) => {
      digit.textContent = index === 0 ? randomOf(majorPool) : randomOf(pool);
    });
  }

  function setState(nextState) {
    loader.dataset.loaderState = nextState;
  }

  function hideLoader() {
    if (ticker !== null) {
      window.clearInterval(ticker);
    }
    setState('hidden');
    loader.classList.add('is-hidden');
    html.classList.remove('lq-loader-active');
    window.setTimeout(() => {
      loader.remove();
    }, 420);
  }

  function completeLoader() {
    if (loader.dataset.loaderState === 'complete' || loader.dataset.loaderState === 'hidden') {
      return;
    }
    if (ticker !== null) {
      window.clearInterval(ticker);
    }
    setState('complete');
    if (status) {
      status.textContent = config.complete_text || 'Archive synchronized';
    }
    if (window.sessionStorage) {
      window.sessionStorage.setItem('lq-loader-visited', '1');
    }
    window.setTimeout(hideLoader, completeHoldDuration);
  }

  function tryFinish() {
    if (!finishedLoading) {
      return;
    }
    const wait = Math.max(gateDuration - (Date.now() - startedAt), 0);
    window.setTimeout(completeLoader, wait);
  }

  html.classList.add('lq-loader-active');
  setState('running');
  if (status) {
    status.textContent = config.subtitle || '正在校准进入这片个人世界的入口';
  }
  tick();
  ticker = window.setInterval(tick, interval);

  if (document.readyState === 'complete') {
    finishedLoading = true;
    tryFinish();
  } else {
    window.addEventListener('load', function () {
      finishedLoading = true;
      tryFinish();
    }, { once: true });
  }
})();
```

Insert this block before `<%- js('/argontheme.js?v=' + lqAssetVersion) %>` in `themes/argon/layout/footer.ejs`:

```ejs
<% if (theme.show_lq_loader !== false && (((theme.lq_loader || {}).mode) || 'divergence') === 'divergence') { %>
  <%- js('/js/lq-divergence-loader.js?v=' + lqAssetVersion) %>
<% } %>
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npm run build
node --test tests/lq-loader-runtime.test.mjs
node --test tests/lq-loader-build.test.mjs
```

Expected:

- `tests/lq-loader-runtime.test.mjs` PASS, confirming the script enters `running`, switches to `complete`, then ends in `hidden`
- `tests/lq-loader-build.test.mjs` PASS, confirming the generated HTML references `/js/lq-divergence-loader.js?v=...`

- [ ] **Step 5: Commit**

Run:

```bash
git add themes/argon/source/js/lq-divergence-loader.js themes/argon/layout/footer.ejs tests/lq-loader-runtime.test.mjs tests/lq-loader-build.test.mjs
git commit -m "feat: add divergence loader runtime"
```

Expected: If `D:/blog` is git-backed, commit succeeds. Otherwise record the skipped commit and continue.
