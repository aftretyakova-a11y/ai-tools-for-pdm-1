# Архитектура sprint_1

Статус: initial scaffold

## Назначение и границы

Опишите пользователей, ключевые сценарии, что входит в проект и что остаётся снаружи.

## Компоненты и данные

Опишите runtime-компоненты, хранилища, внешние зависимости и потоки данных.
Крупные пользовательские файлы и generated artifacts находятся в полностью
ignored `materials/` внутри project root согласно
[`MATERIALS.md`](MATERIALS.md), но не входят в Git history.
Выбранный финальный артефакт, созданный по запросу пользователя, по умолчанию
копируется из tool/runtime storage в `materials/generated/`.

## Публикация и shared infrastructure

По умолчанию проект не опубликован. Штатный prototype URL после явного запроса
пользователя — `https://vibe-apps.aikibox.ru/sprint-1/` с общей
авторизацией. Внешний cloud hosting не является default. Любой путь на основном
`aikibox.ru` или другое изменение shared infrastructure проходит через
структурированный административный запрос и синхронное обновление реестра.
Внешний browser URL не является техническим health endpoint для клиентов без
MAIN audience session; нормативный путь проверки описан в
[`OPERATIONS.md`](OPERATIONS.md).

## Секреты, backup и recovery

Опишите классы секретов без значений, данные для backup, RPO/RTO и проверяемый recovery path.
