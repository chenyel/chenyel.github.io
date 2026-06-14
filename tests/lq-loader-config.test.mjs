import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  DEFAULT_LOADER_CONFIG,
  buildLoaderConfig,
  normalizeLoaderPath,
} = require('../themes/argon/scripts/lq-loader-config.js');

test('normalizeLoaderPath collapses slashes and index routes', () => {
  assert.equal(normalizeLoaderPath('/about'), '/about');
  assert.equal(normalizeLoaderPath('/about/'), '/about');
  assert.equal(normalizeLoaderPath('about/index.html'), '/about');
  assert.equal(normalizeLoaderPath('/'), '/');
});

test('buildLoaderConfig merges global config, path overrides, and front-matter overrides in order', () => {
  const config = buildLoaderConfig({
    theme: {
      show_lq_loader: true,
      lq_loader: {
        brand: 'Global Brand',
        title: 'Global Title',
        subtitle: 'Global Subtitle',
        palette: {
          accent: '#77e7f1',
          backdrop: '#050a12',
        },
        meter: {
          interval: 190,
        },
        overrides: {
          '/about': {
            title: 'About Override',
            subtitle: 'About Subtitle',
            palette: {
              accent: '#99f6ff',
            },
          },
        },
      },
    },
    entry: {
      path: 'about/index.html',
      lq_loader: {
        title: 'Front Matter Title',
        complete_text: 'Archive synchronized',
      },
    },
  });

  assert.equal(config.enabled, true);
  assert.equal(config.title, 'Front Matter Title');
  assert.equal(config.subtitle, 'About Subtitle');
  assert.equal(config.complete_text, 'Archive synchronized');
  assert.equal(config.palette.accent, '#99f6ff');
  assert.equal(config.palette.backdrop, '#050a12');
  assert.equal(config.meter.interval, 190);
  assert.equal(config.mode, DEFAULT_LOADER_CONFIG.mode);
});

test('buildLoaderConfig disables the component when the global switch is off', () => {
  const config = buildLoaderConfig({
    theme: {
      show_lq_loader: false,
      lq_loader: {
        title: 'Disabled loader',
      },
    },
    entry: {
      path: 'index.html',
    },
  });

  assert.equal(config.enabled, false);
});
