# Verification record

Verified 2026-11-13. Local-only application; no deployment or external API integration.

## Automated checks

`node --test`: 12 passing tests. Coverage includes independent idea projects and references, empty progress, safe Unicode/code-like text roundtrip, malformed imports and statuses, duplicate IDs, dangling milestones, prototype fields, 300-character architecture names, real calendar dates, backups over 4 MB with Unicode, exact save/reload, stale-tab protection, corruption/quota errors, and startup of all ten views from the generated standalone bundle.

`node scripts/build.mjs`: dependency-free standalone HTML generated successfully. The same generated HTML was served for browser checks. No remote fonts, assets, tracking or third-party requests are required.

Impeccable mechanical detector: ran once against source HTML/CSS/JS and returned no findings. Later review fixes were verified separately.

## Browser checks

Chrome desktop, with a separate `127.0.0.1` origin for test records so the main `localhost` workspace remains an untouched example.

- Created a DevOps project and safely rendered HTML-like project names as text.
- Edited scope and project status; verified persistence after reload.
- Created a GPT/API task, assigned a milestone, moved task status and filtered the board.
- Selected an architecture option and verified the generated decision record.
- Inspected API contracts and data models; checked a deployment item.
- Created and searched a reusable workspace note.
- Downloaded an export, inspected it with the workspace validator, restored through pasted JSON, then reloaded successfully.
- Verified 2,001 scope lines are rejected in the editor with an actionable error.
- Verified task-select focus, task-dialog focus and the second milestone's Add task focus survive changes.
- At a 390 × 844 CSS-pixel embedded viewport, inspected overview and stacked task board. Document scroll width equaled client width (375 pixels after scrollbar); no horizontal page overflow. Mobile navigation opens/closes; Escape returns focus to the menu button. Closed navigation is absent from the accessibility tree.

Native file-picker automation was blocked by the browser extension's file-URL permission. The ordinary file input remains available to users. The pasted-JSON path exercises the same schema validation, confirmation and replacement logic, and was verified end to end.

## Independent review

A separate reviewer inspected source and desktop/mobile screenshots and independently ran the tests. Six material issues were resolved: oversized generated decision titles, inconsistent scope limits, imported date markup, a smaller import ceiling than export size, lost mutation focus, and low-contrast placeholder/completed text. The closed mobile drawer's visibility and focus return were also corrected.

Final disposition: **ship for the reviewed findings**. This is a scoped review result, not a claim that every possible browser or input was tested.

## Storage behavior

Records live in localStorage at the exact browser origin. Export before clearing browser data, moving the app, changing browsers or reloading a tab with unsaved changes. No device synchronization or filesystem database is provided. This matches the user's local-storage choice.
