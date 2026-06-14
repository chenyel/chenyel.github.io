# 3D Tech Constellation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public-facing `技术星图` page for the Hexo blog with three equal trunks (`Java后端`、`大模型`、`Agent`), multi-state progress badges, public notes, a sidebar mini entry, and a true 3D stage that gracefully falls back to a readable static layout.

**Architecture:** Keep data normalization server-side in a dedicated theme helper module, render the page shell and fallback detail panels through EJS, and use a page-scoped runtime to progressively enhance the stage into a Three.js-backed 3D constellation. Use DOM for hero, stats, detail panels, mini entry, and node badges, while WebGL handles branch cores, link lines, particles, and camera motion.

**Tech Stack:** Hexo 7, EJS partials, theme helper scripts, plain browser JavaScript, Three.js, existing `style.css`, Node built-in test runner

---

## File Structure

- `D:/blog/source/_data/argon.yml`
  - Source of truth for page copy, branch metadata, node status, icon URLs, notes, and mini-entry labels
- `D:/blog/source/tech-map/index.md`
  - Dedicated page entry with front matter flag for the custom renderer
- `D:/blog/themes/argon/scripts/tech-constellation-data.js`
  - Theme-side normalization for branches, nodes, stats, latest update, link URLs, and safe fallbacks
- `D:/blog/themes/argon/scripts/functions.js`
  - Registers `build_tech_constellation` helper for EJS
- `D:/blog/themes/argon/layout/layout.ejs`
  - Adds page-shell classes and hides sidebars on the dedicated constellation page
- `D:/blog/themes/argon/layout/_partial/content-page.ejs`
  - Routes `lq_tech_map_page` pages into the dedicated constellation partial
- `D:/blog/themes/argon/layout/_partial/tech-constellation-page.ejs`
  - Hero, stats, 3D stage shell, fallback branch lists, detail panels, and embedded JSON payload
- `D:/blog/themes/argon/layout/_partial/lq-rightbar.ejs`
  - Sidebar mini entry card for the constellation page
- `D:/blog/themes/argon/layout/footer.ejs`
  - Page-scoped script tags for Three.js and the constellation runtime
- `D:/blog/themes/argon/source/argontheme.js`
  - Calls `initLqTechConstellation()` from the existing enhancement boot flow
- `D:/blog/themes/argon/source/lq-tech-constellation.js`
  - DOM selection logic, reduced-motion behavior, 3D scene boot, overlay projection, and fallback handling
- `D:/blog/themes/argon/source/assets/vendor/three/three.min.js`
  - Local browser copy of Three.js used only by the constellation page
- `D:/blog/themes/argon/source/style.css`
  - Full-page, detail panel, mini-entry, enhanced-stage, fallback, dark, and responsive styles
- `D:/blog/tests/tech-constellation-data.test.mjs`
  - Helper-level assertions for normalized branch and node data
- `D:/blog/tests/tech-constellation-shell.test.mjs`
  - Build-output assertions for page shell, JSON payload, page classes, script includes, and mini entry
- `D:/blog/tests/tech-constellation-style.test.mjs`
  - Source assertions for required selectors, reduced-motion behavior, and mobile layout rules
- `D:/blog/tests/tech-constellation-runtime.test.mjs`
  - Source assertions for runtime hooks, fallback path, projection logic, and Three.js boot wiring

## Task 1: Add the Theme Data Model and Helper Pipeline

**Files:**
- Create: `D:/blog/tests/tech-constellation-data.test.mjs`
- Create: `D:/blog/themes/argon/scripts/tech-constellation-data.js`
- Modify: `D:/blog/themes/argon/scripts/functions.js`
- Modify: `D:/blog/source/_data/argon.yml`

- [ ] **Step 1: Write the failing helper test**

Create `D:/blog/tests/tech-constellation-data.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { buildTechConstellationData } = require('../themes/argon/scripts/tech-constellation-data.js')

const theme = {
  lq_tech_map: {
    enabled: true,
    page: {
      title: '技术星图',
      eyebrow: 'Tech Constellation',
      summary: '把 Java 后端、大模型和 Agent 的学习轨迹整理成一张可探索的公开成长图。',
      identity: 'Java 后端 / 大模型 / Agent'
    },
    mini_entry: {
      title: '技术星图',
      summary: '看看最近点亮了哪些节点'
    },
    branches: [
      { id: 'java-backend', name: 'Java后端', color: '#5ad1ff', core_position: { x: -22, y: 6, z: -14 } },
      { id: 'llm', name: '大模型', color: '#9c7bff', core_position: { x: 0, y: 14, z: -6 } },
      { id: 'agent', name: 'Agent', color: '#59f2c1', core_position: { x: 22, y: -2, z: -12 } }
    ],
    nodes: [
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        branch: 'java-backend',
        status: '做过项目',
        icon: 'https://cdn.simpleicons.org/springboot/6DB33F',
        short_note: '项目主力框架',
        detail: '做过接口开发、参数校验、异常处理和基础分层。',
        tags: ['后端', '框架'],
        updated_at: '2026-06-10',
        position: { x: -12, y: 14, z: 10 },
        articles: [{ title: 'Spring 入门笔记', url: '/archives' }]
      },
      {
        id: 'rag',
        name: 'RAG',
        branch: 'llm',
        status: '会用',
        icon: 'https://cdn.simpleicons.org/openai/ffffff',
        short_note: '开始搭检索增强链路',
        detail: '已经理解基础链路，正在把向量检索和问答流程串起来。',
        tags: ['LLM', '检索'],
        updated_at: '2026-06-11',
        position: { x: 2, y: 22, z: 6 }
      },
      {
        id: 'tool-calling',
        name: 'Tool Calling',
        branch: 'agent',
        status: '了解',
        icon: 'https://cdn.simpleicons.org/python/3776AB',
        short_note: '刚开始梳理调用模式',
        detail: '正在建立对工具选择、入参与结果回写的整体认知。',
        tags: ['Agent'],
        updated_at: '2026-06-12',
        position: { x: 24, y: 8, z: 8 }
      }
    ]
  }
}

const urlFor = input => input

test('tech constellation helper normalizes branches, nodes, stats, and latest update', () => {
  const result = buildTechConstellationData(theme, urlFor)

  assert.equal(result.page.title, '技术星图')
  assert.equal(result.branches.length, 3)
  assert.equal(result.nodes.length, 3)
  assert.equal(result.stats.totalNodes, 3)
  assert.equal(result.stats.litNodes, 3)
  assert.equal(result.stats.branchCount, 3)
  assert.equal(result.latestNode.id, 'tool-calling')
  assert.equal(result.defaultNodeId, 'spring-boot')
  assert.equal(result.branches[0].nodes.length > 0, true)
  assert.equal(result.nodes[0].position.x !== undefined, true)
  assert.equal(result.nodes[0].statusKey, 'project')
  assert.equal(result.nodes[2].statusKey, 'aware')
})
```

