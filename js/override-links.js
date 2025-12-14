(function () {
  'use strict';

  function normalize(v) {
    return (v || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function getSlugFromHref(href) {
    var match = /(?:^|\/)goto\/([^?#]+)\.html/i.exec(href || '');
    return match ? match[1] : null;
  }

  function pickOverride(slug) {
    if (!slug) return null;
    var map = window.CASINO_LINK_OVERRIDE || {};
    var norm = normalize(slug);
    if (map[slug]) return map[slug];
    if (map[norm]) return map[norm];
    for (var key in map) {
      if (normalize(key) === norm) return map[key];
    }
    return null;
  }

  function applyOverrides() {
    var anchors = document.querySelectorAll('a[href]');
    anchors.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var slug = a.getAttribute('data-casino-slug') || getSlugFromHref(href);
      var url = pickOverride(slug);
      if (!url) return;
      a.setAttribute('href', url);
      if (!a.target) a.setAttribute('target', '_blank');
      a.setAttribute('data-link-overridden', 'true');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyOverrides);
  } else {
    applyOverrides();
  }
})();
