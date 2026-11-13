// Тексты сайта на трёх языках: интерфейс, проекты, описания серий, «О нас», Impressum и Datenschutz.
// Данные о самих книгах — в kit/data/books.json.

export const LANGS = ["en", "de", "ru"];
export const DEFAULT_LANG = "en";

export const LANG_NAMES = { en: "English", de: "Deutsch", ru: "Русский" };

// Проекты — источники (журналы и книги), из которых делаются издания. Порядок — как на сайте.
// Новый проект: добавьте сюда блок и укажите его id в поле project у его серий ниже.
export const PROJECTS = [
  {
    id: "wassersport",
    photo: "hertha",
    name: { en: "Wassersport", de: "Wassersport", ru: "Wassersport" },
    period: {
      en: "Berlin weekly, 1883–1895",
      de: "Berliner Wochenschrift, 1883–1895",
      ru: "Берлинский еженедельник, 1883–1895",
    },
    short: {
      en: "Rowing, sailing and boatbuilding through the eyes of those who lived it.",
      de: "Rudern, Segeln und Bootsbau mit den Augen derer, die dabei waren.",
      ru: "Гребля, парусный спорт и постройка лодок глазами тех, кто этим жил.",
    },
    // Рассказ о журнале для страницы проекта (прежний текст «About» из ТЗ).
    text: {
      en: "From 1883 to 1895 the Berlin weekly <i>Wassersport</i> was the meeting place of German oarsmen, canoeists and yachtsmen. Its pages carried race results and club news — and, between them, the logs of holiday voyages, articles on how boats were designed and built, and the engravings and photographs that went with them. Aurum Viride brings these pages back: in new English and Russian translations and in the original German, set in modern type, with an introduction to every piece. The books are selected, translated and edited by Leonid Dudakov.",
      de: "Von 1883 bis 1895 war die Berliner Wochenschrift <i>Wassersport</i> der Treffpunkt der deutschen Ruderer, Kanuten und Segler. Zwischen Regattaergebnissen und Vereinsnachrichten standen dort Fahrtenberichte, Aufsätze über Konstruktion und Bau von Booten und die dazugehörigen Holzstiche und Fotografien. Aurum Viride holt diese Seiten zurück: im deutschen Originaltext in behutsam modernisierter Rechtschreibung sowie in neuer englischer und russischer Übersetzung, mit einer Einführung zu jedem Beitrag. Auswahl und Herausgabe: Leonid Dudakov.",
      ru: "С 1883 по 1895 год берлинский еженедельник <i>Wassersport</i> был местом встречи немецких гребцов, каноистов и яхтсменов. Между результатами регат и клубными новостями в нём печатались путевые журналы, статьи о проектировании и постройке лодок, гравюры и фотографии. Aurum Viride возвращает эти страницы: в новых переводах на английский и русский и в немецком оригинале современным шрифтом, с вступлением к каждому тексту. Составитель, переводчик и редактор — Леонид Дудаков.",
    },
  },
];

