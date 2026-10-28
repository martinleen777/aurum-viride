// Тексты сайта на трёх языках: интерфейс, описания серий, «About», Impressum и Datenschutz.
// Данные о самих книгах — в kit/data/books.json.

export const LANGS = ["en", "de", "ru"];
export const DEFAULT_LANG = "en";

export const LANG_NAMES = { en: "English", de: "Deutsch", ru: "Русский" };

// Порядок серий на сайте и их описания.
export const SERIES = [
  {
    id: "building-boats",
    photo: "bubble",
    name: {
      en: "Building Boats in the Golden Age",
      de: "Bootsbau im Goldenen Zeitalter",
      ru: "Постройка лодок в золотой век",
    },
    text: {
      en: "A large book on how boats were designed, built and fitted out, gathered from the Berlin weekly Wassersport, 1883–1895, with the journal’s plates redrawn as clear line drawings. Letter format, 8.5 × 11 in.",
      de: "Ein großes Buch darüber, wie Boote konstruiert, gebaut und ausgerüstet wurden – aus der Berliner Wochenschrift Wassersport, 1883–1895, mit den Tafeln des Journals, neu als klare Strichzeichnungen gezeichnet. Format Letter, 8,5 × 11 Zoll.",
      ru: "Большая книга о том, как проектировали, строили и снаряжали лодки, — по страницам берлинского еженедельника Wassersport, 1883–1895, с чертежами журнала, заново выполненными чёткой линией. Формат Letter, 8,5 × 11 дюймов.",
    },
  },
  {
    id: "under-oar-and-sail",
    photo: "hertha",
    name: {
      en: "Under Oar and Sail",
      de: "Unter Ruder und Segel",
      ru: "Под веслом и парусом",
    },
    text: {
      en: "Voyage logs from the Berlin weekly Wassersport in two volumes. Volume I — under oar: rivers, lakes and canals. Volume II — under sail: at sea. Format 6 × 9 in.",
      de: "Fahrtenberichte aus der Berliner Wochenschrift Wassersport in zwei Bänden. Band I – unter Ruder: Flüsse, Seen und Kanäle. Band II – unter Segel: auf See. Format 6 × 9 Zoll.",
      ru: "Путевые журналы из берлинского еженедельника Wassersport в двух томах. Том I — на вёслах: реки, озёра и каналы. Том II — под парусом: море. Формат 6 × 9 дюймов.",
    },
  },
  {
    id: "wassersport-1885-issues",
    photo: null,
    journal: true, // кремово-синее оформление, как на обложках этой серии
    name: {
      en: "Wassersport 1885 — weekly issues",
      de: "Wassersport 1885 — Wochenausgaben",
      ru: "Wassersport 1885 — еженедельные номера",
    },
    text: {
      en: "Single issues of the journal for 1885 as e-books: the original layout together with a translation.",
      de: "Einzelne Ausgaben des Jahrgangs 1885 als E-Books: das Originallayout zusammen mit der Übersetzung.",
      ru: "Отдельные номера журнала за 1885 год в виде электронных книг: оригинальная вёрстка вместе с переводом.",
    },
  },
];

