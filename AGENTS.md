# sprint_1 maintainer contract

This repository is the complete default scope for project `sprint-1`.
The user owns product intent; the active AI operator owns coherent
implementation, verification, project documentation, and Git history within
this repository.

## Required startup

1. Read `CONSTITUTION.md`, `VALUES.md`, and `INDEX.md`.
2. Read `docs/ARCHITECTURE.md`, `docs/OPERATIONS.md`, and relevant current work.
3. Inspect live code and runtime for facts that may have changed.
4. State that project `sprint-1` is the active context before material
   work if the thread was switched here from another project.

## Allowed project work

The AI operator may autonomously inspect and modify this repository when the
user's request calls for it. Preserve unrelated work, verify changes in
proportion to risk, keep documentation consistent, and commit a completed
coherent change.

Use `VALUES.md` when choosing between valid approaches: preserve the intended
user outcome, prefer the simplest sufficient architecture, and explain the
verified result in terms the user can readily understand.

## System boundary

Full host capabilities are technically available, but this project context is
not authorization to modify the server itself. Do not modify any of the
following without explicit user authorization in the current conversation:

- `/srv/vibe/system` or its Git history;
- `/etc`, `/usr`, `/opt`, users, packages, kernel, systemd, firewall, DNS, Caddy,
  shared databases, agent runtime, or other shared infrastructure;
- another project under `/srv/vibe/projects`;
- production deployment or publication outside this repository.

Read-only inspection needed to understand dependencies is allowed. If a task
requires a cross-boundary change, explain the exact boundary and obtain explicit
authorization before acting. Then load `/srv/vibe/system/AGENTS.md` and its
required context, keep system and project changes in separate commits, and
update both task histories when relevant.

## Practice feedback

If this project discovers a reusable practice that could improve future
projects, record the evidence here and propose it for upstream promotion. Do not
silently edit the system template from this context.

## Default prototype publication

For a user-requested prototype publication, use the contour publisher and the
authenticated URL `https://vibe-apps.aikibox.ru/sprint-1/`. Do not
create a Sites/App Garden, Vercel, Netlify, or other external cloud deployment,
and do not add `.openai/hosting.json`, unless the user explicitly requests that
specific external host in the current conversation. A requested path on
`aikibox.ru` requires a structured request to the contour system project.

The `vibe-apps.aikibox.ru` URL is a browser surface behind MAIN audience auth.
This project and ordinary agent-side HTTP clients do not have a MAIN session
cookie. Do not run `curl`, `wget`, an unauthenticated browser, or a similar
external reachability probe as a routine health check: `401` or an auth/ingress
timeout is expected and says nothing about project health. Verify publication
through the contour's `publishctl status`, the publisher's internal health
check, and project logs. Test the external user flow only in an already
authenticated browser session or when the user explicitly requests shared
auth/ingress diagnosis.

## Secrets and destructive actions

Never commit or print credentials, tokens, private keys, personal data, or
secret-bearing environment files. Resolve exact targets before destructive
actions and keep a practical rollback when the change is hard to recover.

## Resource-intensive workloads

Large imports, exports, renders, builds, and similar one-shot work must use a
streaming or bounded-chunk design, an explicit memory budget below the
container/cgroup hard limit, and representative peak-RSS verification. Start
with a small correctness/layout preview and avoid keeping an unrelated test
server alive during the full run. If the budget is exceeded, stop and fix the
algorithm; raising infrastructure limits is not a substitute for bounded work.

## Materials

User uploads, generated artifacts, exports and scratch live under the ignored
project-local `materials/` tree; read `docs/MATERIALS.md` before using them.
Unless the user explicitly selects another destination, copy every selected
final user-requested image, audio, video, document, or other generated non-code
artifact to `materials/generated/` before completing the task, even when the
generating tool initially stored it in CODEX_HOME, a cache, or another runtime
directory. Report the final project-local path. Do not overwrite an existing
artifact without an explicit request. If project context is ambiguous, resolve
it before writing rather than choosing an unrelated root. Product assets that
must be versioned receive a separate copy in the appropriate tracked directory.

Do not move secrets or agent runtime state into materials. A request outside
the project or contour becomes a structured privilege request to the contour
system project; it is never an implicit escalation.

## Origin

Created from the System Project template at system commit
`2b94e6f4709dfb9635617fd450572a54390459f5` on `2026-09-13T05:54:33Z`.
