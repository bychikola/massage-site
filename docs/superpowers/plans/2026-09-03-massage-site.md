# Сайт-визитка «Массаж лица и тела» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одностраничный статический сайт-визитка массажиста в стиле PSD-макета (золото + тёмный бирюзовый) с формой записи, отправляющей заявку в WhatsApp.

**Architecture:** Чистый HTML/CSS/JS без сборщиков и зависимостей. `js/booking.js` — «чистая» логика (конфиг, валидация, сборка сообщения, ссылка wa.me), покрытая юнит-тестами Node (`node --test`); `js/main.js` — DOM-логика (бургер, анимации, форма). Сайт должен открываться двойным кликом по `index.html` (file://), поэтому используются классические скрипты, а НЕ ES-модули.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES5-совместимый стиль, `"use strict"`), Node 24 + встроенный `node:test` для тестов, Pillow (Python) для подготовки изображений, Playwright MCP для браузерной верификации.

**Spec:** `docs/superpowers/specs/2026-09-03-massage-site-design.md`

## Global Constraints

- Сайт обязан работать по `file://` (двойной клик по index.html): **без ES-модулей** (`type="module"` запрещён), все картинки локальные в `img/`, шрифты — Google Fonts CDN с системными fallback.
- Без внешних JS/CSS-библиотек, без сборщиков. Node/Python — только для тестов и подготовки ассетов, не входят в сайт.
- Номер телефона, адрес, ссылки соцсетей задаются ТОЛЬКО в объекте `CONFIG` в `js/booking.js`. Все заглушки помечаются комментарием `ЗАМЕНИТЬ`.
- Цены дословно: ШВЗ 800 ₽; Спина от шейных позвонков до крестцов 1700 ₽; Общий массаж (сеанс длится 2 часа) 2800 ₽; Массаж рук 1200 ₽; Массаж ног 1500 ₽; Антицеллюлитный массаж (полный) 2500 ₽; Антицеллюлитный массаж (бёдра, живот, ягодицы) 1800 ₽; Массаж головы 800 ₽; Лифтинг-массаж лица 900 ₽; Скульптурный массаж лица 1200 ₽.
- Палитра (CSS-токены): `--gold:#CFAC58; --gold-text:#D1AB56; --gold-deep:#C9A654; --teal:#044E47; --teal-deep:#033631; --cream:#FAF6EC; --ink:#0A3F3A;`.
- Шрифты Google: Playfair Display (заголовки), Great Vibes (рукописный слоган), Montserrat (текст/кнопки). Кириллические subset обязательны.
- Заглушки контента: телефон `+7 900 000-00-00` (`phoneDigits: "79000000000"`), адрес `г. Москва, ул. Примерная, д. 1`, имя/текст «Обо мне», соцсети.
- Контраст текста ≥ AA; на ширине 375px нет горизонтального скролла; `prefers-reduced-motion` отключает анимации; `lang="ru"`; семантические теги; `alt` у всех фото.
- Git: после каждой задачи — commit. Коммиты только внутри `masaj/`.
- Форма: пустые обязательные поля → сообщения об ошибках; заполненная → `window.open(wa.me-ссылка)` + всегда видимый блок «Если WhatsApp не открылся — скопируйте текст».

---

### Task 1: Каркас проекта: git, .gitignore, favicon, базовые стили

**Files:**
- Create: `.gitignore`, `img/favicon.svg`, `css/style.css`

**Interfaces:**
- Produces: CSS-токены `:root` (см. Global Constraints), классы `.container`, `.section-title`, `.section-sub`, `.btn` (+`--fill`/`--outline`/`--teal`), `.reveal` (без стилей до Task 8), базовые сбросы. Эти классы используют Task 3–8.

- [ ] **Step 1: git init + локальная конфигурация**

```powershell
cd C:\Users\Admin\Documents\masaj
git init
git config user.email "massage@local"
git config user.name "Massage Site"
```

- [ ] **Step 2: .gitignore**

```gitignore
__pycache__/
*.pyc
_psd_*.txt
_psd_analyze*.py
_design_preview.png
_so_*.png
preview/
node_modules/
```

- [ ] **Step 3: img/favicon.svg** — бирюзовый квадрат + золотой лист:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#044E47"/>
  <path d="M32 12C20 20 14 28 14 36c0 9 6 15 13 15 4 0 7-2.5 8-6l4 18 6-2-4-18c1 3.5 4 6 8 6 7 0 13-6 13-15 0-8-6-16-18-24z" fill="#CFAC58"/>
</svg>
```

- [ ] **Step 4: css/style.css — токены, сброс, общие элементы**

```css
/* ===== Дизайн-токены (палитра и шрифты из макета) ===== */
:root {
  --gold: #CFAC58;
  --gold-text: #D1AB56;
  --gold-deep: #C9A654;
  --teal: #044E47;
  --teal-deep: #033631;
  --cream: #FAF6EC;
  --ink: #0A3F3A;
  --white: #FFFFFF;
  --font-title: "Playfair Display", Georgia, "Times New Roman", serif;
  --font-script: "Great Vibes", "Segoe Script", cursive;
  --font-body: "Montserrat", "Segoe UI", Arial, sans-serif;
  --radius: 24px;
  --radius-sm: 14px;
  --shadow: 0 12px 32px rgba(3, 54, 49, .14);
  --shadow-soft: 0 6px 18px rgba(3, 54, 49, .10);
  --container: 1200px;
}

/* ===== Сброс ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 96px; }
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--cream);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; }

/* ===== Контейнер и общие секции ===== */
.container { width: min(100% - 48px, var(--container)); margin-inline: auto; }
.section { padding: 96px 0; }
.section-title {
  font-family: var(--font-title);
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 600;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: .08em;
  text-align: center;
  margin-bottom: 16px;
}
.section-sub {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 56px;
  color: inherit;
  opacity: .85;
}

/* ===== Кнопки ===== */
.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: .08em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  padding: 18px 34px;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color .25s, color .25s, border-color .25s, transform .25s, box-shadow .25s;
}
.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-soft); }
.btn:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }
.btn--fill { background: var(--gold); color: var(--teal-deep); border-color: var(--gold); }
.btn--fill:hover { background: var(--gold-deep); border-color: var(--gold-deep); }
.btn--outline { background: transparent; color: var(--gold); border-color: var(--gold); }
.btn--outline:hover { background: var(--gold); color: var(--teal-deep); }
.btn--teal { background: var(--teal); color: var(--white); border-color: var(--teal); }
.btn--teal:hover { background: var(--teal-deep); border-color: var(--teal-deep); }

