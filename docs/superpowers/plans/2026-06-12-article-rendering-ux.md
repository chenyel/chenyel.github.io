# Article Rendering UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cross-platform-friendly article intro cards, portable callout enhancement, and article outro cards to the Hexo theme without breaking existing posts.

**Architecture:** Keep article-level structured content in front matter and render it in EJS templates. Keep body callouts portable by parsing plain blockquotes in server-side HTML preprocessing, so the generated site gets richer UI while exported Markdown still reads cleanly elsewhere.

**Tech Stack:** Hexo, EJS templates, theme helper modules, Node built-in test runner, CSS

---

### Task 1: Add article UX helper module and failing tests

**Files:**
- Create: `D:\blog\themes\argon\scripts\article-ux.js`
- Create: `D:\blog\tests\article-ux.test.js`

- [ ] **Step 1: Write the failing tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const {
  transformPortableCallouts,
  getArticleIntroItems,
  getArticleOutroData
} = require('../themes/argon/scripts/article-ux');

test('extracts intro rows from front matter fields', () => {
  const result = getArticleIntroItems({
    summary: 'Explain monotonic stack quickly.',
    audience: 'Readers new to monotonic stack.',
    takeaway: 'Know when to use it.'
  });

  assert.deepEqual(result, [
    { label: '这篇讲什么', content: 'Explain monotonic stack quickly.' },
    { label: '适合谁看', content: 'Readers new to monotonic stack.' },
    { label: '读完你会得到', content: 'Know when to use it.' }
  ]);
});

test('transforms labeled portable blockquotes into callout cards', () => {
  const html = '<blockquote><p>提示<br>先判断该找更大值还是更小值。</p></blockquote>';

  const result = transformPortableCallouts(html);

  assert.match(result, /lq-callout/);
  assert.match(result, /lq-callout--tip/);
  assert.match(result, /先判断该找更大值还是更小值。/);
});

test('leaves ordinary blockquotes unchanged', () => {
  const html = '<blockquote><p>普通引用内容</p></blockquote>';

  const result = transformPortableCallouts(html);

  assert.equal(result, html);
});

