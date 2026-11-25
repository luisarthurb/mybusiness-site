// Preenche dados de contato e links a partir do config.js (fonte única).
(function () {
  "use strict";
  var C = window.CONFIG || {};
  document.querySelectorAll("[data-contact-name]").forEach(function (n) {
    n.textContent = C.CONTACT_NAME || "—";
  });
  document.querySelectorAll("[data-contact-email]").forEach(function (a) {
    if (!C.CONTACT_EMAIL) return;
    a.textContent = C.CONTACT_EMAIL;
    a.href = "mailto:" + C.CONTACT_EMAIL;
  });
  document.querySelectorAll(".insta-link").forEach(function (a) { a.href = C.INSTAGRAM_URL || "#"; });
})();
