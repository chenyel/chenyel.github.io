import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function createClassList(initialValues = []) {
  const values = new Set(initialValues);
  return {
    add(...nextValues) {
      nextValues.forEach(value => values.add(value));
    },
    remove(...nextValues) {
      nextValues.forEach(value => values.delete(value));
    },
    has(value) {
      return values.has(value);
    },
    contains(value) {
      return values.has(value);
    },
  };
}

function extractFunction(source, functionName) {
  const start = source.indexOf(`function ${functionName}()`);
  assert.notEqual(start, -1, `Expected to find ${functionName} in argontheme.js`);

  const nextFunctionStart = source.indexOf('\nfunction ', start + 1);
  assert.notEqual(nextFunctionStart, -1, `Expected to find a function boundary after ${functionName}`);

  return source.slice(start, nextFunctionStart);
}

test('hero title motion waits for loader teardown before revealing characters', () => {
  const source = readFileSync('D:/blog/themes/argon/source/argontheme.js', 'utf8');
  const helperSource = extractFunction(source, 'isLqLoaderBlockingMotion');
  const functionSource = extractFunction(source, 'initHeroTitleMotion');
  const listeners = {};

  const titleInner = {
    textContent: '辰烨の博客',
    classList: createClassList(['is-pending-motion']),
    appendedChildren: [],
    setAttribute() {},
    appendChild(node) {
      this.appendedChildren.push(node);
    },
  };

  const subtitle = {
    classList: createClassList(['is-pending-motion']),
  };

  const title = {
    dataset: {},
    getAttribute(name) {
      if (name === 'data-title-motion') return 'chars';
      if (name === 'data-title-motion-interval') return '90';
      if (name === 'data-subtitle-reveal-delay') return '680';
      return '';
    },
    querySelector(selector) {
      if (selector === '.banner-title-inner') return titleInner;
      if (selector === '.banner-subtitle') return subtitle;
      return null;
    },
  };

  const loader = {
    dataset: {
      loaderState: 'running',
    },
  };

  const context = {
    Math,
    Number,
    Array,
    window: {
      addEventListener(name, handler) {
        listeners[name] = handler;
      },
      removeEventListener(name) {
        delete listeners[name];
      },
      setTimeout() {
        return 1;
      },
    },
    document: {
      documentElement: {
        classList: createClassList(['lq-loader-active']),
      },
      querySelector(selector) {
        return selector === '.banner-title[data-title-motion]' ? title : null;
      },
      getElementById(id) {
        return id === 'lq-divergence-loader' ? loader : null;
      },
      createElement() {
        return {
          className: '',
          textContent: '',
          classList: createClassList(),
          setAttribute() {},
        };
      },
    },
    prefersReducedMotion() {
      return false;
    },
    splitGraphemes(text) {
      return Array.from(text);
    },
  };

  vm.createContext(context);
  vm.runInContext(`${helperSource}\n${functionSource}\nthis.initHeroTitleMotion = initHeroTitleMotion;`, context);

  context.initHeroTitleMotion();

  assert.equal(title.dataset.motionReady, undefined);
  assert.equal(titleInner.textContent, '辰烨の博客');
  assert.equal(titleInner.appendedChildren.length, 0);
  assert.equal(typeof listeners['lq:loader-hidden'], 'function');

  context.document.documentElement.classList.remove('lq-loader-active');
  loader.dataset.loaderState = 'hidden';
  listeners['lq:loader-hidden']();

  assert.equal(title.dataset.motionReady, 'true');
  assert.equal(titleInner.textContent, '');
  assert.equal(titleInner.appendedChildren.length, Array.from('辰烨の博客').length);
});