/* ===== Фокус ===== */
:focus-visible { outline: 3px solid var(--gold-deep); outline-offset: 2px; }
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore img/favicon.svg css/style.css
git commit -m "chore: project scaffold with design tokens and base styles"
```

---

### Task 2: js/booking.js — логика записи (TDD)

**Files:**
- Create: `js/booking.js`, `tests/booking.test.mjs`

**Interfaces:**
- Produces: глобальный объект `window.Booking` с полями `CONFIG` и функциями:
  - `isValidPhone(value: string): boolean` — true, если после удаления не-цифр осталось 10–15 цифр;
  - `buildBookingMessage(fields: {name, phone, service, date, comment}): string` — многострочное сообщение; пустые `date`/`comment` пропускают строку;
  - `buildWhatsAppLink(message: string): string` — `https://wa.me/<CONFIG.phoneDigits>?text=<encodeURIComponent(message)>`.
- В Node файл также экспортируется через `module.exports` (UMD-обёртка), чтобы тесты импортировали его через `createRequire`.

- [ ] **Step 1: Написать падающие тесты**

`tests/booking.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { CONFIG, isValidPhone, buildBookingMessage, buildWhatsAppLink } = require("../js/booking.js");

test("CONFIG содержит номер-заглушку и телефон для отображения", () => {
  assert.equal(typeof CONFIG.phoneDigits, "string");
  assert.equal(typeof CONFIG.phoneDisplay, "string");
});

test("isValidPhone: принимает телефоны из 10–15 цифр в любом формате", () => {
  assert.equal(isValidPhone("+7 (900) 123-45-67"), true);
  assert.equal(isValidPhone("89001234567"), true);
  assert.equal(isValidPhone("123456789012345"), true); // 15 цифр
  assert.equal(isValidPhone("123"), false);
  assert.equal(isValidPhone("1234567890123456"), false); // 16 цифр
  assert.equal(isValidPhone("звоните после обеда"), false);
  assert.equal(isValidPhone(""), false);
});

test("buildBookingMessage: все поля", () => {
  const msg = buildBookingMessage({
    name: "Анна",
    phone: "+7 900 123-45-67",
    service: "Общий массаж (сеанс длится 2 часа)",
    date: "завтра после 18:00",
    comment: "Первый сеанс",
  });
  assert.equal(
    msg,
    "Здравствуйте! Хочу записаться на массаж.\n" +
      "Имя: Анна\n" +
      "Телефон: +7 900 123-45-67\n" +
      "Услуга: Общий массаж (сеанс длится 2 часа)\n" +
      "Дата и время: завтра после 18:00\n" +
      "Комментарий: Первый сеанс"
  );
});

test("buildBookingMessage: необязательные поля пропускаются", () => {
  const msg = buildBookingMessage({
    name: "Анна",
    phone: "89001234567",
    service: "Массаж головы",
    date: "",
    comment: "",
  });
  assert.equal(
    msg,
    "Здравствуйте! Хочу записаться на массаж.\n" +
      "Имя: Анна\n" +
      "Телефон: 89001234567\n" +
      "Услуга: Массаж головы"
  );
});

test("buildWhatsAppLink: корректная wa.me-ссылка с закодированным текстом", () => {
  const link = buildWhatsAppLink("Привет, мир!");
  assert.equal(link, "https://wa.me/79000000000?text=" + encodeURIComponent("Привет, мир!"));
  assert.ok(link.startsWith("https://wa.me/"));
});
```

- [ ] **Step 2: Запустить тесты — убедиться, что падают**

Run: `node --test`
Expected: FAIL (`Cannot find module '../js/booking.js'`)

- [ ] **Step 3: Реализация js/booking.js**

```js
/* ============================================================
   Конфигурация сайта «Массаж лица и тела».
   ЗАМЕНИТЬ: реальные данные мамы — номер, адрес, соцсети.
   phoneDigits — только цифры, без «+» (формат для wa.me).
   ============================================================ */
(function (global) {
  "use strict";

  var CONFIG = {
    phoneDigits: "79000000000",          // ЗАМЕНИТЬ: номер мамы для WhatsApp
    phoneDisplay: "+7 900 000-00-00",    // ЗАМЕНИТЬ: как номер показывается на сайте
    address: "г. Москва, ул. Примерная, д. 1", // ЗАМЕНИТЬ: реальный адрес
    instagramUrl: "https://instagram.com/",    // ЗАМЕНИТЬ: ссылка Instagram
    vkUrl: "https://vk.com/"                   // ЗАМЕНИТЬ: ссылка VK
  };

  function isValidPhone(value) {
    var digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function buildBookingMessage(fields) {
    var lines = ["Здравствуйте! Хочу записаться на массаж."];
    lines.push("Имя: " + (fields.name || "").trim());
    lines.push("Телефон: " + (fields.phone || "").trim());
    lines.push("Услуга: " + (fields.service || "").trim());
    if (fields.date && fields.date.trim()) {
      lines.push("Дата и время: " + fields.date.trim());
    }
    if (fields.comment && fields.comment.trim()) {
      lines.push("Комментарий: " + fields.comment.trim());
    }
    return lines.join("\n");
  }

  function buildWhatsAppLink(message) {
    return "https://wa.me/" + CONFIG.phoneDigits + "?text=" + encodeURIComponent(message);
  }

  var Booking = {
    CONFIG: CONFIG,
    isValidPhone: isValidPhone,
    buildBookingMessage: buildBookingMessage,
    buildWhatsAppLink: buildWhatsAppLink
  };

  global.Booking = Booking;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Booking;
  }
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Запустить тесты — должны пройти**

Run: `node --test`
Expected: PASS, 5 тестов зелёные

- [ ] **Step 5: Commit**

```bash
git add js/booking.js tests/booking.test.mjs
git commit -m "feat: booking logic with WhatsApp message builder and unit tests"
```

---

### Task 3: index.html — каркас, шапка, бургер-меню

**Files:**
- Create: `index.html`
- Create: `js/main.js`
- Modify: `css/style.css` (append — стили шапки)

**Interfaces:**
- Consumes: `.container`, `.btn` из Task 1.
- Produces: разметка всех секций (пустые контейнеры для Task 4–7), ID-якоря: `#top`, `#home`, `#services`, `#about`, `#booking`, `#contacts`; элементы `#nav`, `#burger`; скрипт `js/main.js` с логикой бургера.

