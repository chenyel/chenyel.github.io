(function () {
	'use strict';

	var doc = document;
	var win = window;
	var root = doc.documentElement;
	var loaderTimer = null;
	var loaderWordlineTimer = null;
	var cursorRaf = null;
	var cursorMoveHandler = null;
	var snowRaf = null;
	var snowResizeHandler = null;

	function parseEffectsConfig() {
		var node = doc.getElementById('lq-effects-config');
		if (!node) return {};
		try {
			return JSON.parse(node.textContent || '{}');
		} catch (error) {
			return {};
		}
	}

	function onReady(callback) {
		if (doc.readyState === 'loading') {
			doc.addEventListener('DOMContentLoaded', callback, { once: true });
			return;
		}
		callback();
	}

	function prefersReducedMotion() {
		return win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function isCoarsePointer() {
		return win.matchMedia && win.matchMedia('(pointer: coarse)').matches;
	}

	function hideLoader(loader, duration) {
		win.clearTimeout(loaderTimer);
		loaderTimer = win.setTimeout(function () {
			loader.classList.add('is-hidden');
			loader.setAttribute('aria-hidden', 'true');
		}, Math.max(0, duration || 0));
	}

	function initLoader(config) {
		var loader = doc.querySelector('.lq-loader');
		if (!loader || !config || config.enabled === false) return;

		win.clearTimeout(loaderTimer);
		win.clearInterval(loaderWordlineTimer);
		loader.classList.remove('is-hidden');
		loader.removeAttribute('aria-hidden');

		var lines = Array.isArray(config.lines) ? config.lines.filter(Boolean) : [];
		var wordline = loader.querySelector('.lq-loader-wordline');
		var lineIndex = 0;

		if (wordline && lines.length > 0) {
			wordline.textContent = lines[0];
		}

		if (wordline && lines.length > 1) {
			loaderWordlineTimer = win.setInterval(function () {
				lineIndex = (lineIndex + 1) % lines.length;
				wordline.textContent = lines[lineIndex];
			}, 1200);
		}

		var visitKey = 'lq-loader-seen';
		var duration = config.minimumDuration || 850;
		try {
			if (win.sessionStorage.getItem(visitKey)) {
				duration = config.repeatVisitDuration || 320;
			} else {
				win.sessionStorage.setItem(visitKey, '1');
			}
		} catch (error) {}

		if (doc.readyState === 'complete') {
			hideLoader(loader, duration);
		} else {
			win.addEventListener('load', function () {
				hideLoader(loader, duration);
			}, { once: true });
		}

		$(doc).on('pjax:send', function () {
			loader.classList.remove('is-hidden');
			loader.removeAttribute('aria-hidden');
		});

		$(doc).on('pjax:complete', function () {
			hideLoader(loader, config.repeatVisitDuration || 220);
		});
	}

	function destroyCursorTrail() {
		var trail = doc.querySelector('.lq-cursor-trail');
		if (trail) trail.innerHTML = '';
		if (cursorRaf) {
			win.cancelAnimationFrame(cursorRaf);
			cursorRaf = null;
		}
		if (cursorMoveHandler) {
			doc.removeEventListener('mousemove', cursorMoveHandler);
			cursorMoveHandler = null;
		}
		root.classList.remove('lq-cursor-on');
	}

	function initCursor(config) {
		var trail = doc.querySelector('.lq-cursor-trail');
		if (!trail || !config || config.enabled === false) return;
		if (config.desktopOnly !== false && isCoarsePointer()) return;
		if (prefersReducedMotion()) return;

		destroyCursorTrail();

		var count = Math.max(4, Number(config.trailCount || 10));
		var size = Math.max(6, Number(config.trailSize || 12));
		var color = config.trailColor || 'rgba(255,255,255,0.72)';
		var dots = [];
		var pointer = { x: win.innerWidth / 2, y: win.innerHeight / 2 };

		root.classList.add('lq-cursor-on');
		root.style.setProperty('--lq-cursor-default-url', 'url("' + (config.defaultCursor || '/img/cursor-default.svg') + '") 4 4, auto');
		root.style.setProperty('--lq-cursor-pointer-url', 'url("' + (config.pointerCursor || '/img/cursor-pointer.svg') + '") 6 2, pointer');
		root.style.setProperty('--lq-trail-size', size + 'px');
		root.style.setProperty('--lq-trail-color', color);

		for (var index = 0; index < count; index += 1) {
			var dot = doc.createElement('span');
			dot.className = 'lq-cursor-dot';
			dot.style.opacity = String(Math.max(0.12, 1 - index / (count + 1)));
			dot.style.transform = 'translate3d(-100px, -100px, 0) scale(' + (1 - index / (count * 1.75)) + ')';
			trail.appendChild(dot);
			dots.push({ element: dot, x: pointer.x, y: pointer.y });
		}

		cursorMoveHandler = function (event) {
			pointer.x = event.clientX;
			pointer.y = event.clientY;
			trail.classList.remove('is-idle');
		};

		doc.addEventListener('mousemove', cursorMoveHandler, { passive: true });

		doc.addEventListener('mouseleave', function () {
			trail.classList.add('is-idle');
		}, { passive: true });

		var animate = function () {
			var x = pointer.x;
			var y = pointer.y;

			for (var i = 0; i < dots.length; i += 1) {
				var current = dots[i];
				current.x += (x - current.x) * 0.32;
				current.y += (y - current.y) * 0.32;
				current.element.style.transform = 'translate3d(' + current.x + 'px, ' + current.y + 'px, 0) translate(-50%, -50%) scale(' + (1 - i / (dots.length * 1.75)) + ')';
				if (dots[i + 1]) {
					x = current.x;
					y = current.y;
				}
			}

			cursorRaf = win.requestAnimationFrame(animate);
		};

		cursorRaf = win.requestAnimationFrame(animate);
	}

	function destroySnow() {
		if (snowRaf) {
			win.cancelAnimationFrame(snowRaf);
			snowRaf = null;
		}
		if (snowResizeHandler) {
			win.removeEventListener('resize', snowResizeHandler);
			snowResizeHandler = null;
		}
	}

	function initSnow(config) {
		var canvas = doc.querySelector('.lq-snow-canvas');
		if (!canvas || !config || config.enabled === false) return;
		if (prefersReducedMotion()) return;

		destroySnow();

		var context = canvas.getContext('2d');
		if (!context) return;

		var count = Math.max(16, Number(config.count || 42));
		var speed = Number(config.speed || 0.85);
		var drift = Number(config.drift || 0.32);
		var maxSize = Number(config.maxSize || 3.2);
		var opacity = Number(config.opacity || 0.78);
		var flakes = [];

		var resetFlake = function (flake, randomY) {
			flake.x = Math.random() * canvas.width;
			flake.y = randomY ? Math.random() * canvas.height : -Math.random() * canvas.height * 0.35;
			flake.radius = Math.max(1, Math.random() * maxSize);
			flake.velocityY = speed * (0.6 + Math.random());
			flake.velocityX = drift * (Math.random() - 0.5);
			flake.alpha = opacity * (0.35 + Math.random() * 0.65);
		};

		var resize = function () {
			canvas.width = win.innerWidth;
			canvas.height = win.innerHeight;
		};

		snowResizeHandler = resize;
		resize();
		win.addEventListener('resize', snowResizeHandler, { passive: true });

		for (var i = 0; i < count; i += 1) {
			var flake = {};
			resetFlake(flake, true);
			flakes.push(flake);
		}

		var draw = function () {
			context.clearRect(0, 0, canvas.width, canvas.height);

			for (var j = 0; j < flakes.length; j += 1) {
				var current = flakes[j];
				current.x += current.velocityX;
				current.y += current.velocityY;

				if (current.y > canvas.height + current.radius || current.x < -24 || current.x > canvas.width + 24) {
					resetFlake(current, false);
				}

				context.beginPath();
				context.arc(current.x, current.y, current.radius, 0, Math.PI * 2);
				context.fillStyle = 'rgba(255,255,255,' + current.alpha.toFixed(3) + ')';
				context.fill();
			}

			snowRaf = win.requestAnimationFrame(draw);
		};

		snowRaf = win.requestAnimationFrame(draw);
	}

	function initEffects() {
		var config = parseEffectsConfig();
		initLoader(config.loader || {});
		initCursor(config.cursor || {});
		initSnow(config.snow || {});
	}

	onReady(initEffects);
	$(doc).on('pjax:complete', initEffects);
})();
