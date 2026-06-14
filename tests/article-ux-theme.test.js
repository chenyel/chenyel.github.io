const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('article ux theme defines intro, callout, and outro styles', () => {
  const cssPath = path.join(__dirname, '..', 'themes', 'argon', 'source', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /\.lq-article-intro\b/);
  assert.match(css, /\.lq-callout--tip\b/);
  assert.match(css, /\.lq-callout--warning\b/);
  assert.match(css, /\.lq-article-outro\b/);
});
