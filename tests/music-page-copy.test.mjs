import test from 'node:test'
import assert from 'node:assert/strict'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { withSiteBuildLock } from './helpers/site-build-lock.mjs'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const runSiteBuild = () => {
  execSync(`${npmCommand} run build`, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: 'pipe',
  })
}

const readPublicHtml = relativePath => {
  return readFileSync(path.join(publicDir, ...relativePath.split('/')), 'utf8')
}

test('music page exposes a dual-panel stage and removes transition copy', () => {
  withSiteBuildLock(() => {
    runSiteBuild()
  })

  const html = readPublicHtml('music/index.html')

  assert.match(html, /class=\"lq-music-stage\"/)
  assert.match(html, /class=\"lq-music-stage__player\"/)
  assert.match(html, /class=\"lq-music-stage__lyrics\"/)
  assert.match(html, /data-music-lyrics-stage/)

  assert.doesNotMatch(html, /Fallback Player|Coming Soon|Now Loading/i)
  assert.doesNotMatch(
    html,
    /Music Log|NetEase Ready|Lyrics View|Playlist Switcher|代理接口接入前|作为兜底|先用当前播放器|下方还有兜底播放器|下方保留兜底播放器/i
  )
})
