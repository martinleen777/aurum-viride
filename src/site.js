// Aurum Viride: фильтры каталога и просмотр картинок (обложка-развёртка, превью страниц).
(function () {
  "use strict";
  var lang = document.documentElement.lang;
  var L = {
    en: { close: "Close", prev: "Previous", next: "Next" },
    de: { close: "Schließen", prev: "Zurück", next: "Weiter" },
    ru: { close: "Закрыть", prev: "Назад", next: "Вперёд" }
  }[lang] || { close: "Close", prev: "Previous", next: "Next" };

  // ---------- Согласие на Google Analytics ----------
  // Аналитика загружается только после «Принять». Выбор хранится в localStorage;
  // по ссылке «Настройки cookies» внизу страницы его можно изменить в любой момент.
  var GA_ID = document.documentElement.getAttribute("data-ga");
  var banner = document.querySelector(".consent");
  var CONSENT_KEY = "av-analytics-consent";

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* без сохранения выбор действует до закрытия страницы */ }
  }
  function loadAnalytics() {
    if (!GA_ID || window.__avGaLoaded) return;
    window.__avGaLoaded = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    var sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(sc);
  }
  function removeAnalytics() {
    if (GA_ID) window["ga-disable-" + GA_ID] = true;
    // Удаляем cookies Google Analytics (_ga, _ga_…) для этого домена и его родительских доменов.
    var parts = location.hostname.split(".");
    var domains = [""];
    for (var i = 0; i < parts.length - 1; i++) domains.push("; domain=." + parts.slice(i).join("."));
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name === "_gat") {
        domains.forEach(function (d) { document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d; });
      }
    });
  }
  function showBanner(show) {
    if (banner) banner.hidden = !show;
  }

  if (GA_ID && banner) {
    var consent = getConsent();
    if (consent === "granted") loadAnalytics();
    else if (consent !== "denied") showBanner(true);

    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var value = btn.getAttribute("data-consent");
      var was = getConsent();
      setConsent(value);
      showBanner(false);
      if (value === "granted") loadAnalytics();
      else {
        removeAnalytics();
        // Если аналитика уже работала на этой странице — перезагрузим её без аналитики.
        if (was === "granted" && window.__avGaLoaded) location.reload();
      }
    });
    document.querySelectorAll(".consent-open").forEach(function (b) {
      b.addEventListener("click", function () { showBanner(true); banner.querySelector("[data-consent]").focus(); });
    });
  }

  // ---------- Фильтры каталога ----------
  var filters = document.querySelector(".filters");
  if (filters) {
    filters.hidden = false;
    var state = {};
    var cards = document.querySelectorAll(".catalog .card");
    var empty = document.querySelector(".empty");
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var group = btn.closest("[data-filter]");
      group.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === btn ? "true" : "false"); });
      state[group.getAttribute("data-filter")] = btn.getAttribute("data-value");
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (!state.series || card.dataset.series === state.series) &&
          (!state.lang || card.dataset.lang === state.lang) &&
          (!state.format || card.dataset.format.split(" ").indexOf(state.format) >= 0);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // ---------- Лайтбокс ----------
  var links = Array.prototype.slice.call(document.querySelectorAll("a[data-lightbox]"));
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  var dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML =
    '<img alt="">' +
    '<button type="button" class="lb-btn lb-close" aria-label="' + L.close + '">×</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="' + L.prev + '">‹</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="' + L.next + '">›</button>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector("img");
  var group = [], index = 0;

  function show(i) {
    index = (i + group.length) % group.length;
    var a = group[index];
    var inner = a.querySelector("img");
    img.src = a.href;
    img.alt = inner ? inner.alt : "";
    dlg.classList.toggle("lb-wide", a.getAttribute("data-lightbox") === "wrap");
    dlg.querySelector(".lb-prev").hidden = dlg.querySelector(".lb-next").hidden = group.length < 2;
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var name = a.getAttribute("data-lightbox");
      group = links.filter(function (x) { return x.getAttribute("data-lightbox") === name; });
      show(group.indexOf(a));
      dlg.showModal();
    });
  });
  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  dlg.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", function (e) {
    if (group.length < 2) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dlg.addEventListener("close", function () { img.removeAttribute("src"); });
})();
