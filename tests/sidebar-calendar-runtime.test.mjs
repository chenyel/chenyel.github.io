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