// Порядок серий на сайте и их описания. project — id проекта из списка выше.
export const SERIES = [
  {
    id: "building-boats",
    project: "wassersport",
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
    project: "wassersport",
    photo: "hertha",
    name: {
      en: "Under Oar and Sail",
      de: "Unter Ruder und Segel",
      ru: "Под веслом и парусом",
    },
    text: {
      en: "Voyage logs from the Berlin weekly Wassersport in three volumes. Volume I — under oar: rivers, lakes and canals. Volume II — under sail: at sea. Volume III — rivers and coasts: journeys by gig, sculler, canoe and yacht. Format 6 × 9 in.",
      de: "Fahrtenberichte aus der Berliner Wochenschrift Wassersport in drei Bänden. Band I – unter Ruder: Flüsse, Seen und Kanäle. Band II – unter Segel: auf See. Band III – Flüsse und Küsten: Fahrten mit Gig, Skiff, Kanu und Yacht. Format 6 × 9 Zoll.",
      ru: "Путевые журналы из берлинского еженедельника Wassersport в трёх томах. Том I — на вёслах: реки, озёра и каналы. Том II — под парусом: море. Том III — реки и побережья: плавания на гичках, скифах, каноэ и яхтах. Формат 6 × 9 дюймов.",
    },
  },
  {
    id: "wassersport-1885-issues",
    project: "wassersport",
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
    consent_title: "Analytics cookies",
    consent_text: "We would like to use Google Analytics to see how visitors use this site. It sets cookies and sends data to Google, including to the USA. Analytics only starts if you accept. You can change your choice at any time via “Cookie settings” at the bottom of the page.",
    consent_accept: "Accept", consent_decline: "Decline", consent_more: "Privacy policy", consent_settings: "Cookie settings",
    hero_lead: "Texts that show how people lived a hundred or two hundred years ago.",
    featured: "Featured", more_about_book: "Learn more",
    motto: "Forgotten pages of our history",
    nav_home: "Home", nav_projects: "Projects", nav_books: "Books", nav_about: "About us",
    projects: "Projects", project: "Project", our_projects: "Our projects", view_project: "Explore the project",
    projects_intro: "Every project is one forgotten journal or book. From it we make new editions — reprints, collections and translations.",
    project_series: "What we have made from it", series_count: (n) => (n === 1 ? "1 series" : `${n} series`), book_count: (n) => (n === 1 ? "1 title" : `${n} titles`),
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
    about_project: "About us",
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
    other_volume: "Other volumes",
    more_issues: "More issues",
    enlarge_cover: "Show the full cover (back, spine and front)",
    close: "Close", prev: "Previous", next: "Next",
    book_lang: { en: "English", de: "German", ru: "Russian" },
    not_found: "Page not found",
    not_found_text: "This page does not exist.",
    back_home: "Back to the home page",
  },
  de: {
    consent_title: "Analyse-Cookies",
    consent_text: "Wir möchten Google Analytics nutzen, um zu sehen, wie Besucher diese Website verwenden. Dabei werden Cookies gesetzt und Daten an Google übermittelt, auch in die USA. Die Analyse startet nur, wenn Sie zustimmen. Ihre Wahl können Sie jederzeit über „Cookie-Einstellungen“ unten auf der Seite ändern.",
    consent_accept: "Akzeptieren", consent_decline: "Ablehnen", consent_more: "Datenschutzerklärung", consent_settings: "Cookie-Einstellungen",
    hero_lead: "Texte, die zeigen, wie die Menschen vor hundert oder zweihundert Jahren gelebt haben.",
    featured: "Empfehlung", more_about_book: "Mehr erfahren",
    motto: "Vergessene Seiten unserer Geschichte",
    nav_home: "Start", nav_projects: "Projekte", nav_books: "Bücher", nav_about: "Über uns",
    projects: "Projekte", project: "Projekt", our_projects: "Unsere Projekte", view_project: "Zum Projekt",
    projects_intro: "Jedes Projekt ist eine vergessene Zeitschrift oder ein vergessenes Buch. Daraus entstehen neue Ausgaben – Neuauflagen, Sammelbände und Übersetzungen.",
    project_series: "Was daraus entstanden ist", series_count: (n) => (n === 1 ? "1 Reihe" : `${n} Reihen`), book_count: (n) => (n === 1 ? "1 Titel" : `${n} Titel`),
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
    about_project: "Über uns",
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
    other_volume: "Weitere Bände",
    more_issues: "Weitere Ausgaben",
    enlarge_cover: "Ganzen Umschlag zeigen (Rückseite, Rücken und Vorderseite)",
    close: "Schließen", prev: "Zurück", next: "Weiter",
    book_lang: { en: "Englisch", de: "Deutsch", ru: "Russisch" },
    not_found: "Seite nicht gefunden",
    not_found_text: "Diese Seite gibt es nicht.",
    back_home: "Zur Startseite",
  },
  ru: {
    consent_title: "Cookies для аналитики",
    consent_text: "Мы хотели бы использовать Google Analytics, чтобы видеть, как посетители пользуются сайтом. Для этого ставятся cookies, а данные передаются в Google, в том числе в США. Аналитика включится, только если вы согласитесь. Изменить выбор можно в любой момент по ссылке «Настройки cookies» внизу страницы.",
    consent_accept: "Принять", consent_decline: "Отклонить", consent_more: "Политика конфиденциальности", consent_settings: "Настройки cookies",
    hero_lead: "Тексты, по которым видно, как жили люди сто и двести лет назад.",
    featured: "Рекомендуем", more_about_book: "Подробнее",
    motto: "Забытые страницы нашей истории",
    nav_home: "Главная", nav_projects: "Проекты", nav_books: "Книги", nav_about: "О нас",
    projects: "Проекты", project: "Проект", our_projects: "Наши проекты", view_project: "Подробнее о проекте",
    projects_intro: "Каждый проект — это один забытый журнал или книга. Из него мы делаем новые издания: переиздания, сборники и переводы.",
    project_series: "Что мы из него сделали", series_count: (n) => `${n} ${n === 1 ? "серия" : n < 5 ? "серии" : "серий"}`, book_count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "издание" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "издания" : "изданий"}`,
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
    about_project: "О нас",
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
    other_volume: "Другие тома",
    more_issues: "Другие номера",
    enlarge_cover: "Показать обложку целиком (задняя сторона, корешок и лицевая)",
    close: "Закрыть", prev: "Назад", next: "Вперёд",
    book_lang: { en: "английский", de: "немецкий", ru: "русский" },
    not_found: "Страница не найдена",
    not_found_text: "Такой страницы нет.",
    back_home: "На главную",
  },
};

// «О нас»: суть Aurum Viride (абзацы). Первый абзац показывается и на главной.
export const ABOUT = {
  en: [
    "Aurum Viride is a project about the forgotten pages of our history. We look for old journals and books that have not been republished for a long time but still matter to those who want to step into the past: to feel the atmosphere of an era and to learn how people lived, what they cared about and what they argued about a hundred or two hundred years ago. We carefully republish these texts, compile new books from them and translate them into other languages.",
    "Our first project is the Berlin weekly <i>Wassersport</i> (1883–1895): rowing, sailing and boatbuilding through the eyes of those who lived it. Others will follow.",
  ],
  de: [
    "Aurum Viride ist ein Projekt über die vergessenen Seiten unserer Geschichte. Wir suchen alte Zeitschriften und Bücher, die lange nicht mehr neu aufgelegt wurden, aber alle interessieren, die in die Vergangenheit eintauchen möchten: die Atmosphäre einer Epoche spüren und erfahren, wie die Menschen vor hundert oder zweihundert Jahren lebten, wofür sie sich begeisterten und worüber sie stritten. Wir geben diese Texte behutsam neu heraus, stellen aus ihnen neue Bücher zusammen und übersetzen sie in andere Sprachen.",
    "Unser erstes Projekt ist die Berliner Wochenschrift <i>Wassersport</i> (1883–1895): Rudern, Segeln und Bootsbau mit den Augen derer, die dabei waren. Weitere werden folgen.",
  ],
  ru: [
    "Aurum Viride — проект о забытых страницах нашей истории. Мы находим старые журналы и книги, которые давно никто не переиздавал, но которые по-прежнему интересны тем, кто хочет погрузиться в прошлое: почувствовать атмосферу эпохи, узнать, как жили, чем увлекались и о чём спорили люди сто или двести лет назад. Мы бережно переиздаём эти тексты, собираем из них новые книги и переводим их на разные языки.",
    "Первый проект — берлинский еженедельник <i>Wassersport</i> (1883–1895): гребля, парусный спорт и постройка лодок глазами тех, кто этим жил. Следом будут другие.",
  ],
};

// Impressum (§ 5 DDG). Betreiber der Website ist die King Casino Entertainment GmbH (Daten wie im Impressum von merkurzeit.com);
// für den Inhalt verantwortlich ist Leonid Dudakov.
export const IMPRESSUM = {
  de: `<h1>Impressum</h1>
<p>Angaben gemäß § 5 DDG</p>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Deutschland</p>
<p>Vertreten durch die Geschäftsführerin:<br>Julia Gross</p>
<h2>Kontakt</h2>
<p>Telefon: <a href="tel:+49402705434">+49 40 2705434</a><br>E-Mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<h2>Registereintrag</h2>
<p>Registergericht: Amtsgericht Hamburg<br>Registernummer: HRB 110839</p>
<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE267746902</p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>Leonid Dudakov<br>Krohnskamp 13<br>22301 Hamburg<br>Deutschland</p>`,
  en: `<h1>Impressum</h1>
<p>Information pursuant to § 5 DDG (German Digital Services Act)</p>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Germany</p>
<p>Represented by the managing director:<br>Julia Gross</p>
<h2>Contact</h2>
<p>Phone: <a href="tel:+49402705434">+49 40 2705434</a><br>E-mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<h2>Commercial register</h2>
<p>Register court: Amtsgericht Hamburg<br>Registration number: HRB 110839</p>
<h2>VAT ID</h2>
<p>VAT identification number under § 27a UStG: DE267746902</p>
<h2>Responsible for content under § 18 (2) MStV</h2>
<p>Leonid Dudakov<br>Krohnskamp 13<br>22301 Hamburg<br>Germany</p>`,
  ru: `<h1>Impressum</h1>
<p>Сведения согласно § 5 DDG (закон Германии о цифровых услугах)</p>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Германия</p>
<p>В лице управляющего директора (Geschäftsführerin):<br>Julia Gross</p>
<h2>Контакт</h2>
<p>Телефон: <a href="tel:+49402705434">+49 40 2705434</a><br>E-mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<h2>Торговый реестр</h2>
<p>Суд регистрации: Amtsgericht Hamburg<br>Номер: HRB 110839</p>
<h2>Номер плательщика НДС</h2>
<p>USt-IdNr. согласно § 27a UStG: DE267746902</p>
<h2>Ответственный за содержание согласно § 18 абз. 2 MStV</h2>
<p>Leonid Dudakov<br>Krohnskamp 13<br>22301 Hamburg<br>Германия</p>`,
};

const GH_PRIVACY = "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement";

const GOOGLE_PRIVACY = "https://policies.google.com/privacy";
const GOOGLE_OPTOUT = "https://tools.google.com/dlpage/gaoptout";

export const PRIVACY = {
  de: `<h1>Datenschutzerklärung</h1>
<h2>Verantwortlicher</h2>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Deutschland<br>Vertreten durch die Geschäftsführerin Julia Gross<br>Telefon: <a href="tel:+49402705434">+49 40 2705434</a><br>E-Mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<p>Ein Datenschutzbeauftragter ist nicht bestellt, da hierzu keine gesetzliche Pflicht besteht.</p>
<h2>Cookies und Einwilligung</h2>
<p>Ohne Ihre Einwilligung setzt diese Website keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge. Die Schriften sind lokal auf dieser Website gespeichert und werden nicht von fremden Servern geladen. Ihre Entscheidung im Einwilligungsbanner („Akzeptieren“ oder „Ablehnen“) wird im Speicher Ihres Browsers (localStorage) abgelegt, damit das Banner nicht bei jedem Seitenaufruf erneut erscheint; das ist technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen: über den Link „Cookie-Einstellungen“ unten auf jeder Seite.</p>
<h2>Google Analytics</h2>
<p>Nur wenn Sie im Banner „Akzeptieren“ wählen, nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland („Google“). Google Analytics setzt Cookies (<code>_ga</code>, <code>_ga_*</code>, Speicherdauer bis zu 2 Jahre) und erfasst Informationen über Ihre Nutzung der Website, z. B. aufgerufene Seiten, Klicks auf die Links zu Amazon und Apple Books, Verweildauer, ungefähren Standort, Geräte- und Browserdaten. IP-Adressen werden von Google Analytics 4 nicht gespeichert. Die Daten können an Server der Google LLC in den USA übermittelt werden; Google ist nach dem EU-US Data Privacy Framework zertifiziert. Google verarbeitet die Daten in unserem Auftrag; mit Google besteht ein Vertrag über die Auftragsverarbeitung (Art. 28 DSGVO). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Ereignisdaten werden nach 2 Monaten gelöscht, nutzerbezogene Daten (Cookie-Kennungen) nach 14 Monaten; bei einem erneuten Besuch beginnt diese Frist neu. Wenn Sie die Einwilligung widerrufen, wird Google Analytics nicht mehr geladen und die Cookies werden gelöscht. Weitere Informationen: <a href="${GOOGLE_PRIVACY}" rel="noopener">Datenschutzerklärung von Google</a>; Browser-Add-on zur Deaktivierung: <a href="${GOOGLE_OPTOUT}" rel="noopener">tools.google.com/dlpage/gaoptout</a>.</p>
<h2>Hosting</h2>
<p>Die Website wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der Seiten verarbeitet GitHub die IP-Adresse der Besucher sowie technische Protokolldaten (z. B. Zeitpunkt des Abrufs, abgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und zuverlässigen Bereitstellung der Website. Dabei können Daten in die USA übermittelt werden; GitHub ist nach dem EU-US Data Privacy Framework zertifiziert. Näheres im <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Links zu Amazon und Apple Books</h2>
<p>Die Website enthält Links zu Amazon und Apple Books. Erst wenn Sie einem solchen Link folgen, gelangen Sie auf die Seiten dieser Anbieter; dort gelten deren Datenschutzbestimmungen.</p>
<h2>Kontakt per E-Mail oder Telefon</h2>
<p>Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben (z. B. Name, E-Mail-Adresse, Telefonnummer, Inhalt der Anfrage) ausschließlich zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO) bzw. Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Anfrage auf einen Vertrag gerichtet ist. Für E-Mails nutzen wir Google Workspace der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; dabei können Daten an Google LLC in den USA übermittelt werden (Google ist nach dem EU-US Data Privacy Framework zertifiziert). Wir löschen Ihre Anfrage, sobald sie abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
<h2>Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (Art. 7 Abs. 3 DSGVO). Wenden Sie sich dazu an die oben genannten Kontaktdaten.</p>
<h2>Beschwerderecht bei der Aufsichtsbehörde</h2>
<p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für uns ist:</p>
<p>Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit<br>Ludwig-Erhard-Straße 22, 20459 Hamburg<br><a href="https://www.datenschutz-hamburg.de" rel="noopener">www.datenschutz-hamburg.de</a></p>`,
  en: `<h1>Privacy Policy</h1>
<p><i>Translation for convenience; the German version (Datenschutzerklärung) is authoritative.</i></p>
<h2>Controller</h2>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Germany<br>Represented by the managing director Julia Gross<br>Phone: <a href="tel:+49402705434">+49 40 2705434</a><br>E-mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<p>No data protection officer has been appointed, as there is no legal obligation to do so.</p>
<h2>Cookies and consent</h2>
<p>Without your consent this website sets no cookies and uses no analytics or tracking tools. The fonts are stored on this website and are not loaded from other servers. Your choice in the consent banner (“Accept” or “Decline”) is saved in your browser’s storage (localStorage) so that the banner does not reappear on every page; this is technically necessary (§ 25(2) no. 2 TDDDG). You can withdraw your consent at any time with effect for the future via the “Cookie settings” link at the bottom of every page.</p>
<h2>Google Analytics</h2>
<p>Only if you choose “Accept” in the banner do we use Google Analytics 4, a web analytics service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland (“Google”). Google Analytics sets cookies (<code>_ga</code>, <code>_ga_*</code>, stored for up to 2 years) and collects information about your use of the website, such as pages viewed, clicks on the links to Amazon and Apple Books, time spent, approximate location, device and browser data. Google Analytics 4 does not store IP addresses. Data may be transferred to servers of Google LLC in the USA; Google is certified under the EU-US Data Privacy Framework. Google processes the data on our behalf under a data processing agreement (Art. 28 GDPR). The legal basis is your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG). Event-level data is deleted after 2 months and user-level data (cookie identifiers) after 14 months; this period restarts with each new visit. If you withdraw your consent, Google Analytics is no longer loaded and its cookies are deleted. More information: <a href="${GOOGLE_PRIVACY}" rel="noopener">Google Privacy Policy</a>; browser add-on to opt out: <a href="${GOOGLE_OPTOUT}" rel="noopener">tools.google.com/dlpage/gaoptout</a>.</p>
<h2>Hosting</h2>
<p>The website is hosted on GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. When the pages are opened, GitHub processes visitors’ IP addresses and technical log data (for example the time of access, the page requested and the browser type) in order to deliver the website and keep it secure. The legal basis is Art. 6(1)(f) GDPR; our legitimate interest is the secure and reliable provision of the website. Data may be transferred to the USA; GitHub is certified under the EU-US Data Privacy Framework. See the <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Links to Amazon and Apple Books</h2>
<p>The website contains links to Amazon and Apple Books. Only when you follow such a link do you reach the sites of these providers; their privacy policies apply there.</p>
<h2>Contact by e-mail or phone</h2>
<p>If you contact us by e-mail or phone, we process your details (e.g. name, e-mail address, phone number, content of the request) solely to deal with your request. The legal basis is our legitimate interest in answering enquiries (Art. 6(1)(f) GDPR), or Art. 6(1)(b) GDPR if your request relates to a contract. For e-mail we use Google Workspace of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland; data may be transferred to Google LLC in the USA (Google is certified under the EU-US Data Privacy Framework). We delete your request once it has been dealt with, unless statutory retention obligations apply.</p>
<h2>Your rights</h2>
<p>You have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15–21 GDPR), and the right to withdraw consent at any time with effect for the future (Art. 7(3) GDPR). Please use the contact details above.</p>
<h2>Right to lodge a complaint</h2>
<p>You have the right to lodge a complaint with a data protection supervisory authority. The authority responsible for us is:</p>
<p>Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit<br>Ludwig-Erhard-Straße 22, 20459 Hamburg<br><a href="https://www.datenschutz-hamburg.de" rel="noopener">www.datenschutz-hamburg.de</a></p>`,
  ru: `<h1>Политика конфиденциальности</h1>
