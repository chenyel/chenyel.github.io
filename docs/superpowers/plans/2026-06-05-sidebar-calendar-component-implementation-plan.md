# Sidebar Calendar Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable lunar calendar component for the `argon` theme, mount it in the sidebar first, and support month navigation, today highlighting, date selection, and daily detail display.

**Architecture:** Keep the component split into template, stylesheet, and runtime script so the sidebar is only a consumer. Use a local browser copy of `lunar-javascript` for in-browser date calculations, then initialize the component through the existing `argontheme.js` enhancement boot flow so it works on first load and after PJAX re-entry.

**Tech Stack:** Hexo 7, EJS partials, plain browser JavaScript, existing `style.css`, Node built-in test runner, `lunar-javascript`

---

## File Structure

- `D:/blog/source/_data/argon.yml`
  - Theme-level switch and labels for the calendar card
- `D:/blog/themes/argon/layout/_partial/calendar.ejs`
  - Reusable calendar component markup and data attributes
- `D:/blog/themes/argon/layout/sidebar.ejs`
  - Sidebar card wrapper that mounts the reusable calendar partial
- `D:/blog/themes/argon/layout/footer.ejs`
  - Script includes for the lunar vendor asset and calendar runtime
- `D:/blog/themes/argon/source/assets/vendor/lunar/lunar.js`
  - Browser build copied from `lunar-javascript`
- `D:/blog/themes/argon/source/lq-calendar.js`
  - Calendar rendering, month navigation, detail formatting, mount function
- `D:/blog/themes/argon/source/argontheme.js`
  - Calls `initLqCalendar()` from the existing enhancement pipeline
- `D:/blog/themes/argon/source/style.css`
  - Component styles and responsive rules
- `D:/blog/tests/sidebar-calendar-shell.test.mjs`
  - Build-output assertions for sidebar markup, config hooks, and script includes
- `D:/blog/tests/sidebar-calendar-style.test.mjs`
  - Source assertions for required selectors and responsive rules
- `D:/blog/tests/sidebar-calendar-runtime.test.mjs`
  - Source assertions for runtime hooks and local vendor asset presence

## Task 1: Add the Sidebar Card Shell and Theme Config

**Files:**
- Create: `D:/blog/tests/sidebar-calendar-shell.test.mjs`
- Create: `D:/blog/themes/argon/layout/_partial/calendar.ejs`
- Modify: `D:/blog/source/_data/argon.yml`
- Modify: `D:/blog/themes/argon/layout/sidebar.ejs`
- Modify: `D:/blog/themes/argon/layout/footer.ejs`
- Create: `D:/blog/themes/argon/source/lq-calendar.js`
- Create: `D:/blog/themes/argon/source/assets/vendor/lunar/lunar.js`

- [ ] **Step 1: Write the failing build-output test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { withSiteBuildLock } from './helpers/site-build-lock.mjs'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const runSiteCommand = scriptName => {
  execSync(`${npmCommand} run ${scriptName}`, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: 'pipe',
  })
}

const readPublicHtml = relativePath => {
  return readFileSync(path.join(publicDir, ...relativePath.split('/')), 'utf8')
}

