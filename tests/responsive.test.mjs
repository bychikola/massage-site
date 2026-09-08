import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdirSync } from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = "file:///" + path.join(root, "index.html").replace(/\\/g, "/");
const previewDir = path.join(root, "preview");
const WIDTHS = [320, 360, 375, 414, 768, 1024, 1440];

let browser;
test.before(async () => { browser = await chromium.launch({ channel: "chrome" }); });
test.after(async () => { await browser.close(); });

test("нет горизонтального скролла на 320–1440", async () => {
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(url);
    await page.waitForTimeout(1200);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(sw <= w + 1, w + "px: scrollWidth=" + sw + " > viewport");
    await page.close();
  }
});

test("скриншоты контрольных ширин в preview/", async () => {
  mkdirSync(previewDir, { recursive: true });
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(url);
    await page.waitForTimeout(2500); // анимации доиграли, цены докрутились
    await page.screenshot({ path: path.join(previewDir, "redesign-" + w + ".png"), fullPage: true });
    await page.close();
  }
});

test("форма открывает wa.me-ссылку с услугой и ценой", async () => {
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
  await page.goto(url);
  await page.evaluate(() => {
    window.__opened = null;
    window.open = function (u) { window.__opened = u; return { closed: false }; };
  });
  await page.fill("#bfName", "Анна");
  await page.fill("#bfPhone", "+7 900 123-45-67");
  await page.selectOption("#bfService", { label: "Массаж головы" });
  await page.click(".booking__submit");
  const opened = await page.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith("https://wa.me/"), "window.open не вызван: " + opened);
  assert.ok(decodeURIComponent(opened).includes("Массаж головы — 800"));
  assert.ok(decodeURIComponent(opened).includes("+7 900 123-45-67"));
  await page.close();
});
