/* ============================================================
   Конфигурация сайта «Массаж лица и тела».
   ЗАМЕНИТЬ: реальные данные мамы — номер, адрес, соцсети.
   phoneDigits — только цифры, без «+» (формат для wa.me).
   ============================================================ */
(function (global) {
  "use strict";

  var CONFIG = {
    phoneDigits: "79888350003",          // WhatsApp мамы: +7 988 835-00-03
    phoneDisplay: "+7 988 835-00-03",    // как номер показывается на сайте
    address: "с. Чикола, ул. А. Макоева, д. 10", // адрес мамы
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