test('sidebar calendar shell renders in standard pages with reusable hooks', () => {
  withSiteBuildLock(() => {
    runSiteCommand('clean')
    runSiteCommand('build')
  })

  const homeHtml = readPublicHtml('index.html')
  const aboutHtml = readPublicHtml('about/index.html')

  for (const html of [homeHtml, aboutHtml]) {
    assert.match(html, /lq-calendar-card/)
    assert.match(html, /data-lq-calendar\b/)
    assert.match(html, /data-calendar-title=/)
    assert.match(html, /data-calendar-show-detail=/)
    assert.match(html, /data-calendar-show-navigator=/)
    assert.match(html, /data-calendar-mobile-full=/)
    assert.match(html, /lq-calendar__month-label/)
    assert.match(html, /lq-calendar__weekdays/)
    assert.match(html, /lq-calendar__grid/)
    assert.match(html, /lq-calendar__detail/)
    assert.match(html, /\/assets\/vendor\/lunar\/lunar\.js\?v=/)
    assert.match(html, /\/lq-calendar\.js\?v=/)
  }
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/sidebar-calendar-shell.test.mjs`

Expected: FAIL because the generated pages do not yet include calendar markup or calendar script tags.

- [ ] **Step 3: Add theme-level config defaults**

Add this block near the other `lq_*` theme options in `D:/blog/source/_data/argon.yml`:

```yml
lq_calendar:
  enabled: true
  title: '今日黄历'
  show_detail: true
  show_navigator: true
  mobile_full: true
```

- [ ] **Step 4: Create the reusable partial shell**

Create `D:/blog/themes/argon/layout/_partial/calendar.ejs` with this markup:

```ejs
<%
  const calendarConfig = theme.lq_calendar || {};
  const calendarTitle = calendarConfig.title || '今日黄历';
  const showDetail = calendarConfig.show_detail !== false;
  const showNavigator = calendarConfig.show_navigator !== false;
  const mobileFull = calendarConfig.mobile_full !== false;
%>
<section
  class="lq-calendar-card"
  data-lq-calendar
  data-calendar-title="<%= calendarTitle %>"
  data-calendar-show-detail="<%= showDetail ? 'true' : 'false' %>"
  data-calendar-show-navigator="<%= showNavigator ? 'true' : 'false' %>"
  data-calendar-mobile-full="<%= mobileFull ? 'true' : 'false' %>"
>
  <div class="lq-calendar__header">
    <div class="lq-calendar__heading">
      <div class="lq-calendar__eyebrow">Calendar</div>
      <h3 class="lq-calendar__title"><%= calendarTitle %></h3>
    </div>
    <div class="lq-calendar__nav" <% if (!showNavigator) { %>hidden<% } %>>
      <button class="lq-calendar__nav-btn" type="button" data-calendar-nav="prev" aria-label="上个月">‹</button>
      <span class="lq-calendar__month-label" data-calendar-month-label>--</span>
      <button class="lq-calendar__nav-btn" type="button" data-calendar-nav="next" aria-label="下个月">›</button>
    </div>
  </div>
  <div class="lq-calendar__weekdays" aria-hidden="true">
    <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
  </div>
  <div class="lq-calendar__grid" data-calendar-grid></div>
  <div class="lq-calendar__detail" data-calendar-detail <% if (!showDetail) { %>hidden<% } %>>
    <div class="lq-calendar__detail-date" data-calendar-detail-date>--</div>
    <div class="lq-calendar__detail-row"><span>农历</span><span data-calendar-detail-lunar>--</span></div>
    <div class="lq-calendar__detail-row"><span>星期</span><span data-calendar-detail-weekday>--</span></div>
    <div class="lq-calendar__detail-row" data-calendar-row="term" hidden><span>节气</span><span data-calendar-detail-term></span></div>
    <div class="lq-calendar__detail-row" data-calendar-row="festival" hidden><span>节日</span><span data-calendar-detail-festival></span></div>
    <div class="lq-calendar__detail-row"><span>宜</span><span data-calendar-detail-yi>--</span></div>
    <div class="lq-calendar__detail-row"><span>忌</span><span data-calendar-detail-ji>--</span></div>
  </div>
</section>
```

- [ ] **Step 5: Mount the partial inside the sidebar**

Insert this card block in `D:/blog/themes/argon/layout/sidebar.ejs` after the existing overview card:

```ejs
<% if ((theme.lq_calendar || {}).enabled !== false) { %>
  <div id="leftbar_part_calendar" class="widget card bg-white shadow-sm border-0">
    <div class="card-body">
      <%- partial('_partial/calendar') %>
    </div>
  </div>
<% } %>
```

- [ ] **Step 6: Add script tags for the local lunar vendor file and calendar runtime**

Insert these lines in `D:/blog/themes/argon/layout/footer.ejs` before `argontheme.js`:

```ejs
<%- js('/assets/vendor/lunar/lunar.js?v=' + lqAssetVersion) %>
<%- js('/lq-calendar.js?v=' + lqAssetVersion) %>
```

The footer block should become:

```ejs
<%- js('/assets/vendor/lunar/lunar.js?v=' + lqAssetVersion) %>
<%- js('/lq-calendar.js?v=' + lqAssetVersion) %>
<%- js('/lq-music-core.js?v=' + lqAssetVersion) %>
<%- js('/argontheme.js?v=' + lqAssetVersion) %>
<%- js('/lq-effects.js?v=' + lqAssetVersion) %>
```

- [ ] **Step 7: Add temporary runtime stubs so the build can complete**

Create `D:/blog/themes/argon/source/lq-calendar.js` with:

```js
(function () {
  window.initLqCalendar = window.initLqCalendar || function () {};
})();
```

Create `D:/blog/themes/argon/source/assets/vendor/lunar/lunar.js` with:

```js
window.Solar = window.Solar || {};
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `node --test tests/sidebar-calendar-shell.test.mjs`

Expected: PASS

- [ ] **Step 9: Checkpoint the shell work**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add source/_data/argon.yml themes/argon/layout/_partial/calendar.ejs themes/argon/layout/sidebar.ejs themes/argon/layout/footer.ejs themes/argon/source/lq-calendar.js themes/argon/source/assets/vendor/lunar/lunar.js tests/sidebar-calendar-shell.test.mjs
git commit -m "feat: add sidebar calendar shell"
```

## Task 2: Add Calendar Styles and Mobile Layout

**Files:**
- Create: `D:/blog/tests/sidebar-calendar-style.test.mjs`
- Modify: `D:/blog/themes/argon/source/style.css`

- [ ] **Step 1: Write the failing stylesheet test**

Create `D:/blog/tests/sidebar-calendar-style.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const stylePath = new URL('../themes/argon/source/style.css', import.meta.url)

test('calendar stylesheet contains card, grid, state, and mobile selectors', async () => {
  const css = await readFile(stylePath, 'utf8')

  const requiredSnippets = [
    '.lq-calendar-card {',
    '.lq-calendar__header {',
    '.lq-calendar__weekdays {',
    '.lq-calendar__grid {',
    '.lq-calendar__cell {',
    '.lq-calendar__cell.is-today',
    '.lq-calendar__cell.is-selected',
    '.lq-calendar__detail {',
    '.lq-calendar__meta',
    '.lq-calendar__detail-row[hidden]',
    '@media (max-width: 575px)',
  ]

  for (const snippet of requiredSnippets) {
    assert.ok(css.includes(snippet), `Expected style.css to include: ${snippet}`)
  }
})
```

- [ ] **Step 2: Run the stylesheet test to verify it fails**

Run: `node --test tests/sidebar-calendar-style.test.mjs`

Expected: FAIL because `style.css` does not yet contain the required selectors.

- [ ] **Step 3: Add the calendar card styles**

Append this block to `D:/blog/themes/argon/source/style.css`:

```css
.lq-calendar-card {
  display: grid;
  gap: 14px;
}

.lq-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.lq-calendar__eyebrow {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(var(--themecolor-rgbstr), 0.72);
}

.lq-calendar__title {
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.lq-calendar__nav {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.lq-calendar__nav-btn {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: rgba(var(--themecolor-rgbstr), 0.12);
  color: var(--themecolor-dark2);
}

.lq-calendar__month-label {
  min-width: 84px;
  text-align: center;
  font-weight: 600;
}

.lq-calendar__weekdays,
.lq-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.lq-calendar__weekdays {
  gap: 6px;
  color: rgba(60, 72, 88, 0.62);
  font-size: 12px;
  text-align: center;
}

.lq-calendar__grid {
  gap: 6px;
}

.lq-calendar__cell {
  min-height: 56px;
  padding: 8px 6px;
  border: 0;
  border-radius: 14px;
  background: rgba(245, 247, 252, 0.95);
  text-align: left;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.lq-calendar__cell:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(38, 52, 77, 0.08);
}

.lq-calendar__cell.is-today {
  box-shadow: inset 0 0 0 1px rgba(var(--themecolor-rgbstr), 0.5);
}

.lq-calendar__cell.is-selected {
  background: linear-gradient(180deg, rgba(var(--themecolor-rgbstr), 0.18), rgba(var(--themecolor-rgbstr), 0.1));
  box-shadow: 0 14px 28px rgba(var(--themecolor-rgbstr), 0.18);
}

.lq-calendar__solar {
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.lq-calendar__meta {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.25;
  color: rgba(60, 72, 88, 0.72);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lq-calendar__detail {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(var(--themecolor-rgbstr), 0.09), rgba(255, 255, 255, 0.98));
}

.lq-calendar__detail-date {
  font-size: 15px;
  font-weight: 700;
}

.lq-calendar__detail-row {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  align-items: start;
  font-size: 13px;
}

.lq-calendar__detail-row[hidden] {
  display: none;
}

@media (max-width: 575px) {
  .lq-calendar__cell {
    min-height: 50px;
    padding: 7px 5px;
    border-radius: 12px;
  }

  .lq-calendar__solar {
    font-size: 15px;
  }

  .lq-calendar__meta {
    font-size: 10px;
  }
}
```

- [ ] **Step 4: Run the stylesheet test to verify it passes**

Run: `node --test tests/sidebar-calendar-style.test.mjs`

Expected: PASS

- [ ] **Step 5: Checkpoint the style work**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add themes/argon/source/style.css tests/sidebar-calendar-style.test.mjs
git commit -m "feat: style sidebar calendar card"
```

## Task 3: Add the Runtime Logic and Local Lunar Vendor Asset

**Files:**
- Create: `D:/blog/tests/sidebar-calendar-runtime.test.mjs`
- Modify: `D:/blog/package.json`
- Modify: `D:/blog/themes/argon/source/assets/vendor/lunar/lunar.js`
- Modify: `D:/blog/themes/argon/source/lq-calendar.js`
- Modify: `D:/blog/themes/argon/source/argontheme.js`

- [ ] **Step 1: Write the failing runtime source test**

Create `D:/blog/tests/sidebar-calendar-runtime.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const runtimePath = new URL('../themes/argon/source/lq-calendar.js', import.meta.url)
const vendorPath = new URL('../themes/argon/source/assets/vendor/lunar/lunar.js', import.meta.url)
const hostPath = new URL('../themes/argon/source/argontheme.js', import.meta.url)

test('calendar runtime exposes mount helpers and uses lunar data hooks', async () => {
  const js = await readFile(runtimePath, 'utf8')

  const requiredSnippets = [
    'function formatCalendarDetail',
    'function buildCalendarCellLabel',
    'function setDetailRow',
    'function renderCalendarMonth',
    'function mountCalendar',
    'window.initLqCalendar = initLqCalendar',
    'Solar.fromYmd(',
    'data-calendar-grid',
    'data-calendar-nav',
  ]

  for (const snippet of requiredSnippets) {
    assert.ok(js.includes(snippet), `Expected lq-calendar.js to include: ${snippet}`)
  }
})

test('local lunar vendor asset is present', async () => {
  const vendor = await readFile(vendorPath, 'utf8')
  assert.match(vendor, /Solar/)
})

test('theme enhancement boot initializes the calendar runtime', async () => {
  const host = await readFile(hostPath, 'utf8')
  assert.match(host, /initLqCalendar\(\)/)
})
```

- [ ] **Step 2: Run the runtime source test to verify it fails**

Run: `node --test tests/sidebar-calendar-runtime.test.mjs`

Expected: FAIL because the real runtime functions and vendor file are not in place yet.

- [ ] **Step 3: Add the npm dependency**

Run: `npm install lunar-javascript --save`

Expected: `package.json` gains `"lunar-javascript": "<version>"` under `dependencies`.

The `dependencies` section should include:

```json
{
  "dependencies": {
    "lunar-javascript": "^1.7.4"
  }
}
```

Use the latest resolved version from the install at execution time instead of hard-coding a stale number if npm resolves a newer stable release.

- [ ] **Step 4: Copy the browser build into the theme vendor directory**

Run: `Copy-Item -LiteralPath 'D:\blog\node_modules\lunar-javascript\lunar.js' -Destination 'D:\blog\themes\argon\source\assets\vendor\lunar\lunar.js' -Force`

Expected: `themes/argon/source/assets/vendor/lunar/lunar.js` exists and contains the browser `Solar` global used by the runtime.

- [ ] **Step 5: Replace the stub runtime with the real calendar script**

Replace `D:/blog/themes/argon/source/lq-calendar.js` with:

```js
(function () {
  const WEEKDAY_LABELS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  function padValue(value) {
    return String(value).padStart(2, '0');
  }

  function formatIsoDate(date) {
    return `${date.getFullYear()}-${padValue(date.getMonth() + 1)}-${padValue(date.getDate())}`;
  }

  function getSolarForDate(date) {
    return window.Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function joinDisplay(parts) {
    return parts.filter(Boolean).join(' · ');
  }

  function buildCalendarCellLabel(lunar) {
    const festivals = []
      .concat(lunar.getFestivals ? lunar.getFestivals() : [])
      .concat(lunar.getOtherFestivals ? lunar.getOtherFestivals() : []);
    const term = lunar.getJieQi ? lunar.getJieQi() : '';

    if (festivals.length > 0) {
      return festivals[0];
    }
    if (term) {
      return term;
    }
    return lunar.getDayInChinese();
  }

  function formatCalendarDetail(date) {
    const solar = getSolarForDate(date);
    const lunar = solar.getLunar();
    const festivals = []
      .concat(lunar.getFestivals ? lunar.getFestivals() : [])
      .concat(lunar.getOtherFestivals ? lunar.getOtherFestivals() : []);
    const yi = lunar.getDayYi ? lunar.getDayYi() : [];
    const ji = lunar.getDayJi ? lunar.getDayJi() : [];

    return {
      iso: formatIsoDate(date),
      fullDate: `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`,
      lunarText: joinDisplay([lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(), lunar.getYearShengXiao ? lunar.getYearShengXiao() : '']),
      weekday: WEEKDAY_LABELS[(date.getDay() + 6) % 7],
      term: lunar.getJieQi ? lunar.getJieQi() : '',
      festival: festivals.join(' / '),
      yi: yi.length ? yi.join(' ') : '无',
      ji: ji.length ? ji.join(' ') : '无',
      cellLabel: buildCalendarCellLabel(lunar),
    };
  }

  function setDetailRow(root, key, value) {
    const row = root.querySelector(`[data-calendar-row="${key}"]`);
    const field = root.querySelector(`[data-calendar-detail-${key}]`);
    if (!row || !field) {
      return;
    }
    if (!value) {
      row.hidden = true;
      field.textContent = '';
      return;
    }
    row.hidden = false;
    field.textContent = value;
  }

  function renderCalendarMonth(root, state) {
    const grid = root.querySelector('[data-calendar-grid]');
    const label = root.querySelector('[data-calendar-month-label]');
    if (!grid || !label) {
      return;
    }

    grid.innerHTML = '';
    label.textContent = `${state.viewYear} 年 ${state.viewMonth + 1} 月`;

    const daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
    const todayIso = formatIsoDate(new Date());

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(state.viewYear, state.viewMonth, day);
      const detail = formatCalendarDetail(currentDate);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lq-calendar__cell';
      button.dataset.calendarDate = detail.iso;
      button.innerHTML = `
        <span class="lq-calendar__solar">${day}</span>
        <span class="lq-calendar__meta">${detail.cellLabel}</span>
      `;

      if (detail.iso === todayIso) {
        button.classList.add('is-today');
      }
      if (detail.iso === state.selectedIso) {
        button.classList.add('is-selected');
      }

      button.addEventListener('click', () => {
        state.selectedIso = detail.iso;
        updateCalendarDetail(root, state, currentDate);
        renderCalendarMonth(root, state);
      });

      grid.appendChild(button);
    }
  }

  function updateCalendarDetail(root, state, date) {
    const detail = formatCalendarDetail(date);
    state.selectedIso = detail.iso;

    root.querySelector('[data-calendar-detail-date]')?.replaceChildren(document.createTextNode(detail.fullDate));
    root.querySelector('[data-calendar-detail-lunar]')?.replaceChildren(document.createTextNode(detail.lunarText));
    root.querySelector('[data-calendar-detail-weekday]')?.replaceChildren(document.createTextNode(detail.weekday));
    setDetailRow(root, 'term', detail.term);
    setDetailRow(root, 'festival', detail.festival);
    root.querySelector('[data-calendar-detail-yi]')?.replaceChildren(document.createTextNode(detail.yi));
    root.querySelector('[data-calendar-detail-ji]')?.replaceChildren(document.createTextNode(detail.ji));
  }

  function shiftCalendarMonth(state, offset) {
    const next = new Date(state.viewYear, state.viewMonth + offset, 1);
    const today = new Date();
    const isCurrentMonth = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    const selectedDate = isCurrentMonth ? today : next;
    state.viewYear = next.getFullYear();
    state.viewMonth = next.getMonth();
    state.selectedIso = formatIsoDate(selectedDate);
    return selectedDate;
  }

  function mountCalendar(root) {
    if (!root || root.dataset.calendarBound === 'true') {
      return;
    }
    if (!window.Solar || typeof window.Solar.fromYmd !== 'function') {
      return;
    }

    root.dataset.calendarBound = 'true';

    const today = new Date();
    const state = {
      viewYear: today.getFullYear(),
      viewMonth: today.getMonth(),
      selectedIso: formatIsoDate(today),
    };

    root.querySelectorAll('[data-calendar-nav]').forEach(button => {
      button.addEventListener('click', () => {
        const offset = button.dataset.calendarNav === 'prev' ? -1 : 1;
        const nextDate = shiftCalendarMonth(state, offset);
        updateCalendarDetail(root, state, nextDate);
        renderCalendarMonth(root, state);
      });
    });

    updateCalendarDetail(root, state, today);
    renderCalendarMonth(root, state);
  }

  function initLqCalendar() {
    document.querySelectorAll('[data-lq-calendar]').forEach(mountCalendar);
  }

  window.initLqCalendar = initLqCalendar;
})();
```

- [ ] **Step 6: Register the calendar initializer in the theme boot flow**

Add this line inside `initLqEnhancements()` in `D:/blog/themes/argon/source/argontheme.js`:

```js
initLqCalendar();
```

The block should read:

```js
function initLqEnhancements() {
  initLqPageState();
  initHeroTitleMotion();
  initLqTabTitleState();
  initLqHeroScroll();
  initLqPlaylistPlayer();
  initLqMusicPage();
  initLqMusicConsoleTabs();
  initLqCalendar();
  initLqLive2dDock();
  initLqTagTree();
}
```

- [ ] **Step 7: Run the runtime source test to verify it passes**

Run: `node --test tests/sidebar-calendar-runtime.test.mjs`

Expected: PASS

- [ ] **Step 8: Checkpoint the runtime work**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add package.json package-lock.json themes/argon/source/assets/vendor/lunar/lunar.js themes/argon/source/lq-calendar.js themes/argon/source/argontheme.js tests/sidebar-calendar-runtime.test.mjs
git commit -m "feat: add lunar-powered sidebar calendar runtime"
```

## Task 4: Run Full Verification and Polish Any Build Breaks

**Files:**
- Test: `D:/blog/tests/sidebar-calendar-shell.test.mjs`
- Test: `D:/blog/tests/sidebar-calendar-style.test.mjs`
- Test: `D:/blog/tests/sidebar-calendar-runtime.test.mjs`
- Test: `D:/blog/tests/layout-shell.test.mjs`

- [ ] **Step 1: Run the focused calendar test suite**

Run: `node --test tests/sidebar-calendar-shell.test.mjs tests/sidebar-calendar-style.test.mjs tests/sidebar-calendar-runtime.test.mjs`

Expected: PASS for all three new calendar tests.

- [ ] **Step 2: Run the existing shell regression test**

Run: `node --test tests/layout-shell.test.mjs`

Expected: PASS, confirming the shared shell still renders home, posts, pages, player, and other theme hooks.

- [ ] **Step 3: Run a clean site build**

Run: `npm run clean`

Expected: Hexo cleans the `public` directory without error.

Run: `npm run build`

Expected: Hexo regenerates the site successfully and writes updated output to `D:/blog/public`.

- [ ] **Step 4: Manually inspect the generated calendar markup**

Open and inspect:

- `D:/blog/public/index.html`
- `D:/blog/public/about/index.html`

Confirm these strings are present:

```text
data-lq-calendar
lq-calendar__grid
/assets/vendor/lunar/lunar.js
/lq-calendar.js
```

- [ ] **Step 5: Manual browser verification**

After starting the dev server, verify:

1. Sidebar card appears on desktop home and about pages.
2. Current month renders with today highlighted.
3. Clicking another date updates the detail panel.
4. Prev/next buttons switch month and select the first day of the new month.
5. Returning to the current month restores today as the active day.
6. Empty 节气 or 节日 rows stay hidden instead of showing blank lines.
7. Mobile width still shows the full grid and readable detail rows.

Suggested command: `npm run server`

- [ ] **Step 6: Final checkpoint**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add source/_data/argon.yml themes/argon/layout/_partial/calendar.ejs themes/argon/layout/sidebar.ejs themes/argon/layout/footer.ejs themes/argon/source/style.css themes/argon/source/lq-calendar.js themes/argon/source/argontheme.js themes/argon/source/assets/vendor/lunar/lunar.js tests/sidebar-calendar-shell.test.mjs tests/sidebar-calendar-style.test.mjs tests/sidebar-calendar-runtime.test.mjs package.json package-lock.json
git commit -m "feat: add reusable sidebar lunar calendar component"
```

## Self-Review

### Spec Coverage

- Reusable component partial: covered in Task 1
- Sidebar-first integration: covered in Task 1
- Today highlight and selected day state: covered in Task 2 and Task 3
- Month navigation and day details: covered in Task 3
- Mobile full calendar: covered in Task 2 and Task 4
- `lunar-javascript` data source: covered in Task 3

No uncovered spec requirements remain.

### Placeholder Scan

This plan avoids unfinished placeholder language. The remaining places where work can vary are explicitly constrained to current file paths and current project conditions such as missing `.git`.

### Type Consistency

- Calendar root hook: `data-lq-calendar`
- Month navigation hook: `data-calendar-nav`
- Grid hook: `data-calendar-grid`
- Runtime entrypoint: `initLqCalendar`
- Theme config root: `lq_calendar`

These names are used consistently across template, CSS, runtime, and tests.
