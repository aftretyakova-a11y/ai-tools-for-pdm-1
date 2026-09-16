const http = require('node:http');

require('./database');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '127.0.0.1';

const page = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Кто выгуливает Бориса</title>
  </head>
  <body>
    <main>
      <h1>Кто выгуливает Бориса</h1>
      <p>Основа приложения запущена.</p>
    </main>
  </body>
</html>`;

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' || request.url !== '/') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Страница не найдена');
    return;
  }

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(page);
});

server.listen(port, host, () => {
  console.log(`Приложение запущено: http://localhost:${port}`);
});
