# Sidequest implementation plan

Goal: complete local engineering project workspace.
Stack: HTML/CSS/JavaScript, Node built-ins, no dependencies.
Spec: ../specs/2026-11-13-sidequest-design.md

## Review focus
- Imported objects must reject malformed arrays, invalid statuses and dangling milestone references.
- User text must render as text, including HTML-like content.
- Storage failures must not silently discard edited work.
- Project changes must not leak tasks or notes between projects.
- Standalone and server builds must use the same implementation.

## Tasks
- [ ] 1. Core data model, idea templates, strict workspace validation, progress and meaningful tests. Files: src/core.mjs, tests/core.test.mjs. Run node --test; commit model.
- [ ] 2. Full example, navigation, overview, roadmap, board, scope, comparison, API/data, deployment, decisions and reusable notes. Files: src/seed.mjs, src/app.js, src/style.css, src/shell.html. Verify mutation persistence and safe text rendering.
- [ ] 3. Dependency-free build and localhost server, standalone HTML, JSON backup/restore. Files: scripts/build.mjs, scripts/serve.mjs, package.json, README.md. Run npm test and npm run build; commit app.
- [ ] 4. Browser checks on desktop/mobile and independent design/code review, resolve material issues, final documentation and release commit.
