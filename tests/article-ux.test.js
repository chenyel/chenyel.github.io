const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getArticleIntroItems,
  getArticleOutroData,
  transformPortableCallouts
} = require('../themes/argon/scripts/article-ux');
const { addMacCodeBlockChrome } = require('../themes/argon/scripts/codeblock-macify');

test('extracts intro rows from front matter fields', () => {
  const result = getArticleIntroItems({
    summary: 'Explain monotonic stack quickly.',
    audience: 'Readers new to monotonic stack.',
    takeaway: 'Know when to use it.'
  });

  assert.deepEqual(result, [
    { label: '这篇讲什么', content: 'Explain monotonic stack quickly.' },
    { label: '适合谁看', content: 'Readers new to monotonic stack.' },
    { label: '读完你会得到', content: 'Know when to use it.' }
  ]);
});

test('returns empty intro rows when front matter fields are missing', () => {
  assert.deepEqual(getArticleIntroItems({}), []);
});

test('transforms labeled portable blockquotes into callout cards', () => {
  const html = '<blockquote><p>提示<br>先判断该找更大值还是更小值。</p></blockquote>';

  const result = transformPortableCallouts(html);

  assert.match(result, /lq-callout/);
  assert.match(result, /lq-callout--tip/);
  assert.match(result, /<div class="lq-callout__title">提示<\/div>/);
  assert.match(result, /先判断该找更大值还是更小值。/);
});

test('transforms paragraph-separated portable blockquotes into callout cards', () => {
  const html = '<blockquote><p>总结</p><p>这一节主要记边界。</p></blockquote>';

  const result = transformPortableCallouts(html);

  assert.match(result, /lq-callout--summary/);
  assert.match(result, /这一节主要记边界。/);
});

test('leaves ordinary blockquotes unchanged', () => {
  const html = '<blockquote><p>普通引用内容</p></blockquote>';

  const result = transformPortableCallouts(html);

  assert.equal(result, html);
});

test('callout transformation does not remove unrelated rendered HTML', () => {
  const html = '<blockquote><p>总结<br>这一节主要记边界。</p></blockquote><figure class="highlight bash"><table><tr><td class="code"><pre><span class="line">echo hi</span><br></pre></td></tr></table></figure>';

  const calloutResult = transformPortableCallouts(html);
  const finalResult = addMacCodeBlockChrome(calloutResult);

  assert.match(finalResult, /lq-callout--summary/);
  assert.match(finalResult, /lq-codeblock-toolbar/);
});

test('extracts outro data when closing fields are present', () => {
  const result = getArticleOutroData({
    closing: '抓住最近边界和单调性就够了。',
    next_reading: '/2026/06/05/algorithm/数字DP/',
    next_reading_title: '接着读：数字 DP'
  });

  assert.deepEqual(result, {
    closing: '抓住最近边界和单调性就够了。',
    nextReadingUrl: '/2026/06/05/algorithm/数字DP/',
    nextReadingTitle: '接着读：数字 DP'
  });
});

test('returns null outro data when no closing fields are present', () => {
  assert.equal(getArticleOutroData({}), null);
});
