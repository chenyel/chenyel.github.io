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

test('sidebar calendar shell renders in standard pages with reusable hooks', () => {
  withSiteBuildLock(() => {
    runSiteCommand('clean')
    runSiteCommand('build')
  })

  const homeHtml = readPublicHtml('index.html')
  const aboutHtml = readPublicHtml('about/index.html')

  for (const html of [homeHtml, aboutHtml]) {
    assert.match(html, /lq-calendar-card/)
    assert.match(html, /data-lq-calendar\b/)
    assert.match(html, /data-calendar-title=/)
    assert.match(html, /data-calendar-show-detail=/)
    assert.match(html, /data-calendar-show-navigator=/)
    assert.match(html, /data-calendar-mobile-full=/)
    assert.match(html, /lq-calendar__month-label/)
    assert.match(html, /lq-calendar__weekdays/)
    assert.match(html, /lq-calendar__grid/)
    assert.match(html, /lq-calendar__detail/)
    assert.match(html, /\/assets\/vendor\/lunar\/lunar\.js\?v=/)
    assert.match(html, /\/lq-calendar\.js\?v=/)
  }
})
