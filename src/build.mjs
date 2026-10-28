// Генератор сайта Aurum Viride: читает kit/data/books.json и собирает статический сайт в _site/.
// Запуск: node src/build.mjs   (SITE_URL=https://... — адрес сайта для canonical, sitemap и OpenGraph)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  return `<div class="stores">${links.map((l) =>
    `<a class="store" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || T[lang].other_link)}</a>`).join("")}</div>`;
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
const EMBLEM_SRC = fs.readFileSync(path.join(KIT, "design/ornaments/emblem.svg"), "utf8")
  .replace(/<\?xml[^>]*>/, "").trim();
let emblemSeq = 0;
function emblem(cls) {
  const id = "emg" + ++emblemSeq;
  return EMBLEM_SRC
    .replace(/id="g1"/g, `id="${id}"`).replace(/url\(#g1\)/g, `url(#${id})`)
    .replace("<svg ", `<svg class="${cls}" aria-hidden="true" focusable="false" `);
}

function picture(b, root, { sizes = "(max-width: 600px) 45vw, 220px", eager = false } = {}) {
  const alt = esc(fullTitle(b));
  const webp = kitExists(b.cover_web) ? `<source type="image/webp" srcset="${root}${b.cover_web} 640w" sizes="${sizes}">` : "";
  return `<picture>${webp}<img src="${root}${b.cover}" srcset="${root}${b.cover} 1600w" sizes="${sizes}" width="640" height="1024" alt="${alt}"${eager ? "" : ' loading="lazy"'} decoding="async"></picture>`;
}

function langBadge(code) {
  return `<span class="lang-badge" title="${esc(LANG_NAMES[code])}">${code.toUpperCase()}</span>`;
}

function card(b, lang, root, showSeries) {
  const s = b._series;
  const meta = isJournal(b) ? (b.issue || "") : [showSeries ? s.name[lang] : "", b.volume ? `${T[lang].volume} ${roman(b.volume)}` : ""].filter(Boolean).join(" · ");
  const fmt = [hasPrint(b) ? "print" : "", hasEbook(b) ? "ebook" : ""].filter(Boolean).join(" ");
  return `<li class="card" data-series="${b.series}" data-lang="${b.language}" data-format="${fmt}">
<a href="${root}${lang}/books/${b.id}/">
<span class="card-cover">${picture(b, root)}</span>
<span class="card-title" lang="${b.language}">${esc(b.title)}</span>
<span class="card-meta">${langBadge(b.language)}${meta ? ` <span lang="${isJournal(b) ? b.language : lang}">${esc(meta)}</span>` : ""}</span>
</a></li>`;
}

const roman = (n) => ["", "I", "II", "III", "IV", "V", "VI"][n] || String(n);

function grid(list, lang, root, cls = "", showSeries = false) {
  return `<ul class="grid ${cls}">${list.map((b) => card(b, lang, root, showSeries)).join("")}</ul>`;
}

function divider(root) {
  return `<div class="divider" aria-hidden="true"><img src="${root}assets/orn/divider.svg" alt="" width="600" height="120"></div>`;
}

