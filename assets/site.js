/*
  Общий код сайта: шапка, подвал, переключатель темы, рисованные обложки
  и вывод книг/журналов из data/books.js.
  Для обычной работы с сайтом этот файл менять не нужно.
*/
(function () {
  "use strict";

  var AV = window.AV || { SITE: {}, BOOKS: [], JOURNALS: [] };
  var SITE = AV.SITE || {};
  var BOOKS = AV.BOOKS || [];
  var JOURNALS = AV.JOURNALS || [];

  // ---------- Меню сайта (пункты меню меняются здесь) ----------
  var NAV = [
    { href: "index.html", label: "Главная", page: "home" },
    { href: "books.html", label: "Книги", page: "books" },
    { href: "journals.html", label: "Журналы", page: "journals" },
    { href: "about.html", label: "О нас", page: "about" }
  ];

  // ---------- Утилиты ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function paragraphs(d) {
    if (!d) return [];
    return Array.isArray(d) ? d : String(d).split(/\n\s*\n/);
  }
  function itemUrl(item) { return "item.html?id=" + encodeURIComponent(item.id); }
  function kindOf(item) { return JOURNALS.indexOf(item) >= 0 ? "journal" : "book"; }
  function byYearDesc(a, b) { return (b.year || 0) - (a.year || 0); }

  // ---------- Тема ----------
  var THEME_KEY = "av-theme";
  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  function currentTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(storedTheme());

  // ---------- Эмблема ----------
  var EMBLEM =
    '<svg class="emblem" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width=".75" stroke-dasharray="1 2.2"/>' +
    '<path d="M24 37 C 14 30, 14 18, 24 10 C 34 18, 34 30, 24 37 Z" fill="var(--leaf)"/>' +
    '<path d="M24 36 L24 14 M24 22 L19.5 18 M24 27 L28.5 22.5 M24 31 L20 28" stroke="var(--gold)" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
    "</svg>";

  // ---------- Рисованные обложки ----------
  var PALETTES = {
    emerald: ["#21614a", "#0d3124", "#d9b866", "#f3ead2"],
    forest:  ["#2e4d31", "#132515", "#e2c172", "#f1ead6"],
    olive:   ["#62652c", "#2d2f13", "#efd58e", "#f6efd9"],
    teal:    ["#1f585d", "#0b2a2e", "#dcbc6c", "#eef0e4"],
    gold:    ["#c9a24a", "#8a6620", "#183326", "#1b2a22"],
    wine:    ["#64212e", "#2e0e16", "#e0be70", "#f4e9d8"],
    ink:     ["#26332e", "#0f1714", "#d8b765", "#efe8d5"]
  };

  function wrap(text, max, maxLines) {
    var words = String(text || "").split(/\s+/).filter(Boolean);
    var lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= max) cur += " " + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
    }
    return lines;
  }

  var coverSeq = 0;
  function coverSvg(item) {
    var p = PALETTES[item.color] || PALETTES.emerald;
    var id = "g" + (++coverSeq);
    var isJournal = kindOf(item) === "journal";
    var s = '<svg class="cover-svg" viewBox="0 0 300 450" role="img" aria-label="Обложка: ' + esc(item.title) + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient>' +
      '<pattern id="' + id + 'p" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<line x1="0" y1="0" x2="0" y2="14" stroke="' + p[2] + '" stroke-opacity=".07" stroke-width="6"/></pattern></defs>' +
      '<rect width="300" height="450" fill="url(#' + id + ')"/>' +
      '<rect width="300" height="450" fill="url(#' + id + 'p)"/>' +
      '<rect x="0" y="0" width="10" height="450" fill="#000" opacity=".18"/>';

    if (isJournal) {
      s += '<text x="150" y="92" text-anchor="middle" class="c-mast" fill="' + p[3] + '">' + esc(item.title) + '</text>' +
        '<line x1="28" y1="112" x2="272" y2="112" stroke="' + p[2] + '" stroke-width="1.5"/>' +
        '<line x1="28" y1="117" x2="272" y2="117" stroke="' + p[2] + '" stroke-width=".6"/>' +
        '<text x="28" y="138" class="c-small" fill="' + p[2] + '">' + esc(item.issue || "") + '</text>' +
        '<text x="272" y="138" text-anchor="end" class="c-small" fill="' + p[2] + '">' + esc(item.year || "") + '</text>' +
        '<g transform="translate(150 265)">' +
        '<circle r="70" fill="none" stroke="' + p[2] + '" stroke-width="1"/>' +
        '<circle r="58" fill="none" stroke="' + p[2] + '" stroke-width=".6" stroke-dasharray="2 4"/>' +
        '<path d="M0 46 C -32 22, -32 -22, 0 -50 C 32 -22, 32 22, 0 46 Z" fill="' + p[2] + '" opacity=".9"/>' +
        '<path d="M0 44 L0 -36 M0 -8 L-14 -22 M0 10 L14 -4 M0 26 L-12 14" stroke="' + p[1] + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        "</g>";
      wrap(item.topic || "", 26, 2).forEach(function (l, i) {
        s += '<text x="150" y="' + (382 + i * 18) + '" text-anchor="middle" class="c-sub" fill="' + p[3] + '">' + esc(l) + "</text>";
      });
    } else {
      s += '<rect x="22" y="22" width="256" height="406" fill="none" stroke="' + p[2] + '" stroke-width="1.2"/>' +
        '<rect x="28" y="28" width="244" height="394" fill="none" stroke="' + p[2] + '" stroke-width=".5"/>' +
        '<text x="150" y="70" text-anchor="middle" class="c-small" fill="' + p[2] + '">' + esc(item.author || "") + '</text>' +
        '<g transform="translate(150 140)">' +
        '<circle r="34" fill="none" stroke="' + p[2] + '" stroke-width="1"/>' +
        '<path d="M0 24 C -16 12, -16 -12, 0 -26 C 16 -12, 16 12, 0 24 Z" fill="' + p[2] + '"/>' +
        '<path d="M0 22 L0 -18 M0 -4 L-7 -11 M0 6 L7 -1" stroke="' + p[1] + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        "</g>";
      var lines = wrap(item.title, 13, 4);
      var y0 = 240 - (lines.length - 1) * 19;
      lines.forEach(function (l, i) {
        s += '<text x="150" y="' + (y0 + i * 38) + '" text-anchor="middle" class="c-title" fill="' + p[3] + '">' + esc(l) + "</text>";
      });
      if (item.subtitle) {
        s += '<text x="150" y="' + (y0 + lines.length * 38 + 6) + '" text-anchor="middle" class="c-sub" fill="' + p[2] + '">' + esc(item.subtitle) + "</text>";
      }
      s += '<line x1="120" y1="372" x2="180" y2="372" stroke="' + p[2] + '" stroke-width=".8"/>' +
        '<text x="150" y="398" text-anchor="middle" class="c-small" fill="' + p[2] + '">AURUM VIRIDE</text>';
    }
    return s + "</svg>";
  }

  function coverHtml(item) {
    var inner = item.cover
      ? '<img src="' + esc(item.cover) + '" alt="Обложка: ' + esc(item.title) + '" loading="lazy">'
      : coverSvg(item);
    var badge = item.example ? '<span class="example-badge">Пример — заменить</span>' : "";
    return '<div class="cover' + (kindOf(item) === "journal" ? " cover--journal" : "") + '">' + inner + badge + "</div>";
  }

  // ---------- Карточка ----------
  function card(item) {
    var isJournal = kindOf(item) === "journal";
    var meta = isJournal
      ? [item.issue, item.year].filter(Boolean).join(" · ")
      : [item.author, item.year].filter(Boolean).join(" · ");
    return '<article class="card"><a class="card-link" href="' + itemUrl(item) + '">' +
      coverHtml(item) +
      '<div class="card-body">' +
      '<p class="card-kicker">' + esc(isJournal ? (item.topic || "Журнал") : (item.genre || "Книга")) + "</p>" +
      '<h3 class="card-title">' + esc(item.title) + "</h3>" +
      '<p class="card-meta">' + esc(meta) + "</p>" +
      (item.short ? '<p class="card-text">' + esc(item.short) + "</p>" : "") +
      "</div></a></article>";
  }

  function grid(items, cls) {
    if (!items.length) return '<p class="empty">Пока здесь пусто.</p>';
    return '<div class="grid ' + (cls || "") + '">' + items.map(card).join("") + "</div>";
  }

  // ---------- Шапка и подвал ----------
  function renderChrome(page) {
    var header = $("#site-header");
    if (header) {
      header.innerHTML =
        '<div class="wrap header-inner">' +
        '<a class="brand" href="index.html">' + EMBLEM +
        '<span class="brand-text"><span class="brand-name">Aurum Viride</span>' +
        '<span class="brand-tag">' + esc(SITE.tagline || "") + "</span></span></a>" +
        '<button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Меню">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
        '<nav id="site-nav" class="nav" aria-label="Основное меню">' +
        NAV.map(function (n) {
          return '<a href="' + n.href + '"' + (n.page === page ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
        }).join("") +
        "</nav>" +
        '<button class="icon-btn theme-btn" type="button" aria-label="Сменить тему">' +
        '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
        "</button></div>";

      var menuBtn = $(".menu-btn", header);
      menuBtn.addEventListener("click", function () {
        var open = header.classList.toggle("nav-open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $(".theme-btn", header).addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* без сохранения */ }
      });
    }

    var footer = $("#site-footer");
    if (footer) {
      var links = (SITE.links || []).map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
      }).join("");
      footer.innerHTML =
        '<div class="wrap footer-inner">' +
        '<div class="footer-brand">' + EMBLEM + "<div><strong>Aurum Viride</strong><br><span>" + esc(SITE.tagline || "") + "</span></div></div>" +
        '<div class="footer-contacts">' +
        (SITE.email ? '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>" : "") +
        (SITE.phone ? '<a href="tel:' + esc(SITE.phone.replace(/[^\d+]/g, "")) + '">' + esc(SITE.phone) + "</a>" : "") +
        "</div>" +
        '<div class="footer-links">' + links + "</div>" +
        '<p class="footer-copy">© ' + new Date().getFullYear() + " Aurum Viride</p>" +
        "</div>";
    }
  }

  // ---------- Страницы ----------
  function renderHome() {
    var el = $("#home-books");
    if (el) el.innerHTML = grid(BOOKS.slice().sort(byYearDesc).slice(0, 3));
    var jl = $("#home-journals");
    if (jl) jl.innerHTML = grid(JOURNALS.slice().sort(byYearDesc).slice(0, 2), "grid--journals");
  }

  function renderBooks() {
    var list = $("#books-list");
    var filters = $("#books-filters");
    var search = $("#books-search");
    if (!list) return;
    var genres = [];
    BOOKS.forEach(function (b) { if (b.genre && genres.indexOf(b.genre) < 0) genres.push(b.genre); });
    var active = "";

    if (filters) {
      filters.innerHTML = ["Все"].concat(genres).map(function (g, i) {
        return '<button type="button" class="chip" data-genre="' + (i ? esc(g) : "") + '" aria-pressed="' + (i ? "false" : "true") + '">' + esc(g) + "</button>";
      }).join("");
      filters.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        active = b.getAttribute("data-genre");
        Array.prototype.forEach.call(filters.querySelectorAll(".chip"), function (c) {
          c.setAttribute("aria-pressed", c === b ? "true" : "false");
        });
        draw();
      });
    }
    if (search) search.addEventListener("input", draw);

    function draw() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var items = BOOKS.slice().sort(byYearDesc).filter(function (b) {
        if (active && b.genre !== active) return false;
        if (!q) return true;
        return [b.title, b.subtitle, b.author, b.genre].join(" ").toLowerCase().indexOf(q) >= 0;
      });
      list.innerHTML = items.length ? grid(items) : '<p class="empty">Ничего не найдено.</p>';
    }
    draw();
  }

  function renderJournals() {
    var el = $("#journals-list");
    if (el) el.innerHTML = grid(JOURNALS.slice().sort(byYearDesc), "grid--journals");
  }

  function row(label, value) {
    return value ? "<div><dt>" + label + "</dt><dd>" + esc(value) + "</dd></div>" : "";
  }

  function renderItem() {
    var el = $("#item");
    if (!el) return;
    var id = new URLSearchParams(location.search).get("id");
    var all = BOOKS.concat(JOURNALS);
    var item = all.filter(function (x) { return x.id === id; })[0];
    if (!item) {
      document.title = "Не найдено — Aurum Viride";
      el.innerHTML = '<div class="notfound"><h1>Издание не найдено</h1><p>Возможно, ссылка устарела. Загляните в <a href="books.html">каталог книг</a> или <a href="journals.html">журналы</a>.</p></div>';
      return;
    }
    var isJournal = kindOf(item) === "journal";
    document.title = item.title + " — Aurum Viride";
    var back = isJournal ? '<a href="journals.html">Журналы</a>' : '<a href="books.html">Книги</a>';

    var details = isJournal
      ? row("Выпуск", item.issue) + row("Год", item.year) + row("Тематика", item.topic) + row("Страниц", item.pages)
      : row("Автор", item.author) + row("Год", item.year) + row("Жанр", item.genre) + row("Страниц", item.pages) +
        row("Формат", item.format) + row("ISBN", item.isbn);

    var contents = (item.contents && item.contents.length)
      ? '<h2 class="h-sub">Содержание</h2><ol class="toc">' + item.contents.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ol>"
      : "";

    // Кнопки магазинов: показываются, только если ссылка заполнена.
    var buy =
      (item.amazon_url ? '<a class="btn" href="' + esc(item.amazon_url) + '" target="_blank" rel="noopener">Купить на Amazon</a>' : "") +
      (item.apple_books_url ? '<a class="btn btn--ghost" href="' + esc(item.apple_books_url) + '" target="_blank" rel="noopener">Читать в Apple Books</a>' : "");

    var related = (isJournal ? JOURNALS : BOOKS).filter(function (x) { return x !== item; }).slice(0, 3);

    el.innerHTML =
      '<nav class="crumbs" aria-label="Навигация"><a href="index.html">Главная</a><span>/</span>' + back + "</nav>" +
      '<div class="item">' +
      '<div class="item-cover">' + coverHtml(item) + "</div>" +
      '<div class="item-body">' +
      '<p class="eyebrow">' + esc(isJournal ? "Журнал" : (item.genre || "Книга")) + "</p>" +
      '<h1 class="item-title">' + esc(item.title) + "</h1>" +
      (item.subtitle ? '<p class="item-subtitle">' + esc(item.subtitle) + "</p>" : "") +
      (!isJournal && item.author ? '<p class="item-author">' + esc(item.author) + "</p>" : "") +
      (isJournal && item.issue ? '<p class="item-author">' + esc(item.issue) + "</p>" : "") +
      '<div class="prose">' + paragraphs(item.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
      contents +
      '<dl class="specs">' + details + "</dl>" +
      (buy ? '<div class="actions">' + buy + "</div>" : "") +
      "</div></div>" +
      (related.length ? '<section class="section"><div class="section-head"><h2>' + (isJournal ? "Другие журналы" : "Другие книги") + "</h2></div>" + grid(related, isJournal ? "grid--journals" : "") + "</section>" : "");
  }

  function renderAbout() {
    var el = $("#contacts");
    if (!el) return;
    var rows = "";
    if (SITE.email) rows += '<div><dt>Почта</dt><dd><a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a></dd></div>";
    if (SITE.phone) rows += '<div><dt>Телефон</dt><dd><a href="tel:' + esc(SITE.phone.replace(/[^\d+]/g, "")) + '">' + esc(SITE.phone) + "</a></dd></div>";
    rows += row("Адрес", SITE.address) + row("Часы работы", SITE.hours);
    (SITE.links || []).forEach(function (l) {
      rows += "<div><dt>" + esc(l.label) + '</dt><dd><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.url.replace(/^https?:\/\//, "")) + "</a></dd></div>";
    });
    el.innerHTML = '<dl class="specs specs--contacts">' + rows + "</dl>";
  }

  // ---------- Запуск ----------
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    renderChrome(page);
    ({ home: renderHome, books: renderBooks, journals: renderJournals, item: renderItem, about: renderAbout }[page] || function () {})();
  });
})();