test('extracts outro data when closing fields are present', () => {
  const result = getArticleOutroData({
    closing: '抓住最近边界和单调性就够了。',
    next_reading: '/2026/06/05/algorithm/数字DP/',
    next_reading_title: '接着读：数字 DP'
  });

  assert.deepEqual(result, {
    closing: '抓住最近边界和单调性就够了。',
    nextReadingUrl: '/2026/06/05/algorithm/数字DP/',
    nextReadingTitle: '接着读：数字 DP'
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/article-ux.test.js`

Expected: FAIL because `themes/argon/scripts/article-ux.js` does not exist yet.

- [ ] **Step 3: Write the minimal helper implementation**

```js
const INTRO_FIELDS = [
  ['summary', '这篇讲什么'],
  ['audience', '适合谁看'],
  ['takeaway', '读完你会得到']
];

const CALLOUT_LABELS = {
  '提示': 'tip',
  '注意': 'note',
  '警告': 'warning',
  '总结': 'summary',
  '结论': 'summary'
};

function getTrimmedString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function getArticleIntroItems(post) {
  return INTRO_FIELDS.map(([field, label]) => {
    const content = getTrimmedString(post[field]);
    return content ? { label, content } : null;
  }).filter(Boolean);
}

function getArticleOutroData(post) {
  const closing = getTrimmedString(post.closing);
  const nextReadingUrl = getTrimmedString(post.next_reading);
  const nextReadingTitle = getTrimmedString(post.next_reading_title);

  if (!closing && !nextReadingUrl && !nextReadingTitle) {
    return null;
  }

  return {
    closing,
    nextReadingUrl,
    nextReadingTitle: nextReadingTitle || nextReadingUrl
  };
}

function transformPortableCallouts(content) {
  return content.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (match, innerHtml) => {
    const paragraphMatch = innerHtml.match(/^\s*<p>([\s\S]*?)<\/p>\s*$/i);
    if (!paragraphMatch) return match;

    const bodyHtml = paragraphMatch[1];
    const firstBreak = bodyHtml.search(/<br\s*\/?>/i);
    if (firstBreak === -1) return match;

    const headingHtml = bodyHtml.slice(0, firstBreak).replace(/<[^>]+>/g, '').trim();
    const variant = CALLOUT_LABELS[headingHtml];
    if (!variant) return match;

    const contentHtml = bodyHtml.slice(firstBreak).replace(/^<br\s*\/?>/i, '').trim();
    if (!contentHtml) return match;

    return [
      `<aside class="lq-callout lq-callout--${variant}">`,
      `  <div class="lq-callout__title">${headingHtml}</div>`,
      `  <div class="lq-callout__body">${contentHtml}</div>`,
      '</aside>'
    ].join('');
  });
}

module.exports = {
  getArticleIntroItems,
  getArticleOutroData,
  transformPortableCallouts
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/article-ux.test.js`

Expected: PASS

### Task 2: Wire article UX helpers into the Hexo helper pipeline

**Files:**
- Modify: `D:\blog\themes\argon\scripts\functions.js`
- Modify: `D:\blog\tests\article-ux.test.js`

- [ ] **Step 1: Extend the failing tests with integration expectations**

Add an assertion that transformed callouts and existing code block macification can coexist:

```js
const { addMacCodeBlockChrome } = require('../themes/argon/scripts/codeblock-macify');

test('callout transformation does not remove unrelated rendered HTML', () => {
  const html = '<blockquote><p>总结<br>这一节主要记边界。</p></blockquote><figure class="highlight bash"><table><tr><td class="code"><pre><span class="line">echo hi</span><br></pre></td></tr></table></figure>';

  const calloutResult = transformPortableCallouts(html);
  const finalResult = addMacCodeBlockChrome(calloutResult);

  assert.match(finalResult, /lq-callout--summary/);
  assert.match(finalResult, /lq-codeblock-toolbar/);
});
```

- [ ] **Step 2: Run the test to verify current helper wiring is incomplete**

Run: `node --test tests/article-ux.test.js`

Expected: PASS for the pure helper, but generated-site integration is still not wired into `functions.js`.

- [ ] **Step 3: Update `functions.js` to use the helper**

```js
const { addMacCodeBlockChrome } = require('./codeblock-macify');
const { transformPortableCallouts } = require('./article-ux');

hexo.extend.helper.register('argon_preprocess_article', function (content, theme, moretag) {
  // existing lazyload + moretag logic
  content = transformPortableCallouts(content);
  content = addMacCodeBlockChrome(content);
  return content;
});

hexo.extend.helper.register('get_article_intro_items', function (post) {
  return require('./article-ux').getArticleIntroItems(post);
});

hexo.extend.helper.register('get_article_outro_data', function (post) {
  return require('./article-ux').getArticleOutroData(post);
});
```

- [ ] **Step 4: Re-run the helper tests**

Run: `node --test tests/article-ux.test.js tests/codeblock-macify.test.js`

Expected: PASS

### Task 3: Render intro and outro sections in article templates

**Files:**
- Modify: `D:\blog\themes\argon\layout\_partial\content-article.ejs`
- Modify: `D:\blog\themes\argon\layout\_partial\content-page.ejs`

- [ ] **Step 1: Add a failing test for intro/outro markup generation logic if extracted**

If needed, expand `article-ux.test.js` with expectations on helper return values used by templates:

```js
test('returns null outro data when no closing fields are present', () => {
  assert.equal(getArticleOutroData({}), null);
});
```

- [ ] **Step 2: Run the tests**

Run: `node --test tests/article-ux.test.js`

Expected: PASS, confirming the template-facing helper data shape is stable.

- [ ] **Step 3: Update the post template**

Insert intro markup above `#post_content` and outro markup below it:

```ejs
<%
  const articleIntroItems = get_article_intro_items(post);
  const articleOutro = get_article_outro_data(post);
%>

<% if (articleIntroItems.length) { %>
  <section class="lq-article-intro" aria-label="文章速览">
    <div class="lq-article-intro__eyebrow">文章速览</div>
    <div class="lq-article-intro__list">
      <% articleIntroItems.forEach(function (item) { %>
        <div class="lq-article-intro__item">
          <div class="lq-article-intro__label"><%= item.label %></div>
          <div class="lq-article-intro__content"><%= item.content %></div>
        </div>
      <% }) %>
    </div>
  </section>
<% } %>

<div class="post-content" id="post_content">
  <%- argon_preprocess_article(post.content, theme, false) %>
</div>

<% if (articleOutro) { %>
  <section class="lq-article-outro" aria-label="阅读收束">
    <% if (articleOutro.closing) { %>
      <p class="lq-article-outro__closing"><%= articleOutro.closing %></p>
    <% } %>
    <% if (articleOutro.nextReadingUrl || articleOutro.nextReadingTitle) { %>
      <div class="lq-article-outro__next">
        <span class="lq-article-outro__next-label">下一篇建议读什么</span>
        <% if (articleOutro.nextReadingUrl) { %>
          <a href="<%= url_for(articleOutro.nextReadingUrl) %>" class="lq-article-outro__next-link"><%= articleOutro.nextReadingTitle %></a>
        <% } else { %>
          <span class="lq-article-outro__next-link"><%= articleOutro.nextReadingTitle %></span>
        <% } %>
      </div>
    <% } %>
  </section>
<% } %>
```

- [ ] **Step 4: Mirror the same logic into `content-page.ejs` for non-music pages**

Apply the same pattern only in the standard page branch, leaving the custom music page layout untouched.

### Task 4: Add theme styles for intro cards, callouts, and outro cards

**Files:**
- Modify: `D:\blog\themes\argon\source\style.css`
- Create: `D:\blog\tests\article-ux-theme.test.js`

- [ ] **Step 1: Write the failing theme-style test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('article ux theme styles exist', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'themes', 'argon', 'source', 'style.css'), 'utf8');

  assert.match(css, /\.lq-article-intro/);
  assert.match(css, /\.lq-callout--tip/);
  assert.match(css, /\.lq-callout--warning/);
  assert.match(css, /\.lq-article-outro/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/article-ux-theme.test.js`

Expected: FAIL because the selectors do not exist yet.

- [ ] **Step 3: Add minimal but complete CSS**

Add selectors for:

- `.lq-article-intro`
- `.lq-article-intro__item`
- `.lq-callout`
- `.lq-callout--tip`
- `.lq-callout--note`
- `.lq-callout--warning`
- `.lq-callout--summary`
- `.lq-article-outro`

Use the current theme language:

- soft card styling
- obvious but calm color accents
- mobile-safe spacing
- readable typography

- [ ] **Step 4: Run the theme-style test**

Run: `node --test tests/article-ux-theme.test.js`

Expected: PASS

### Task 5: Full verification with site build

**Files:**
- Modify: `D:\blog\source\_posts\hello-world.md` (only if a local verification sample is needed)

- [ ] **Step 1: Add temporary or real sample front matter fields if needed for verification**

Example:

```yaml
summary: 这是一篇用来验证文章速览卡的示例文章。
audience: 适合第一次进入博客、想快速确认增强效果的读者。
takeaway: 可以一眼看到文章重点、提示框和收束区。
closing: 如果这个页面显示正常，说明新的文章 UX 链路已经接好了。
next_reading: /2022/09/07/notes/markdown_notes/
next_reading_title: 接着读：markdown_notes
```

- [ ] **Step 2: Add a portable sample callout in the body**

```md
> 提示
> 这里是一条跨平台友好的提示框示例。
```

- [ ] **Step 3: Run all focused tests**

Run: `node --test tests/article-ux.test.js tests/article-ux-theme.test.js tests/codeblock-macify.test.js tests/codeblock-highlight-theme.test.js`

Expected: PASS

- [ ] **Step 4: Build the full site**

Run: `npm run build`

Expected: `hexo generate` succeeds and regenerates `public/style.css` plus article pages.

- [ ] **Step 5: Inspect generated HTML**

Run:

```powershell
Get-ChildItem -Path 'D:\blog\public' -Recurse -Filter *.html |
  Select-String -Pattern 'lq-article-intro|lq-callout|lq-article-outro' |
  Select-Object -First 20
```

Expected: generated pages contain the new intro/callout/outro markup.
