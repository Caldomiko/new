(function () {
  'use strict';
  // Linkify casino names based on mapping in casino-links.json

  function normalize(s) {
    return (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function getPref() {
    return (window.CASINO_LINK_PREF || 'goto').toLowerCase();
  }

  function createAnchor(href, text, isExternal) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (isExternal) a.target = '_blank';
    a.className = 'casino-linkified';
    a.setAttribute('data-casino-linkified', 'true');
    return a;
  }

  function linkifyElements(map) {
    var pref = getPref();
    var nodes = document.querySelectorAll('.table-row > div:first-child, .bonus-table .table-row > div:first-child, .table-row > .casino-name, .casino-name');

    nodes.forEach(function (node) {
      if (node.querySelector('a')) return;
      var name = node.textContent.trim();
      var key = normalize(name);
      if (!key) return;

      var entry = null;
      for (var k in map) {
        if (normalize(k) === key) {
          entry = map[k];
          break;
        }
      }
      if (!entry) return;

      var overrideMap = (window.CASINO_LINK_OVERRIDE) || {};
      var ov = overrideMap[entry.slug] || overrideMap[normalize(entry.slug)] || overrideMap[key];
      var href = ov || entry[pref] || entry.goto || entry.obzor || entry.external;
      if (!href) return;

      var isExternal = /^(https?:)?\/\//.test(href);
      var anchor = createAnchor(href, name, isExternal);
      anchor.title = 'Открыть ' + name;
      node.textContent = '';
      node.appendChild(anchor);
      node.setAttribute('data-casino-slug', entry.slug || name);
    });
  }

  function initFromObject(obj) {
    try {
      linkifyElements(obj);
    } catch (e) {
      console.error('linkifyElements failed', e);
    }
  }

  function init() {
    if (window.CASINO_LINKS) {
      initFromObject(window.CASINO_LINKS);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
