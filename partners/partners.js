(function () {
  "use strict";

  var pageOpenedAt = Date.now();
  var form = document.getElementById("partner-form");
  var status = document.getElementById("form-status");
  var message = document.getElementById("message");
  var messageCount = document.querySelector("#message-count span");

  function track(eventName, details) {
    var safeDetails = details || {};
    window.dispatchEvent(new CustomEvent("bzzy:analytics", { detail: { event: eventName, properties: safeDetails } }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: eventName }, safeDetails));
  }

  track("partners_page_view");

  if (message && messageCount) {
    message.addEventListener("input", function () { messageCount.textContent = String(message.value.length); });
  }

  document.querySelectorAll("[data-track]").forEach(function (link) {
    link.addEventListener("click", function () { track(link.dataset.track); });
  });

  var tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  var panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  function selectTab(tab, setFocus) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel) { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
    if (setFocus) tab.focus();
    track("partners_product_tab_view", { tab: tab.dataset.tab });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (event) {
      var nextIndex;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (typeof nextIndex === "number") { event.preventDefault(); selectTab(tabs[nextIndex], true); }
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (item) { observer.observe(item); });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = "form-status " + (type || "");
  }

  function readLastSubmission(key) {
    try { return Number(localStorage.getItem(key) || 0); }
    catch (error) { return 0; }
  }

  function rememberSubmission(key) {
    try { localStorage.setItem(key, String(Date.now())); }
    catch (error) { /* Submission still succeeded if browser storage is unavailable. */ }
  }

  function populateAttribution() {
    var params = new URLSearchParams(window.location.search);
    var fields = {
      page_url: window.location.href,
      referrer: document.referrer,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || ""
    };
    Object.keys(fields).forEach(function (name) {
      if (form.elements[name]) form.elements[name].value = fields[name];
    });
  }

  function ajaxEndpoint(action) {
    var url = new URL(action);
    url.pathname = "/ajax" + url.pathname;
    return url.href;
  }

  function clearErrors() {
    form.querySelectorAll(".field-error").forEach(function (error) { error.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (input) { input.removeAttribute("aria-invalid"); });
  }

  function showFieldError(input, message) {
    input.setAttribute("aria-invalid", "true");
    var error = document.createElement("p");
    error.className = "field-error";
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
  }

  function validateForm() {
    clearErrors();
    var valid = true;
    Array.from(form.querySelectorAll("input[required], select[required], textarea[required]")).forEach(function (input) {
      if (!input.validity.valid) {
        valid = false;
        var message = input.validity.typeMismatch ? "Enter a valid value." : "This field is required.";
        showFieldError(input, message);
      }
    });
    var website = form.elements.website;
    if (website.value && !website.validity.valid) { valid = false; showFieldError(website, "Enter a complete URL, including https://."); }
    return valid;
  }

  if (form) {
    // JavaScript-enhanced submissions use the inline accessible error treatment.
    // Without JavaScript, the browser's native validation remains active.
    form.noValidate = true;
    var started = false;
    form.addEventListener("focusin", function () {
      if (!started) { started = true; track("partners_inquiry_start"); }
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      populateAttribution();
      showStatus("", "");
      if (!validateForm()) {
        showStatus("Please review the highlighted fields.", "error");
        var firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (form.elements._honey.value || Date.now() - pageOpenedAt < 3000) {
        showStatus("Please wait a moment and try again.", "error");
        track("partners_inquiry_submit_error", { reason: "spam_check" });
        return;
      }

      var emailKey = String(form.elements.email.value || "").trim().toLowerCase();
      var duplicateKey = "bzzy-partner-inquiry:" + emailKey;
      var lastSubmission = readLastSubmission(duplicateKey);
      if (Date.now() - lastSubmission < 24 * 60 * 60 * 1000) {
        showStatus("We already received an inquiry from this email in the last 24 hours. We’ll be in touch.", "success");
        return;
      }

      var button = form.querySelector("button[type='submit']");
      button.disabled = true;
      button.querySelector("span").textContent = "Sending…";
      showStatus("Sending your inquiry…", "");

      var controller = typeof AbortController === "function" ? new AbortController() : null;
      var timeout = window.setTimeout(function () { if (controller) controller.abort(); }, 15000);
      try {
        var response = await fetch(ajaxEndpoint(form.action), { method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: controller ? controller.signal : undefined });
        var payload = await response.json().catch(function () { return {}; });
        if (!response.ok || payload.success === false) throw new Error("Submission failed");
        rememberSubmission(duplicateKey);
        form.reset();
        showStatus("Thanks—your inquiry is on its way. The Bzzy team will follow up by email.", "success");
        track("partners_inquiry_submit_success");
      } catch (error) {
        var timedOut = error && error.name === "AbortError";
        showStatus(timedOut ? "The request took too long. Please try again, or email hello@bzzy.app." : "We couldn’t send your inquiry. Please try again, or email hello@bzzy.app.", "error");
        track("partners_inquiry_submit_error", { reason: timedOut ? "timeout" : "network_or_provider" });
      } finally {
        window.clearTimeout(timeout);
        button.disabled = false;
        button.querySelector("span").textContent = "Request a conversation";
      }
    });
  }
})();
