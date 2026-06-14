(function () {
  const loader = document.getElementById('lq-divergence-loader');
  const configNode = document.getElementById('lq-loader-config');
  const html = document.documentElement;

  if (!loader || !configNode || !html) {
    return;
  }

  const config = JSON.parse(configNode.textContent || '{}');
  if (config.enabled === false) {
    loader.remove();
    return;
  }

  const status = loader.querySelector('.lq-divergence-loader__status');
  const digits = Array.from(loader.querySelectorAll('.lq-divergence-loader__digit')).filter((node) => {
    return !(node.classList && node.classList.contains('lq-divergence-loader__digit--separator'));
  });
  const pool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const majorPool = (config.meter && config.meter.major_digits) || ['0', '1', '2', '3'];
  const interval = Number((config.meter && config.meter.interval) || 180);
  const settleInterval = Number((config.meter && config.meter.settle_interval) || Math.max(interval * 2, 180));
  const minimumDuration = Number(config.minimum_duration || 0);
  const completeHoldDuration = Number(config.complete_hold_duration || 420);
  const settleDuration = Number(config.settle_duration || 0);
  const repeatVisitDuration = Number(config.repeat_visit_duration || minimumDuration);
  const sessionStorageRef = window.sessionStorage || null;
  const hasVisited = sessionStorageRef && sessionStorageRef.getItem('lq-loader-visited') === '1';
  const gateDuration = hasVisited ? repeatVisitDuration : minimumDuration;
  const startedAt = Date.now();
  let finishedLoading = false;
  let ticker = null;

  function randomOf(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function tick() {
    digits.forEach((digit, index) => {
      digit.textContent = index === 0 ? randomOf(majorPool) : randomOf(pool);
    });
  }

  function startTicker(nextInterval) {
    if (ticker !== null) {
      window.clearInterval(ticker);
    }
    ticker = window.setInterval(tick, nextInterval);
  }

  function setState(nextState) {
    loader.dataset.loaderState = nextState;
  }

  function hideLoader() {
    if (ticker !== null) {
      window.clearInterval(ticker);
    }
    setState('hidden');
    loader.classList.add('is-hidden');
    html.classList.remove('lq-loader-active');
    if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('lq:loader-hidden', {
        detail: {
          state: 'hidden'
        }
      }));
    }
    window.setTimeout(() => {
      loader.remove();
    }, 420);
  }

  function completeLoader() {
    if (loader.dataset.loaderState === 'complete' || loader.dataset.loaderState === 'hidden') {
      return;
    }
    if (ticker !== null) {
      window.clearInterval(ticker);
    }
    setState('complete');
    if (status) {
      status.textContent = config.complete_text || 'Archive synchronized';
    }
    if (sessionStorageRef) {
      sessionStorageRef.setItem('lq-loader-visited', '1');
    }
    window.setTimeout(hideLoader, completeHoldDuration);
  }

  function beginSettling() {
    if (loader.dataset.loaderState === 'complete' || loader.dataset.loaderState === 'hidden') {
      return;
    }
    setState('settling');
    startTicker(settleInterval);
    window.setTimeout(completeLoader, settleDuration);
  }

  function tryFinish() {
    if (!finishedLoading) {
      return;
    }
    const wait = Math.max(gateDuration - (Date.now() - startedAt), 0);
    window.setTimeout(beginSettling, wait);
  }

  html.classList.add('lq-loader-active');
  setState('running');
  if (status) {
    status.textContent = config.subtitle || '正在接入这片属于我的 signal layer';
  }
  tick();
  startTicker(interval);

  if (document.readyState === 'complete') {
    finishedLoading = true;
    tryFinish();
  } else {
    window.addEventListener('load', function () {
      finishedLoading = true;
      tryFinish();
    }, { once: true });
  }
})();