- [ ] **Step 2: Run the helper test to verify it fails**

Run: `node --test tests/tech-constellation-data.test.mjs`

Expected: FAIL because `tech-constellation-data.js` does not exist and `buildTechConstellationData` is undefined.

- [ ] **Step 3: Create the helper module**

Create `D:/blog/themes/argon/scripts/tech-constellation-data.js`:

```js
const STATUS_META = {
  '了解': { key: 'aware', label: '了解', order: 1 },
  '会用': { key: 'usable', label: '会用', order: 2 },
  '做过项目': { key: 'project', label: '做过项目', order: 3 },
  '能输出': { key: 'teaching', label: '能输出', order: 4 }
}

const DEFAULT_PAGE = {
  title: '技术星图',
  eyebrow: 'Tech Constellation',
  summary: '把正在推进的技术主线整理成一张可以长期公开展示的成长星图。',
  identity: 'Java 后端 / 大模型 / Agent'
}

const DEFAULT_MINI_ENTRY = {
  title: '技术星图',
  summary: '看看最近点亮了哪些节点'
}

const safeArray = value => Array.isArray(value) ? value.filter(Boolean) : []

const compareDateDesc = (left, right) => String(right || '').localeCompare(String(left || ''))

const createInitials = name => {
  const text = String(name || '').trim()
  if (!text) return 'NA'
  const ascii = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
  if (ascii) {
    return ascii.split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join('')
  }
  return text.slice(0, 2)
}

function buildTechConstellationData(theme, urlFor) {
  const config = (theme && theme.lq_tech_map) || {}
  const page = { ...DEFAULT_PAGE, ...(config.page || {}) }
  const miniEntry = { ...DEFAULT_MINI_ENTRY, ...(config.mini_entry || {}) }

  const branchMap = new Map()
  safeArray(config.branches).forEach((branch, index) => {
    if (!branch || !branch.id) return
    branchMap.set(branch.id, {
      id: branch.id,
      name: branch.name || branch.id,
      subtitle: branch.subtitle || '',
      description: branch.description || '',
      icon: branch.icon || '',
      color: branch.color || '#7dd3fc',
      corePosition: branch.core_position || { x: 0, y: 0, z: 0 },
      order: index,
      nodes: []
    })
  })

  const nodes = safeArray(config.nodes)
    .map(node => {
      const branch = branchMap.get(node.branch)
      if (!node || !node.id || !branch) return null
      const status = STATUS_META[node.status] || STATUS_META['了解']
      const record = {
        id: node.id,
        name: node.name || node.id,
        branch: branch.id,
        branchName: branch.name,
        icon: node.icon || '',
        initials: createInitials(node.name || node.id),
        status: status.label,
        statusKey: status.key,
        statusOrder: status.order,
        shortNote: node.short_note || '',
        detail: node.detail || '',
        tags: safeArray(node.tags),
        updatedAt: node.updated_at || '',
        articles: safeArray(node.articles).map(article => ({
          title: article.title || '相关文章',
          url: urlFor(article.url || '/')
        })),
        position: node.position || { x: 0, y: 0, z: 0 }
      }
      branch.nodes.push(record)
      return record
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.statusOrder !== left.statusOrder) return right.statusOrder - left.statusOrder
      return compareDateDesc(left.updatedAt, right.updatedAt)
    })

  const branches = Array.from(branchMap.values())
    .filter(branch => branch.nodes.length > 0)
    .sort((left, right) => left.order - right.order)

  const latestNode = [...nodes].sort((left, right) => compareDateDesc(left.updatedAt, right.updatedAt))[0] || null
  const defaultNode = [...nodes].sort((left, right) => right.statusOrder - left.statusOrder || compareDateDesc(left.updatedAt, right.updatedAt))[0] || null

  return {
    page,
    miniEntry,
    branches,
    nodes,
    latestNode,
    defaultNodeId: defaultNode ? defaultNode.id : '',
    stats: {
      totalNodes: nodes.length,
      litNodes: nodes.filter(node => node.statusOrder >= 1).length,
      branchCount: branches.length
    }
  }
}

module.exports = {
  buildTechConstellationData
}
```

- [ ] **Step 4: Register the helper in `functions.js`**

Add the import near the top of `D:/blog/themes/argon/scripts/functions.js`:

```js
const { buildTechConstellationData } = require('./tech-constellation-data');
```

Append this helper registration near the existing `build_tag_tree` registration:

```js
hexo.extend.helper.register('build_tech_constellation', function (theme) {
  return buildTechConstellationData(theme, this.url_for.bind(this));
});
```

- [ ] **Step 5: Add the initial theme configuration**

Append this block near the other `lq_*` theme settings in `D:/blog/source/_data/argon.yml`:

```yml
lq_tech_map:
  enabled: true
  page:
    title: '技术星图'
    eyebrow: 'Tech Constellation'
    summary: '把 Java 后端、大模型和 Agent 的学习轨迹整理成一张可探索的公开成长图。'
    identity: 'Java 后端 / 大模型 / Agent'
  mini_entry:
    title: '技术星图'
    summary: '最近在点亮新的技术节点。'
  branches:
    - id: 'java-backend'
      name: 'Java后端'
      subtitle: 'Service Spine'
      description: '服务、数据和工程能力的稳定主轴。'
      color: '#57d6ff'
      core_position: { x: -22, y: 6, z: -14 }
    - id: 'llm'
      name: '大模型'
      subtitle: 'Model Orbit'
      description: '围绕理解、检索和生成能力继续延展。'
      color: '#9e7dff'
      core_position: { x: 0, y: 14, z: -6 }
    - id: 'agent'
      name: 'Agent'
      subtitle: 'Workflow Pulse'
      description: '把模型能力接到工具、记忆和流程上。'
      color: '#58efbf'
      core_position: { x: 22, y: -2, z: -12 }
  nodes:
    - id: 'java'
      name: 'Java'
      branch: 'java-backend'
      status: '做过项目'
      icon: 'https://cdn.simpleicons.org/openjdk/ffffff'
      short_note: '后端主语言'
      detail: '做过基础语法、集合、面向对象和常见服务端开发实践。'
      tags: ['语言', '后端']
      updated_at: '2026-06-01'
      position: { x: -30, y: 12, z: 4 }
    - id: 'spring-boot'
      name: 'Spring Boot'
      branch: 'java-backend'
      status: '做过项目'
      icon: 'https://cdn.simpleicons.org/springboot/6DB33F'
      short_note: '项目主力框架'
      detail: '做过接口开发、参数校验、异常处理和基础分层。'
      tags: ['框架', '后端']
      updated_at: '2026-06-10'
      position: { x: -12, y: 14, z: 10 }
    - id: 'mysql'
      name: 'MySQL'
      branch: 'java-backend'
      status: '会用'
      icon: 'https://cdn.simpleicons.org/mysql/4479A1'
      short_note: '常用关系型数据库'
      detail: '能完成基础建表、查询和索引层面的日常学习与使用。'
      tags: ['数据库']
      updated_at: '2026-05-27'
      position: { x: -18, y: -6, z: 14 }
    - id: 'redis'
      name: 'Redis'
      branch: 'java-backend'
      status: '了解'
      icon: 'https://cdn.simpleicons.org/redis/DC382D'
      short_note: '正在补缓存思路'
      detail: '开始理解缓存、过期和常见使用场景。'
      tags: ['缓存']
      updated_at: '2026-05-25'
      position: { x: -34, y: -4, z: 6 }
    - id: 'transformer'
      name: 'Transformer'
      branch: 'llm'
      status: '了解'
      icon: 'https://cdn.simpleicons.org/huggingface/FFD21E'
      short_note: '打基础的关键概念'
      detail: '正在把注意力机制、编码表示和整体结构梳理清楚。'
      tags: ['原理', 'LLM']
      updated_at: '2026-05-30'
      position: { x: -4, y: 28, z: 8 }
    - id: 'prompt-engineering'
      name: 'Prompt Engineering'
      branch: 'llm'
      status: '会用'
      icon: 'https://cdn.simpleicons.org/openai/ffffff'
      short_note: '持续打磨提示词表达'
      detail: '已经能通过角色、约束和格式要求提高输出稳定性。'
      tags: ['提示词', 'LLM']
      updated_at: '2026-06-07'
      position: { x: 8, y: 18, z: 12 }
    - id: 'rag'
      name: 'RAG'
      branch: 'llm'
      status: '会用'
      icon: 'https://cdn.simpleicons.org/openai/ffffff'
      short_note: '开始搭检索增强链路'
      detail: '已经理解基础链路，正在把向量检索和问答流程串起来。'
      tags: ['检索', '问答']
      updated_at: '2026-06-11'
      position: { x: 2, y: 22, z: 6 }
    - id: 'embedding'
      name: 'Embedding'
      branch: 'llm'
      status: '了解'
      icon: 'https://cdn.simpleicons.org/openai/ffffff'
      short_note: '在补向量语义基础'
      detail: '正在理解文本向量化和相似度检索的基础概念。'
      tags: ['向量', '检索']
      updated_at: '2026-06-03'
      position: { x: -10, y: 10, z: 14 }
    - id: 'tool-calling'
      name: 'Tool Calling'
      branch: 'agent'
      status: '了解'
      icon: 'https://cdn.simpleicons.org/python/3776AB'
      short_note: '刚开始梳理调用模式'
      detail: '正在建立对工具选择、入参与结果回写的整体认知。'
      tags: ['Agent', '工具']
      updated_at: '2026-06-12'
      position: { x: 24, y: 8, z: 8 }
    - id: 'workflow'
      name: 'Workflow'
      branch: 'agent'
      status: '会用'
      icon: 'https://cdn.simpleicons.org/langchain/1C3C3C'
      short_note: '能画出基础链路'
      detail: '开始把模型输入、工具调用和结果整理成稳定的流程。'
      tags: ['Agent', '流程']
      updated_at: '2026-06-09'
      position: { x: 34, y: 6, z: 4 }
    - id: 'memory'
      name: 'Memory'
      branch: 'agent'
      status: '了解'
      icon: 'https://cdn.simpleicons.org/langchain/1C3C3C'
      short_note: '正在理解上下文保存'
      detail: '关注会话记忆、状态延续和长链路上下文管理。'
      tags: ['Agent', '记忆']
      updated_at: '2026-06-04'
      position: { x: 20, y: -8, z: 14 }
```

- [ ] **Step 6: Run the helper test to verify it passes**

Run: `node --test tests/tech-constellation-data.test.mjs`

Expected: PASS

- [ ] **Step 7: Checkpoint the data-model work**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add source/_data/argon.yml themes/argon/scripts/tech-constellation-data.js themes/argon/scripts/functions.js tests/tech-constellation-data.test.mjs
git commit -m "feat: add tech constellation data model"
```

## Task 2: Add the Dedicated Page Shell, Fallback Content, and Sidebar Mini Entry

**Files:**
- Create: `D:/blog/tests/tech-constellation-shell.test.mjs`
- Create: `D:/blog/source/tech-map/index.md`
- Create: `D:/blog/themes/argon/layout/_partial/tech-constellation-page.ejs`
- Modify: `D:/blog/themes/argon/layout/layout.ejs`
- Modify: `D:/blog/themes/argon/layout/_partial/content-page.ejs`
- Modify: `D:/blog/themes/argon/layout/_partial/lq-rightbar.ejs`

- [ ] **Step 1: Write the failing shell test**

Create `D:/blog/tests/tech-constellation-shell.test.mjs`:

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

test('tech constellation page renders a custom shell, fallback content, and mini entry', () => {
  withSiteBuildLock(() => {
    runSiteCommand('clean')
    runSiteCommand('build')
  })

  const techMapHtml = readPublicHtml('tech-map/index.html')
  const homeHtml = readPublicHtml('index.html')

  assert.match(techMapHtml, /lq-page-shell--tech-map/)
  assert.match(techMapHtml, /lq-tech-constellation-page/)
  assert.match(techMapHtml, /data-tech-constellation/)
  assert.match(techMapHtml, /lq-tech-constellation__canvas/)
  assert.match(techMapHtml, /lq-tech-constellation__overlay/)
  assert.match(techMapHtml, /lq-tech-constellation__fallback/)
  assert.match(techMapHtml, /lq-tech-constellation__detail/)
  assert.match(techMapHtml, /lq-tech-constellation-data/)
  assert.match(techMapHtml, /\/assets\/vendor\/three\/three\.min\.js\?v=/)
  assert.match(techMapHtml, /\/lq-tech-constellation\.js\?v=/)
  assert.doesNotMatch(techMapHtml, /id="leftbar"/)
  assert.doesNotMatch(techMapHtml, /class="lq-rightbar"/)

  assert.match(homeHtml, /lq-rightbar-card--tech-map/)
  assert.match(homeHtml, /进入技术星图/)
})
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run: `node --test tests/tech-constellation-shell.test.mjs`

Expected: FAIL because the `tech-map` page, shell classes, fallback markup, and mini entry do not exist yet.

- [ ] **Step 3: Create the dedicated page entry**

Create `D:/blog/source/tech-map/index.md`:

```md
---
title: 技术星图
layout: page
lq_tech_map_page: true
---
```

- [ ] **Step 4: Add page-shell detection in `layout.ejs`**

Replace the top flag block in `D:/blog/themes/argon/layout/layout.ejs` with:

```ejs
<%- include('header.ejs') %>
<% const isTagLanding = is_page() && page && page.path === 'tags/index.html'; %>
<% const currentPost = typeof post !== 'undefined' ? post : null; %>
<% const isMusicPage = is_page() && ((page && page.lq_music_page) || (currentPost && currentPost.lq_music_page)); %>
<% const isTechMapPage = is_page() && ((page && page.lq_tech_map_page) || (currentPost && currentPost.lq_tech_map_page)); %>

