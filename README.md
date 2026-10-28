# Aurum Viride — сайт aurumviride.com

Сайт-витрина книг Aurum Viride: переиздания и переводы берлинского еженедельника *Wassersport* (1883–1895).
Три языка (`/en/`, `/de/`, `/ru/`). У каждой книги есть кнопки на Amazon и Apple Books. Ничего не продаётся напрямую.

Сайт **собирается автоматически**: вы меняете файл с данными, делаете push (или «Commit changes» на GitHub) в ветку `main`, и через 1–2 минуты GitHub Actions пересобирает и публикует сайт.

## Где что лежит

| Путь | Что это |
|---|---|
| `kit/data/books.json` | **Все книги и номера журнала.** Обычно меняется только этот файл. |
| `kit/covers/` | Обложки: `<id>.jpg` (1600×2560), `<id>-640.webp`, `<id>-full-wrap.jpg` (развёртка) |
| `kit/previews/` | Превью страниц «Заглянуть внутрь», по 3 на книгу (WebP) |
| `kit/samples/<id>/` | `preface.html` (предисловие), `excerpt.html` (короткий отрывок) и рисунки к ним |
| `kit/BRIEF.md` | Техническое задание |
| `src/i18n.mjs` | Тексты сайта на трёх языках: меню, названия и описания серий, «About», **Impressum** и **Datenschutz** |
| `src/build.mjs` | Генератор сайта |
| `src/style.css`, `src/site.js` | Оформление; фильтры каталога и просмотр картинок |
| `src/static/` | Шрифты EB Garamond (локально, SIL OFL), текстура, фото, иконки |
| `.github/workflows/deploy.yml` | Автоматическая сборка и публикация |

## Как добавить новую книгу

1. Положите файлы, назвав их по `id` книги (латиница, цифры и дефис, например `under-oar-fr`):
   - `kit/covers/under-oar-fr.jpg`, `kit/covers/under-oar-fr-640.webp` и, если есть, `kit/covers/under-oar-fr-full-wrap.jpg`;
   - превью страниц в `kit/previews/`;
   - предисловие и отрывок в `kit/samples/under-oar-fr/` (`preface.html`, `excerpt.html` и рисунки).
   На github.com это делается так: откройте папку → **Add file → Upload files** → перетащите файлы → **Commit changes**.
2. В `kit/data/books.json` скопируйте блок похожей книги (от `{` до `},`), вставьте его в список `"books"` и поменяйте значения: `id`, `series`, `volume`, `language`, `title`, `volume_title`, `subtitle`, `editor_credit`, `back_title`, `blurb`, `contents`, `pages`, `trim_in`, `formats`, пути к файлам.
   - `series` — одна из серий: `building-boats`, `under-oar-and-sail`, `wassersport-1885-issues`;
   - `language` — `en`, `de` или `ru`;
   - `formats` — `["paperback", "ebook"]` или `["ebook"]`. По этому полю работает фильтр «печатная / электронная».
3. Сохраните (Commit). Сборка проверяет данные и при ошибке пишет, в какой книге она. Ошибку видно на вкладке **Actions**.

Чего не хватает (нет развёртки, превью или отрывка), то просто не показывается.

Новая серия добавляется в `src/i18n.mjs` (список `SERIES`): название и описание на трёх языках.

## Как вписать ссылки на магазины, ISBN и цену

В `kit/data/books.json` у нужной книги:

```json
"links": {
  "amazon": "https://www.amazon.com/dp/XXXXXXXXXX",
  "apple_books": "https://books.apple.com/book/idXXXXXXXXX",
  "other": null
},
"isbn": { "paperback": "978-…", "ebook": "978-…" },
"price": { "amount": 24.99, "currency": "EUR" },
```

- Пустая ссылка (`null`) — кнопки нет. Если у книги нет ни одной ссылки, показывается неактивная метка «Coming soon / Demnächst / Скоро».
- `other` — ссылка на печатное издание на другой площадке (например, для русских книг): `"other": "https://…"` или с собственной подписью: `"other": { "url": "https://…", "label": "Печатное издание" }`. Пока там `null`, кнопки нет.
- ISBN и цена появляются в характеристиках книги и в данных для поисковиков (schema.org).
- Текст пишется в прямых кавычках `"…"`, между полями и блоками ставятся запятые. Кавычки внутри текста — «ёлочки» или “такие”.

## Как пересобрать и выложить

Ничего делать не нужно: любой push в `main` → GitHub Actions собирает сайт (`node src/build.mjs`) и публикует его на GitHub Pages. Ход сборки виден на вкладке **Actions**. Перезапустить вручную: Actions → *Deploy to GitHub Pages* → **Run workflow**.

Посмотреть сайт у себя (нужен Node.js 18+ и Python 3):

```bash
npm run serve
```

Затем откройте http://localhost:8000/ в браузере.

## Хостинг и домен (один раз)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   После первой публикации сайт откроется по адресу https://martinleen777.github.io/aurum-viride/.
2. **DNS у регистратора домена (GoDaddy → `aurumviride.com` → DNS):**
   - четыре записи **A**, имя `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (прежние A-записи и «Parked» для `@` удалить);
   - запись **CNAME**, имя `www`, значение `martinleen777.github.io`.
   Записи начинают действовать через время от нескольких минут до суток.
3. **Settings → Pages → Custom domain:** `aurumviride.com` → Save. Когда проверка DNS пройдёт, включите **Enforce HTTPS**.
4. Перезапустите сборку (Actions → Run workflow), чтобы ссылки для поисковиков (canonical, sitemap) получили новый адрес. Сборка берёт адрес из настроек Pages сама.

## Юридические страницы

Impressum и Datenschutzerklärung лежат в `src/i18n.mjs` (`IMPRESSUM`, `PRIVACY`). Замените заглушки `[NAME]`, `[ADDRESS]`, `[EMAIL]` на свои данные на всех трёх языках.
