# Article Rendering UX Design

## Goal

Improve article readability and reader guidance in the Hexo blog theme while staying friendly to cross-platform Markdown publishing.

## Context

The current blog already has:

- a strong article shell
- post metadata
- a sidebar table of contents
- custom code block presentation

What is still missing is structured guidance for readers:

- a quick summary at the top
- clearer emphasis for important inline sections
- a softer landing at the end of long articles

The user also wants future notes to remain portable to other publishing platforms, so the design must avoid relying on highly platform-specific Markdown syntax for core content.

## Non-Goals

- Do not redesign the full article layout.
- Do not require changes to existing posts.
- Do not introduce a complex authoring DSL.
- Do not depend on browser-only enhancement for critical content.

## Requirements

### 1. Article Intro Card

Posts can optionally define structured intro metadata in front matter.

Recommended fields:

- `summary`
- `audience`
- `takeaway`

When present, the theme renders a compact intro card near the start of the article body.

If none of these fields are present, nothing new is rendered.

### 2. Body Callout Blocks

Callouts must be authored in plain Markdown blockquote form so the source still reads well on other platforms.

Portable authoring pattern:

```md
> 提示
> 这里是一个实用技巧。

> 注意
> 这里是一个易错点。

> 总结
> 这里是本节结论。
```

Theme enhancement behavior:

- Detect blockquotes whose first line is a recognized label.
- Render them as styled callout cards in this blog.
- Preserve readable fallback as normal blockquotes on other platforms.

Initial label set:

- `提示`
- `注意`
- `警告`
- `总结`
- `结论`

Possible internal mapping:

- tip
- note
- warning
- summary

### 3. Article Outro Card

Posts can optionally define structured closing metadata in front matter.

Recommended fields:

- `closing`
- `next_reading`
- `next_reading_title`

When present, the theme renders a closing section after the article body and before tags/share extras.

If none are present, the article remains unchanged.

## Cross-Platform Strategy

### Front Matter

Front matter is acceptable because:

- unsupported fields are usually ignored by other platforms
- the raw source remains clean
- the blog can render richer UI without polluting article prose

Other platforms will not reproduce the custom visual cards automatically, but they also should not break.

### Callouts

Use plain blockquote source instead of private Markdown extensions like:

- `> [!TIP]`
- custom shortcodes
- embedded HTML-only blocks as the primary format

This keeps exported notes readable everywhere:

- best case: another platform also enhances them
- worst case: they still display as ordinary quote blocks

## Rendering Design

### Intro Card

Visual structure:

- small eyebrow label such as `文章速览`
- 1 to 3 short rows
- calm, scannable styling

Content priority:

1. `summary`
2. `audience`
3. `takeaway`

Rules:

- Hide empty rows.
- Do not duplicate the existing post description banner.
- Keep the card concise and above the main article text.

### Callout Card

Visual structure:

- icon or accent marker
- title derived from the first blockquote line
- body content from the remaining blockquote lines

Behavior:

- Only transform recognized labels.
- Unrecognized blockquotes stay as ordinary blockquotes.
- Nested Markdown inside the body should still render normally.

### Outro Card

Visual structure:

- short summary or wrap-up line
- optional next reading link or plain title

Rules:

- Render after main content and before tags/additional sharing extras if possible.
- Keep this section lighter than the intro card so it feels like a closing gesture.

## Technical Approach

### Preferred Architecture

Use server-side article HTML preprocessing in the theme helper layer.

Reasons:

- works with full static generation
- survives PJAX navigation naturally
- keeps final generated HTML explicit
- does not rely on client-side DOM mutation for core article meaning

### Intro/Outro Injection

Use post front matter values in article/page EJS templates to render optional intro and outro sections.

Likely touchpoints:

- `themes/argon/layout/_partial/content-article.ejs`
- `themes/argon/layout/_partial/content-page.ejs`

### Callout Transformation

Extend the article preprocessing helper to detect portable labeled blockquotes in rendered HTML and convert them into richer callout markup.

Likely touchpoints:

- `themes/argon/scripts/functions.js`
- a new helper module alongside `codeblock-macify.js`

### Styling

Add theme CSS for:

- intro card
- callout variants
- outro card
- responsive behavior

Likely touchpoint:

- `themes/argon/source/style.css`

## Content Rules

### Intro Metadata

Expected front matter example:

```yaml
summary: 这篇文章会快速讲清楚单调栈的核心思路和常见题型。
audience: 适合刚接触单调栈、想建立题感的读者。
takeaway: 读完后你应该能独立判断什么时候该用单调栈。
```

### Outro Metadata

Expected front matter example:

```yaml
closing: 如果你先抓住“维护单调性”和“找最近边界”这两个核心，后面的题型会顺很多。
next_reading: /2026/06/05/algorithm/数字DP/
next_reading_title: 接着读：数字 DP
```

### Portable Callout Source

Expected Markdown example:

```md
> 提示
> 如果你不知道该维护递增栈还是递减栈，可以先问自己：我要找更大值还是更小值。

> 注意
> 重复元素的处理方式会直接影响边界是否正确。

> 总结
> 单调栈的本质是用一次遍历维护“最近且满足条件”的候选集合。
```

## Error Handling

- Missing front matter fields: render nothing.
- Empty strings: treat as absent.
- Callout blockquotes with only a label and no body: keep as ordinary blockquote or drop enhancement.
- Unknown labels: keep original blockquote styling.

## Backward Compatibility

- Existing posts render unchanged by default.
- Existing ordinary blockquotes remain ordinary unless they match a recognized portable label format.
- Existing article metadata and extra content areas remain intact.

## Testing Strategy

### Automated

Add focused tests for:

- intro/outro field presence logic if extracted into helpers
- portable callout transformation
- non-callout blockquotes remaining unchanged
- generated classes for recognized labels

### Build Verification

Run a full Hexo build and inspect generated HTML to confirm:

- intro cards appear only when configured
- labeled blockquotes are transformed
- ordinary blockquotes remain normal
- outro cards render in the intended location

## Trade-Offs Considered

### Option A: Private Markdown Syntax

Example:

```md
> [!TIP]
```

Pros:

- concise
- familiar to some platforms

Cons:

- not broadly portable
- degrades inconsistently across sites

Rejected in favor of portability.

### Option B: Raw HTML Blocks in Markdown

Pros:

- maximum theme control

Cons:

- poor portability
- worse writing ergonomics
- uglier source content

Rejected for authoring experience.

### Option C: Front Matter + Portable Blockquotes

Pros:

- portable source
- clean authoring experience
- strong theme rendering
- easy backward compatibility

Cons:

- requires careful parsing rules
- outro/intro visuals remain theme-specific

Recommended option.

## Implementation Scope

This work should ship in one focused iteration with:

1. front matter intro block
2. portable blockquote callouts
3. front matter outro block
4. tests
5. build verification

## Spec Review

Self-review results:

- No placeholders remain.
- Scope is focused to one theme-level enhancement pass.
- The portability requirement is explicit and consistent throughout.
- The implementation path is aligned with the existing helper/template architecture.

## Notes

This workspace does not currently appear to be inside a Git repository, so the spec cannot be committed from here unless the project is moved into a repo or Git metadata is restored.
