(function () {
  'use strict';

  var root = document.documentElement;

  function initTheme() {
    var toggle = document.getElementById('theme-toggle');
    var themeColor = document.getElementById('theme-color');
    if (!toggle) return;

    function syncThemeControl() {
      var isDark = root.dataset.theme !== 'light';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      if (themeColor) themeColor.content = isDark ? '#0b0f17' : '#f8fafc';
    }

    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('mj-theme', root.dataset.theme);
      } catch (error) {
        /* Storage optional */
      }
      syncThemeControl();
    });

    syncThemeControl();
  }

  function initStackDiagram() {
    var diagram = document.getElementById('stack-diagram');
    if (!diagram) return;

    var filters = Array.prototype.slice.call(diagram.querySelectorAll('.arch-filter'));
    var nodes = Array.prototype.slice.call(diagram.querySelectorAll('.platform-node'));
    var lanes = Array.prototype.slice.call(diagram.querySelectorAll('.ops-lane'));
    var readoutText = diagram.querySelector('.readout-text');

    var layerDescriptions = {
      all: 'All 6 core platforms active — daily administration across the full stack, with custom development focused in SharePoint, Teams, and ServiceNow.',
      dev: 'Development Focus (3 platforms): SharePoint, Teams, and ServiceNow — site architecture, Flow Designer workflows, Service Catalog builds, and Power Automate.',
      admin: 'Administration & Ticket Operations (6 platforms): Handling day-to-day user support, permissions, governance, and configuration across all six tools.',
      ai: 'Claude Code AI Toolkit (6 platforms): Custom automation scripts for cross-platform reporting, user offboarding, and one-off administrative tasks.'
    };

    function applyLayer(layer) {
      filters.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.layer === layer);
      });

      nodes.forEach(function (node) {
        node.classList.remove('is-selected');
        var roles = (node.dataset.roles || '').split(' ');
        node.classList.toggle('is-dimmed', roles.indexOf(layer) === -1);
      });

      lanes.forEach(function (lane) {
        var roles = (lane.dataset.roles || '').split(' ');
        lane.classList.toggle('is-dimmed', roles.indexOf(layer) === -1);
      });

      if (readoutText && layerDescriptions[layer]) {
        readoutText.textContent = layerDescriptions[layer];
      }
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLayer(btn.dataset.layer || 'all');
      });
    });

    nodes.forEach(function (node) {
      function selectNode() {
        nodes.forEach(function (n) {
          n.classList.remove('is-selected', 'is-dimmed');
        });
        node.classList.add('is-selected');
        var title = node.querySelector('strong') ? node.querySelector('strong').textContent : '';
        var desc = node.dataset.desc || '';
        if (readoutText && desc) {
          readoutText.textContent = title + ': ' + desc;
        }
      }

      node.addEventListener('click', selectNode);
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectNode();
        }
      });
    });
  }

  initTheme();
  initStackDiagram();
})();
