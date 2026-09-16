const http = require('node:http');

const { currentDate, getWalkSlotsForDate } = require('./database');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '127.0.0.1';

function renderPage(walkDate, walkSlots) {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  }).format(new Date(`${walkDate}T12:00:00+03:00`));
  const slotItems = walkSlots
    .map(({ slot_time: slotTime }) => `<li><time datetime="${slotTime}">${slotTime}</time></li>`)
    .join('\n          ');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Кто выгуливает Бориса</title>
  </head>
  <body>
    <main>
      <h1>Кто выгуливает Бориса</h1>
      <p>Сегодня: <time datetime="${walkDate}">${formattedDate}</time></p>
      <section aria-labelledby="walk-slots-title">
        <h2 id="walk-slots-title">Слоты прогулок</h2>
        <ol>
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
