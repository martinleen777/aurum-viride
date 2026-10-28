// Генератор сайта Aurum Viride: читает kit/data/books.json и собирает статический сайт в _site/.
// Запуск: node src/build.mjs   (SITE_URL=https://... — адрес сайта для canonical, sitemap и OpenGraph)

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GA_ID } from "./config.mjs";
import { LANGS, DEFAULT_LANG, LANG_NAMES, SERIES, T, ABOUT, IMPRESSUM, PRIVACY } from "./i18n.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = path.join(ROOT, "kit");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "_site");

const data = JSON.parse(fs.readFileSync(path.join(KIT, "data/books.json"), "utf8"));
const SITE_URL = (process.env.SITE_URL || "https://" + (data.domain || "aurumviride.com")).replace(/\/+$/, "");
const BASE_PATH = new URL(SITE_URL + "/").pathname; // "/" или "/aurum-viride/"
const NAME = "Aurum Viride";
const EDITOR = "Leonid Dudakov";
const LOCALES = { en: "en_US", de: "de_DE", ru: "ru_RU" };
// Метка версии в адресах стилей и скрипта: после обновления сайта браузер сразу берёт новые файлы, а не старые из кеша.
const version = (file) => crypto.createHash("sha1").update(fs.readFileSync(path.join(SRC, file))).digest("hex").slice(0, 10);
const ASSET_V = { css: version("style.css"), js: version("site.js") };

// ---------- утилиты ----------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stripTags = (s) => String(s ?? "").replace(/<[^>]+>/g, "");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