export const T = {
  en: {
    hero_lead: "Rowing, sailing and boatbuilding from the Berlin weekly Wassersport, 1883–1895 — in English, German and Russian.",
    featured: "Featured", more_about_book: "Learn more",
    motto: "Forgotten pages from the golden age of rowing and sailing",
    nav_home: "Home", nav_books: "Books", nav_about: "About",
    impressum: "Impressum", privacy: "Privacy",
    skip: "Skip to content",
    language: "Language",
    series: "Series", all: "All", lang_filter: "Language", format_filter: "Format",
    print: "Print", ebook: "E-book",
    paperback: "Paperback",
    catalog: "Catalogue", catalog_intro: "All our books and journal issues in English.",
    also_in: "This book in other languages",
    to_catalog: "Browse the catalogue",
    series_books: "Books in this series",
    view_series: "View the series",
    about_project: "About the project",
    nothing_found: "No books match these filters.",
    coming_soon: "Coming soon",
    other_link: "Print edition",
    lang_of_book: "Language", pages: "Pages", format: "Format", isbn: "ISBN", price: "Price",
    inches: "in",
    volume: "Volume",
    issue: "Issue",
    look_inside: "Look inside",
    preface: "Preface",
    excerpt: "Read an excerpt",
    excerpt_note: "The opening pages of a chapter.",
    contents: "Contents",
    other_editions: "Other editions",
    other_volume: "The other volume",
    more_issues: "More issues",
    enlarge_cover: "Show the full cover (back, spine and front)",
    close: "Close", prev: "Previous", next: "Next",
    book_lang: { en: "English", de: "German", ru: "Russian" },
    not_found: "Page not found",
    not_found_text: "This page does not exist.",
    back_home: "Back to the home page",
  },
  de: {
    hero_lead: "Rudern, Segeln und Bootsbau aus der Berliner Wochenschrift Wassersport, 1883–1895 — auf Deutsch, Englisch und Russisch.",
    featured: "Empfehlung", more_about_book: "Mehr erfahren",
    motto: "Vergessene Seiten aus dem goldenen Zeitalter des Ruderns und Segelns",
    nav_home: "Start", nav_books: "Bücher", nav_about: "Über",
    impressum: "Impressum", privacy: "Datenschutz",
    skip: "Zum Inhalt",
    language: "Sprache",
    series: "Reihe", all: "Alle", lang_filter: "Sprache", format_filter: "Ausgabe",
    print: "Druck", ebook: "E-Book",
    paperback: "Taschenbuch",
    catalog: "Katalog", catalog_intro: "Alle unsere Bücher und Zeitschriftenausgaben auf Deutsch.",
    also_in: "Dieses Buch in anderen Sprachen",
    to_catalog: "Zum Katalog",
    series_books: "Bücher dieser Reihe",
    view_series: "Zur Reihe",
    about_project: "Über das Projekt",
    nothing_found: "Keine Bücher für diese Auswahl.",
    coming_soon: "Demnächst",
    other_link: "Druckausgabe",
    lang_of_book: "Sprache", pages: "Seiten", format: "Format", isbn: "ISBN", price: "Preis",
    inches: "Zoll",
    volume: "Band",
    issue: "Ausgabe",
    look_inside: "Blick ins Buch",
    preface: "Vorwort",
    excerpt: "Leseprobe",
    excerpt_note: "Die ersten Seiten eines Kapitels.",
    contents: "Inhalt",
    other_editions: "Andere Ausgaben",
    other_volume: "Der andere Band",
    more_issues: "Weitere Ausgaben",
    enlarge_cover: "Ganzen Umschlag zeigen (Rückseite, Rücken und Vorderseite)",
    close: "Schließen", prev: "Zurück", next: "Weiter",
    book_lang: { en: "Englisch", de: "Deutsch", ru: "Russisch" },
    not_found: "Seite nicht gefunden",
    not_found_text: "Diese Seite gibt es nicht.",
    back_home: "Zur Startseite",
  },
  ru: {
    hero_lead: "Гребля, парусный спорт и постройка лодок по страницам берлинского еженедельника Wassersport, 1883–1895, — на русском, английском и немецком.",
    featured: "Рекомендуем", more_about_book: "Подробнее",
    motto: "Забытые страницы золотого века гребли и парусного спорта",
    nav_home: "Главная", nav_books: "Книги", nav_about: "О проекте",
    impressum: "Impressum", privacy: "Конфиденциальность",
    skip: "К содержанию",
    language: "Язык",
    series: "Серия", all: "Все", lang_filter: "Язык", format_filter: "Издание",
    print: "Печатное", ebook: "Электронное",
    paperback: "Мягкая обложка",
    catalog: "Каталог", catalog_intro: "Все наши книги на русском языке.",
    also_in: "Эта книга на других языках",
    to_catalog: "Перейти в каталог",
    series_books: "Книги серии",
    view_series: "Вся серия",
    about_project: "О проекте",
    nothing_found: "По этим фильтрам книг нет.",
    coming_soon: "Скоро",
    other_link: "Печатное издание",
    lang_of_book: "Язык", pages: "Страниц", format: "Формат", isbn: "ISBN", price: "Цена",
    inches: "дюйма",
    volume: "Том",
    issue: "Номер",
    look_inside: "Заглянуть внутрь",
    preface: "Предисловие",
    excerpt: "Читать отрывок",
    excerpt_note: "Первые страницы одной из глав.",
    contents: "Содержание",
    other_editions: "Другие издания",
    other_volume: "Другой том",
    more_issues: "Другие номера",
    enlarge_cover: "Показать обложку целиком (задняя сторона, корешок и лицевая)",
    close: "Закрыть", prev: "Назад", next: "Вперёд",
    book_lang: { en: "английский", de: "немецкий", ru: "русский" },
    not_found: "Страница не найдена",
    not_found_text: "Такой страницы нет.",
    back_home: "На главную",
  },
};

