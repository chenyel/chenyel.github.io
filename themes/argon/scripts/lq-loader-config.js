const DEFAULT_LOADER_CONFIG = {
  enabled: true,
  mode: 'divergence',
  scope: 'site',
  minimum_duration: 900,
  repeat_visit_duration: 320,
  settle_duration: 260,
  complete_hold_duration: 520,
  brand: 'CHENYE ARCHIVE',
  title: 'Entering Signal Layer',
  subtitle: '正在接入这片属于我的 signal layer',
  complete_text: 'Signal layer aligned',
  palette: {
    accent: '#a7f6ff',
    accent_soft: 'rgba(167, 246, 255, 0.26)',
    backdrop: '#050b14',
    line: 'rgba(167, 246, 255, 0.24)',
    text: '#f4fdff',
  },
  meter: {
    major_digits: ['0', '1', '2', '3'],
    digits: 6,
    interval: 90,
    settle_interval: 240,
    decimal_separator: '.',
  },
  overrides: {},
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneDeep(value) {
  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneDeep(item)]));
  }
  return value;
}

function mergeDeep(base, patch) {
  const next = cloneDeep(base);
  if (!isPlainObject(patch)) {
    return next;
  }

  Object.entries(patch).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(next[key])) {
      next[key] = mergeDeep(next[key], value);
      return;
    }
    next[key] = cloneDeep(value);
  });

  return next;
}

function normalizeLoaderPath(input = '') {
  const value = String(input || '').trim().replace(/\\/g, '/');
  if (!value || value === 'index.html' || value === '/index.html') {
    return '/';
  }

  const withSlash = value.startsWith('/') ? value : `/${value}`;
  const withoutIndex = withSlash.replace(/\/index\.html$/, '');
  const compacted = withoutIndex.replace(/\/+$/, '');
  return compacted || '/';
}

function pickPathOverride(overrides, inputPath) {
  if (!isPlainObject(overrides)) {
    return {};
  }

  const normalizedPath = normalizeLoaderPath(inputPath);
  return Object.entries(overrides).reduce((match, [key, value]) => {
    return normalizeLoaderPath(key) === normalizedPath ? value : match;
  }, {});
}

function buildLoaderConfig({ theme = {}, entry = {} } = {}) {
  const rootConfig = mergeDeep(DEFAULT_LOADER_CONFIG, theme.lq_loader || {});
  const pathOverride = pickPathOverride(rootConfig.overrides, entry.path);
  const frontMatterOverride = isPlainObject(entry.lq_loader) ? entry.lq_loader : {};
  const merged = mergeDeep(mergeDeep(rootConfig, pathOverride), frontMatterOverride);

  merged.enabled = theme.show_lq_loader !== false && merged.enabled !== false;
  merged.current_path = normalizeLoaderPath(entry.path || '/');
  return merged;
}

module.exports = {
  DEFAULT_LOADER_CONFIG,
  buildLoaderConfig,
  mergeDeep,
  normalizeLoaderPath,
};