- [ ] **Step 1: index.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Массаж лица и тела — профессиональный массаж</title>
  <meta name="description" content="Профессиональный массаж лица и тела. Онлайн-запись, честные цены, уютная атмосфера.">
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body id="top">

  <header class="header">
    <div class="container header__inner">
      <a class="logo" href="#top">
        <span class="logo__leaf" aria-hidden="true"></span>
        Массаж лица и тела
      </a>
      <nav class="nav" id="nav" aria-label="Основная навигация">
        <a class="nav__link" href="#home">Главная</a>
        <a class="nav__link" href="#services">Услуги</a>
        <a class="nav__link" href="#about">Обо мне</a>
        <a class="nav__link" href="#contacts">Контакты</a>
        <a class="btn btn--fill nav__cta" href="#booking">Записаться</a>
      </nav>
      <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="nav">
        <span class="burger__line"></span>
        <span class="burger__line"></span>
        <span class="burger__line"></span>
      </button>
    </div>
  </header>

  <main>
    <!-- Task 4 -->
    <section class="hero" id="home"></section>
    <!-- Task 5 -->
    <section class="services section" id="services"></section>
    <!-- Task 6 -->
    <section class="about section" id="about"></section>
    <!-- Task 7 -->
    <section class="booking section" id="booking"></section>
    <!-- Task 6 -->
    <section class="contacts section" id="contacts"></section>
  </main>

  <footer class="footer" id="footer"><!-- Task 6 --></footer>

  <script src="js/booking.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: js/main.js — стартовый каркас с бургером**

```js
(function () {
  "use strict";

  /* ===== Мобильное меню ===== */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("nav--open");
    burger.classList.toggle("burger--open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  /* Закрывать меню после клика по ссылке */
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("nav--open");
      burger.classList.remove("burger--open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* Закрывать меню по Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      nav.classList.remove("nav--open");
      burger.classList.remove("burger--open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
})();
```

- [ ] **Step 3: css/style.css — append: стили шапки**

```css
/* ===== Шапка ===== */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--gold);
  box-shadow: 0 2px 12px rgba(3, 54, 49, .12);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 14px;
}
.logo {
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: .04em;
  color: var(--teal-deep);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.logo__leaf {
  width: 26px;
  height: 26px;
  flex: none;
  background: var(--teal);
  border-radius: 50%;
  position: relative;
}
.logo__leaf::after {
  content: "";
  position: absolute;
  inset: 6px;
  background: var(--gold);
  border-radius: 70% 0 70% 0;
  transform: rotate(-20deg);
}
.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav__link {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--teal-deep);
  padding: 6px 2px;
  border-bottom: 2px solid transparent;
  transition: border-color .25s;
}
.nav__link:hover { border-bottom-color: var(--teal); }
.nav__cta { padding: 12px 24px; font-size: 13px; }
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}
.burger__line {
  display: block;
  height: 2px;
  background: var(--teal-deep);
  border-radius: 2px;
  transition: transform .25s, opacity .25s;
}
.burger--open .burger__line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger--open .burger__line:nth-child(2) { opacity: 0; }
.burger--open .burger__line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 900px) {
  .burger { display: flex; }
  .nav {
    position: fixed;
    inset: 0;
    top: 72px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 32px 24px;
    background: var(--gold);
    transform: translateX(100%);
    transition: transform .3s ease;
  }
  .nav--open { transform: translateX(0); }
  .nav__link { font-size: 16px; }
  .nav__cta { margin-top: 8px; }
}
```

- [ ] **Step 4: Верификация в браузере**

1. Запустить сервер в фоне: `python -m http.server 8000` (в корне `masaj/`).
2. Playwright MCP: `browser_navigate` → `http://localhost:8000`.
3. `browser_evaluate` — проверить без ошибок:
   - `document.querySelectorAll(".nav__link").length === 5` (4 пункта + CTA — CTA это `.nav__cta`, пунктов `.nav__link` 4);
   - `document.title === "Массаж лица и тела — профессиональный массаж"`.
4. `browser_resize` 375×812 → `browser_click` на `#burger` → `browser_evaluate`: `document.getElementById("nav").classList.contains("nav--open") === true`; клик по ссылке «Услуги» → меню закрыто.
5. Консоль без ошибок (`browser_console_messages`).

- [ ] **Step 5: Commit**

```bash
git add index.html js/main.js css/style.css
git commit -m "feat: page skeleton with sticky header and mobile burger menu"
```

---

### Task 4: Hero-секция (адаптация PSD-макета) + ассеты из PSD

**Files:**
- Create: `img/hero.jpg`, `img/leaf.webp`
- Modify: `index.html` (секция `#home`), `css/style.css` (append — стили hero)

**Interfaces:**
- Consumes: `.btn`, токены из Task 1; ассеты извлечены из `5841158.psd` (смарт-объект фото) и слоя-листа.
- Produces: секция `.hero` с панелью `.hero__panel` (заголовок, слоган, подзаголовок, текст, кнопки), фото `.hero__photo` в рамке `.hero__media`, лист `.hero__leaf`.

- [ ] **Step 1: Подготовить фото hero из PSD**

Извлечённый ранее смарт-объект лежит в `_so_Place_Your_Image_Her.png` (2391×1592). Конвертируем в JPG 1600px:

```python
from PIL import Image
img = Image.open(r"C:\Users\Admin\Documents\masaj\_so_Place_Your_Image_Her.png").convert("RGB")
w = 1600
h = round(img.height * w / img.width)
img.resize((w, h), Image.LANCZOS).save(r"C:\Users\Admin\Documents\masaj\img\hero.jpg", quality=85, optimize=True)
print("OK", w, h)
```

Run: `python -c "..."` (код выше). Проверка: файл `img/hero.jpg` существует, размер 100–600 КБ, PIL открывает и размеры 1600×1065.

- [ ] **Step 2: Подготовить лист из PSD**