// «About» — тексты из ТЗ, без изменений.
export const ABOUT = {
  en: "From 1883 to 1895 the Berlin weekly <i>Wassersport</i> was the meeting place of German oarsmen, canoeists and yachtsmen. Its pages carried race results and club news — and, between them, the logs of holiday voyages, articles on how boats were designed and built, and the engravings and photographs that went with them. Aurum Viride brings these pages back: in new English and Russian translations and in the original German, set in modern type, with an introduction to every piece. The books are selected, translated and edited by Leonid Dudakov.",
  de: "Von 1883 bis 1895 war die Berliner Wochenschrift <i>Wassersport</i> der Treffpunkt der deutschen Ruderer, Kanuten und Segler. Zwischen Regattaergebnissen und Vereinsnachrichten standen dort Fahrtenberichte, Aufsätze über Konstruktion und Bau von Booten und die dazugehörigen Holzstiche und Fotografien. Aurum Viride holt diese Seiten zurück: im deutschen Originaltext in behutsam modernisierter Rechtschreibung sowie in neuer englischer und russischer Übersetzung, mit einer Einführung zu jedem Beitrag. Auswahl und Herausgabe: Leonid Dudakov.",
  ru: "С 1883 по 1895 год берлинский еженедельник <i>Wassersport</i> был местом встречи немецких гребцов, каноистов и яхтсменов. Между результатами регат и клубными новостями в нём печатались путевые журналы, статьи о проектировании и постройке лодок, гравюры и фотографии. Aurum Viride возвращает эти страницы: в новых переводах на английский и русский и в немецком оригинале современным шрифтом, с вступлением к каждому тексту. Составитель, переводчик и редактор — Леонид Дудаков.",
};

// Impressum (§ 5 DDG). [NAME], [ADDRESS], [EMAIL] заполняет владелец.
export const IMPRESSUM = {
  de: `<h1>Impressum</h1>
<p>Angaben gemäß § 5 DDG</p>
<p>[NAME]<br>[ADDRESS]</p>
<h2>Kontakt</h2>
<p>E-Mail: [EMAIL]</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>[NAME]<br>[ADDRESS]</p>`,
  en: `<h1>Impressum</h1>
<p>Information pursuant to § 5 DDG (German Digital Services Act)</p>
<p>[NAME]<br>[ADDRESS]</p>
<h2>Contact</h2>
<p>E-mail: [EMAIL]</p>
<h2>Responsible for content under § 18 (2) MStV</h2>
<p>[NAME]<br>[ADDRESS]</p>`,
  ru: `<h1>Impressum</h1>
<p>Сведения согласно § 5 DDG (закон Германии о цифровых услугах)</p>
<p>[NAME]<br>[ADDRESS]</p>
<h2>Контакт</h2>
<p>E-mail: [EMAIL]</p>
<h2>Ответственный за содержание согласно § 18 абз. 2 MStV</h2>
<p>[NAME]<br>[ADDRESS]</p>`,
};

