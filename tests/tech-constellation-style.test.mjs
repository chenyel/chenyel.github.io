import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const stylePath = new URL('../themes/argon/source/style.css', import.meta.url)

test('tech constellation stylesheet contains page, node, mini-entry, enhanced, and responsive selectors', async () => {
  const css = await readFile(stylePath, 'utf8')

  const requiredSnippets = [
    '.lq-shell--tech-map',
    '.lq-page-shell--tech-map .lq-main-column',
    '.lq-page-shell--tech-map .page-information-card-container',
    '.lq-tech-constellation-page {',
    '.lq-tech-constellation-page.lq-page-card',
    '.lq-tech-constellation__stage {',
    '.lq-tech-constellation__stage-hint',
    '.lq-tech-constellation__toolbar',
    '.lq-tech-constellation__search',
    '.lq-tech-constellation__filters',
    '.lq-tech-node-list',
    '.lq-tech-view-switcher',
    '.lq-tech-editor',
    '[data-tech-view-mode="overview"]',
    '[data-tech-view-mode="edit"]',
    '.lq-tech-constellation__canvas {',
    '.lq-tech-constellation__overlay {',
    '.lq-tech-constellation__fallback {',
    '.lq-tech-node {',
    '.lq-tech-node__initials',
    '.lq-tech-node--floating',
    '.lq-tech-constellation__detail.is-sticky',
    '.lq-tech-constellation__stage.is-dragging',
    '.is-muted',
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