function write(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
function copyDir(from, to) {
  if (fs.existsSync(from)) fs.cpSync(from, path.join(OUT, to), { recursive: true });
}
function fail(msg) {
  console.error("Ошибка в kit/data/books.json: " + msg);
  process.exit(1);
}

// ---------- данные ----------
const seriesById = Object.fromEntries(SERIES.map((s, i) => [s.id, { ...s, order: i }]));
const BOOKS = data.books.map((b, i) => {
  if (!b.id || !/^[a-z0-9-]+$/.test(b.id)) fail(`у книги №${i + 1} неверный id «${b.id}» (только латиница, цифры и дефис)`);
  if (!seriesById[b.series]) fail(`у книги «${b.id}» неизвестная серия «${b.series}»`);
  if (!LANGS.includes(b.language)) fail(`у книги «${b.id}» неизвестный язык «${b.language}»`);
  if (!b.cover || !fs.existsSync(path.join(KIT, b.cover))) fail(`у книги «${b.id}» нет файла обложки «${b.cover}»`);
  return { ...b, _i: i, _series: seriesById[b.series] };
});
const ids = new Set();
BOOKS.forEach((b) => { if (ids.has(b.id)) fail(`id «${b.id}» встречается дважды`); ids.add(b.id); });

const isJournal = (b) => !!b._series.journal;
// Каждая языковая версия сайта показывает только книги на своём языке.
const booksIn = (lang) => BOOKS.filter((b) => b.language === lang);
// Одна и та же книга на разных языках: серия + том (у номеров журнала — id без языкового окончания).
const editionKey = (b) => (isJournal(b) ? b.id.replace(/-(en|de|ru)$/, "") : `${b.series}|${b.volume || 0}`);
const editionsOf = (b) => BOOKS.filter((x) => x !== b && editionKey(x) === editionKey(b));
const formatsOf = (b) => b.formats || [];
const hasPrint = (b) => formatsOf(b).some((f) => f !== "ebook");
const hasEbook = (b) => formatsOf(b).includes("ebook");
const kitExists = (p) => p && fs.existsSync(path.join(KIT, p));

// Книги на языке версии — первыми, затем по серии, тому и порядку в books.json.
function sortFor(lang, list) {
  return [...list].sort((a, b) =>
    (a.language !== lang) - (b.language !== lang) ||
    a._series.order - b._series.order ||
    (a.volume || 0) - (b.volume || 0) ||
    a._i - b._i);
}

function storeLinks(b) {
  const l = b.links || {};
  const out = [];
  if (l.amazon) out.push({ url: l.amazon, label: "Amazon" });
  if (l.apple_books) out.push({ url: l.apple_books, label: "Apple Books" });
  if (l.other) {
    const o = typeof l.other === "string" ? { url: l.other } : l.other;
    if (o.url) out.push({ url: o.url, label: o.label || null, other: true });
  }
  return out;
}

function storeButtons(b, lang) {
  const links = storeLinks(b);
  if (!links.length) return `<div class="stores"><span class="store store--soon" aria-disabled="true">${T[lang].coming_soon}</span></div>`;
  return `<div class="stores">${links.map((l, i) =>
    `<a class="store${i ? "" : " store--primary"}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || T[lang].other_link)}</a>`).join("")}</div>`;
}

function formatPrice(price, lang) {
  if (price == null) return "";
  if (typeof price === "object" && price.amount != null) {
    try {
      return new Intl.NumberFormat(lang, { style: "currency", currency: price.currency || "EUR" }).format(price.amount);
    } catch { return `${price.amount} ${price.currency || ""}`.trim(); }
  }
  return String(price);
}

function trimText(b, lang) {
  if (!b.trim_in) return "";
  const n = (x) => (lang === "en" ? String(x) : String(x).replace(".", ","));
  return `${n(b.trim_in[0])} × ${n(b.trim_in[1])} ${T[lang].inches}`;
}

function formatsText(b, lang) {
  return formatsOf(b).map((f) => (f === "ebook" ? T[lang].ebook : f === "paperback" ? T[lang].paperback : f)).join(" · ");
}

const subline = (b) => b.volume_title || b.issue || "";
const fullTitle = (b) => [b.title, subline(b)].filter(Boolean).join(" — ");

// ---------- разметка ----------
function picture(b, root, { sizes = "(max-width: 600px) 45vw, 220px", eager = false } = {}) {
  const alt = esc(fullTitle(b));
  const webp = kitExists(b.cover_web) ? `<source type="image/webp" srcset="${root}${b.cover_web} 640w" sizes="${sizes}">` : "";
  return `<picture>${webp}<img src="${root}${b.cover}" srcset="${root}${b.cover} 1600w" sizes="${sizes}" width="640" height="1024" alt="${alt}"${eager ? "" : ' loading="lazy"'} decoding="async"></picture>`;
}

function card(b, lang, root, showSeries) {
  const s = b._series;
  const meta = isJournal(b) ? (b.issue || "") : [showSeries && s.name[lang] !== b.title ? s.name[lang] : "", b.volume ? `${T[lang].volume} ${roman(b.volume)}` : ""].filter(Boolean).join(" · ");
  const fmt = [hasPrint(b) ? "print" : "", hasEbook(b) ? "ebook" : ""].filter(Boolean).join(" ");
  return `<li class="card" data-series="${b.series}" data-lang="${b.language}" data-format="${fmt}">
<a href="${root}${lang}/books/${b.id}/">
<span class="card-cover">${picture(b, root)}</span>
<span class="card-title" lang="${b.language}">${esc(b.title)}</span>
${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}
</a></li>`;
}

const roman = (n) => ["", "I", "II", "III", "IV", "V", "VI"][n] || String(n);

function grid(list, lang, root, cls = "", showSeries = false) {
  return `<ul class="grid ${cls}">${list.map((b) => card(b, lang, root, showSeries)).join("")}</ul>`;
}

// alts — адреса этой же страницы на других языках: { en: "books/x/", de: "books/y/" }.
// Если версии на каком-то языке нет, переключатель языка ведёт на главную этого языка.
const SITEMAP = [];
function layout({ lang, rel, title, description, body, root, ogImage, ogType = "website", jsonld, noindex = false, alts }) {
  const t = T[lang];
  const pageUrl = `${SITE_URL}/${lang}/${rel}`;
  alts = alts || Object.fromEntries(LANGS.map((l) => [l, rel]));
  if (!noindex) SITEMAP.push({ lang, rel, alts });
  const alt = noindex ? "" : hreflangLinks(alts).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${href}">`).join("\n");
  const nav = [
    ["", t.nav_home],
    ["books/", t.nav_books],
    ["about/", t.nav_about],
  ].map(([href, label]) => {
    const current = rel === href || (href && rel.startsWith(href) && href !== "about/");
    return `<a href="${root}${lang}/${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");
  const switcher = LANGS.map((l) =>
    `<a href="${root}${l}/${alts[l] ?? ""}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ""} title="${LANG_NAMES[l]}">${l.toUpperCase()}</a>`).join("");
  const fullTitle = title ? `${title} — ${NAME}` : `${NAME} — ${t.motto}`;
  const img = ogImage || `${SITE_URL}/assets/img/icon-512.png`;

  return `<!doctype html>
<html lang="${lang}"${GA_ID ? ` data-ga="${esc(GA_ID)}"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${pageUrl}">`}
${alt}
<meta property="og:site_name" content="${NAME}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title || NAME)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="${LOCALES[lang]}">
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALES[l]}">`).join("\n")}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="${root}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="${root}assets/style.css?v=${ASSET_V.css}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>` : ""}
<script src="${root}assets/site.js?v=${ASSET_V.js}" defer></script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
<div class="wrap header-inner">
<a class="brand" href="${root}${lang}/">${NAME}</a>
<nav class="nav" aria-label="${esc(t.nav_home)}">${nav}</nav>
<nav class="langs" aria-label="${esc(t.language)}">${switcher}</nav>
</div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
<div class="wrap footer-inner">
<p class="footer-name">${NAME}</p>
<p class="footer-motto">${esc(t.motto)}</p>
<nav class="footer-links"><a href="${root}${lang}/books/">${t.nav_books}</a><a href="${root}${lang}/about/">${t.nav_about}</a><a href="${root}${lang}/impressum/">${t.impressum}</a><a href="${root}${lang}/privacy/">${t.privacy}</a>${GA_ID ? `<button type="button" class="consent-open">${t.consent_settings}</button>` : ""}</nav>
</div>
</footer>
${GA_ID ? consentBanner(t, root, lang) : ""}
</body>
</html>
`;
}

function hreflangLinks(alts) {
  const list = LANGS.filter((l) => alts[l] != null).map((l) => [l, `${SITE_URL}/${l}/${alts[l]}`]);
  if (list.length > 1) list.push(["x-default", `${SITE_URL}/${alts[DEFAULT_LANG] != null ? DEFAULT_LANG : list[0][0]}/${alts[DEFAULT_LANG] ?? alts[list[0][0]]}`]);
  return list.length > 1 ? list : [];
}

// Баннер согласия на аналитику: показывается скриптом site.js, пока посетитель не выбрал.
// Кнопки «Принять» и «Отклонить» одинаково заметны — так требуют немецкие надзорные органы.
function consentBanner(t, root, lang) {
  return `<section class="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title" hidden>
<p class="consent-title" id="consent-title">${t.consent_title}</p>
<p class="consent-text">${esc(t.consent_text)} <a href="${root}${lang}/privacy/">${t.consent_more}</a></p>
<div class="consent-actions">
<button type="button" class="btn consent-btn" data-consent="denied">${t.consent_decline}</button>
<button type="button" class="btn consent-btn" data-consent="granted">${t.consent_accept}</button>
</div>
</section>`;
}

const rootFor = (lang, rel) => "../".repeat(1 + rel.split("/").filter(Boolean).length);

// ---------- страницы ----------
function homePage(lang) {
  const t = T[lang], rel = "", root = rootFor(lang, rel);
  const sorted = sortFor(lang, booksIn(lang));
  const inSeries = (id) => sorted.filter((b) => b.series === id);

  // Веер обложек под заголовком: по книге из каждой серии, на языке версии — в центре.
  const bb = inSeries("building-boats"), oar = inSeries("under-oar-and-sail"), ws = inSeries("wassersport-1885-issues");
  const fan = [ws[0], oar.find((b) => b.volume === 1), bb[0], oar.find((b) => b.volume === 2), ws[1]].filter(Boolean);
  if (fan.length % 2 === 0) fan.shift(); // нечётное число обложек — веер симметричен
  const hero = `<section class="hero">
<div class="wrap">
<p class="hero-kicker">${NAME}</p>
<h1 class="hero-title">${esc(t.motto)}</h1>
<p class="hero-lead">${esc(t.hero_lead)}</p>
<p class="hero-actions"><a class="btn btn--primary" href="${root}${lang}/books/">${t.to_catalog}</a><a class="btn btn--link" href="${root}${lang}/about/">${t.about_project} ›</a></p>
</div>
<div class="hero-fan">${fan.map((b, i) => `<a class="fan-item fan-d${Math.abs(i - Math.floor(fan.length / 2))}" href="${root}${lang}/books/${b.id}/" tabindex="-1">${picture(b, root, { sizes: "(max-width: 600px) 40vw, 260px", eager: true })}</a>`).join("")}</div>
</section>`;

  // Серия из одной книги показывается крупным блоком «Рекомендуем», остальные — полкой обложек.
  const featured = (f) => `<section class="featured">
<div class="wrap featured-inner">
<a class="featured-cover" href="${root}${lang}/books/${f.id}/">${picture(f, root, { sizes: "(max-width: 760px) 60vw, 380px" })}</a>
<div class="featured-text">
<p class="eyebrow">${t.featured}</p>
<h2 lang="${f.language}">${esc(f.title)}</h2>
${f.subtitle ? `<p class="featured-sub" lang="${f.language}">${esc(f.subtitle)}</p>` : ""}
${(f.blurb || [])[0] ? `<p class="featured-blurb" lang="${f.language}">${esc(f.blurb[0])}</p>` : ""}
<p class="hero-actions"><a class="btn btn--primary" href="${root}${lang}/books/${f.id}/">${t.more_about_book}</a></p>
</div>
</div>
</section>`;

  const seriesBlocks = SERIES.map((s) => {
    const books = inSeries(s.id);
    if (!books.length) return "";
    if (books.length === 1) return featured(books[0]);
    return `<section class="shelf">
<div class="wrap">
<header class="shelf-head">
<h2><a href="${root}${lang}/series/${s.id}/">${esc(s.name[lang])}</a></h2>
<p>${esc(s.text[lang])}</p>
</header>
</div>
<div class="shelf-row">${grid(books, lang, root, "row")}</div>
<p class="more"><a href="${root}${lang}/series/${s.id}/">${t.view_series} ›</a></p>
</section>`;
  });

  const body = `${hero}
${seriesBlocks.join("\n")}
<section class="about-short">
<div class="wrap">
<h2>${t.about_project}</h2>
<p>${ABOUT[lang]}</p>
<p><a class="btn btn--outline" href="${root}${lang}/about/">${t.about_project} ›</a></p>
</div>
</section>`;
  write(`${lang}/index.html`, layout({ lang, rel, root, title: "", description: t.motto, body,
    jsonld: { "@context": "https://schema.org", "@type": "WebSite", name: NAME, url: `${SITE_URL}/${lang}/`, inLanguage: lang } }));
}

function catalogPage(lang) {
  const t = T[lang], rel = "books/", root = rootFor(lang, rel);
  const books = sortFor(lang, booksIn(lang));
  const group = (name, label, items) =>
    `<div class="filter" role="group" aria-label="${esc(label)}" data-filter="${name}"><span class="filter-label">${label}</span>` +
    [["", t.all], ...items].map(([v, l], i) => `<button type="button" class="chip" data-value="${v}" aria-pressed="${i ? "false" : "true"}">${esc(l)}</button>`).join("") +
    "</div>";
  const series = SERIES.filter((s) => books.some((b) => b.series === s.id));
  const bothFormats = books.some(hasPrint) && books.some(hasEbook);
  const filters = [
    series.length > 1 ? group("series", t.series, series.map((s) => [s.id, s.name[lang]])) : "",
    bothFormats ? group("format", t.format_filter, [["print", t.print], ["ebook", t.ebook]]) : "",
  ].filter(Boolean).join("\n");
  const body = `<div class="wrap page">
<header class="page-head">
<h1>${t.catalog}</h1>
<p class="lead">${t.catalog_intro}</p>
</header>
${filters ? `<div class="filters" hidden>\n${filters}\n</div>` : ""}
${grid(books, lang, root, "catalog", true)}
<p class="empty" hidden>${t.nothing_found}</p>
</div>`;
  write(`${lang}/books/index.html`, layout({ lang, rel, root, title: t.catalog, description: t.catalog_intro, body }));
}

function sortLangs(lang, list) {
  return [...list].sort((a, b) => (a !== lang) - (b !== lang) || LANGS.indexOf(a) - LANGS.indexOf(b));
}

function seriesPage(lang, s) {
  const t = T[lang], rel = `series/${s.id}/`, root = rootFor(lang, rel);
  const books = sortFor(lang, booksIn(lang).filter((b) => b.series === s.id));
  const photo = s.photo
    ? `<figure class="photo"><picture><source type="image/webp" srcset="${root}assets/img/${s.photo}.webp"><img src="${root}assets/img/${s.photo}.jpg" alt="" loading="lazy"></picture></figure>`
    : "";
  const body = `<div class="${s.journal ? "journal " : ""}series-page">
<div class="wrap page">
<header class="page-head series-intro">
<div>
<p class="eyebrow">${t.series}</p>
<h1>${esc(s.name[lang])}</h1>
<p class="lead">${esc(s.text[lang])}</p>
</div>
${photo}
</header>
<h2 class="section-title">${t.series_books}</h2>
${grid(books, lang, root, s.journal ? "grid--journal" : "")}
</div>
</div>`;
  const alts = Object.fromEntries(LANGS.filter((l) => booksIn(l).some((b) => b.series === s.id)).map((l) => [l, rel]));
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title: s.name[lang], description: s.text[lang], body, alts,
    ogImage: books[0] ? `${SITE_URL}/${books[0].cover}` : undefined }));
}

function readSample(b, key, root) {
  const p = b[key];
  if (!kitExists(p)) return "";
  const dir = path.posix.dirname(p);
  return fs.readFileSync(path.join(KIT, p), "utf8")
    .replace(/<img\b([^>]*?)\bsrc="(?![a-z]+:|\/)([^"]+)"/g, (m, pre, src) => `<img${pre}src="${root}${dir}/${src}"`)
    .replace(/<img\b(?![^>]*\balt=)/g, '<img alt=""')
    .replace(/<img\b(?![^>]*\bloading=)/g, '<img loading="lazy"');
}

function bookJsonLd(b, lang) {
  const isbn = b.isbn || {};
  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: b.title,
    url: `${SITE_URL}/${lang}/books/${b.id}/`,
    inLanguage: b.language,
    author: { "@type": "Person", name: "Various" },
    editor: { "@type": "Person", name: EDITOR },
    image: `${SITE_URL}/${b.cover}`,
  };
  if (b.subtitle) ld.alternativeHeadline = b.subtitle;
  if (subline(b)) ld.alternateName = fullTitle(b);
  if (b.language !== "de") ld.translator = { "@type": "Person", name: EDITOR };
  if (b.pages) ld.numberOfPages = b.pages;
  if (b.volume) ld.volumeNumber = b.volume;
  if (b.blurb) ld.description = b.blurb.join(" ");
  ld.isPartOf = { "@type": "BookSeries", name: b._series.name[b.language] || b._series.name.en };
  const editions = formatsOf(b).map((f) => {
    const e = { "@type": "Book", bookFormat: f === "ebook" ? "https://schema.org/EBook" : "https://schema.org/Paperback" };
    if (isbn[f]) e.isbn = isbn[f];
    return e;
  }).filter((e) => e.isbn);
  if (editions.length) ld.workExample = editions;
  if (b.price && typeof b.price === "object" && b.price.amount != null) {
    const link = storeLinks(b)[0];
    ld.offers = { "@type": "Offer", price: b.price.amount, priceCurrency: b.price.currency || "EUR", availability: "https://schema.org/InStock", ...(link ? { url: link.url } : {}) };
  }
  return ld;
}

function bookPage(lang, b) {
  const t = T[lang], rel = `books/${b.id}/`, root = rootFor(lang, rel);
  const s = b._series, bl = b.language;
  const wrap = kitExists(b.cover_wrap) ? b.cover_wrap : null;

  const cover = wrap
    ? `<a class="cover-link" href="${root}${wrap}" data-lightbox="wrap" title="${esc(t.enlarge_cover)}" aria-label="${esc(t.enlarge_cover)}">${bigCover(b, root)}<span class="cover-hint" aria-hidden="true">⤢</span></a>`
    : bigCover(b, root);

  const specs = [
    [t.lang_of_book, esc(t.book_lang[bl])],
    b.pages ? [t.pages, esc(b.pages)] : null,
    (b.trim_in || formatsOf(b).length) ? [t.format, [trimText(b, lang), formatsText(b, lang)].filter(Boolean).map((x) => `<span class="nowrap">${esc(x)}</span>`).join("<br>")] : null,
    ...Object.entries(b.isbn || {}).filter(([, v]) => v).map(([k, v]) => [`${t.isbn} (${k === "ebook" ? t.ebook : t.paperback})`, esc(v)]),
    b.price ? [t.price, esc(formatPrice(b.price, lang))] : null,
  ].filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  const blurb = (b.blurb || []).length
    ? `<div class="blurb" lang="${bl}">${b.back_title ? `<p class="back-title">${esc(b.back_title)}</p>` : ""}${b.blurb.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
    : "";

  const previews = (b.previews || []).filter((f) => fs.existsSync(path.join(KIT, "previews", f)));
  const look = previews.length ? `<section class="wrap section" aria-labelledby="look">
<h2 id="look" class="section-title">${t.look_inside}</h2>
<ul class="previews">${previews.map((f, i) => `<li><a href="${root}previews/${f}" data-lightbox="previews"><img src="${root}previews/${f}" alt="${esc(`${t.look_inside} ${i + 1}`)}" width="935" height="1210" loading="lazy"></a></li>`).join("")}</ul>
</section>` : "";

  const preface = readSample(b, "preface", root);
  const prefaceBlock = preface ? `<section class="wrap section" aria-label="${esc(t.preface)}">
<article class="paper" lang="${bl}">${preface}</article>
</section>` : "";

  const excerpt = readSample(b, "excerpt", root);
  const excerptBlock = excerpt ? `<section class="wrap section" aria-labelledby="excerpt">
<h2 id="excerpt" class="section-title">${t.excerpt}</h2>
<p class="section-note">${t.excerpt_note}</p>
<article class="paper paper--excerpt" lang="${bl}">${excerpt}
<div class="paper-end">${storeButtons(b, lang)}</div>
</article>
</section>` : "";

  const contentsList = Array.isArray(b.contents) ? b.contents : (b.contents ? String(b.contents).split(/\s+·\s+/) : []);
  const contents = contentsList.length ? `<section class="wrap section" aria-labelledby="contents">
<h2 id="contents" class="section-title">${t.contents}</h2>
<ol class="toc" lang="${bl}">${contentsList.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>
</section>` : "";

  // Эта же книга на других языках — ссылками; второй том и другие номера — обложками.
  const editions = sortLangs(lang, editionsOf(b).map((x) => x.language)).map((l) => editionsOf(b).find((x) => x.language === l));
  const alsoIn = editions.length
    ? `<p class="also-in">${t.also_in}: ${editions.map((x) => `<a href="${root}${x.language}/books/${x.id}/" hreflang="${x.language}" lang="${x.language}">${esc(LANG_NAMES[x.language])}</a>`).join(" · ")}</p>`
    : "";
  const otherVol = isJournal(b) ? [] : BOOKS.filter((x) => x.series === b.series && x.language === bl && x.volume && b.volume && x.volume !== b.volume);
  const moreIssues = isJournal(b) ? sortFor(lang, booksIn(lang).filter((x) => x !== b && x.series === b.series)) : [];
  const related = [
    otherVol.length ? `<h2 class="section-title">${t.other_volume}</h2>${grid(otherVol, lang, root)}` : "",
    moreIssues.length ? `<h2 class="section-title">${t.more_issues}</h2>${grid(moreIssues, lang, root, "grid--journal")}` : "",
  ].filter(Boolean).join("");

  const body = `<div class="${isJournal(b) ? "journal " : ""}book-page">
<div class="wrap book">
<div class="book-cover">${cover}</div>
<div class="book-info">
<p class="eyebrow"><a href="${root}${lang}/series/${s.id}/">${esc(s.name[lang])}</a></p>
<h1 class="book-title" lang="${bl}">${esc(b.title)}</h1>
${subline(b) ? `<p class="book-volume" lang="${bl}">${esc(subline(b))}</p>` : ""}
${b.subtitle ? `<p class="book-subtitle" lang="${bl}">${esc(b.subtitle)}</p>` : ""}
${b.editor_credit ? `<p class="book-credit" lang="${bl}">${esc(b.editor_credit)}</p>` : ""}
<dl class="specs">${specs}</dl>
${blurb}
${storeButtons(b, lang)}
${alsoIn}
</div>
</div>
${look}
${prefaceBlock}
${excerptBlock}
${contents}
${related ? `<section class="wrap section related">${related}</section>` : ""}
</div>`;

  const desc = clip(stripTags(b.subtitle || (b.blurb || [])[0] || fullTitle(b)), 180);
  const alts = { [lang]: rel, ...Object.fromEntries(editions.map((x) => [x.language, `books/${x.id}/`])) };
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title: fullTitle(b), description: desc, body, alts,
    ogType: "book", ogImage: `${SITE_URL}/${b.cover}`, jsonld: bookJsonLd(b, lang) }));
}