Отрендерить векторный слой «Leaf» и конвертировать в WebP с прозрачностью:

```python
from psd_tools import PSDImage
from PIL import Image

psd = PSDImage.open(r"C:\Users\Admin\Documents\masaj\5841158.psd")
leaf = None
def find(g):
    global leaf
    for l in g:
        if l.name == "Leaf" and l.kind == "shape":
            leaf = l
        if l.is_group():
            find(l)
find(psd)
assert leaf is not None, "слой Leaf не найден"
pil = leaf.composite()          # рендер слоя с прозрачностью
w = 1000
h = round(pil.height * w / pil.width)
pil = pil.resize((w, h), Image.LANCZOS)
pil.save(r"C:\Users\Admin\Documents\masaj\img\leaf.webp", "WEBP", quality=90, lossless=False)
print("OK", pil.size, pil.mode)
```

Проверка: `img/leaf.webp` существует; PIL открывает с режимом RGBA; размер файла 30–300 КБ. Если слой не рендерится (`composite()` падает) — фолбэк: взять `_so_Leaf_shadow_.png`, обрезать до непрозрачного bbox, уменьшить до 1000px и сохранить как `img/leaf.webp` (тот же формат).

- [ ] **Step 3: Разметка hero в index.html** — заменить `<section class="hero" id="home"></section>`:

```html
<section class="hero" id="home">
  <div class="container hero__inner">
    <div class="hero__panel">
      <h1 class="hero__title">Массаж лица и&nbsp;тела</h1>
      <p class="hero__tagline">«забота и&nbsp;гармония»</p>
      <!-- ЗАМЕНИТЬ: подзаголовок и текст ниже — реальные слова мамы -->
      <div class="hero__divider" aria-hidden="true"></div>
      <p class="hero__subtitle">место вашего восстановления</p>
      <p class="hero__body">
        Профессиональный массаж в спокойной, уютной атмосфере.
        Индивидуальный подход, комфортные материалы и забота о&nbsp;каждом клиенте.
      </p>
      <div class="hero__actions">
        <a class="btn btn--fill" href="#booking">Записаться</a>
        <a class="btn btn--outline" href="#services">Услуги и цены</a>
      </div>
    </div>
    <div class="hero__media">
      <img class="hero__photo" src="img/hero.jpg" alt="Сеанс массажа: спокойная спа-атмосфера" width="1600" height="1065" loading="eager">
    </div>
  </div>
  <img class="hero__leaf" src="img/leaf.webp" alt="" aria-hidden="true">
</section>
```

- [ ] **Step 4: css/style.css — append: стили hero**

```css
/* ===== Hero ===== */
.hero {
  position: relative;
  background: var(--gold);
  overflow: hidden;
  padding: 64px 0 96px;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 48px;
  position: relative;
  z-index: 1;
}
.hero__panel {
  background: var(--teal);
  border-radius: var(--radius);
  padding: clamp(40px, 5vw, 72px);
  color: var(--white);
  box-shadow: var(--shadow);
}
.hero__title {
  font-family: var(--font-title);
  font-size: clamp(34px, 4.6vw, 56px);
  font-weight: 600;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.hero__tagline {
  font-family: var(--font-script);
  font-size: clamp(30px, 3.4vw, 42px);
  color: var(--gold-text);
  margin-top: 18px;
}
.hero__divider {
  width: 120px;
  height: 2px;
  background: var(--gold);
  margin: 28px 0;
}
.hero__subtitle {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--gold-text);
}
.hero__body {
  margin-top: 18px;
  max-width: 460px;
  font-size: 16px;
  opacity: .92;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 36px;
}
.hero__media {
  position: relative;
  padding: 18px;
  background: var(--gold);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.hero__media::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(255, 255, 255, .55);
  border-radius: calc(var(--radius) - 8px);
  pointer-events: none;
}
.hero__photo {
  border-radius: calc(var(--radius) - 12px);
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
.hero__leaf {
  position: absolute;
  left: -60px;
  bottom: -80px;
  width: min(46vw, 560px);
  opacity: .9;
  pointer-events: none;
}
@media (max-width: 900px) {
  .hero { padding-top: 32px; }
  .hero__inner { grid-template-columns: 1fr; gap: 32px; }
  .hero__leaf { width: 70vw; left: auto; right: -80px; }
}
```

- [ ] **Step 5: Верификация в браузере**

Playwright MCP (`http://localhost:8000`):
- `browser_evaluate`: `document.querySelector(".hero__photo").naturalWidth > 0` (фото загрузилось), `.hero__leaf` существует и `naturalWidth > 0`;
- 375×812: `document.documentElement.scrollWidth <= 375` (нет горизонтального скролла);
- консоль без ошибок;
- `browser_take_screenshot` на 1440×900 и 375×812 — скопировать файлы в `preview/hero-desktop.png` и `preview/hero-mobile.png` (папку `preview/` создать) — для просмотра заказчиком.

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css img/hero.jpg img/leaf.webp
git commit -m "feat: hero section with PSD photo, gold frame and leaf decoration"
```

---

### Task 5: Секция «Услуги и цены»

**Files:**
- Modify: `index.html` (секция `#services`), `css/style.css` (append — стили услуг)

**Interfaces:**
- Consumes: `.section-title`, `.section-sub`, `.btn`, `.container` из Task 1.
- Produces: 10 карточек `.card` в двух группах (`.services__group`), каждая с кнопкой-якорем `#booking`.

- [ ] **Step 1: Разметка** — заменить `<section class="services section" id="services"></section>`:

```html
<section class="services section" id="services">
  <div class="container">
    <h2 class="section-title">Услуги и цены</h2>
    <!-- ЗАМЕНИТЬ: подзаголовок ниже — реальный текст -->
    <p class="section-sub">
      Честные цены без доплат. Продолжительность сеанса обсуждается при записи.
    </p>

    <div class="services__group">
      <h3 class="services__heading">Массаж тела</h3>
      <div class="services__grid">
        <!-- ЗАМЕНИТЬ: описания услуг ниже — реальные слова мамы -->

        <article class="card">
          <h4 class="card__name">Шейно-воротниковая зона</h4>
          <p class="card__desc">Снятие напряжения в шее и плечах</p>
          <p class="card__price">800&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Спина от шейных позвонков до крестцов</h4>
          <p class="card__desc">Глубокая проработка мышц спины</p>
          <p class="card__price">1700&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Общий массаж (сеанс длится 2 часа)</h4>
          <p class="card__desc">Полное расслабление всего тела</p>
          <p class="card__price">2800&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Массаж рук</h4>
          <p class="card__desc">Лёгкость и снятие усталости в руках</p>
          <p class="card__price">1200&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Массаж ног</h4>
          <p class="card__desc">Отдых для ног после долгого дня</p>
          <p class="card__price">1500&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Антицеллюлитный массаж (полный)</h4>
          <p class="card__desc">Интенсивная работа со всем телом</p>
          <p class="card__price">2500&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Антицеллюлитный массаж (бёдра, живот, ягодицы)</h4>
          <p class="card__desc">Работа с проблемными зонами</p>
          <p class="card__price">1800&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Массаж головы</h4>
          <p class="card__desc">Глубокое расслабление и спокойствие</p>
          <p class="card__price">800&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>
      </div>
    </div>

    <div class="services__group">
      <h3 class="services__heading">Массаж лица</h3>
      <div class="services__grid">
        <article class="card">
          <h4 class="card__name">Лифтинг-массаж лица</h4>
          <p class="card__desc">Подтянутость кожи и свежий вид</p>
          <p class="card__price">900&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>

        <article class="card">
          <h4 class="card__name">Скульптурный массаж лица</h4>
          <p class="card__desc">Чёткий овал лица, проработка мышц</p>
          <p class="card__price">1200&nbsp;₽</p>
          <a class="btn btn--teal card__btn" href="#booking">Записаться</a>
        </article>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: css/style.css — append: стили услуг**

```css
/* ===== Услуги ===== */
.services { background: var(--cream); }
.services__group { margin-bottom: 64px; }
.services__group:last-child { margin-bottom: 0; }
.services__heading {
  font-family: var(--font-title);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: .06em;
  color: var(--teal);
  text-align: center;
  margin-bottom: 32px;
}
.services__heading::after {
  content: "";
  display: block;
  width: 64px;
  height: 2px;
  background: var(--gold);
  margin: 14px auto 0;
}
.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.card {
  background: var(--white);
  border: 1px solid rgba(4, 78, 71, .08);
  border-radius: var(--radius-sm);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-soft);
  transition: transform .25s, box-shadow .25s;
}
.card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.card__name {
  font-family: var(--font-title);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--teal);
}
.card__desc { font-size: 14px; opacity: .8; flex: 1; }
.card__price {
  font-family: var(--font-title);
  font-size: 26px;
  font-weight: 700;
  color: var(--gold-deep);
}
.card__btn { align-self: flex-start; padding: 12px 26px; font-size: 12px; }
@media (max-width: 600px) {
  .services__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Верификация**

Playwright MCP:
- `browser_evaluate`: массив из `document.querySelectorAll(".card__name")` содержит ровно 10 элементов и дословно совпадает с прайсом из Global Constraints (сравнить со списком в скрипте);
- цены: массив `document.querySelectorAll(".card__price")` — дословно `["800 ₽","1700 ₽","2800 ₽","1200 ₽","1500 ₽","2500 ₽","1800 ₽","800 ₽","900 ₽","1200 ₽"]` (после нормализации `&nbsp;`→пробел);
- 375px: `document.documentElement.scrollWidth <= 375`;
- консоль без ошибок.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: services section with full price list"
```

---

### Task 6: Секции «Обо мне», «Контакты», подвал + стоковое фото

**Files:**
- Create: `img/about.jpg` (стоковое фото, скачано и оптимизировано)
- Modify: `index.html` (секции `#about`, `#contacts`, `footer`), `css/style.css` (append)

**Interfaces:**
- Consumes: `CONFIG` из `js/booking.js` (глобально `Booking.CONFIG`) — в подвале и контактах телефон/адрес вставляются скриптом, чтобы данные жили в одном месте.
- Produces: элементы с `id`: `contactPhone`, `contactWhatsApp`, `contactAddress`, `contactInstagram`, `contactVk`, `footerPhone`, `footerAddress`; разметка подвала.

- [ ] **Step 1: Скачать стоковое фото для «Обо мне»**

Скачать и проверить кандидатов (список по порядку, берём первый рабочий):

```
https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1000&q=82&fm=jpg&fit=crop
https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1000&q=82&fm=jpg&fit=crop
https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1000&q=82&fm=jpg&fit=crop
https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=82&fm=jpg&fit=crop
```

```powershell
$urls = @(
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1000&q=82&fm=jpg&fit=crop",
  "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1000&q=82&fm=jpg&fit=crop",
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1000&q=82&fm=jpg&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=82&fm=jpg&fit=crop"
)
foreach ($u in $urls) {
  try {
    Invoke-WebRequest -Uri $u -OutFile "C:\Users\Admin\Documents\masaj\img\about.jpg" -UseBasicParsing -TimeoutSec 30
    $f = Get-Item "C:\Users\Admin\Documents\masaj\img\about.jpg"
    if ($f.Length -gt 50000) { Write-Output "OK: $($f.Length) bytes from $u"; break }
  } catch { Write-Output "FAIL: $u" }
}
```

Проверка скачанного: Python + Pillow — файл открывается как JPEG, размеры ≥ 800px по ширине:

```python
from PIL import Image
im = Image.open(r"C:\Users\Admin\Documents\masaj\img\about.jpg")
print(im.size, im.format)
assert im.width >= 800 and im.format == "JPEG"
im.thumbnail((900, 900), Image.LANCZOS)
im.save(r"C:\Users\Admin\Documents\masaj\img\about.jpg", quality=85, optimize=True)
print("optimized", im.size)
```

Фолбэк, если все URL не работают: скопировать `img/hero.jpg` в `img/about.jpg` (кроп центра 3:4).

- [ ] **Step 2: Разметка «Обо мне»** — заменить `<section class="about section" id="about"></section>`:

```html
<section class="about section" id="about">
  <div class="container about__inner">
    <div class="about__media">
      <img class="about__photo" src="img/about.jpg" alt="Массажист за работой" width="900" height="900" loading="lazy">
    </div>
    <div class="about__content">
      <h2 class="section-title about__title">Обо мне</h2>
      <!-- ЗАМЕНИТЬ: имя и текст ниже — реальная история мамы -->
      <p class="about__lead">Здравствуйте! Меня зовут Ирина, я&nbsp;профессиональный массажист.</p>
      <p class="about__text">
        Массаж для меня — не просто работа, а способ вернуть человеку лёгкость
        и&nbsp;хорошее настроение. На сеансе я подбираю технику под ваше состояние,
        использую качественные масла и работаю в спокойной, уютной обстановке.
      </p>
      <p class="about__text">
        Буду рада помочь вам восстановить силы после рабочих будней,
        снять напряжение в мышцах и позаботиться о коже лица.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Разметка «Контакты» и подвала** — заменить `<section class="contacts section" id="contacts"></section>` и `<footer class="footer" id="footer"></footer>`:

```html
<section class="contacts section" id="contacts">
  <div class="container">
    <h2 class="section-title">Контакты</h2>
    <p class="section-sub">Позвоните, напишите в WhatsApp или оставьте заявку — отвечу в ближайшее время.</p>
    <div class="contacts__grid">
      <a class="contact-card" id="contactPhone" href="#" target="_blank" rel="noopener">
        <svg class="contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02z"/>
        </svg>
        <span class="contact-card__label">Телефон</span>
        <span class="contact-card__value" id="contactPhoneValue">…</span>
      </a>

      <a class="contact-card" id="contactWhatsApp" href="#" target="_blank" rel="noopener">
        <svg class="contact-card__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span class="contact-card__label">WhatsApp</span>
        <span class="contact-card__value">написать</span>
      </a>

      <div class="contact-card">
        <svg class="contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z"/>
          <circle cx="12" cy="10" r="2.6"/>
        </svg>
        <span class="contact-card__label">Адрес</span>
        <span class="contact-card__value" id="contactAddress">…</span>
      </div>
    </div>

    <div class="contacts__social" aria-label="Социальные сети">
      <a id="contactInstagram" class="social" href="#" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/>
          <circle cx="12" cy="12" r="4.3"/>
          <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/>
        </svg>
      </a>
      <a id="contactVk" class="social" href="#" target="_blank" rel="noopener" aria-label="ВКонтакте">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.454-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.649 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.115-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.357.457.159.02.519.099.71.363.247.341.239 1.106.239 1.106s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161c-.112.135-.009.412-.009.412s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838h.001z"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__brand">Массаж лица и&nbsp;тела</p>
    <p class="footer__contacts">
      <a id="footerPhone" href="#">…</a>
      <span aria-hidden="true">·</span>
      <span id="footerAddress">…</span>
    </p>
    <p class="footer__copy">© <span id="footerYear">2026</span> Массаж лица и тела. Все права защищены.</p>
  </div>
</footer>
```

- [ ] **Step 4: js/main.js — append: подстановка контактов из CONFIG**

```js
  /* ===== Контакты из CONFIG (одно место для правок) ===== */
  var C = Booking.CONFIG;
  var telHref = "tel:+" + C.phoneDigits;
  var waHref = "https://wa.me/" + C.phoneDigits;

  var contactPhone = document.getElementById("contactPhone");
  contactPhone.href = telHref;
  document.getElementById("contactPhoneValue").textContent = C.phoneDisplay;

  document.getElementById("contactWhatsApp").href = waHref;
  document.getElementById("contactAddress").textContent = C.address;
  document.getElementById("contactInstagram").href = C.instagramUrl;
  document.getElementById("contactVk").href = C.vkUrl;

  var footerPhone = document.getElementById("footerPhone");
  footerPhone.href = telHref;
  footerPhone.textContent = C.phoneDisplay;
  document.getElementById("footerAddress").textContent = C.address;
  document.getElementById("footerYear").textContent = String(new Date().getFullYear());
```

(Вставить внутрь IIFE в `js/main.js` перед закрывающей `})();`.)

- [ ] **Step 5: css/style.css — append: стили «Обо мне», контактов, подвала**

```css
/* ===== Обо мне ===== */
.about { background: var(--teal); color: var(--white); }
.about__inner {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  align-items: center;
  gap: 56px;
}
.about__media {
  padding: 16px;
  background: var(--gold);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 420px;
}
.about__photo {
  border-radius: calc(var(--radius) - 8px);
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}
.about__title { text-align: left; }
.about__lead {
  font-family: var(--font-script);
  font-size: 30px;
  color: var(--gold-text);
  margin-bottom: 20px;
}
.about__text { opacity: .92; margin-bottom: 14px; max-width: 560px; }
@media (max-width: 900px) {
  .about__inner { grid-template-columns: 1fr; gap: 40px; }
  .about__media { max-width: 320px; }
  .about__title { text-align: center; }
}