<div id="lq-page-shell" class="<%= is_home() ? 'lq-home-shell' : 'lq-shell-wrap' %> <%= isTagLanding ? 'lq-page-shell--tag-tree' : '' %> <%= isMusicPage ? 'lq-page-shell--music' : '' %> <%= isTechMapPage ? 'lq-page-shell--tech-map' : '' %>">
	<div class="lq-shell <%= isTagLanding ? 'lq-shell--tag-tree' : '' %> <%= isMusicPage ? 'lq-shell--music' : '' %> <%= isTechMapPage ? 'lq-shell--tech-map' : '' %>">
		<% if (!isMusicPage && !isTechMapPage) { %>
		<div class="lq-left-column">
			<%- include('sidebar.ejs') %>
		</div>
		<% } %>
```

Also replace the rightbar guard near the bottom:

```ejs
		<% if (!isMusicPage && !isTechMapPage) { %>
		<div class="lq-right-column">
			<%- include('_partial/lq-rightbar.ejs') %>
		</div>
		<% } %>
```

- [ ] **Step 5: Route the new page type through `content-page.ejs`**

Insert this branch at the top of `D:/blog/themes/argon/layout/_partial/content-page.ejs` before the music-page branch:

```ejs
<% if (post.lq_tech_map_page) { %>
	<%- include('tech-constellation-page', { constellation: build_tech_constellation(theme) }) %>
<% } else if (post.lq_music_page) { %>
```

- [ ] **Step 6: Create the dedicated page partial with fallback detail panels**

Create `D:/blog/themes/argon/layout/_partial/tech-constellation-page.ejs`:

```ejs
<%
  const techMap = constellation || build_tech_constellation(theme);
  const defaultNodeId = techMap.defaultNodeId;
%>
<article class="post post-full card bg-white shadow-sm border-0 lq-page-card lq-tech-constellation-page" data-tech-constellation>
  <div class="lq-tech-constellation-page__aurora" aria-hidden="true"></div>

  <header class="lq-tech-constellation-page__hero">
    <div class="lq-tech-constellation-page__intro">
      <span class="lq-tech-constellation-page__eyebrow"><%= techMap.page.eyebrow %></span>
      <h1 class="lq-tech-constellation-page__title"><%= techMap.page.title %></h1>
      <p class="lq-tech-constellation-page__identity"><%= techMap.page.identity %></p>
      <p class="lq-tech-constellation-page__copy"><%= techMap.page.summary %></p>
    </div>

    <div class="lq-tech-constellation-page__stats" role="list" aria-label="Tech constellation statistics">
      <div class="lq-tech-constellation-stat" role="listitem">
        <span class="lq-tech-constellation-stat__value"><%= techMap.stats.totalNodes %></span>
        <span class="lq-tech-constellation-stat__label">技术节点</span>
      </div>
      <div class="lq-tech-constellation-stat" role="listitem">
        <span class="lq-tech-constellation-stat__value"><%= techMap.stats.branchCount %></span>
        <span class="lq-tech-constellation-stat__label">主干</span>
      </div>
      <div class="lq-tech-constellation-stat" role="listitem">
        <span class="lq-tech-constellation-stat__value"><%= techMap.latestNode ? techMap.latestNode.updatedAt : '--' %></span>
        <span class="lq-tech-constellation-stat__label">最近更新</span>
      </div>
    </div>
  </header>

  <div class="lq-tech-constellation">
    <section class="lq-tech-constellation__stage" aria-label="3D tech constellation stage">
      <canvas class="lq-tech-constellation__canvas" data-tech-map-canvas></canvas>
      <div class="lq-tech-constellation__overlay" data-tech-map-overlay aria-hidden="true"></div>
      <div class="lq-tech-constellation__fallback" data-tech-map-fallback>
        <% techMap.branches.forEach(function(branch) { %>
          <section class="lq-tech-constellation__branch" data-tech-map-branch="<%= branch.id %>" style="--branch-accent:<%= branch.color %>;">
            <div class="lq-tech-constellation__branch-head">
              <span class="lq-tech-constellation__branch-kicker"><%= branch.subtitle || branch.name %></span>
              <h2 class="lq-tech-constellation__branch-title"><%= branch.name %></h2>
              <p class="lq-tech-constellation__branch-copy"><%= branch.description %></p>
            </div>
            <div class="lq-tech-constellation__branch-nodes">
              <% branch.nodes.forEach(function(node) { %>
                <button
                  type="button"
                  class="lq-tech-node <%= node.id === defaultNodeId ? 'is-active' : '' %>"
                  data-tech-node="<%= node.id %>"
                  data-branch-id="<%= branch.id %>"
                  aria-pressed="<%= node.id === defaultNodeId ? 'true' : 'false' %>"
                >
                  <span class="lq-tech-node__icon">
                    <% if (node.icon) { %>
                      <img src="<%= node.icon %>" alt="<%= node.name %>">
                    <% } else { %>
                      <span><%= node.initials %></span>
                    <% } %>
                  </span>
                  <span class="lq-tech-node__meta">
                    <span class="lq-tech-node__name"><%= node.name %></span>
                    <span class="lq-tech-node__note"><%= node.shortNote %></span>
                  </span>
                  <span class="lq-tech-node__badge lq-tech-node__badge--<%= node.statusKey %>"><%= node.status %></span>
                </button>
              <% }) %>
            </div>
          </section>
        <% }) %>
      </div>
    </section>

    <aside class="lq-tech-constellation__detail" aria-live="polite">
      <% techMap.nodes.forEach(function(node) { %>
        <section class="lq-tech-detail-panel <%= node.id === defaultNodeId ? 'is-active' : '' %>" data-tech-panel="<%= node.id %>">
          <header class="lq-tech-detail-panel__header">
            <div class="lq-tech-detail-panel__title-wrap">
              <span class="lq-tech-detail-panel__branch"><%= node.branchName %></span>
              <h2 class="lq-tech-detail-panel__title"><%= node.name %></h2>
            </div>
            <span class="lq-tech-detail-panel__status lq-tech-detail-panel__status--<%= node.statusKey %>"><%= node.status %></span>
          </header>
          <p class="lq-tech-detail-panel__note"><%= node.shortNote %></p>
          <p class="lq-tech-detail-panel__copy"><%= node.detail %></p>
          <% if (node.tags.length) { %>
            <div class="lq-tech-detail-panel__chips">
              <% node.tags.forEach(function(tag) { %>
                <span class="lq-tech-detail-panel__chip"><%= tag %></span>
              <% }) %>
            </div>
          <% } %>
          <% if (node.articles.length) { %>
            <div class="lq-tech-detail-panel__links">
              <% node.articles.forEach(function(article) { %>
                <a class="lq-tech-detail-panel__link" href="<%= article.url %>"><%= article.title %></a>
              <% }) %>
            </div>
          <% } %>
          <div class="lq-tech-detail-panel__updated">最近更新：<%= node.updatedAt || '--' %></div>
        </section>
      <% }) %>
    </aside>
  </div>

  <script class="lq-tech-constellation-data" type="application/json"><%- JSON.stringify(techMap) %></script>
</article>
```

- [ ] **Step 7: Add the rightbar mini entry**

Insert this block in `D:/blog/themes/argon/layout/_partial/lq-rightbar.ejs` after the status card:

```ejs
		<%
			const techMap = build_tech_constellation(theme);
			const latestNode = techMap.latestNode;
		%>
		<% if ((theme.lq_tech_map || {}).enabled !== false && techMap.nodes.length > 0) { %>
			<section class="card shadow-sm border-0 lq-rightbar-card lq-rightbar-card--tech-map">
				<div class="lq-rightbar-card__title"><%= techMap.miniEntry.title %></div>
				<div class="lq-tech-mini-entry">
					<p class="lq-tech-mini-entry__copy"><%= techMap.miniEntry.summary %></p>
					<div class="lq-tech-mini-entry__stats">
						<span><%= techMap.stats.totalNodes %> 节点</span>
						<span><%= techMap.stats.branchCount %> 主干</span>
					</div>
					<% if (latestNode) { %>
						<div class="lq-tech-mini-entry__latest">最近点亮：<%= latestNode.name %></div>
					<% } %>
					<a class="lq-tech-mini-entry__link" href="<%= url_for('/tech-map/') %>">进入技术星图</a>
				</div>
			</section>
		<% } %>
```

- [ ] **Step 8: Run the shell test to verify it passes**

Run: `node --test tests/tech-constellation-shell.test.mjs`

Expected: PASS

- [ ] **Step 9: Checkpoint the shell work**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add source/tech-map/index.md themes/argon/layout/layout.ejs themes/argon/layout/_partial/content-page.ejs themes/argon/layout/_partial/tech-constellation-page.ejs themes/argon/layout/_partial/lq-rightbar.ejs tests/tech-constellation-shell.test.mjs
git commit -m "feat: add tech constellation page shell"
```

## Task 3: Add Styles and DOM Fallback Interaction

**Files:**
- Create: `D:/blog/tests/tech-constellation-style.test.mjs`
- Create: `D:/blog/tests/tech-constellation-runtime.test.mjs`
- Modify: `D:/blog/themes/argon/source/style.css`
- Create: `D:/blog/themes/argon/source/lq-tech-constellation.js`

- [ ] **Step 1: Write the failing style test**

Create `D:/blog/tests/tech-constellation-style.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const stylePath = new URL('../themes/argon/source/style.css', import.meta.url)

test('tech constellation stylesheet contains page, node, mini-entry, enhanced, and responsive selectors', async () => {
  const css = await readFile(stylePath, 'utf8')

  const requiredSnippets = [
    '.lq-page-shell--tech-map .lq-main-column',
    '.lq-tech-constellation-page {',
    '.lq-tech-constellation__stage {',
    '.lq-tech-constellation__canvas {',
    '.lq-tech-constellation__overlay {',
    '.lq-tech-constellation__fallback {',
    '.lq-tech-node {',
    '.lq-tech-detail-panel.is-active',
    '.lq-rightbar-card--tech-map',
    '[data-tech-map-enhanced="true"] .lq-tech-constellation__fallback',
    '@media (prefers-reduced-motion: reduce)',
    '@media (max-width: 991.98px)',
  ]

  for (const snippet of requiredSnippets) {
    assert.ok(css.includes(snippet), `Expected style.css to include: ${snippet}`)
  }
})
```

- [ ] **Step 2: Write the failing runtime test**

Create `D:/blog/tests/tech-constellation-runtime.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const runtimePath = new URL('../themes/argon/source/lq-tech-constellation.js', import.meta.url)

test('tech constellation runtime exposes mount helper, selection logic, reduced-motion handling, and fallback guards', async () => {
  const js = await readFile(runtimePath, 'utf8')

  const requiredSnippets = [
    'function parseTechConstellationData',
    'function selectTechNode',
    'function mountTechConstellation',
    'function prefersReducedMotion',
    'window.initLqTechConstellation = initLqTechConstellation',
    'data-tech-map-enhanced',
    'matchMedia(\'(prefers-reduced-motion: reduce)\')',
    'if (!window.THREE)',
  ]

  for (const snippet of requiredSnippets) {
    assert.ok(js.includes(snippet), `Expected lq-tech-constellation.js to include: ${snippet}`)
  }
})
```

- [ ] **Step 3: Run the style and runtime tests to verify they fail**

Run: `node --test tests/tech-constellation-style.test.mjs tests/tech-constellation-runtime.test.mjs`

Expected: FAIL because the stylesheet selectors and runtime file do not exist yet.

- [ ] **Step 4: Add the page and mini-entry styles**

Append this block near the other custom immersive page styles in `D:/blog/themes/argon/source/style.css`:

```css
.lq-page-shell--tech-map .lq-main-column {
  width: min(1320px, 100%);
  max-width: 1320px;
  margin: 0 auto;
}

.lq-tech-constellation-page {
  position: relative;
  overflow: hidden;
  padding: 32px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(91, 214, 255, 0.16), transparent 42%),
    radial-gradient(circle at 85% 15%, rgba(153, 125, 255, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(8, 16, 31, 0.96), rgba(9, 12, 24, 0.98));
  color: #edf6ff;
}

.lq-tech-constellation-page__hero,
.lq-tech-constellation {
  position: relative;
  z-index: 1;
}

.lq-tech-constellation {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.72fr);
  gap: 24px;
  align-items: stretch;
}

.lq-tech-constellation__stage,
.lq-tech-constellation__detail,
.lq-rightbar-card--tech-map {
  border: 1px solid rgba(133, 199, 255, 0.14);
  background: rgba(6, 12, 24, 0.76);
  box-shadow: 0 30px 80px rgba(3, 8, 20, 0.45);
  backdrop-filter: blur(20px);
}

.lq-tech-constellation__stage {
  position: relative;
  min-height: 680px;
  border-radius: 28px;
  overflow: hidden;
}

.lq-tech-constellation__canvas,
.lq-tech-constellation__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lq-tech-constellation__overlay {
  pointer-events: none;
}

.lq-tech-constellation__fallback {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 24px;
}

.lq-tech-constellation__branch {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(133, 199, 255, 0.12);
  background: rgba(10, 18, 34, 0.7);
}

.lq-tech-node {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(135, 189, 255, 0.12);
  border-radius: 18px;
  background: rgba(10, 16, 30, 0.88);
  color: inherit;
  text-align: left;
}

.lq-tech-node + .lq-tech-node {
  margin-top: 12px;
}

.lq-tech-node__icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
}

.lq-tech-node__icon img {
  width: 24px;
  height: 24px;
}

.lq-tech-node__badge,
.lq-tech-detail-panel__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.lq-tech-node__badge--aware,
.lq-tech-detail-panel__status--aware {
  background: rgba(135, 189, 255, 0.16);
  color: #b9dbff;
}

.lq-tech-node__badge--usable,
.lq-tech-detail-panel__status--usable {
  background: rgba(95, 244, 199, 0.16);
  color: #9ff1d6;
}

.lq-tech-node__badge--project,
.lq-tech-detail-panel__status--project {
  background: rgba(255, 198, 92, 0.16);
  color: #ffd98a;
}

.lq-tech-node__badge--teaching,
.lq-tech-detail-panel__status--teaching {
  background: rgba(163, 125, 255, 0.18);
  color: #d9c9ff;
}

.lq-tech-node.is-active,
.lq-tech-node:hover {
  border-color: rgba(132, 220, 255, 0.44);
  transform: translateY(-2px);
}

.lq-tech-node--floating {
  position: absolute;
  left: 0;
  top: 0;
  min-width: 220px;
  pointer-events: auto;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
}

.lq-tech-constellation__detail {
  border-radius: 28px;
  padding: 22px;
}

.lq-tech-detail-panel {
  display: none;
}

.lq-tech-detail-panel.is-active {
  display: block;
}

.lq-tech-mini-entry {
  display: grid;
  gap: 12px;
}

.lq-tech-mini-entry__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: rgba(236, 246, 255, 0.72);
}

.lq-tech-mini-entry__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(87, 214, 255, 0.25), rgba(158, 125, 255, 0.22));
  color: #eef8ff;
}

[data-tech-map-enhanced="true"] .lq-tech-constellation__fallback {
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .lq-tech-node,
  .lq-tech-mini-entry__link {
    transition: none;
    transform: none;
  }
}

@media (max-width: 991.98px) {
  .lq-tech-constellation {
    grid-template-columns: 1fr;
  }

  .lq-tech-constellation__stage {
    min-height: 520px;
  }

  .lq-tech-constellation__fallback {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Create the DOM fallback runtime**

Create `D:/blog/themes/argon/source/lq-tech-constellation.js`:

```js
(function () {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function parseTechConstellationData(root) {
    const node = root.querySelector('.lq-tech-constellation-data')
    if (!node) return null
    try {
      return JSON.parse(node.textContent || '{}')
    } catch (error) {
      return null
    }
  }

  function setActiveNode(root, nodeId) {
    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const isActive = button.dataset.techNode === nodeId
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })

    root.querySelectorAll('[data-tech-panel]').forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.techPanel === nodeId)
    })
  }

  function selectTechNode(root, nodeId) {
    if (!nodeId) return
    root.dataset.activeNode = nodeId
    setActiveNode(root, nodeId)
  }

  function mountTechConstellation(root) {
    if (!root || root.dataset.techMapBound === 'true') return
    root.dataset.techMapBound = 'true'

    const payload = parseTechConstellationData(root)
    const defaultNodeId = payload && payload.defaultNodeId

    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const nodeId = button.dataset.techNode
      button.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion()) {
          selectTechNode(root, nodeId)
        }
      })
      button.addEventListener('focus', () => selectTechNode(root, nodeId))
      button.addEventListener('click', () => selectTechNode(root, nodeId))
    })

    if (defaultNodeId) {
      selectTechNode(root, defaultNodeId)
    }

    if (!window.THREE) {
      return
    }
  }

  function initLqTechConstellation() {
    document.querySelectorAll('[data-tech-constellation]').forEach(mountTechConstellation)
  }

  window.initLqTechConstellation = initLqTechConstellation
})()
```

- [ ] **Step 6: Run the style and runtime tests to verify they pass**

Run: `node --test tests/tech-constellation-style.test.mjs tests/tech-constellation-runtime.test.mjs`

Expected: PASS

- [ ] **Step 7: Checkpoint the fallback stage**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add themes/argon/source/style.css themes/argon/source/lq-tech-constellation.js tests/tech-constellation-style.test.mjs tests/tech-constellation-runtime.test.mjs
git commit -m "feat: add tech constellation fallback UI"
```

