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
})();