<p><i>Перевод для удобства; юридически действует немецкая версия (Datenschutzerklärung).</i></p>
<h2>Ответственное лицо</h2>
<p>King Casino Entertainment GmbH<br>Krohnskamp 13<br>22301 Hamburg<br>Германия<br>В лице управляющего директора Julia Gross<br>Телефон: <a href="tel:+49402705434">+49 40 2705434</a><br>E-mail: <a href="mailto:leonid@dudakov.com">leonid@dudakov.com</a></p>
<p>Уполномоченный по защите данных не назначен, так как закон этого не требует.</p>
<h2>Cookies и согласие</h2>
<p>Без вашего согласия сайт не устанавливает cookies и не использует инструменты аналитики и отслеживания. Шрифты хранятся на самом сайте и не загружаются с чужих серверов. Ваш выбор в баннере («Принять» или «Отклонить») сохраняется в памяти браузера (localStorage), чтобы баннер не появлялся на каждой странице; это технически необходимо (§ 25 абз. 2 п. 2 TDDDG). Вы можете в любой момент отозвать согласие на будущее — по ссылке «Настройки cookies» внизу каждой страницы.</p>
<h2>Google Analytics</h2>
<p>Только если вы нажали в баннере «Принять», мы используем Google Analytics 4 — сервис веб-аналитики компании Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ирландия («Google»). Google Analytics устанавливает cookies (<code>_ga</code>, <code>_ga_*</code>, срок хранения — до 2 лет) и собирает сведения о том, как вы пользуетесь сайтом: просмотренные страницы, нажатия на ссылки на Amazon и Apple Books, время на сайте, примерное местоположение, данные устройства и браузера. Google Analytics 4 не сохраняет IP-адреса. Данные могут передаваться на серверы Google LLC в США; Google сертифицирован по EU-US Data Privacy Framework. Google обрабатывает данные по нашему поручению; с Google заключён договор об обработке данных (ст. 28 GDPR). Правовое основание — ваше согласие (ст. 6 п. 1 лит. a GDPR, § 25 абз. 1 TDDDG). Данные о событиях удаляются через 2 месяца, данные о пользователях (идентификаторы cookies) — через 14 месяцев; при новом посещении этот срок начинается заново. Если вы отзовёте согласие, Google Analytics больше не загружается, а его cookies удаляются. Подробнее: <a href="${GOOGLE_PRIVACY}" rel="noopener">политика конфиденциальности Google</a>; дополнение для браузера, отключающее аналитику: <a href="${GOOGLE_OPTOUT}" rel="noopener">tools.google.com/dlpage/gaoptout</a>.</p>
<h2>Хостинг</h2>
<p>Сайт размещён на GitHub Pages — сервисе компании GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. При открытии страниц GitHub обрабатывает IP-адреса посетителей и технические журналы (например, время обращения, запрошенную страницу, тип браузера), чтобы доставлять сайт и обеспечивать его безопасность. Правовое основание — ст. 6 п. 1 лит. f GDPR; наш законный интерес — безопасная и надёжная работа сайта. Данные могут передаваться в США; GitHub сертифицирован по EU-US Data Privacy Framework. Подробнее — в <a href="${GH_PRIVACY}" rel="noopener">GitHub Privacy Statement</a>.</p>
<h2>Ссылки на Amazon и Apple Books</h2>
<p>На сайте есть ссылки на Amazon и Apple Books. Только перейдя по такой ссылке, вы попадаете на сайт этих компаний; там действуют их правила обработки данных.</p>
<h2>Связь по e-mail или телефону</h2>
<p>Если вы связываетесь с нами по e-mail или телефону, мы обрабатываем ваши данные (например, имя, адрес e-mail, номер телефона, содержание обращения) только для ответа на обращение. Правовое основание — наш законный интерес в ответе на запросы (ст. 6 п. 1 лит. f GDPR), а если обращение касается договора — ст. 6 п. 1 лит. b GDPR. Для e-mail мы используем Google Workspace компании Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ирландия; данные могут передаваться в Google LLC в США (Google сертифицирован по EU-US Data Privacy Framework). Мы удаляем обращение после его окончательной обработки, если закон не требует хранить его дольше.</p>
<h2>Ваши права</h2>
<p>Вы вправе получить сведения о своих данных, потребовать их исправления, удаления, ограничения обработки, переноса, возразить против обработки (ст. 15–21 GDPR), а также в любой момент отозвать данное согласие на будущее (ст. 7 п. 3 GDPR). Для этого используйте контактные данные выше.</p>
<h2>Право на жалобу в надзорный орган</h2>
<p>Вы вправе подать жалобу в надзорный орган по защите данных. Для нас компетентен:</p>
<p>Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit<br>Ludwig-Erhard-Straße 22, 20459 Hamburg<br><a href="https://www.datenschutz-hamburg.de" rel="noopener">www.datenschutz-hamburg.de</a></p>`,
};
