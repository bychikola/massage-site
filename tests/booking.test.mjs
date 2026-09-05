import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { CONFIG, SERVICE_PRICES, getServicePrice, isValidPhone, buildBookingMessage, buildWhatsAppLink } = require("../js/booking.js");

test("CONFIG содержит номер мамы и телефон для отображения", () => {
  assert.equal(typeof CONFIG.phoneDigits, "string");
  assert.ok(CONFIG.phoneDigits.length >= 10, "phoneDigits — только цифры без «+»");
  assert.equal(typeof CONFIG.phoneDisplay, "string");
  assert.ok(CONFIG.phoneDisplay.length > 0);
});

test("SERVICE_PRICES покрывает все 10 услуг и значения > 0", () => {
  const expected = [
    "Шейно-воротниковая зона",
    "Спина от шейных позвонков до крестцов",
    "Общий массаж (сеанс длится 2 часа)",
    "Массаж рук",
    "Массаж ног",
    "Антицеллюлитный массаж (полный)",
    "Антицеллюлитный массаж (бёдра, живот, ягодицы)",
    "Массаж головы",
    "Лифтинг-массаж лица",
    "Скульптурный массаж лица"
  ];
  for (const name of expected) {
    assert.ok(name in SERVICE_PRICES, "нет цены для: " + name);
    assert.ok(SERVICE_PRICES[name] > 0, "цена должна быть > 0 для: " + name);
  }
});

test("getServicePrice: возвращает число для известной услуги, null для неизвестной", () => {
  assert.equal(getServicePrice("Массаж головы"), 800);
  assert.equal(getServicePrice("Лифтинг-массаж лица"), 900);
  assert.equal(getServicePrice("Такой услуги нет"), null);
  assert.equal(getServicePrice(""), null);
  assert.equal(getServicePrice(null), null);
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

test("buildBookingMessage: все поля, услуга с ценой уходит в строку", () => {
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
      "Услуга: Общий массаж (сеанс длится 2 часа) — 2800 ₽\n" +
      "Дата и время: завтра после 18:00\n" +
      "Комментарий: Первый сеанс"
  );
});

test("buildBookingMessage: услуга без цены в прайсе — сообщение формируется без цены", () => {
  const msg = buildBookingMessage({
    name: "Анна",
    phone: "89001234567",
    service: "Какая-то новая услуга",
    date: "",
    comment: "",
  });
  assert.equal(
    msg,
    "Здравствуйте! Хочу записаться на массаж.\n" +
      "Имя: Анна\n" +
      "Телефон: 89001234567\n" +
      "Услуга: Какая-то новая услуга"
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
      "Услуга: Массаж головы — 800 ₽"
  );
});

test("buildWhatsAppLink: использует номер из CONFIG и URL-кодирует текст", () => {
  const link = buildWhatsAppLink("Привет, мир!");
  // Сверяем не абсолютную строку, а то, что ссылка использует реальный CONFIG.phoneDigits
  // и кодирует текст — так тест остаётся зелёным при смене номера.
  assert.equal(
    link,
    "https://wa.me/" + CONFIG.phoneDigits + "?text=" + encodeURIComponent("Привет, мир!")
  );
  assert.ok(link.startsWith("https://wa.me/"));
  assert.ok(link.includes(CONFIG.phoneDigits));
});
