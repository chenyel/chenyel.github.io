# Floating Player Signal HUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the bottom-right floating music player into a mid-strength Signal HUD panel without changing its current size tier, collapsed-handle interaction, or playback data flow.

**Architecture:** Keep the existing floating player markup and logic intact, then layer the redesign through focused CSS updates plus only minimal template hooks if styling needs cleaner selectors. Protect the redesign with generated-shell regression tests that assert the new HUD shell characteristics in built HTML/CSS.

**Tech Stack:** Hexo, EJS templates, sitewide CSS, Node built-in test runner

---

## File Map

- Modify: `D:\blog\themes\argon\source\style.css`
  Responsibility: floating player visual shell, HUD tokens, collapsed-handle continuity, responsive behavior.
- Modify: `D:\blog\themes\argon\layout\_partial\lq-player.ejs`
  Responsibility: minimal structural hooks only if the HUD skin needs explicit elements or classes.
- Modify: `D:\blog\tests\floating-player-shell.test.mjs`
  Responsibility: regression coverage for generated HUD shell behavior.
- Read/verify: `D:\blog\public\index.html`, `D:\blog\public\style.css`
  Responsibility: built artifacts used by shell tests.

## Task 1: Lock the HUD shell in tests

**Files:**
- Modify: `D:\blog\tests\floating-player-shell.test.mjs`
- Read: `D:\blog\public\style.css`

- [ ] **Step 1: Write the failing test**

Add a new test that asserts the built CSS contains the new HUD design tokens and structural shell cues:

```js
test('home page floating player ships the signal HUD shell styles', () => {
  const css = readPublicCss()

  assert.match(css, /--lq-player-hud-glow:/)
  assert.match(css, /--lq-player-hud-grid:/)
  assert.match(css, /\.lq-player-panel::before/)
  assert.match(css, /\.lq-player-progress-wrap\{[^}]*overflow:hidden/)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests\\floating-player-shell.test.mjs`

Expected: FAIL because the current built CSS does not yet expose the new Signal HUD shell tokens/selectors.

- [ ] **Step 3: Keep the existing player behavior assertions intact**

Do not remove the current tests for:

```js
test('home page floating player exposes a playable source or playlist id', ...)
test('home page floating player keeps a dedicated visible toggle arrow control', ...)
test('home page floating player collapsed state keeps a slim reveal and scales as one unit', ...)
```

- [ ] **Step 4: Re-run after implementation**

Run the same test command again after style changes.

Expected: PASS with all floating-player shell tests green.

## Task 2: Implement the Signal HUD skin

**Files:**
- Modify: `D:\blog\themes\argon\source\style.css`
- Modify only if needed: `D:\blog\themes\argon\layout\_partial\lq-player.ejs`

- [ ] **Step 1: Add HUD design tokens to the floating player root**

Extend `.lq-player` with explicit tokens for:

```css
--lq-player-hud-glow
--lq-player-hud-glow-soft
--lq-player-hud-grid
--lq-player-panel-border
--lq-player-progress-energy
```

These should derive from the site theme color and a restrained cool signal tint.

- [ ] **Step 2: Upgrade the panel body into a layered HUD surface**

Enhance `.lq-player-panel` with:

```css
background: linear-gradient(...), rgba(...);
border: 1px solid var(--lq-player-panel-border);
box-shadow: ... var(--lq-player-hud-glow-soft);
overflow: hidden;
position: relative;
isolation: isolate;
```

Add pseudo-elements for subtle grid/highlight treatment:

```css
.lq-player-panel::before { ... }
.lq-player-panel::after { ... }
```

The effect should stay low-contrast and avoid strong animated scanlines.

- [ ] **Step 3: Upgrade the cover, controls, and progress strip**

Restyle:

```css
.lq-player-cover
.lq-player-cover img
.lq-player-play
.lq-player-prev, .lq-player-next
.lq-player-progress-wrap
.lq-player-progress
.lq-player-status
```

Required outcomes:
- cover reads like a module bay
- play button is the visual core
- prev/next feel secondary
- progress area reads like an energy channel
- text hierarchy feels like HUD status lines

- [ ] **Step 4: Preserve collapsed-handle continuity**

Keep the current collapsed reveal behavior and arrow handle, while visually blending the toggle into the same HUD surface:

```css
.lq-player-toggle
.lq-player.is-collapsed .lq-player-toggle__icon
```

Do not remove the handle or reintroduce a detached button look.

- [ ] **Step 5: Only add template hooks if CSS alone is insufficient**

If the HUD skin needs more precise styling anchors, add a minimal class or wrapper in `D:\blog\themes\argon\layout\_partial\lq-player.ejs`. Otherwise leave the markup structure unchanged.

## Task 3: Build and verify

**Files:**
- Read: `D:\blog\public\index.html`
- Read: `D:\blog\public\style.css`

- [ ] **Step 1: Build fresh artifacts**

Run: `npm run build`

Expected: exit code `0` and regenerated `public/index.html` / `public/style.css`.

- [ ] **Step 2: Verify the floating player shell regression tests**

Run: `node --test tests\\floating-player-shell.test.mjs`

Expected: PASS with all four subtests green.

- [ ] **Step 3: Verify the shared music page shell still passes**

Run: `node --test tests\\music-page-shell.test.mjs`

Expected: PASS so the floating player redesign does not regress the page-level player rules.

- [ ] **Step 4: Spot-check the generated shell cues**

Use built artifacts to confirm:

```txt
public/index.html contains class="lq-player"
public/style.css contains --lq-player-hud-glow
public/style.css contains .lq-player-panel::before
```

## Self-Review

- Spec coverage: this plan covers the approved direction for Signal HUD look, restrained motion, preserved collapsed handle, and non-disruptive implementation boundaries.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: selectors and test token names are consistent across tasks.
