const http = require('node:http');

const { bookWalkSlot, currentDate, getWalkSlotsForDate } = require('./database');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '127.0.0.1';
const MAX_FORM_BYTES = 4096;

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

function renderWalkSlot({ slot_time: slotTime, booked_by: bookedBy }, formError) {
  const safeSlotTime = escapeHtml(slotTime);

  if (bookedBy === null) {
    const inputId = `employee-name-${safeSlotTime.replace(':', '-')}`;
    const errorId = `${inputId}-error`;
    const hasError = formError?.slotTime === slotTime;
    const inputValue = hasError ? escapeHtml(formError.employeeName) : '';
    const errorAttributes = hasError
      ? ` value="${inputValue}" aria-invalid="true" aria-describedby="${errorId}"`
      : '';
    const errorMessage = hasError
      ? `<p class="slot__error" id="${errorId}" role="alert">${escapeHtml(formError.message)}</p>`
      : '';

    return `<li class="slot slot--free">
            <time class="slot__time" datetime="${safeSlotTime}">${safeSlotTime}</time>
            <form class="slot__form" method="post" action="walks">
              <input type="hidden" name="slotTime" value="${safeSlotTime}">
              <label class="slot__label" for="${inputId}">ФИО сотрудника</label>
              <div class="slot__fields">
                <input id="${inputId}" name="employeeName" type="text" maxlength="120" required autocomplete="name"${errorAttributes}>
                <button type="submit">Записаться</button>
              </div>
              ${errorMessage}
            </form>
            <span class="slot__status">Свободен</span>
          </li>`;
  }

  return `<li class="slot slot--booked">
            <time class="slot__time" datetime="${safeSlotTime}">${safeSlotTime}</time>
            <p class="slot__details">Записан: <strong>${escapeHtml(bookedBy)}</strong></p>
            <span class="slot__status">Занят</span>
          </li>`;
}

function renderPage(walkDate, walkSlots, formError = null) {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  }).format(new Date(`${walkDate}T12:00:00+03:00`));
  const slotItems = walkSlots
    .map((walkSlot) => renderWalkSlot(walkSlot, formError))
    .join('\n          ');

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

      .slot__form {
        display: grid;
        gap: 6px;
      }

      .slot__label {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .slot__fields {
        display: flex;
        gap: 8px;
      }

      .slot__fields input {
        box-sizing: border-box;
        min-width: 0;
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #5f6c62;
        border-radius: 8px;
        font: inherit;
      }

      .slot__fields button {
        padding: 8px 12px;
        border: 0;
        border-radius: 8px;
        color: #fff;
        background: #24663e;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      .slot__error {
        margin: 0;
        color: #8b241c;
        font-size: 0.875rem;
        font-weight: 600;
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

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function sendPage(response, statusCode, walkSlots, formError = null) {
  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(renderPage(currentDate, walkSlots, formError));
}

async function readForm(request) {
  let body = '';
  request.setEncoding('utf8');

  for await (const chunk of request) {
    body += chunk;

    if (Buffer.byteLength(body) > MAX_FORM_BYTES) {
      throw new Error('FORM_TOO_LARGE');
    }
  }

  return new URLSearchParams(body);
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    const walkSlots = getWalkSlotsForDate(currentDate);

    sendPage(response, 200, walkSlots);
    return;
  }

  if (request.method === 'POST' && request.url === '/walks') {
    const contentType = request.headers['content-type'] ?? '';

    if (!contentType.startsWith('application/x-www-form-urlencoded')) {
      sendText(response, 415, 'Поддерживается только отправка формы');
      return;
    }

    try {
      const form = await readForm(request);
      const slotTime = form.get('slotTime') ?? '';
      const enteredEmployeeName = form.get('employeeName') ?? '';
      const employeeName = enteredEmployeeName.trim();
      const walkSlots = getWalkSlotsForDate(currentDate);
      const slotExists = walkSlots.some(({ slot_time: time }) => time === slotTime);

      if (!slotExists) {
        sendText(response, 400, 'Выберите доступный слот');
        return;
      }

      if (!employeeName || employeeName.length > 120) {
        sendPage(response, 400, walkSlots, {
          employeeName: enteredEmployeeName,
          message: 'Введите непустое ФИО',
          slotTime,
        });
        return;
      }

      if (!bookWalkSlot(currentDate, slotTime, employeeName)) {
        sendText(response, 409, 'Не удалось записаться в выбранный слот');
        return;
      }

      response.writeHead(303, { Location: './' });
      response.end();
      return;
    } catch (error) {
      if (error.message === 'FORM_TOO_LARGE') {
        sendText(response, 413, 'Данные формы слишком велики');
        return;
      }

      console.error(error);
      sendText(response, 500, 'Не удалось обработать запись');
      return;
    }
  }

  sendText(response, 404, 'Страница не найдена');
});

server.listen(port, host, () => {
  console.log(`Приложение запущено: http://localhost:${port}`);
});
