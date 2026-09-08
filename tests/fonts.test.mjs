import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("шрифт New Standard лежит в fonts/", () => {
  assert.ok(existsSync(path.join(root, "fonts", "newstandard.otf")), "fonts/newstandard.otf не найден");
});

test("style.css подключает New Standard через @font-face с font-display: swap", () => {
  const css = readFileSync(path.join(root, "css", "style.css"), "utf8");
  assert.match(css, /@font-face\s*\{/);
  assert.match(css, /font-family:\s*"New Standard"/);
  assert.match(css, /url\(["']?\.\.\/fonts\/newstandard\.otf["']?\)/);
  assert.match(css, /font-display:\s*swap/);
});

test("Google Fonts больше не грузят Playfair Display", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  assert.doesNotMatch(html, /Playfair/i);
  assert.match(html, /Great\+Vibes/);
  assert.match(html, /Montserrat/);
});

test("заголовочный шрифт — New Standard со стеком Georgia → Times → serif", () => {
  const css = readFileSync(path.join(root, "css", "style.css"), "utf8");
  assert.match(css, /--font-title:\s*"New Standard",\s*Georgia,\s*"Times New Roman",\s*serif/);
});