const GH_PRIVACY = "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement";

export const PRIVACY = {
  de: `<h1>Datenschutzerklärung</h1>
<h2>Verantwortlicher</h2>
<p>[NAME]<br>[ADDRESS]<br>E-Mail: [EMAIL]</p>
<h2>Keine Cookies, kein Tracking</h2>
<p>Diese Website setzt keine Cookies, verwendet keine Analyse- oder Tracking-Werkzeuge und bindet keine Inhalte Dritter ein. Die Schriften sind lokal auf dieser Website gespeichert und werden nicht von fremden Servern geladen.</p>
<h2>Hosting</h2>
<p>Die Website wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der Seiten verarbeitet GitHub die IP-Adresse der Besucher sowie technische Protokolldaten (z. B. Zeitpunkt des Abrufs, abgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und zuverlässigen Bereitstellung der Website. Dabei können Daten in die USA übermittelt werden. Näheres im <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Links zu Amazon und Apple Books</h2>
<p>Die Website enthält Links zu Amazon und Apple Books. Erst wenn Sie einem solchen Link folgen, gelangen Sie auf die Seiten dieser Anbieter; dort gelten deren Datenschutzbestimmungen.</p>
<h2>Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde.</p>`,
  en: `<h1>Privacy Policy</h1>
<p><i>Translation for convenience; the German version (Datenschutzerklärung) is authoritative.</i></p>
<h2>Controller</h2>
<p>[NAME]<br>[ADDRESS]<br>E-mail: [EMAIL]</p>
<h2>No cookies, no tracking</h2>
<p>This website sets no cookies, uses no analytics or tracking tools and embeds no third-party content. The fonts are stored on this website and are not loaded from other servers.</p>
<h2>Hosting</h2>
<p>The website is hosted on GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. When the pages are opened, GitHub processes visitors’ IP addresses and technical log data (for example the time of access, the page requested and the browser type) in order to deliver the website and keep it secure. The legal basis is Art. 6(1)(f) GDPR; our legitimate interest is the secure and reliable provision of the website. Data may be transferred to the USA. See the <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Links to Amazon and Apple Books</h2>
<p>The website contains links to Amazon and Apple Books. Only when you follow such a link do you reach the sites of these providers; their privacy policies apply there.</p>
<h2>Your rights</h2>
<p>You have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15–21 GDPR), and the right to lodge a complaint with a data protection supervisory authority.</p>`,
  ru: `<h1>Политика конфиденциальности</h1>
<p><i>Перевод для удобства; юридически действует немецкая версия (Datenschutzerklärung).</i></p>
<h2>Ответственное лицо</h2>
<p>[NAME]<br>[ADDRESS]<br>E-mail: [EMAIL]</p>
<h2>Без cookies и отслеживания</h2>
<p>Сайт не использует cookies, инструменты аналитики и отслеживания и не встраивает содержимое третьих лиц. Шрифты хранятся на самом сайте и не загружаются с чужих серверов.</p>
<h2>Хостинг</h2>
<p>Сайт размещён на GitHub Pages — сервисе компании GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. При открытии страниц GitHub обрабатывает IP-адреса посетителей и технические журналы (например, время обращения, запрошенную страницу, тип браузера), чтобы доставлять сайт и обеспечивать его безопасность. Правовое основание — ст. 6 п. 1 лит. f GDPR; наш законный интерес — безопасная и надёжная работа сайта. Данные могут передаваться в США. Подробнее — в <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Ссылки на Amazon и Apple Books</h2>
<p>На сайте есть ссылки на Amazon и Apple Books. Только перейдя по такой ссылке, вы попадаете на сайт этих компаний; там действуют их правила обработки данных.</p>
<h2>Ваши права</h2>
<p>Вы вправе получить сведения о своих данных, потребовать их исправления, удаления, ограничения обработки, переноса, возразить против обработки (ст. 15–21 GDPR) и подать жалобу в надзорный орган по защите данных.</p>`,
};
