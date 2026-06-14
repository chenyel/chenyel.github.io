const test = require('node:test');
const assert = require('node:assert/strict');

const { addMacCodeBlockChrome } = require('../themes/argon/scripts/codeblock-macify');

test('adds a mac-style toolbar to Hexo highlight blocks', () => {
  const input = '<figure class="highlight python"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">print(1)</span><br></pre></td></tr></table></figure>';

  const output = addMacCodeBlockChrome(input);

  assert.match(output, /lq-codeblock--mac/);
  assert.match(output, /lq-codeblock-toolbar/);
  assert.match(output, /lq-codeblock-dot--close/);
  assert.match(output, />Python<\/span>/);
});

test('normalizes common language aliases for the toolbar label', () => {
  const input = '<figure class="highlight c++"><table><tr><td class="code"><pre><span class="line">int main() {}</span><br></pre></td></tr></table></figure>';

  const output = addMacCodeBlockChrome(input);

  assert.match(output, />C\+\+<\/span>/);
});

test('leaves non-highlight markup unchanged', () => {
  const input = '<p>plain text</p><pre><code>no transform</code></pre>';

  const output = addMacCodeBlockChrome(input);

  assert.equal(output, input);
});
