import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Motion = require("../js/motion.js");

test("effectsConfig: reduced-motion выключает всё", () => {
  assert.deepEqual(
    Motion.effectsConfig({ reducedMotion: true, coarsePointer: false, viewportWidth: 1440 }),
    { particles: false, parallax: false, stagger: false, countUp: false }
  );
});

test("effectsConfig: десктоп (1440, мышь) — включено всё", () => {
  assert.deepEqual(
    Motion.effectsConfig({ reducedMotion: false, coarsePointer: false, viewportWidth: 1440 }),
    { particles: true, parallax: true, stagger: true, countUp: true }
  );
});

test("effectsConfig: мобильный (375, тач) — частицы и параллакс выключены, каскад/докрутка работают", () => {
  assert.deepEqual(
    Motion.effectsConfig({ reducedMotion: false, coarsePointer: true, viewportWidth: 375 }),
    { particles: false, parallax: false, stagger: true, countUp: true }
  );
});

test("effectsConfig: планшет (768, тач) — без частиц и параллакса", () => {
  assert.deepEqual(
    Motion.effectsConfig({ reducedMotion: false, coarsePointer: true, viewportWidth: 768 }),
    { particles: false, parallax: false, stagger: true, countUp: true }
  );
});

test("staggerDelayMs: задержка по индексу с потолком", () => {
  assert.equal(Motion.staggerDelayMs(0, 60, 500), 0);
  assert.equal(Motion.staggerDelayMs(3, 60, 500), 180);
  assert.equal(Motion.staggerDelayMs(20, 60, 500), 500);
});

test("easedProgress: cubic ease-out с зажимом 0..1", () => {
  assert.equal(Motion.easedProgress(0), 0);
  assert.equal(Motion.easedProgress(1), 1);
  assert.ok(Motion.easedProgress(0.5) > 0.5, "в середине кривая опережает линейную");
  assert.equal(Motion.easedProgress(-1), 0);
  assert.equal(Motion.easedProgress(2), 1);
});

test("particleCountFor: 7 на десктопе, 0 на ≤900", () => {
  assert.equal(Motion.particleCountFor(1440), 7);
  assert.equal(Motion.particleCountFor(900), 0);
  assert.equal(Motion.particleCountFor(375), 0);
});

test("parallaxShiftPx: пропорция прокрутки с зажимом ±80", () => {
  assert.equal(Motion.parallaxShiftPx(0, 0.2), 0);
  assert.equal(Motion.parallaxShiftPx(200, 0.2), 40);
  assert.equal(Motion.parallaxShiftPx(1000, 0.2), 80);
  assert.equal(Motion.parallaxShiftPx(-1000, 0.2), -80);
});
