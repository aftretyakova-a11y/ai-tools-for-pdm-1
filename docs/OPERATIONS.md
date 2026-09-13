# Операции sprint_1

## Build и запуск

Добавьте копируемые команды локальной установки, build и запуска.

## Проверки

Добавьте unit/integration/e2e тесты, lint, health check и ожидаемые результаты.

## Развёртывание и rollback

До публикации опишите exact deploy, migrations, smoke test и rollback. Default
prototype deploy выполняется из `/srv/vibe/system` командой
`scripts/publishctl publish sprint-1` и открывается на
`https://vibe-apps.aikibox.ru/sprint-1/` после общей авторизации.
Внешний cloud hosting не используйте без отдельного явного запроса пользователя.
Путь на основном `aikibox.ru` оформляйте через `scripts/requestctl`.

Не используйте unauthenticated `curl`, `wget` или browser smoke внешнего URL как
routine health check. Vibe VDS не имеет MAIN audience session, поэтому `401`
либо timeout на auth/ingress path ожидаем и не свидетельствует о сбое проекта.
Проверяйте публикацию через `scripts/publishctl status`, внутренний health check
publisher и `scripts/publishctl logs sprint-1`; внешний пользовательский
сценарий — только в уже авторизованной browser-сессии.

## Диагностика и recovery

Добавьте пути к логам без секретов, типовые сбои, backup/restore и критерии успешного
восстановления.

## Ресурсный бюджет крупных операций

Для импортов, экспортов, render и build зафиксируйте размер порции, soft memory
limit, container/cgroup hard limit и команду измерения peak RSS. Сначала
проверяйте малый preview, затем репрезентативный полный запуск. Частичный
результат не должен подменять финальный; публикация выполняется атомарно.

## Материалы

Используйте только material roots из [`MATERIALS.md`](MATERIALS.md). Не считайте
Git backup для uploads, generated artifacts или exports. До завершения
задачи копируйте выбранный финальный артефакт из tool/runtime storage в
`materials/generated/` и сообщите его абсолютный путь.