## Task 4: Add the Page-Scoped Three.js 3D Enhancement

**Files:**
- Modify: `D:/blog/package.json`
- Modify: `D:/blog/package-lock.json`
- Create: `D:/blog/themes/argon/source/assets/vendor/three/three.min.js`
- Modify: `D:/blog/themes/argon/layout/footer.ejs`
- Modify: `D:/blog/themes/argon/source/lq-tech-constellation.js`
- Modify: `D:/blog/tests/tech-constellation-runtime.test.mjs`
- Modify: `D:/blog/tests/tech-constellation-shell.test.mjs`

- [ ] **Step 1: Expand the runtime test to cover the 3D boot path**

Update `D:/blog/tests/tech-constellation-runtime.test.mjs` so the snippet list becomes:

```js
  const requiredSnippets = [
    'function parseTechConstellationData',
    'function selectTechNode',
    'function createThreeScene',
    'function createNodeOverlay',
    'function updateOverlayPositions',
    'function mountTechConstellation',
    'window.initLqTechConstellation = initLqTechConstellation',
    'data-tech-map-enhanced',
    'matchMedia(\'(prefers-reduced-motion: reduce)\')',
    'if (!window.THREE)',
    'new window.THREE.Scene()',
    'new window.THREE.PerspectiveCamera',
    'projected.project(camera)',
  ]
```

