const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('mac code block theme defines syntax token colors', () => {
  const cssPath = path.join(__dirname, '..', 'themes', 'argon', 'source', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /lq-codeblock--mac \.comment/);
  assert.match(css, /lq-codeblock--mac \.keyword/);
  assert.match(css, /lq-codeblock--mac \.string/);
  assert.match(css, /lq-codeblock--mac \.number/);
  assert.match(css, /lq-codeblock--mac \.built_in/);
});