function bigCover(b, root) {
  const alt = esc(fullTitle(b));
  const web = kitExists(b.cover_web) ? `${root}${b.cover_web} 640w, ` : "";
  return `<img class="big-cover" src="${root}${b.cover}" srcset="${web}${root}${b.cover} 1600w" sizes="(max-width: 760px) 70vw, 420px" width="640" height="1024" alt="${alt}" decoding="async" fetchpriority="high">`;
}

function aboutPage(lang) {
  const t = T[lang], rel = "about/", root = rootFor(lang, rel);
  const body = `<div class="wrap page about">
<header class="page-head"><h1>${t.about_project}</h1></header>
<div class="about-grid">
<div class="about-text"><p>${ABOUT[lang]}</p></div>
<figure class="photo"><picture><source type="image/webp" srcset="${root}assets/img/thistle.webp"><img src="${root}assets/img/thistle.jpg" alt="" loading="lazy"></picture></figure>
</div>
<div class="about-photos">
<figure class="photo"><picture><source type="image/webp" srcset="${root}assets/img/wiking.webp"><img src="${root}assets/img/wiking.jpg" alt="" loading="lazy"></picture></figure>
<figure class="photo"><picture><source type="image/webp" srcset="${root}assets/img/hertha.webp"><img src="${root}assets/img/hertha.jpg" alt="" loading="lazy"></picture></figure>
</div>
<p class="center"><a class="btn btn--primary" href="${root}${lang}/books/">${t.to_catalog}</a></p>
</div>`;
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title: t.about_project, description: clip(stripTags(ABOUT[lang]), 180), body }));
}