Also expand `D:/blog/tests/tech-constellation-shell.test.mjs` to assert the local Three.js vendor path:

```js
  assert.match(techMapHtml, /\/assets\/vendor\/three\/three\.min\.js\?v=/)
```

- [ ] **Step 2: Run the updated tests to verify they fail**

Run: `node --test tests/tech-constellation-runtime.test.mjs tests/tech-constellation-shell.test.mjs`

Expected: FAIL because the 3D functions, vendor asset, and conditional footer include do not exist yet.

- [ ] **Step 3: Install and vendor Three.js**

Run: `npm install three --save-exact`

Expected: `package.json` and `package-lock.json` gain the `three` dependency.

Then create the local vendor directory and copy the browser build:

Run: `New-Item -ItemType Directory -Force -Path 'D:\blog\themes\argon\source\assets\vendor\three' | Out-Null; Copy-Item -LiteralPath 'D:\blog\node_modules\three\build\three.min.js' -Destination 'D:\blog\themes\argon\source\assets\vendor\three\three.min.js' -Force`

Expected: `D:/blog/themes/argon/source/assets/vendor/three/three.min.js` exists.

- [ ] **Step 4: Load the vendor and runtime only on the tech-map page**

In `D:/blog/themes/argon/layout/footer.ejs`, add page detection near the asset version line:

