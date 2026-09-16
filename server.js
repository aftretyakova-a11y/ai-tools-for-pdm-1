const http = require('node:http');

const { currentDate, getWalkSlotsForDate } = require('./database');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '127.0.0.1';

function escapeHtml(value) {
  const characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value).replace(/[&<>"']/g, (character) => characters[character]);
}

function renderWalkSlot({ slot_time: slotTime, booked_by: bookedBy }) {
  const safeSlotTime = escapeHtml(slotTime);

  if (bookedBy === null) {
    return `<li class="slot slot--free">
            <time class="slot__time" datetime="${safeSlotTime}">${safeSlotTime}</time>
            <p class="slot__details">Можно записаться</p>
            <span class="slot__status">Свободен</span>
          </li>`;
  }

  return `<li class="slot slot--booked">
            <time class="slot__time" datetime="${safeSlotTime}">${safeSlotTime}</time>
            <p class="slot__details">Записан: <strong>${escapeHtml(bookedBy)}</strong></p>
            <span class="slot__status">Занят</span>
          </li>`;
}

function renderPage(walkDate, walkSlots) {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  }).format(new Date(`${walkDate}T12:00:00+03:00`));
  const slotItems = walkSlots.map(renderWalkSlot).join('\n          ');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Кто выгуливает Бориса</title>
    <style>
      :root {
        color: #24211d;
        background: #f7f4ee;
        font-family: system-ui, sans-serif;
      }

      body {
        margin: 0;
      }

      main {
        box-sizing: border-box;
        width: min(100%, 720px);
        margin: 0 auto;
        padding: 40px 20px;
      }

      ol {
        display: grid;
        gap: 12px;
        padding: 0;
        list-style: none;
      }

      .slot {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 16px;
        align-items: center;
        padding: 18px;
        border: 2px solid;
        border-radius: 12px;
      }

      .slot--free {
        border-color: #2d7d4b;
        background: #eef9f1;
      }

      .slot--booked {
        border-color: #a7493d;
        background: #fff0ed;
      }

      .slot__time {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .slot__details {
        margin: 0;
      }

      .slot__status {
        padding: 4px 10px;
        border-radius: 999px;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 700;
      }

      .slot--free .slot__status {
        background: #2d7d4b;
      }

      .slot--booked .slot__status {
        background: #a7493d;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Кто выгуливает Бориса</h1>
      <p>Сегодня: <time datetime="${walkDate}">${formattedDate}</time></p>
      <section aria-labelledby="walk-slots-title">
        <h2 id="walk-slots-title">Слоты прогулок</h2>
        <ol class="slots">
          ${slotItems}
        </ol>
      </section>
    </main>
  </body>
</html>`;
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' || request.url !== '/') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Страница не найдена');
    return;
  }

  const walkSlots = getWalkSlotsForDate(currentDate);

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(renderPage(currentDate, walkSlots));
});

server.listen(port, host, () => {
  console.log(`Приложение запущено: http://localhost:${port}`);
});