function legalPage(lang, slug, html, title) {
  const rel = `${slug}/`, root = rootFor(lang, rel);
  const body = `<div class="wrap page"><article class="legal">${html}</article></div>`;
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title, description: title, body }));
}

// ---------- сборка ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

copyDir(path.join(KIT, "covers"), "covers");
copyDir(path.join(KIT, "previews"), "previews");
copyDir(path.join(KIT, "samples"), "samples");
copyDir(path.join(SRC, "static"), "assets");
fs.copyFileSync(path.join(SRC, "style.css"), path.join(OUT, "assets/style.css"));
fs.copyFileSync(path.join(SRC, "site.js"), path.join(OUT, "assets/site.js"));
// HTML-фрагменты отрывков встраиваются в страницы — отдельно их не публикуем.
for (const b of BOOKS) for (const k of ["preface", "excerpt"]) if (kitExists(b[k])) fs.rmSync(path.join(OUT, b[k]), { force: true });

for (const lang of LANGS) {
  homePage(lang);
  catalogPage(lang);
  for (const s of SERIES) if (booksIn(lang).some((b) => b.series === s.id)) seriesPage(lang, s);
  for (const b of booksIn(lang)) bookPage(lang, b);
  aboutPage(lang);
  legalPage(lang, "impressum", IMPRESSUM[lang], "Impressum");
  legalPage(lang, "privacy", PRIVACY[lang], T[lang].privacy);
}