```ejs
<% const currentPage = typeof page !== 'undefined' ? page : null; %>
<% const currentPost = typeof post !== 'undefined' ? post : null; %>
<% const isTechMapPage = is_page() && ((currentPage && currentPage.lq_tech_map_page) || (currentPost && currentPost.lq_tech_map_page)); %>
<% const lqAssetVersion = Date.now(); %>
```

Then insert the conditional script block before `argontheme.js`:

```ejs
<% if (isTechMapPage) { %>
	<%- js('/assets/vendor/three/three.min.js?v=' + lqAssetVersion) %>
	<%- js('/lq-tech-constellation.js?v=' + lqAssetVersion) %>
<% } %>
<%- js('/argontheme.js?v=' + lqAssetVersion) %>
```

- [ ] **Step 5: Wire the new runtime into the theme boot flow**

Add this block in `D:/blog/themes/argon/source/argontheme.js` near the other `initLq*()` calls:

```js
	if (typeof window.initLqTechConstellation === "function") {
		window.initLqTechConstellation();
	}
```

- [ ] **Step 6: Upgrade `lq-tech-constellation.js` to build the 3D stage and projected overlay**

Replace `D:/blog/themes/argon/source/lq-tech-constellation.js` with:

```js
(function () {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function parseTechConstellationData(root) {
    const node = root.querySelector('.lq-tech-constellation-data')
    if (!node) return null
    try {
      return JSON.parse(node.textContent || '{}')
    } catch (error) {
      return null
    }
  }

  function setActiveNode(root, nodeId) {
    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const isActive = button.dataset.techNode === nodeId
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })

    root.querySelectorAll('[data-tech-panel]').forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.techPanel === nodeId)
    })
  }

  function selectTechNode(root, nodeId) {
    if (!nodeId) return
    root.dataset.activeNode = nodeId
    setActiveNode(root, nodeId)
  }

  function createNodeOverlay(root, payload) {
    const overlay = root.querySelector('[data-tech-map-overlay]')
    if (!overlay) return []
    overlay.innerHTML = ''

    return payload.nodes.map(node => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'lq-tech-node lq-tech-node--floating'
      button.dataset.techNode = node.id
      button.innerHTML = `
        <span class="lq-tech-node__icon">${node.icon ? `<img src="${node.icon}" alt="${node.name}">` : `<span>${node.initials}</span>`}</span>
        <span class="lq-tech-node__meta">
          <span class="lq-tech-node__name">${node.name}</span>
          <span class="lq-tech-node__note">${node.shortNote || ''}</span>
        </span>
        <span class="lq-tech-node__badge lq-tech-node__badge--${node.statusKey}">${node.status}</span>
      `
      overlay.appendChild(button)

      button.addEventListener('mouseenter', () => selectTechNode(root, node.id))
      button.addEventListener('focus', () => selectTechNode(root, node.id))
      button.addEventListener('click', () => selectTechNode(root, node.id))

      return {
        button,
        vector: new window.THREE.Vector3(node.position.x, node.position.y, node.position.z),
        nodeId: node.id
      }
    })
  }

  function createThreeScene(root, payload) {
    const canvas = root.querySelector('[data-tech-map-canvas]')
    if (!canvas) return null

    const width = canvas.clientWidth || canvas.parentElement.clientWidth || 960
    const height = canvas.clientHeight || canvas.parentElement.clientHeight || 680
    const renderer = new window.THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)

    const scene = new window.THREE.Scene()
    const camera = new window.THREE.PerspectiveCamera(46, width / height, 0.1, 200)
    camera.position.set(0, 8, 54)

    const ambient = new window.THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambient)

    payload.branches.forEach(branch => {
      const sphere = new window.THREE.Mesh(
        new window.THREE.SphereGeometry(2.8, 24, 24),
        new window.THREE.MeshBasicMaterial({ color: branch.color })
      )
      const pos = branch.corePosition || { x: 0, y: 0, z: 0 }
      sphere.position.set(pos.x, pos.y, pos.z)
      scene.add(sphere)
    })

    const lineMaterial = new window.THREE.LineBasicMaterial({ color: 0x79d8ff, transparent: true, opacity: 0.24 })
    payload.nodes.forEach(node => {
      const branch = payload.branches.find(item => item.id === node.branch)
      if (!branch) return
      const core = branch.corePosition || { x: 0, y: 0, z: 0 }
      const geometry = new window.THREE.BufferGeometry().setFromPoints([
        new window.THREE.Vector3(core.x, core.y, core.z),
        new window.THREE.Vector3(node.position.x, node.position.y, node.position.z)
      ])
      scene.add(new window.THREE.Line(geometry, lineMaterial))
    })

    return { scene, camera, renderer }
  }

  function updateOverlayPositions(root, overlayNodes, camera, width, height) {
    overlayNodes.forEach(node => {
      const projected = node.vector.clone()
      projected.project(camera)
      const x = (projected.x * 0.5 + 0.5) * width
      const y = (-projected.y * 0.5 + 0.5) * height
      node.button.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      node.button.style.pointerEvents = 'auto'
    })
  }

  function mountTechConstellation(root) {
    if (!root || root.dataset.techMapBound === 'true') return
    root.dataset.techMapBound = 'true'

    const payload = parseTechConstellationData(root)
    if (!payload) return

    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const nodeId = button.dataset.techNode
      button.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion()) selectTechNode(root, nodeId)
      })
      button.addEventListener('focus', () => selectTechNode(root, nodeId))
      button.addEventListener('click', () => selectTechNode(root, nodeId))
    })

    if (payload.defaultNodeId) {
      selectTechNode(root, payload.defaultNodeId)
    }

    if (!window.THREE) {
      return
    }

    const overlayNodes = createNodeOverlay(root, payload)
    const three = createThreeScene(root, payload)
    if (!three) return

    root.setAttribute('data-tech-map-enhanced', 'true')

    const canvas = root.querySelector('[data-tech-map-canvas]')
    const render = () => {
      const width = canvas.clientWidth || canvas.parentElement.clientWidth || 960
      const height = canvas.clientHeight || canvas.parentElement.clientHeight || 680
      three.camera.aspect = width / height
      three.camera.updateProjectionMatrix()
      three.renderer.setSize(width, height, false)
      updateOverlayPositions(root, overlayNodes, three.camera, width, height)
      three.renderer.render(three.scene, three.camera)
      if (!prefersReducedMotion()) {
        window.requestAnimationFrame(render)
      }
    }

    render()
  }

  function initLqTechConstellation() {
    document.querySelectorAll('[data-tech-constellation]').forEach(mountTechConstellation)
  }

  window.initLqTechConstellation = initLqTechConstellation
})()
```

