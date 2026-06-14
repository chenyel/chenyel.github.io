import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function createClassList() {
  const values = new Set();
  return {
    add(value) {
      values.add(value);
    },
    remove(value) {
      values.delete(value);
    },
    has(value) {
      return values.has(value);
    },
    contains(value) {
      return values.has(value);
    },
  };
}

test('loader runtime transitions through running, complete, and hidden states', () => {
  const source = readFileSync('D:/blog/themes/argon/source/js/lq-divergence-loader.js', 'utf8');
  const intervals = [];
  const dispatchedEvents = [];

  const digits = [
    { textContent: '0', classList: createClassList() },
    { textContent: '.', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
    { textContent: '0', classList: createClassList() },
  ];
  digits[1].classList.add('lq-divergence-loader__digit--separator');

  const status = { textContent: '' };
  let removed = false;

  const loader = {
    dataset: { loaderState: 'idle' },
    classList: createClassList(),
    querySelectorAll(selector) {
      return selector === '.lq-divergence-loader__digit' ? digits : [];
    },
    querySelector(selector) {
      return selector === '.lq-divergence-loader__status' ? status : null;
    },
    remove() {
      removed = true;
    },
  };

  const documentElement = {
    classList: createClassList(),
  };

  const configNode = {
    textContent: JSON.stringify({
      enabled: true,
      subtitle: '正在接入这片属于我的 signal layer',
      complete_text: 'Signal layer aligned',
      minimum_duration: 0,
      repeat_visit_duration: 0,
      settle_duration: 0,
      complete_hold_duration: 0,
      meter: {
        major_digits: ['0', '1', '2', '3'],
        interval: 90,
        settle_interval: 240,
      },
    }),
  };

  const listeners = {};
  const sessionStorage = {
    values: new Map(),
    getItem(key) {
      return this.values.has(key) ? this.values.get(key) : null;
    },
    setItem(key, value) {
      this.values.set(key, String(value));
    },
  };

  const context = {
    Math,
    JSON,
    Date,
    console,
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    document: {
      readyState: 'loading',
      documentElement,
      getElementById(id) {
        if (id === 'lq-divergence-loader') return loader;
        if (id === 'lq-loader-config') return configNode;
        return null;
      },
    },
    window: {
      sessionStorage,
      setInterval(fn, delay) {
        intervals.push(delay);
        fn();
        return 1;
      },
      clearInterval() {},
      setTimeout(fn) {
        fn();
        return 1;
      },
      dispatchEvent(event) {
        dispatchedEvents.push(event);
      },
      addEventListener(name, fn) {
        listeners[name] = fn;
      },
    },
  };

  vm.createContext(context);
  vm.runInContext(source, context);

  assert.equal(loader.dataset.loaderState, 'running');
  assert.equal(status.textContent, '正在接入这片属于我的 signal layer');
  assert.deepEqual(intervals, [90]);

  listeners.load();

  assert.equal(loader.dataset.loaderState, 'hidden');
  assert.equal(status.textContent, 'Signal layer aligned');
  assert.deepEqual(intervals, [90, 240]);
  assert.equal(documentElement.classList.has('lq-loader-active'), false);
  assert.equal(dispatchedEvents.some(event => event.type === 'lq:loader-hidden'), true);
  assert.equal(removed, true);
});
