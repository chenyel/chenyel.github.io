import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')

const readPublicHtml = relativePath => {
  return readFileSync(path.join(publicDir, ...relativePath.split('/')), 'utf8')
}

const readPublicCss = () => {
  return readFileSync(path.join(publicDir, 'style.css'), 'utf8')
}

test('home page floating player exposes a playable source or playlist id', () => {
  const html = readPublicHtml('index.html')
  const playlistIdMatch = html.match(/data-playlist-id="([^"]+)"/)
  const hasPlaylistId = Boolean(playlistIdMatch && playlistIdMatch[1].trim())
  const hasInlinePlaylist = !/data-playlist="\[\]"/.test(html)

  assert.match(html, /class="lq-player\b/)
  assert.ok(
    hasInlinePlaylist || hasPlaylistId,
    'Expected the floating player to expose either a non-empty inline playlist or a playlist id fallback.'
  )
  assert.doesNotMatch(html, /class="lq-player[^"]*\bis-empty\b/)
})

test('home page floating player keeps a dedicated visible toggle arrow control', () => {
  const html = readPublicHtml('index.html')

  assert.match(html, /class="lq-player-toggle"/)
  assert.match(html, /class="[^"]*\blq-player-toggle__icon\b[^"]*"/)
  assert.match(html, /class="[^"]*\bfa-angle-right\b[^"]*\blq-player-toggle__icon\b[^"]*"/)
})

test('home page floating player collapsed state keeps a slim reveal and scales as one unit', () => {
  const css = readPublicCss()

  assert.match(css, /--lq-player-collapsed-reveal:\s*\d+px/)
  assert.match(css, /\.lq-player\.is-collapsed\{transform:scale\(/)
  assert.match(
    css,
    /\.lq-player\.is-collapsed \.lq-player-panel\{transform:translateX\(calc\(100% - var\(--lq-player-collapsed-reveal\)\)\) scale\(var\(--lq-player-panel-collapsed-scale\)\)\}/
  )
})

test('home page floating player ships the signal HUD shell styles', () => {
  const css = readPublicCss()

  assert.match(css, /--lq-player-hud-glow:/)
  assert.match(css, /--lq-player-hud-grid:/)
  assert.match(css, /\.lq-player-panel::before\{/)
  assert.match(css, /\.lq-player-progress-wrap\{[^}]*overflow:hidden/)
})
