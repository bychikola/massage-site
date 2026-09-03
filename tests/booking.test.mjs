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
