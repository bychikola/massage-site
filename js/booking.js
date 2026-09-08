/* ============================================================
   Конфигурация сайта «Массаж лица и тела».
   ЗАМЕНИТЬ: реальные данные мамы — номер, адрес, соцсети.
   phoneDigits — только цифры, без «+» (формат для wa.me).
   ============================================================ */
(function (global) {
  "use strict";

  var CONFIG = {
    phoneDigits: "79284839114",          // WhatsApp мамы: +7 928 483-91-14
    phoneDisplay: "+7 928 483-91-14",    // как номер показывается на сайте
    address: "с. Чикола, ул. А. Макоева, д. 10", // адрес мамы
    instagramUrl: "https://instagram.com/",    // ЗАМЕНИТЬ: ссылка Instagram
    vkUrl: "https://vk.com/"                   // ЗАМЕНИТЬ: ссылка VK
  };

  /* Прайс для формы записи. Имя услуги должно ТОЧНО совпадать
     с текстом опции <option> в index.html и с названием карточки в разделе «Услуги» —
     чтобы Альбина правильно получала цену в WhatsApp. */
  var SERVICE_PRICES = {
    "Шейно-воротниковая зона": 800,
    "Спина от шейных позвонков до крестцов": 1700,
    "Общий массаж (сеанс длится 2 часа)": 2800,
    "Массаж рук": 1200,
    "Массаж ног": 1500,
    "Антицеллюлитный массаж (полный)": 2500,
    "Антицеллюлитный массаж (бёдра, живот, ягодицы)": 1800,
    "Массаж головы": 800,
    "Лифтинг-массаж лица": 900,
    "Скульптурный массаж лица": 1200
  };

  function getServicePrice(serviceName) {
    if (!serviceName) return null;
    if (Object.prototype.hasOwnProperty.call(SERVICE_PRICES, serviceName)) {
      return SERVICE_PRICES[serviceName];
    }
    return null;
  }

  function isValidPhone(value) {
    var digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function buildBookingMessage(fields) {
    var lines = ["Здравствуйте! Хочу записаться на массаж."];
    lines.push("Имя: " + (fields.name || "").trim());
    lines.push("Телефон: " + (fields.phone || "").trim());
    var serviceName = (fields.service || "").trim();
    if (serviceName) {
      var price = getServicePrice(serviceName);
      if (price !== null) {
        lines.push("Услуга: " + serviceName + " — " + price + " ₽");
      } else {
        lines.push("Услуга: " + serviceName);
      }
    }
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
    SERVICE_PRICES: SERVICE_PRICES,
    getServicePrice: getServicePrice,
    isValidPhone: isValidPhone,
    buildBookingMessage: buildBookingMessage,
    buildWhatsAppLink: buildWhatsAppLink
  };

  global.Booking = Booking;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Booking;
  }
})(typeof window !== "undefined" ? window : globalThis);
