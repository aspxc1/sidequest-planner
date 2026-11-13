# Sidequest design

Personal local project planner for backend, applied AI/ML and DevOps projects. User-selected constraint: store locally; no cloud hosting. Builder choices below are defaults, not claimed user preferences.

## Approach
Use a dependency-free browser app with localStorage and validated JSON export/import. A cloud database was considered and rejected by the user. A desktop wrapper adds installation without improving this scope. A Node server uses a stable localhost origin; a standalone generated HTML file also works offline.

## Workflow
Seed an explicitly labeled example project. Create a project from a backend, AI/ML or DevOps idea, or a blank brief. Edit goals, in/out scope and project status. Roadmap groups tasks into dated milestones; board supports accessible status changes and drag/drop. Architecture comparison supports options, tradeoffs, selection and component boundary lists. API/data view stores editable contracts and entities. Decisions contain context, decision and consequences. Deployment is a checked list. Reusable notes belong to the workspace and are searchable across projects.

## Persistence
Save every data mutation synchronously. Exports include schemaVersion, projects, notes and active project. Validate all imported records before replacement; back up current workspace before import. Failures preserve the in-memory workspace and show a persistent recovery message. No network or model calls. Mark software, GPT/API and mixed work explicitly; AI tasks record evaluation/fallback obligations.

## Surface
Operate mode. Standard sidebar navigation, project selector and compact toolbar; readable two-column overview, roadmap list, four-lane board and architecture table. Crisp white paper on warm neutral with deep forest navigation and restrained teal selection. Segoe UI/system sans, monospace reserved for code. One signature: connected milestone track alongside the next deliverable. Mobile navigation drawer and single-column content. Native dialogs reserve focus for creating/editing records; detailed project notes are inline.

## Verification
Core tests cover imported corruption, backup roundtrip, referential integrity, progress derivation and creation from each idea. Browser QA covers record edits, task moves, reload persistence, export/import, navigation, keyboard and a narrow viewport. No external service required.
