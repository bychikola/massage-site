/* ============================================================
   Чистые функции системы движения (редизайн).
   Без DOM — тестируются в Node. Стиль: UMD, как booking.js.
   ============================================================ */
(function (global) {
  "use strict";

  var DESKTOP_MIN_WIDTH = 901;
  var PARTICLES_DESKTOP = 7;
  var PARALLAX_LIMIT_PX = 80;

  function effectsConfig(opts) {
    var o = opts || {};
    var reducedMotion = !!o.reducedMotion;
    var coarsePointer = !!o.coarsePointer;
    var viewportWidth = typeof o.viewportWidth === "number" ? o.viewportWidth : 0;
    var desktop = viewportWidth >= DESKTOP_MIN_WIDTH;
    return {
      particles: !reducedMotion && desktop && !coarsePointer,
      parallax: !reducedMotion && desktop,
      stagger: !reducedMotion,
      countUp: !reducedMotion
    };
  }

  function staggerDelayMs(index, baseMs, capMs) {
    var base = typeof baseMs === "number" ? baseMs : 60;
    var cap = typeof capMs === "number" ? capMs : 500;
    var i = Math.max(0, Number(index) || 0);
    return Math.min(i * base, cap);
  }

  function easedProgress(p) {
    var t = Math.max(0, Math.min(1, Number(p) || 0));
    return 1 - Math.pow(1 - t, 3);
  }

  function particleCountFor(viewportWidth) {
    return viewportWidth >= DESKTOP_MIN_WIDTH ? PARTICLES_DESKTOP : 0;
  }

  function parallaxShiftPx(scrollY, factor) {
    var f = typeof factor === "number" ? factor : 0.2;
    var shift = scrollY * f;
    return Math.max(-PARALLAX_LIMIT_PX, Math.min(PARALLAX_LIMIT_PX, shift));
  }

  var Motion = {
    DESKTOP_MIN_WIDTH: DESKTOP_MIN_WIDTH,
    effectsConfig: effectsConfig,
    staggerDelayMs: staggerDelayMs,
    easedProgress: easedProgress,
    particleCountFor: particleCountFor,
    parallaxShiftPx: parallaxShiftPx
  };

  global.Motion = Motion;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Motion;
  }
})(typeof window !== "undefined" ? window : globalThis);
