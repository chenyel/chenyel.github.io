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

test('music page drops shell sidebars and the floating player while home keeps the player', () => {
  withSiteBuildLock(() => {
    runSiteCommand('clean')
    runSiteCommand('build')
  })

  const musicHtml = readPublicHtml('music/index.html')
  const homeHtml = readPublicHtml('index.html')

  assert.match(musicHtml, /lq-page-shell--music/)
  assert.doesNotMatch(musicHtml, /id="leftbar"/)
  assert.doesNotMatch(musicHtml, /class="lq-rightbar"/)
  assert.doesNotMatch(musicHtml, /class="lq-player\b/)

  assert.match(homeHtml, /class="lq-player\b/)
})
