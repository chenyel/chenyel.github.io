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
