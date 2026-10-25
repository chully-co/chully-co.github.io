(function () {
  'use strict';

  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initTheme() {
    var toggle = document.getElementById('theme-toggle');
    var themeColor = document.getElementById('theme-color');
    if (!toggle) return;

    function syncThemeControl() {
      var isDark = root.dataset.theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      if (themeColor) themeColor.content = isDark ? '#111713' : '#f5f2eb';
    }

    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('mj-theme', root.dataset.theme); } catch (error) { /* Storage is optional. */ }
      syncThemeControl();
    });

    syncThemeControl();
  }

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function updateHeader() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function initReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px' });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initPrintButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (button) {
      button.addEventListener('click', function () { window.print(); });
    });
  }

  function initSystemsMap() {
    var network = document.getElementById('systems-network');
    if (!network) return;

    if (motionQuery.matches || !window.requestAnimationFrame) return;

    var nodeElements = Array.prototype.slice.call(network.querySelectorAll('[data-x][data-y]'));
    var linkElements = Array.prototype.slice.call(network.querySelectorAll('[data-target]'));
    if (!nodeElements.length || !linkElements.length) return;

    var nodes = nodeElements.map(function (element) {
      return {
        id: element.id,
        element: element,
        x: Number(element.dataset.x),
        y: Number(element.dataset.y),
        depth: Number(element.dataset.depth) || 10,
        phase: Number(element.dataset.phase) || 0,
        currentX: Number(element.dataset.x),
        currentY: Number(element.dataset.y)
      };
    });

    var positions = Object.create(null);
    var pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    var width = network.clientWidth || 1;
    var height = network.clientHeight || 1;
    var frame = null;
    var visible = true;

    network.classList.add('is-interactive');

    function updateSize() {
      width = network.clientWidth || 1;
      height = network.clientHeight || 1;
    }

    function connectionPath(hub, target) {
      var deltaX = target.currentX - hub.currentX;
      var deltaY = target.currentY - hub.currentY;
      var controlX = (hub.currentX + target.currentX) / 2 + deltaY * 0.09;
      var controlY = (hub.currentY + target.currentY) / 2 - deltaX * 0.09;
      return 'M' + hub.currentX.toFixed(3) + ' ' + hub.currentY.toFixed(3) +
        ' Q' + controlX.toFixed(3) + ' ' + controlY.toFixed(3) +
        ' ' + target.currentX.toFixed(3) + ' ' + target.currentY.toFixed(3);
    }

    function render(time) {
      frame = null;
      pointer.x += (pointer.targetX - pointer.x) * 0.065;
      pointer.y += (pointer.targetY - pointer.y) * 0.065;

      nodes.forEach(function (node) {
        var driftX = Math.sin(time * 0.00042 + node.phase) * 2.1;
        var driftY = Math.cos(time * 0.00036 + node.phase) * 1.7;
        var offsetX = pointer.x * node.depth + driftX;
        var offsetY = pointer.y * node.depth + driftY;

        node.currentX = node.x + (offsetX / width) * 100;
        node.currentY = node.y + (offsetY / height) * 100;
        positions[node.id] = node;
        node.element.style.transform = 'translate(-50%, -50%) translate3d(' +
          offsetX.toFixed(2) + 'px,' + offsetY.toFixed(2) + 'px,0)';
      });

      var hub = positions['node-hub'];
      if (hub) {
        linkElements.forEach(function (link) {
          var target = positions[link.dataset.target];
          if (target) link.setAttribute('d', connectionPath(hub, target));
        });
      }

      if (visible && !document.hidden) frame = window.requestAnimationFrame(render);
    }

    function start() {
      if (frame === null && visible && !document.hidden) frame = window.requestAnimationFrame(render);
    }

    function stop() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
    }

    network.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      var bounds = network.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    }, { passive: true });

    network.addEventListener('pointerleave', function () {
      pointer.targetX = 0;
      pointer.targetY = 0;
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { rootMargin: '100px' });
      visibilityObserver.observe(network);
    }

    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(network);
    } else {
      window.addEventListener('resize', updateSize, { passive: true });
    }

    updateSize();
    start();
  }

  initTheme();
  initHeader();
  initReveals();
  initPrintButtons();
  initSystemsMap();
})();
