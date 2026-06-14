import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const publicDir = path.join(process.cwd(), 'public')

const readPublicFile = relativePath => {
  return readFileSync(path.join(publicDir, ...relativePath.split('/')), 'utf8')
}

test('shuoshuonian posts render dedicated album cards across list, archive, and detail views', () => {
  const listHtml = readPublicFile('tags/碎碎念/index.html')
  const archiveHtml = readPublicFile('archives/index.html')
  const detailHtml = readPublicFile('2025/02/07/2025-2-7-01/index.html')
  const css = readPublicFile('style.css')

  assert.match(listHtml, /lq-shuoshuonian-card/)
  assert.match(listHtml, /lq-shuoshuonian-card__media/)
  assert.match(listHtml, /img\/background1\.png/)
  assert.match(archiveHtml, /lq-shuoshuonian-archive-card/)
  assert.match(detailHtml, /lq-shuoshuonian-article/)
  assert.match(css, /lq-shuoshuonian-card__media/)
  assert.match(css, /aspect-ratio:\s*16\s*\/\s*10/)
  assert.match(css, /lq-shuoshuonian-archive-card/)
})
