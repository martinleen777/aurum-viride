// Aurum Viride: фильтры каталога и просмотр картинок (обложка-развёртка, превью страниц).
(function () {
  "use strict";
  var lang = document.documentElement.lang;
  var L = {
    en: { close: "Close", prev: "Previous", next: "Next" },
    de: { close: "Schließen", prev: "Zurück", next: "Weiter" },
    ru: { close: "Закрыть", prev: "Назад", next: "Вперёд" }
  }[lang] || { close: "Close", prev: "Previous", next: "Next" };

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