function layout({ lang, rel, title, description, body, root, ogImage, ogType = "website", jsonld, noindex = false, alternates = true }) {
  const t = T[lang];
  const pageUrl = `${SITE_URL}/${lang}/${rel}`;
  const alt = alternates
    ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${rel}">`).join("\n") +
      `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LANG}/${rel}">`
    : "";
  const nav = [
    ["", t.nav_home],
    ["books/", t.nav_books],
    ["about/", t.nav_about],
  ].map(([href, label]) => {
    const current = rel === href || (href && rel.startsWith(href) && href !== "about/");
    return `<a href="${root}${lang}/${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");
  const switcher = LANGS.map((l) =>
    `<a href="${root}${l}/${rel}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ""} title="${LANG_NAMES[l]}">${l.toUpperCase()}</a>`).join("");
  const fullTitle = title ? `${title} — ${NAME}` : `${NAME} — ${t.motto}`;
  const img = ogImage || `${SITE_URL}/assets/img/icon-512.png`;

  return `<!doctype html>
<html lang="${lang}">
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
<meta name="theme-color" content="#0f261c">
<link rel="icon" href="${root}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="preload" href="${root}assets/fonts/EBGaramond-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/style.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>` : ""}
<script src="${root}assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
<div class="wrap header-inner">
<a class="brand" href="${root}${lang}/">${emblem("brand-emblem")}<span class="brand-name">${NAME}</span></a>
<nav class="nav" aria-label="${esc(t.nav_home)}">${nav}</nav>
<nav class="langs" aria-label="${esc(t.language)}">${switcher}</nav>
</div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
<div class="wrap footer-inner">
<div class="footer-ship" aria-hidden="true"></div>
<p class="footer-name">${NAME}</p>
<p class="footer-motto">${esc(t.motto)}</p>
<nav class="footer-links"><a href="${root}${lang}/books/">${t.nav_books}</a><a href="${root}${lang}/about/">${t.nav_about}</a><a href="${root}${lang}/impressum/">${t.impressum}</a><a href="${root}${lang}/privacy/">${t.privacy}</a></nav>
</div>
</footer>
</body>
</html>
`;
}

const rootFor = (lang, rel) => "../".repeat(1 + rel.split("/").filter(Boolean).length);

// ---------- страницы ----------
function homePage(lang) {
  const t = T[lang], rel = "", root = rootFor(lang, rel);
  const seriesBlocks = SERIES.map((s) => {
    const books = sortFor(lang, BOOKS.filter((b) => b.series === s.id));
    if (!books.length) return "";
    return `<section class="series-block${s.journal ? " journal" : ""}">
<div class="wrap">
<header class="series-head">
<p class="eyebrow">${t.series}</p>
<h2><a href="${root}${lang}/series/${s.id}/">${esc(s.name[lang])}</a></h2>
<p class="series-text">${esc(s.text[lang])}</p>
</header>
${grid(books, lang, root, s.journal ? "grid--journal" : "")}
<p class="more"><a href="${root}${lang}/series/${s.id}/">${t.view_series} →</a></p>
</div>
</section>`;
  }).join(divider(root));

  const body = `<section class="hero">
<div class="hero-frame">
<img class="corner c-tl" src="${root}assets/orn/corner.svg" alt="" aria-hidden="true">
<img class="corner c-tr" src="${root}assets/orn/corner.svg" alt="" aria-hidden="true">
<img class="corner c-bl" src="${root}assets/orn/corner.svg" alt="" aria-hidden="true">
<img class="corner c-br" src="${root}assets/orn/corner.svg" alt="" aria-hidden="true">
${emblem("hero-emblem")}
<h1 class="gold hero-title">${NAME}</h1>
<p class="hero-motto">${esc(t.motto)}</p>
</div>
</section>
${seriesBlocks}
${divider(root)}
<section class="wrap about-short">
<h2 class="gold">${t.about_project}</h2>
<p>${ABOUT[lang]}</p>
<p><a class="btn" href="${root}${lang}/books/">${t.to_catalog}</a></p>
</section>`;
  write(`${lang}/index.html`, layout({ lang, rel, root, title: "", description: t.motto, body,
    jsonld: { "@context": "https://schema.org", "@type": "WebSite", name: NAME, url: `${SITE_URL}/${lang}/`, inLanguage: lang } }));
}

function catalogPage(lang) {
  const t = T[lang], rel = "books/", root = rootFor(lang, rel);
  const group = (name, label, items) =>
    `<div class="filter" role="group" aria-label="${esc(label)}" data-filter="${name}"><span class="filter-label">${label}</span>` +
    [["", t.all], ...items].map(([v, l], i) => `<button type="button" class="chip" data-value="${v}" aria-pressed="${i ? "false" : "true"}">${esc(l)}</button>`).join("") +
    "</div>";
  const usedLangs = sortLangs(lang, [...new Set(BOOKS.map((b) => b.language))]);
  const body = `<div class="wrap page">
<header class="page-head">
<h1 class="gold">${t.catalog}</h1>
<p class="lead">${t.catalog_intro}</p>
</header>
<div class="filters" hidden>
${group("series", t.series, SERIES.filter((s) => BOOKS.some((b) => b.series === s.id)).map((s) => [s.id, s.name[lang]]))}
${group("lang", t.lang_filter, usedLangs.map((l) => [l, l.toUpperCase()]))}
${group("format", t.format_filter, [["print", t.print], ["ebook", t.ebook]])}
</div>
${grid(sortFor(lang, BOOKS), lang, root, "catalog", true)}
<p class="empty" hidden>${t.nothing_found}</p>
</div>`;
  write(`${lang}/books/index.html`, layout({ lang, rel, root, title: t.catalog, description: t.catalog_intro, body }));
}

function sortLangs(lang, list) {
  return [...list].sort((a, b) => (a !== lang) - (b !== lang) || LANGS.indexOf(a) - LANGS.indexOf(b));
}

function seriesPage(lang, s) {
  const t = T[lang], rel = `series/${s.id}/`, root = rootFor(lang, rel);
  const books = sortFor(lang, BOOKS.filter((b) => b.series === s.id));
  const photo = s.photo
    ? `<figure class="framed-photo"><picture><source type="image/webp" srcset="${root}assets/img/${s.photo}.webp"><img src="${root}assets/img/${s.photo}.jpg" alt="" loading="lazy"></picture></figure>`
    : "";
  const body = `<div class="${s.journal ? "journal " : ""}series-page">
<div class="wrap page">
<header class="page-head series-intro">
<div>
<p class="eyebrow">${t.series}</p>
<h1 class="${s.journal ? "" : "gold"}">${esc(s.name[lang])}</h1>
<p class="lead">${esc(s.text[lang])}</p>
</div>
${photo}
</header>
<h2 class="section-title">${t.series_books}</h2>
${grid(books, lang, root, s.journal ? "grid--journal" : "")}
</div>
</div>`;
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title: s.name[lang], description: s.text[lang], body,
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
    [t.lang_of_book, `${langBadge(bl)} ${esc(t.book_lang[bl])}`],
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

  // Другие издания (та же книга на других языках) и второй том на том же языке.
  const others = isJournal(b) ? [] :
    sortFor(lang, BOOKS.filter((x) => x !== b && x.series === b.series && (x.volume || null) === (b.volume || null)));
  const otherVol = isJournal(b) ? [] : BOOKS.filter((x) => x.series === b.series && x.language === bl && x.volume && b.volume && x.volume !== b.volume);
  const moreIssues = isJournal(b) ? sortFor(lang, BOOKS.filter((x) => x !== b && x.series === b.series)) : [];
  const related = [
    others.length ? `<h2 class="section-title">${t.other_editions}</h2>${grid(others, lang, root)}` : "",
    otherVol.length ? `<h2 class="section-title">${t.other_volume}</h2>${grid(otherVol, lang, root)}` : "",
    moreIssues.length ? `<h2 class="section-title">${t.more_issues}</h2>${grid(moreIssues, lang, root, "grid--journal")}` : "",
  ].filter(Boolean).join("");

  const body = `<div class="${isJournal(b) ? "journal " : ""}book-page">
<div class="wrap book">
<div class="book-cover">${cover}</div>
<div class="book-info">
<p class="eyebrow"><a href="${root}${lang}/series/${s.id}/">${esc(s.name[lang])}</a></p>
<h1 class="book-title${isJournal(b) ? "" : " gold"}" lang="${bl}">${esc(b.title)}</h1>
${subline(b) ? `<p class="book-volume" lang="${bl}">${esc(subline(b))}</p>` : ""}
${b.subtitle ? `<p class="book-subtitle" lang="${bl}">${esc(b.subtitle)}</p>` : ""}
${b.editor_credit ? `<p class="book-credit" lang="${bl}">${esc(b.editor_credit)}</p>` : ""}
<dl class="specs">${specs}</dl>
${blurb}
${storeButtons(b, lang)}
</div>
</div>
${look}
${prefaceBlock ? divider(root) + prefaceBlock : ""}
${excerptBlock}
${contents}
${related ? `${divider(root)}<section class="wrap section related">${related}</section>` : ""}
</div>`;

  const desc = clip(stripTags(b.subtitle || (b.blurb || [])[0] || fullTitle(b)), 180);
  write(`${lang}/${rel}index.html`, layout({ lang, rel, root, title: fullTitle(b), description: desc, body,
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
<header class="page-head"><h1 class="gold">${t.about_project}</h1></header>
<div class="about-grid">
<div class="about-text"><p>${ABOUT[lang]}</p></div>
<figure class="framed-photo"><picture><source type="image/webp" srcset="${root}assets/img/thistle.webp"><img src="${root}assets/img/thistle.jpg" alt="" loading="lazy"></picture></figure>
</div>
<div class="about-photos">
<figure class="framed-photo"><picture><source type="image/webp" srcset="${root}assets/img/wiking.webp"><img src="${root}assets/img/wiking.jpg" alt="" loading="lazy"></picture></figure>
<figure class="framed-photo"><picture><source type="image/webp" srcset="${root}assets/img/hertha.webp"><img src="${root}assets/img/hertha.jpg" alt="" loading="lazy"></picture></figure>
</div>
<p class="center"><a class="btn" href="${root}${lang}/books/">${t.to_catalog}</a></p>
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
for (const f of ["corner", "divider", "wheel", "ship"]) {
  fs.mkdirSync(path.join(OUT, "assets/orn"), { recursive: true });
  fs.copyFileSync(path.join(KIT, `design/ornaments/${f}.svg`), path.join(OUT, `assets/orn/${f}.svg`));
}
copyDir(path.join(SRC, "static"), "assets");
fs.copyFileSync(path.join(SRC, "style.css"), path.join(OUT, "assets/style.css"));
fs.copyFileSync(path.join(SRC, "site.js"), path.join(OUT, "assets/site.js"));
// HTML-фрагменты отрывков встраиваются в страницы — отдельно их не публикуем.
for (const b of BOOKS) for (const k of ["preface", "excerpt"]) if (kitExists(b[k])) fs.rmSync(path.join(OUT, b[k]), { force: true });

const pages = [];
for (const lang of LANGS) {
  homePage(lang); pages.push("");
  catalogPage(lang); pages.push("books/");
  for (const s of SERIES) if (BOOKS.some((b) => b.series === s.id)) { seriesPage(lang, s); if (lang === LANGS[0]) pages.push(`series/${s.id}/`); }
  for (const b of BOOKS) { bookPage(lang, b); if (lang === LANGS[0]) pages.push(`books/${b.id}/`); }
  aboutPage(lang); pages.push("about/");
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
<style>body{background:#17372a;color:#ead9ad;font-family:Georgia,serif;text-align:center;padding:4rem 1rem}a{color:#e7c46c}</style>
</head><body><p><a href="en/">English</a> · <a href="de/">Deutsch</a> · <a href="ru/">Русский</a></p></body></html>
`);

// 404: GitHub Pages показывает её по любому адресу, поэтому пути — от корня сайта.
write("404.html", layout({ lang: "en", rel: "404/", root: BASE_PATH, title: T.en.not_found, description: T.en.not_found_text, noindex: true, alternates: false,
  body: `<div class="wrap page notfound">
<h1 class="gold">404</h1>
${LANGS.map((l) => `<p lang="${l}">${T[l].not_found}. <a href="${BASE_PATH}${l}/">${T[l].back_home}</a></p>`).join("\n")}
</div>` }).replace(/<nav class="langs"[\s\S]*?<\/nav>/, ""));

// sitemap.xml и robots.txt
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.flatMap((lang) => [...new Set(pages)].map((rel) => `<url><loc>${SITE_URL}/${lang}/${rel}</loc>
${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${rel}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LANG}/${rel}"/></url>`)).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
if (data.domain) write("CNAME", data.domain + "\n");
write(".nojekyll", "");

console.log(`Готово: ${BOOKS.length} книг × ${LANGS.length} языка → ${path.relative(ROOT, OUT)}/  (адрес сайта: ${SITE_URL})`);