/* ===== Контакты ===== */
.contacts { background: var(--gold); }
.contacts__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.contact-card {
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 32px 24px;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-soft);
  transition: transform .25s, box-shadow .25s;
}
a.contact-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.contact-card__icon { width: 34px; height: 34px; color: var(--teal); }
.contact-card__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--teal);
  opacity: .75;
}
.contact-card__value {
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: 600;
  color: var(--teal);
}
.contacts__social {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}
.social {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--teal);
  color: var(--gold);
  transition: transform .25s, background-color .25s;
}
.social:hover { transform: translateY(-3px); background: var(--teal-deep); }
.social svg { width: 24px; height: 24px; }
@media (max-width: 760px) {
  .contacts__grid { grid-template-columns: 1fr; }
}

/* ===== Подвал ===== */
.footer {
  background: var(--teal-deep);
  color: rgba(255, 255, 255, .85);
  padding: 40px 0;
  text-align: center;
}
.footer__inner { display: flex; flex-direction: column; gap: 10px; }
.footer__brand { font-family: var(--font-title); font-size: 20px; letter-spacing: .06em; color: var(--gold-text); }
.footer__contacts { font-size: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.footer__contacts a { color: var(--gold-text); text-decoration: none; }
.footer__contacts a:hover { text-decoration: underline; }
.footer__copy { font-size: 12px; opacity: .65; }
```

- [ ] **Step 6: Верификация**

Playwright MCP:
- `browser_evaluate`: `document.getElementById("contactPhone").getAttribute("href") === "tel:+79000000000"`; `contactWhatsApp.href === "https://wa.me/79000000000"`; `contactAddress.textContent === "г. Москва, ул. Примерная, д. 1"`; `footerPhone.textContent === "+7 900 000-00-00"`;
- `document.querySelector(".about__photo").naturalWidth > 0` (стоковое фото загрузилось);
- 375px: `document.documentElement.scrollWidth <= 375`;
- консоль без ошибок.

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css js/main.js img/about.jpg
git commit -m "feat: about, contacts and footer sections with CONFIG-driven links"
```

---

### Task 7: Форма записи → WhatsApp

**Files:**
- Modify: `index.html` (секция `#booking`), `js/main.js` (append — логика формы), `css/style.css` (append — стили формы)

**Interfaces:**
- Consumes: `Booking.CONFIG`, `Booking.isValidPhone`, `Booking.buildBookingMessage`, `Booking.buildWhatsAppLink` из Task 2; `.btn` из Task 1.
- Produces: форма `#bookingForm` с полями `#bfName`, `#bfPhone`, `#bfService`, `#bfDate`, `#bfComment`, блок ошибки `#formError`, фолбэк `#formFallback` с `#formMessage` и `#copyBtn`.

- [ ] **Step 1: Разметка** — заменить `<section class="booking section" id="booking"></section>`:

```html
<section class="booking section" id="booking">
  <div class="container booking__inner">
    <div class="booking__info">
      <h2 class="section-title booking__title">Запись на сеанс</h2>
      <p class="booking__text">
        Заполните форму — я получу вашу заявку в WhatsApp и свяжусь с вами,
        чтобы подтвердить время.
      </p>
      <div class="booking__quick">
        <a class="btn btn--teal" id="quickCall" href="#">Позвонить</a>
        <a class="btn btn--teal" id="quickWhatsApp" href="#" target="_blank" rel="noopener">Написать в WhatsApp</a>
      </div>
    </div>

    <form class="booking__form" id="bookingForm" novalidate>
      <div class="field">
        <label class="field__label" for="bfName">Имя <span class="field__req" aria-hidden="true">*</span></label>
        <input class="field__input" id="bfName" name="name" type="text" autocomplete="name" required placeholder="Как к вам обращаться">
      </div>
      <div class="field">
        <label class="field__label" for="bfPhone">Телефон <span class="field__req" aria-hidden="true">*</span></label>
        <input class="field__input" id="bfPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 900 000-00-00">
      </div>
      <div class="field">
        <label class="field__label" for="bfService">Услуга</label>
        <select class="field__input" id="bfService" name="service">
          <option value="">— выберите услугу —</option>
          <option>Шейно-воротниковая зона</option>
          <option>Спина от шейных позвонков до крестцов</option>
          <option>Общий массаж (сеанс длится 2 часа)</option>
          <option>Массаж рук</option>
          <option>Массаж ног</option>
          <option>Антицеллюлитный массаж (полный)</option>
          <option>Антицеллюлитный массаж (бёдра, живот, ягодицы)</option>
          <option>Массаж головы</option>
          <option>Лифтинг-массаж лица</option>
          <option>Скульптурный массаж лица</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="bfDate">Дата и время</label>
        <input class="field__input" id="bfDate" name="date" type="text" placeholder="Например: завтра после 18:00">
      </div>
      <div class="field field--wide">
        <label class="field__label" for="bfComment">Комментарий</label>
        <textarea class="field__input" id="bfComment" name="comment" rows="3" placeholder="Пожелания, особенности"></textarea>
      </div>
      <p class="form-error" id="formError" role="alert" hidden></p>
      <button class="btn btn--fill booking__submit" type="submit">Отправить заявку в WhatsApp</button>
      <div class="form-fallback" id="formFallback" hidden>
        <p class="form-fallback__text">Если WhatsApp не открылся — скопируйте текст и отправьте его сами:</p>
        <pre class="form-fallback__msg" id="formMessage"></pre>
        <button class="btn btn--outline" id="copyBtn" type="button">Скопировать текст</button>
        <span class="form-fallback__ok" id="copyOk" hidden>Текст скопирован</span>
      </div>
    </form>
  </div>
</section>
```

- [ ] **Step 2: js/main.js — append: логика формы**

```js
  /* ===== Форма записи → WhatsApp ===== */
  var form = document.getElementById("bookingForm");
  var formError = document.getElementById("formError");
  var formFallback = document.getElementById("formFallback");
  var formMessage = document.getElementById("formMessage");
  var copyBtn = document.getElementById("copyBtn");
  var copyOk = document.getElementById("copyOk");

  /* Быстрые контакты рядом с формой */
  document.getElementById("quickCall").href = telHref;
  document.getElementById("quickWhatsApp").href = waHref;

  function showError(text) {
    formError.textContent = text;
    formError.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formError.hidden = true;

    var name = document.getElementById("bfName").value;
    var phone = document.getElementById("bfPhone").value;
    var service = document.getElementById("bfService").value;
    var date = document.getElementById("bfDate").value;
    var comment = document.getElementById("bfComment").value;

    if (!name.trim()) {
      showError("Пожалуйста, укажите ваше имя.");
      document.getElementById("bfName").focus();
      return;
    }
    if (!Booking.isValidPhone(phone)) {
      showError("Пожалуйста, укажите корректный телефон (10–15 цифр).");
      document.getElementById("bfPhone").focus();
      return;
    }

    var message = Booking.buildBookingMessage({
      name: name,
      phone: phone,
      service: service || "не выбрана",
      date: date,
      comment: comment
    });

    formMessage.textContent = message;
    formFallback.hidden = false;
    copyOk.hidden = true;

    var win = window.open(Booking.buildWhatsAppLink(message), "_blank", "noopener");
    if (!win) {
      showError("Браузер заблокировал всплывающее окно — скопируйте текст ниже.");
    }
  });

  copyBtn.addEventListener("click", function () {
    var text = formMessage.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyOk.hidden = false;
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyOk.hidden = false;
    }
  });
```

- [ ] **Step 3: css/style.css — append: стили формы**

```css
/* ===== Запись ===== */
.booking { background: var(--gold); }
.booking__inner {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 56px;
  align-items: start;
}
.booking__title { text-align: left; color: var(--teal-deep); }
.booking__text { max-width: 420px; color: var(--teal-deep); opacity: .9; }
.booking__quick { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }
.booking__form {
  background: var(--white);
  border-radius: var(--radius);
  padding: 40px;
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.field { display: flex; flex-direction: column; gap: 8px; }
.field--wide { grid-column: 1 / -1; }
.field__label { font-size: 13px; font-weight: 600; letter-spacing: .06em; color: var(--teal); }
.field__req { color: var(--gold-deep); }
.field__input {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid rgba(4, 78, 71, .18);
  border-radius: 10px;
  padding: 14px 16px;
  width: 100%;
  transition: border-color .25s, box-shadow .25s;
}
.field__input:focus {
  outline: none;
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(4, 78, 71, .15);
}
.field__input::placeholder { color: rgba(10, 63, 58, .45); }
.form-error { grid-column: 1 / -1; color: #A03C2E; font-size: 14px; }
.booking__submit { grid-column: 1 / -1; }
.form-fallback {
  grid-column: 1 / -1;
  border-top: 1px dashed rgba(4, 78, 71, .25);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.form-fallback__text { font-size: 14px; opacity: .8; }
.form-fallback__msg {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
  background: var(--cream);
  border-radius: 10px;
  padding: 14px;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}
.form-fallback__ok { font-size: 13px; color: var(--teal); font-weight: 600; }
@media (max-width: 900px) {
  .booking__inner { grid-template-columns: 1fr; gap: 40px; }
  .booking__title { text-align: center; }
  .booking__form { grid-template-columns: 1fr; padding: 28px 22px; }
}
```

- [ ] **Step 4: Верификация**

Playwright MCP:
- Отправить пустую форму: `browser_click` на `.booking__submit` → `browser_evaluate`: `document.getElementById("formError").hidden === false` и текст содержит «имя»;
- Заполнить имя и телефон «+7 900 123-45-67», услугу «Массаж головы» → перед кликом подменить `window.open`:
  `browser_evaluate`: `window.__opened = null; window.open = (u) => { window.__opened = u; return { closed: false }; }` → клик submit → `browser_evaluate`: `window.__opened.startsWith("https://wa.me/79000000000?text=")` и `decodeURIComponent(window.__opened).includes("Массаж головы")` и `includes("+7 900 123-45-67")`;
- `document.getElementById("formFallback").hidden === false`;
- `browser_click` на `#copyBtn` (в Chromium с clipboard permissions работает; если нет — проверяем, что ошибок в консоли нет);
- 375px: `document.documentElement.scrollWidth <= 375`;
- консоль без ошибок.

- [ ] **Step 5: Commit**

```bash
git add index.html js/main.js css/style.css
git commit -m "feat: booking form that opens WhatsApp with prefilled message"
```

---

### Task 8: Анимации, полировка, финальная приёмка

**Files:**
- Modify: `css/style.css` (append — reveal-анимации, reduced-motion), `js/main.js` (append — IntersectionObserver)
- Create: `preview/final-desktop.png`, `preview/final-mobile.png` (скриншоты для заказчика)

**Interfaces:**
- Consumes: классы `.reveal` (уже проставлены в разметке ниже), `.visible` (добавляется скриптом).

- [ ] **Step 1: Проставить класс .reveal** — в `index.html` добавить `reveal` в class секций `#services`, `#about`, `#booking`, `#contacts` (например: `<section class="services section reveal" id="services">`), а также добавить `reveal` к `.card`? Нет — только к секциям (анимация крупных блоков, не каждой карточки).

- [ ] **Step 2: css/style.css — append: анимации появления**

```css
/* ===== Появление секций при скролле ===== */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .btn, .card, .social, a.contact-card { transition: none; }
  .btn:hover, .card:hover, .social:hover, a.contact-card:hover { transform: none; }
}
```

- [ ] **Step 3: js/main.js — append: запуск reveal**

```js
  /* ===== Плавное появление секций ===== */
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }
```

- [ ] **Step 4: Юнит-тесты всё ещё зелёные**

Run: `node --test`
Expected: PASS, 5 тестов.

- [ ] **Step 5: Финальная приёмка по критериям спеки**

Playwright MCP (1440×900 и 375×812), сверить по чек-листу:
1. Страница открывается, консоль без ошибок, сеть без 404 (кроме возможных внешних шрифтов);
2. Прайс дословно совпадает со списком Global Constraints (проверено в Task 5, перепроверить);
3. Форма: пустые поля → ошибки; заполненная → `window.__opened` начинается с `https://wa.me/79000000000?text=` (проверено в Task 7, перепроверить);
4. Номер в одном месте: `grep -c "79000000000" js/*.js index.html` → ровно 1 совпадение (в `js/booking.js`);
5. 375px: `document.documentElement.scrollWidth <= 375`, бургер открывает/закрывает меню;
6. Все заглушки помечены: `grep -c "ЗАМЕНИТЬ" js/booking.js index.html` ≥ 6;
7. `img/` содержит только favicon.svg, hero.jpg, leaf.webp, about.jpg;
8. Скриншоты: `browser_take_screenshot` → сохранить в `preview/final-desktop.png` и `preview/final-mobile.png` и показать заказчику.

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/main.js preview/final-desktop.png preview/final-mobile.png
git commit -m "feat: scroll reveal animations and final polish"
```

---

## Self-Review

**Spec coverage:** ✓ шапка (T3) · hero из макета (T4) · услуги с прайсом (T5) · обо мне (T6) · форма→WhatsApp (T7) · контакты (T6) · подвал (T6) · токены/палитра/шрифты (T1) · ассеты из PSD (T4) · стоковое фото (T6) · favicon (T1) · адаптив/бургер (T3–T8) · reduced-motion (T8) · валидация формы (T2+T7) · копирование-фолбэк (T7) · CONFIG в одном месте (T2+T6+T7) · критерии приёмки (T8).

**Placeholder scan:** все шаги содержат полный код и команды; заглушки контента — намеренные (помечены «ЗАМЕНИТЬ»).

**Type consistency:** `Booking.CONFIG.phoneDigits/phoneDisplay/address/instagramUrl/vkUrl`, `isValidPhone`, `buildBookingMessage`, `buildWhatsAppLink` — одинаковые имена во всех задачах; ID элементов (`bfName`, `contactPhone`, `formFallback`, `copyBtn` и т.д.) совпадают между HTML, CSS и JS.
