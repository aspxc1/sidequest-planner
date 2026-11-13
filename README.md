# Sidequest

A local workspace for backend, applied AI/ML and DevOps side projects. No account, hosting, dependencies, API keys or network services.

## Open the app

**Windows:** double-click **Start Sidequest.cmd**, then open **http://localhost:4173**. Keep the server window open. Node.js 22 or newer is required for the server.

Or run these commands from this folder:

```sh
npm start
```

No `npm install` is needed. The local server builds the app on startup and binds only to your computer's loopback interface.

**Without Node:** open `dist/index.html` in a modern browser. It is a single self-contained HTML file and works offline. Keep the file at the same path: browsers may give moved files a different storage area. The local server is the recommended option for a stable storage address.

## What you can do

- Start with a backend, AI/ML or DevOps idea, or a blank project.
- Define scope, exclusions, outcome and definition of done.
- Set milestones and target dates; track linked tasks on a roadmap.
- Move tasks through Backlog, To do, In progress and Done using drag/drop or accessible status menus.
- Label tasks and components **Software**, **GPT / API** or **Mixed**.
- Compare architecture options and record the selected approach as a technical decision.
- Keep API contracts, data models, decision records and deployment checks.
- Keep reusable notes across projects; search the whole workspace with Ctrl/Cmd K.

The example Incident Brief project is illustrative and fully editable. GPT/API labels describe the components of your planned projects; this planner makes no AI or external API calls.

## Your data

Records save in browser localStorage under `sidequest.workspace.v1`. They are not written to source files or sent to a server. Storage is specific to the browser profile and exact app address: `localhost`, `127.0.0.1`, another port and a direct file each have separate workspaces.

Use **Backup → Export backup** regularly. **Import backup** validates the file, asks before replacing the workspace, and exports the current workspace first. You can also expand **Restore from pasted JSON** and paste the file contents. Invalid imports leave existing work unchanged. Keep the downloaded backup somewhere you control. Clearing browser data removes locally saved projects.

If storage is full, unavailable, corrupted or changed in another tab, a persistent message tells you to export the current work. New edits remain in the open tab until you back them up. Export before closing or reloading an unsaved tab. A stale tab cannot overwrite a newer workspace. With corrupt storage, the original record is retained and can be downloaded from Backup for recovery.

## Develop

```sh
npm test
npm run build
npm run dev
```

Node's built-in test runner verifies templates, schema validation, backup roundtrip, progress and storage safety. The build combines `src/` into `dist/index.html`. Source changes rebuild while the local server runs; refresh the browser to see them.

- `src/core.mjs`: workspace schema, idea starters and progress.
- `src/storage.mjs`: persistence and stale-tab protection.
- `src/seed.mjs`: example project and reusable notes.
- `src/app.js`, `src/style.css`, `src/shell.html`: application UI.
- `scripts/`: dependency-free build and server.

The Git repository is local. No remote or hosted Site was created, following the local-only preference.
