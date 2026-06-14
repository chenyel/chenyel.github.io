# Shuoshuonian Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn posts tagged `碎碎念` into image-first album cards across the home list, tag lists, and archive timeline while preserving the current page shell and avoiding oversized empty space.

**Architecture:** Reuse Argon's existing `thumbnail` support and keep the current page shell intact. Implement the redesign by branching only the `碎碎念` preview markup in the shared post-preview partial, adding a compact image treatment for `archives`, and layering the new visuals through isolated `lq-shuoshuonian-*` CSS plus a small detail-page class hook.

**Tech Stack:** Hexo, EJS templates, sitewide CSS, Node built-in test runner

---

## File Map

- Modify: `D:\blog\tests\layout-shell.test.mjs`
  Responsibility: add a generated-shell regression test for the `碎碎念` album card variants.
- Modify: `D:\blog\source\_posts\2025-2-7-01.md`
  Responsibility: provide the first manual `thumbnail` example for the existing `碎碎念` post.
- Modify: `D:\blog\themes\argon\layout\_partial\content-preview.ejs`
  Responsibility: render a dedicated album card for posts tagged `碎碎念`.
- Modify: `D:\blog\themes\argon\layout\archive.ejs`
  Responsibility: render `碎碎念` archive entries as compact cover cards while keeping the timeline shell.
- Modify: `D:\blog\themes\argon\layout\_partial\content-article.ejs`
  Responsibility: add a conditional class hook so `碎碎念` detail pages can be tuned without changing the full article layout.
- Modify: `D:\blog\themes\argon\source\style.css`
  Responsibility: add isolated album-card, archive-card, detail-page, responsive, and dark-mode styling.

## Task 1: Lock the rendered behavior in a failing shell test

**Files:**
- Modify: `D:\blog\tests\layout-shell.test.mjs`
- Read after build: `D:\blog\public\index.html`
- Read after build: `D:\blog\public\archives\index.html`
- Read after build: `D:\blog\public\2025\02\07\2025-2-7-01\index.html`
- Read after build: `D:\blog\public\style.css`

- [ ] **Step 1: Write the failing regression test**

Add a test block near the other shell tests:

```js
test('shuoshuonian posts render dedicated album cards across list, archive, and detail views', () => {
  const homeHtml = readPublicFile('index.html')
  const archiveHtml = readPublicFile('archives/index.html')
  const detailHtml = readPublicFile('2025/02/07/2025-2-7-01/index.html')
  const css = readPublicFile('style.css')

  assert.match(homeHtml, /lq-shuoshuonian-card/)
  assert.match(homeHtml, /lq-shuoshuonian-card__media/)
  assert.match(homeHtml, /img\/background1\.png/)
  assert.match(archiveHtml, /lq-shuoshuonian-archive-card/)
  assert.match(detailHtml, /lq-shuoshuonian-article/)
  assert.match(css, /lq-shuoshuonian-card__media/)
  assert.match(css, /aspect-ratio:\s*16\s*\/\s*10/)
  assert.match(css, /lq-shuoshuonian-archive-card/)
})
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test tests\\layout-shell.test.mjs`

Expected: FAIL because the generated HTML/CSS do not yet include the new `lq-shuoshuonian-*` classes or the manual cover reference.

- [ ] **Step 3: Keep existing shell coverage intact**

Do not delete or relax the existing shell assertions for:

```txt
home page shell
music page shell
post page shell
standalone pages
tag tree page
live2d dock
```

## Task 2: Add the first manual cover fixture and shared list-card markup

**Files:**
- Modify: `D:\blog\source\_posts\2025-2-7-01.md`
- Modify: `D:\blog\themes\argon\layout\_partial\content-preview.ejs`

- [ ] **Step 1: Add a manual thumbnail to the existing 碎碎念 post**

Update the front matter to include:

```yaml
thumbnail: /img/background1.png
```

Resulting front matter header:

```yaml
---
title: 2025/2/7-01
date: 2025-02-07 22:25:52
tags: 碎碎念
thumbnail: /img/background1.png
categories:
- 今日任务
---
```

- [ ] **Step 2: Branch the shared preview partial for 碎碎念 posts**

Add a top-level tag check and dedicated card path:

```ejs
<%
  const isShuoshuonian = Boolean(post.tags && post.tags.data && post.tags.data.some(tag => tag.name === '碎碎念'));
  const shuoshuonianThumbnail = has_thumbnail(post, theme) ? get_thumbnail(post, theme) : '';
%>
<% if (isShuoshuonian) { %>
  ...
<% } else { %>
  existing preview card
<% } %>
```

- [ ] **Step 3: Render an image-first card that keeps the current width**

Inside the `isShuoshuonian` branch, render:

```ejs
<article class="post card bg-white shadow-sm border-0 lq-article-card lq-shuoshuonian-card">
  <a class="lq-shuoshuonian-card__link" href="<%= url_for(post.path) %>">
    <div class="lq-shuoshuonian-card__media<%= shuoshuonianThumbnail ? ' has-cover' : ' is-fallback' %>">
      <% if (shuoshuonianThumbnail) { %>
        <img class="lq-shuoshuonian-card__image lazyload" ... data-original="<%= shuoshuonianThumbnail %>" alt="<%= post.title %>">
      <% } %>
      <div class="lq-shuoshuonian-card__overlay">
        <div class="lq-shuoshuonian-card__date"><%= post.date.format('YYYY.MM.DD') %></div>
        <h2 class="lq-shuoshuonian-card__title"><%= post.title %></h2>
        <p class="lq-shuoshuonian-card__excerpt"><%= getexcerpt(post.content, 88, true) %></p>
        <span class="lq-shuoshuonian-card__action">查看详情</span>
      </div>
    </div>
  </a>
</article>
```

