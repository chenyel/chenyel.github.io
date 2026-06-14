import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function buildSite() {
  execSync('npm run clean', { cwd: 'D:/blog', stdio: 'pipe', shell: true });
  execSync('npm run build', { cwd: 'D:/blog', stdio: 'pipe', shell: true });
}

test('generated home page includes divergence loader markup and runtime config', () => {
  buildSite();

  const html = readFileSync('D:/blog/public/index.html', 'utf8');

  assert.match(html, /id="lq-divergence-loader"/);
  assert.match(html, /class="lq-divergence-loader__meter"/);
  assert.match(html, /class="lq-divergence-loader__status"/);
  assert.match(html, /id="lq-loader-config"/);
  assert.match(html, /Entering Signal Layer/);
  assert.match(html, /正在接入这片属于我的 signal layer/);
  assert.match(html, /Signal layer aligned/);
});

test('generated home page links the divergence loader stylesheet', () => {
  const html = readFileSync('D:/blog/public/index.html', 'utf8');
  assert.match(html, /href="\/css\/lq-divergence-loader\.css"/);
});

test('generated home page links the divergence loader script', () => {
  const html = readFileSync('D:/blog/public/index.html', 'utf8');
  assert.match(html, /src="\/js\/lq-divergence-loader\.js\?v=/);
});
