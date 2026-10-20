(function () {
  "use strict";

  var section = document.querySelector(".support-section");
  var link = document.querySelector("[data-venmo-link]");
  var configuredUrl = window.BZZY_CONFIG && window.BZZY_CONFIG.venmoUrl;

  if (!section || !link || typeof configuredUrl !== "string") return;

  try {
    var url = new URL(configuredUrl);
    var isVenmoHost = url.hostname === "venmo.com" || url.hostname.endsWith(".venmo.com");

    if (url.protocol !== "https:" || !isVenmoHost) return;

    link.href = url.href;
    section.hidden = false;
    document.documentElement.classList.add("venmo-support-enabled");

    if (window.location.hash === "#support") section.scrollIntoView();
  } catch (error) {
    // Invalid or incomplete configuration: keep the support section hidden.
  }
})();
