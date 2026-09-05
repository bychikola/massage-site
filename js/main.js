(function () {
  "use strict";

  /* ===== Мобильное меню ===== */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  nav.inert = true; /* закрытое меню выпадает из фокус-навигации */

  function setMenu(open) {
    nav.classList.toggle("nav--open", open);
    nav.inert = !open;
    burger.classList.toggle("burger--open", open);
    burger.setAttribute("aria-expanded", String(open));
  }

  burger.addEventListener("click", function () {
    var willOpen = !nav.classList.contains("nav--open");
    setMenu(willOpen);
    if (willOpen) {
      var firstLink = nav.querySelector("a");
      if (firstLink) { firstLink.focus(); }
    }
  });

  /* Закрывать меню после клика по ссылке */
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      setMenu(false);
      burger.focus();
    }
  });

  /* Закрывать меню по Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("nav--open")) {
      setMenu(false);
      burger.focus();
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

  /* ===== Форма записи → WhatsApp ===== */
  var form = document.getElementById("bookingForm");
  var formError = document.getElementById("formError");
  var formFallback = document.getElementById("formFallback");
  var formMessage = document.getElementById("formMessage");
  var copyBtn = document.getElementById("copyBtn");
  var copyOk = document.getElementById("copyOk");
  var serviceHint = document.getElementById("bfServiceHint");
  var serviceSelect = document.getElementById("bfService");

  /* Подсказка с ценой при выборе услуги */
  function updateServiceHint() {
    var name = serviceSelect.value;
    if (!name) { serviceHint.textContent = ""; return; }
    var price = Booking.getServicePrice(name);
    serviceHint.textContent = price !== null
      ? "Стоимость: " + price + " ₽ — эта цена уйдёт Альбине в WhatsApp"
      : "Цена не указана — Альбина уточнит стоимость в переписке";
  }
  serviceSelect.addEventListener("change", updateServiceHint);

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
})();