// Корень сайта → английская версия.
write("index.html", `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${NAME}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${SITE_URL}/${DEFAULT_LANG}/">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LANG}/">
<meta http-equiv="refresh" content="0; url=${DEFAULT_LANG}/">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<style>body{background:#fff;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;padding:4rem 1rem}a{color:#1f6f50}</style>
</head><body><p><a href="en/">English</a> · <a href="de/">Deutsch</a> · <a href="ru/">Русский</a></p></body></html>
`);

// 404: GitHub Pages показывает её по любому адресу, поэтому пути — от корня сайта.
write("404.html", layout({ lang: "en", rel: "404/", root: BASE_PATH, title: T.en.not_found, description: T.en.not_found_text, noindex: true,
  body: `<div class="wrap page notfound">
<h1>404</h1>
${LANGS.map((l) => `<p lang="${l}">${T[l].not_found}. <a href="${BASE_PATH}${l}/">${T[l].back_home}</a></p>`).join("\n")}
</div>` }).replace(/<nav class="langs"[\s\S]*?<\/nav>/, ""));

// sitemap.xml и robots.txt
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${SITEMAP.map(({ lang, rel, alts }) => `<url><loc>${SITE_URL}/${lang}/${rel}</loc>${hreflangLinks(alts).map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`).join("")}</url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
if (data.domain) write("CNAME", data.domain + "\n");
write(".nojekyll", "");

console.log(`Готово: ${BOOKS.length} книг, ${SITEMAP.length} страниц → ${path.relative(ROOT, OUT)}/  (адрес сайта: ${SITE_URL})`);