- [ ] **Step 7: Run the shell and runtime tests to verify they pass**

Run: `node --test tests/tech-constellation-shell.test.mjs tests/tech-constellation-runtime.test.mjs`

Expected: PASS

- [ ] **Step 8: Run the full constellation test set**

Run: `node --test tests/tech-constellation-data.test.mjs tests/tech-constellation-shell.test.mjs tests/tech-constellation-style.test.mjs tests/tech-constellation-runtime.test.mjs`

Expected: PASS

- [ ] **Step 9: Checkpoint the 3D enhancement**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add package.json package-lock.json themes/argon/layout/footer.ejs themes/argon/source/argontheme.js themes/argon/source/lq-tech-constellation.js themes/argon/source/assets/vendor/three/three.min.js tests/tech-constellation-runtime.test.mjs tests/tech-constellation-shell.test.mjs
git commit -m "feat: add 3d tech constellation stage"
```

## Task 5: Verify the Generated Site Output End-to-End

**Files:**
- Modify: `D:/blog/tests/layout-shell.test.mjs`

- [ ] **Step 1: Extend the site-wide shell regression test**

Append this test to `D:/blog/tests/layout-shell.test.mjs`:

```js
test('tech map page renders as a dedicated immersive constellation experience', () => {
  const html = readPublicFile('tech-map/index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-page-shell--tech-map/)
  assert.match(html, /lq-tech-constellation-page/)
  assert.match(html, /lq-tech-constellation__stage/)
  assert.match(html, /lq-tech-constellation__fallback/)
  assert.match(html, /lq-tech-constellation__detail/)
  assert.match(html, /lq-tech-constellation-data/)
  assert.match(html, /\/assets\/vendor\/three\/three\.min\.js\?v=/)
  assert.match(html, /\/lq-tech-constellation\.js\?v=/)
  assert.match(css, /lq-tech-constellation-page/)
  assert.match(css, /lq-rightbar-card--tech-map/)
})
```

- [ ] **Step 2: Run the site-wide shell regression test to verify it fails first**

Run: `node --test tests/layout-shell.test.mjs`

Expected: FAIL until the new assertions are satisfied by the generated site output.

- [ ] **Step 3: Rebuild the site and rerun all affected tests**

Run: `npm run clean`

Expected: Completes without error.

Run: `npm run build`

Expected: Generates `public/tech-map/index.html` and refreshed `public/style.css`.

Run: `node --test tests/layout-shell.test.mjs tests/tech-constellation-data.test.mjs tests/tech-constellation-shell.test.mjs tests/tech-constellation-style.test.mjs tests/tech-constellation-runtime.test.mjs`

Expected: PASS

- [ ] **Step 4: Manual QA checklist**

Open and verify:

- `public/tech-map/index.html`
- `public/index.html`

Confirm:

- the `技术星图` page has no left or right sidebar
- the page hero, stats, fallback nodes, and detail panels all render before JS enhancement
- the rightbar mini entry appears on the home page
- if Three.js loads, the stage receives `data-tech-map-enhanced="true"` and overlay nodes stay clickable
- reduced-motion preference keeps the page readable without continuous motion

- [ ] **Step 5: Final checkpoint**

Run: `git status --short`

Expected: In the current workspace this may fail because `D:/blog/.git` is missing. If git metadata is restored later, commit with:

```bash
git add tests/layout-shell.test.mjs
git commit -m "test: cover tech constellation page shell"
```

## Self-Review

### Spec Coverage

- Three equal trunks for `Java后端`、`大模型`、`Agent`: covered in Task 1 config and helper normalization.
- Public notes, short labels, status badges, and icon support: covered in Tasks 1 and 2.
- Dedicated immersive page plus mini sidebar entry: covered in Task 2.
- DOM fallback before 3D enhancement: covered in Tasks 2 and 3.
- True 3D stage with page-scoped loading and fallback guard: covered in Task 4.
- Responsive and reduced-motion behavior: covered in Task 3.
- Verification through build-output and source tests: covered in Tasks 1 through 5.

### Placeholder Scan

This plan intentionally avoids `TODO`, `TBD`, and “implement later” language. Each file path, command, and interface name is explicit.

### Type and Naming Consistency

Shared names used consistently across tasks:

- page flag: `lq_tech_map_page`
- helper: `build_tech_constellation`
- root selector: `[data-tech-constellation]`
- JSON payload node: `.lq-tech-constellation-data`
- runtime init: `window.initLqTechConstellation`
- stage enhanced flag: `data-tech-map-enhanced`