The card must not reuse the default meta row, because that row adds clutter and vertical height.

## Task 3: Adapt the archive timeline and detail hook without breaking layout

**Files:**
- Modify: `D:\blog\themes\argon\layout\archive.ejs`
- Modify: `D:\blog\themes\argon\layout\_partial\content-article.ejs`

- [ ] **Step 1: Add the same tag check in archive entries**

Within the archive loop, compute:

```ejs
let isShuoshuonian = Boolean(post.tags && post.tags.data && post.tags.data.some(tag => tag.name === '碎碎念'));
let archiveThumbnail = has_thumbnail(post, theme) ? get_thumbnail(post, theme) : '';
```

- [ ] **Step 2: Keep the timeline shell, but swap only the card body**

For `碎碎念`, replace the plain title card with:

```ejs
<div class='argon-timeline-card card bg-gradient-secondary archive-timeline-title lq-shuoshuonian-archive-card<%= archiveThumbnail ? " has-cover" : " is-fallback" %>'>
  <% if (archiveThumbnail) { %>
    <img class="lq-shuoshuonian-archive-card__image lazyload" ... data-original="<%= archiveThumbnail %>" alt="<%= post.title %>">
  <% } %>
  <a class="lq-shuoshuonian-archive-card__link" href="<%= url_for(post.path) %>">
    <span class="lq-shuoshuonian-archive-card__eyebrow">碎碎念</span>
    <span class="lq-shuoshuonian-archive-card__title"><%= post.title %></span>
  </a>
</div>
```

For non-`碎碎念`, keep the existing archive node unchanged.

- [ ] **Step 3: Add a minimal detail-page class hook**

In `content-article.ejs`, extend the wrapper class:

```ejs
<article class="post post-full card bg-white shadow-sm border-0 lq-article-card lq-article-card-full <%= isShuoshuonian ? 'lq-shuoshuonian-article' : '' %> ...">
```

Reuse the same local `isShuoshuonian` tag check. Do not replace the article layout.

## Task 4: Add layout-safe styling and pass the build

**Files:**
- Modify: `D:\blog\themes\argon\source\style.css`

- [ ] **Step 1: Add isolated card-shell styles**

Introduce dedicated selectors such as:

```css
.lq-shuoshuonian-card {
  overflow: hidden;
  padding: 0;
}

.lq-shuoshuonian-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: 280px;
  max-height: 520px;
  overflow: hidden;
}
```

These values keep the card substantial without becoming too tall in the existing main column.

- [ ] **Step 2: Add overlay, image, and fallback treatments**

Implement:

```css
.lq-shuoshuonian-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lq-shuoshuonian-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 26px 28px;
  background: linear-gradient(to top, rgba(17, 19, 28, 0.78) 0%, rgba(17, 19, 28, 0.14) 56%, rgba(17, 19, 28, 0.02) 100%);
}
```

Also add a soft fallback background for `.is-fallback` so missing covers do not create blank boxes.

- [ ] **Step 3: Add gentle interactions and archive-card styles**

Implement hover and archive card rules:

```css
.lq-shuoshuonian-card:hover {
  transform: translateY(-4px);
}

.lq-shuoshuonian-card:hover .lq-shuoshuonian-card__image {
  transform: scale(1.03);
}

.lq-shuoshuonian-archive-card {
  position: relative;
  min-height: 150px;
  padding: 0;
  overflow: hidden;
}
```

The archive card must stay compact so the timeline does not gain large vertical gaps.

- [ ] **Step 4: Add responsive and detail-page tuning**

Add mobile guards:

```css
@media (max-width: 991.98px) {
  .lq-shuoshuonian-card__media {
    aspect-ratio: 6 / 5;
    min-height: 240px;
  }
}
```

Add detail-page refinements only through `.lq-shuoshuonian-article`, for example lighter title spacing and a slightly taller header image cap, but do not change the article body width.

## Task 5: Verify the full flow

**Files:**
- Read: `D:\blog\public\index.html`
- Read: `D:\blog\public\archives\index.html`
- Read: `D:\blog\public\2025\02\07\2025-2-7-01\index.html`
- Read: `D:\blog\public\style.css`

- [ ] **Step 1: Build fresh artifacts**

Run: `npm run clean`

Expected: exit code `0`

Run: `npm run build`

Expected: exit code `0` and regenerated files in `public`

- [ ] **Step 2: Re-run the shell regression suite**

Run: `node --test tests\\layout-shell.test.mjs`

Expected: PASS, including the new `碎碎念` album-card assertions.

- [ ] **Step 3: Spot-check the rendered artifacts**

Confirm:

```txt
public/index.html contains lq-shuoshuonian-card
public/archives/index.html contains lq-shuoshuonian-archive-card
public/2025/02/07/2025-2-7-01/index.html contains lq-shuoshuonian-article
public/style.css contains aspect-ratio: 16 / 10
```

## Self-Review

- Spec coverage: the plan covers shared list cards, archive integration, detail-page continuity, manual `thumbnail`, fallback behavior, and responsive spacing control.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: the same `lq-shuoshuonian-*` naming family is used across tests, templates, and CSS.
