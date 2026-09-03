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
