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
  assert.match(techMapHtml, /拖拽旋转/)
  assert.match(techMapHtml, /data-tech-search/)
  assert.match(techMapHtml, /data-tech-branch-filter/)
  assert.match(techMapHtml, /data-tech-node-list/)
  assert.match(techMapHtml, /data-tech-reset-view/)
  assert.match(techMapHtml, /data-tech-view-mode/)
  assert.match(techMapHtml, /data-tech-editor-form/)
  assert.match(techMapHtml, /data-tech-bind-file/)
  assert.match(techMapHtml, /lq-tech-constellation-data/)
  assert.match(techMapHtml, /lq-tech-node__initials/)
  assert.match(techMapHtml, /\/assets\/vendor\/three\/three\.min\.js\?v=/)
  assert.match(techMapHtml, /\/lq-tech-constellation\.js\?v=/)
  assert.doesNotMatch(techMapHtml, /id="leftbar"/)
  assert.doesNotMatch(techMapHtml, /class="lq-rightbar"/)

  assert.match(homeHtml, /lq-rightbar-card--tech-map/)
  assert.match(homeHtml, /进入技术星图/)
})
