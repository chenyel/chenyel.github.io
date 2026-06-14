import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const publicDir = path.join(process.cwd(), 'public')

const readPublicFile = relativePath => {
  const filePath = path.join(publicDir, ...relativePath.split('/'))
  assert.ok(fs.existsSync(filePath), `Expected generated file to exist: ${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

const readRequiredDataAttr = (html, attributeName) => {
  const match = html.match(new RegExp(`${attributeName}="([^"]+)"`))
  assert.ok(match, `Expected ${attributeName} to be present`)
  const value = match[1].trim()
  assert.notEqual(value, '', `Expected ${attributeName} to be non-empty`)
  return value
}

test('home page uses the immersive three-column shell', () => {
  const html = readPublicFile('index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-shell/)
  assert.match(html, /lq-home-shell/)
  assert.match(html, /lq-left-column/)
  assert.match(html, /lq-right-column/)
  assert.match(html, /lq-home-hero/)
  assert.match(css, /min-height:\s*100(?:d)?vh/)
  assert.match(css, /lq-home-shell/)
  assert.match(css, /position:\s*fixed/)
  assert.match(html, /lq-search-trigger/)
  assert.match(html, /lq-player/)
  assert.match(html, /data-autoplay="true"/)
  assert.match(html, /lq-live2d/)
  assert.match(html, /data-playlist=/)
  assert.match(html, /lq-player-prev/)
  assert.match(html, /lq-player-next/)
  assert.match(html, /lq-rightbar-card--links/)
  assert.match(html, /lq-rightbar-card--recent/)
  assert.match(html, /lq-nav-item__glyph/)
  assert.match(html, /lq-loader/)
  assert.match(html, /lq-divergence-loader__panel/)
  assert.match(html, /lq-snow-canvas/)
  assert.match(html, /lq-cursor-trail/)
  assert.match(html, /lq-live2d-host|live2dw\//)
})

test('home hero renders motion configuration hooks', () => {
  const html = readPublicFile('index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /data-title-motion=/)
  assert.match(html, /data-title-motion-interval=/)
  assert.match(html, /data-subtitle-reveal-delay=/)
  assert.match(css, /lq-title-char/)
  assert.match(css, /\.lq-title-char\.is-in[\s\S]*animation\s*:/)
})

test('layout exposes tab title blur and focus copy', () => {
  const homeHtml = readPublicFile('index.html')
  const aboutHtml = readPublicFile('about/index.html')

  for (const html of [homeHtml, aboutHtml]) {
    const blurTitle = readRequiredDataAttr(html, 'data-tab-blur-title')
    const focusTitle = readRequiredDataAttr(html, 'data-tab-focus-title')

    assert.notEqual(blurTitle, focusTitle, 'Expected blur and focus titles to be distinct')
  }
})

test('music page renders the immersive music layout shell', () => {
  const html = readPublicFile('music/index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-music-page/)
  assert.match(html, /lq-music-hero/)
  assert.match(html, /lq-music-playlists/)
  assert.match(html, /data-music-api-base=/)
  assert.match(html, /data-lq-music-state\b/)
  assert.match(html, /data-music-tab="playlist"/)
  assert.match(html, /data-music-tab="queue"/)
  assert.match(html, /data-music-panel="playlist"/)
  assert.match(html, /data-music-panel="queue"/)
  assert.match(html, /data-music-audio\b/)
  assert.match(html, /data-music-progress\b/)
  assert.match(html, /data-music-action="prev"/)
  assert.match(html, /data-music-action="toggle"/)
  assert.match(html, /data-music-action="next"/)
  assert.match(html, /lq-music-lyrics/)
  assert.match(html, /lq-music-tracklist/)
  assert.match(css, /lq-music-tabs/)
  assert.match(css, /lq-music-lyrics__line/)
  assert.match(css, /lq-music-control--primary/)
  assert.match(css, /lq-music-card/)
})

test('post page keeps the same shell and article card wrapper', () => {
  const html = readPublicFile('2026/06/02/hello-world/index.html')

  assert.match(html, /lq-shell/)
  assert.match(html, /lq-article-card/)
  assert.match(html, /lq-comment-shell/)
  assert.match(html, /lq-right-column/)
  assert.match(html, /lq-player/)
  assert.match(html, /lq-live2d/)
  assert.match(html, /data-playlist=/)
})

test('standalone pages render inside the unified shell', () => {
  const html = readPublicFile('about/index.html')

  assert.match(html, /lq-shell/)
  assert.match(html, /lq-page-card/)
  assert.match(html, /lq-right-column/)
})

test('page-type heroes use distinct configured backgrounds', () => {
  const homeHtml = readPublicFile('index.html')
  const archiveHtml = readPublicFile('archives/index.html')
  const categoryHtml = readPublicFile('categories/index.html')
  const aboutHtml = readPublicFile('about/index.html')

  assert.match(homeHtml, /--lq-hero-image:url\('\/img\/home_img\.png'\)/)
  assert.match(archiveHtml, /--lq-hero-image:url\('\/img\/archive_img\.png'\)/)
  assert.match(categoryHtml, /--lq-hero-image:url\('\/img\/category_img\.png'\)/)
  assert.match(aboutHtml, /--lq-hero-image:url\('\/img\/default_top_img\.png'\)/)
})

test('tags landing page renders as an interactive tech tree', () => {
  const html = readPublicFile('tags/index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-tag-tree-page/)
  assert.match(html, /data-tag-tree/)
  assert.match(html, /lq-tag-leaf/)
  assert.match(html, /lq-tag-tree-detail/)
  assert.match(html, /lq-tag-tree-data/)
  assert.match(css, /lq-tag-tree-page/)
  assert.match(css, /lq-tag-leaf:hover/)
  assert.match(css, /lq-tag-tree-detail/)
})

test('live2d assistant dock renders hover actions and compact avatar state', () => {
  const html = readPublicFile('index.html')
  const css = readPublicFile('style.css')

  assert.match(html, /lq-live2d-dock/)
  assert.match(html, /lq-live2d-actions/)
  assert.match(html, /data-live2d-action="theme"/)
  assert.match(html, /data-live2d-action="home"/)
  assert.match(html, /data-live2d-action="top"/)
  assert.match(html, /data-live2d-action="compact"/)
  assert.match(html, /lq-live2d-avatar/)
  assert.match(html, /data-live2d-bubble/)

  assert.match(css, /lq-live2d-actions/)
  assert.match(css, /lq-live2d-dock:hover \.lq-live2d-actions/)
  assert.match(css, /lq-live2d\.is-compact/)
  assert.doesNotMatch(css, /lq-live2d--widget \.lq-live2d-host script/)
})

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
