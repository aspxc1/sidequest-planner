---
name: Sidequest
description: A quiet engineering field notebook for planning and finishing personal projects.
colors:
  paper: "#f5f6f3"
  white: "#fff"
  ink: "#202e2b"
  muted: "#62716b"
  line: "#e2e7e1"
  forest: "#172d29"
  green: "#236b54"
  soft: "#e6efe8"
  software: "#446873"
  gpt: "#80563c"
  warn: "#9a5a28"
  danger: "#ac4039"
  focus: "#458a6c"
  green-hover: "#19563f"
  software-soft: "#edf2f4"
  gpt-soft: "#f5eae2"
  mixed: "#705d84"
  mixed-soft: "#f0ecf5"
  nav-selected: "#dfede2"
  nav-selected-ink: "#1f4836"
typography:
  display:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "0.09em"
  code:
    fontFamily: "Consolas, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  badge: "4px"
  control: "6px"
  card: "8px"
  panel: "12px"
  dialog: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  control: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  workspace: "42px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    height: "36px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  input-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 11px"
  navigation-item:
    backgroundColor: "transparent"
    rounded: "{rounded.control}"
    padding: "10px 13px"
    height: "39px"
  navigation-item-active:
    backgroundColor: "{colors.nav-selected}"
    textColor: "{colors.nav-selected-ink}"
  chip-software:
    backgroundColor: "{colors.software-soft}"
    textColor: "{colors.software}"
    rounded: "{rounded.badge}"
    padding: "3px 7px"
  chip-gpt:
    backgroundColor: "{colors.gpt-soft}"
    textColor: "{colors.gpt}"
    rounded: "{rounded.badge}"
    padding: "3px 7px"
  chip-mixed:
    backgroundColor: "{colors.mixed-soft}"
    textColor: "{colors.mixed}"
    rounded: "{rounded.badge}"
    padding: "3px 7px"
  panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px 24px 24px"
  task-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px"
  milestone-current:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    size: "29px"
---

# Design System: Sidequest

## Overview

**Creative North Star: "The Engineering Field Notebook"**

Sidequest uses the calm organization of a field notebook: a paper ground, a dark forest navigation rail, precise headings, and connected milestone marks. Its personality comes from useful information arranged with care. Familiar controls keep project planning, technical rationale, and the next task easy to find.

This is a builder-selected direction, documented from the implemented interface rather than a claimed user aesthetic preference. The original field notebook choice is preserved through type, palette, density, and the milestone track. Technical handbooks, map keys, research notebooks, architecture journals, print specification sheets, and engineering drawing indices informed the original comparison; field notebooks were selected with seed `221ef68bca83539a`. No external visual challenger was available.

**Key Characteristics:**
- Quiet paper surfaces with a stable forest rail.
- Compact, legible controls and information-rich rows.
- Color tied to action, selection, status, or component kind.
- Connected milestones that make the next deliverable easy to scan.
- Native controls, authored stroke SVG, and visible keyboard focus.

## Colors

The palette combines slightly warm paper and green-black ink with restrained semantic accents. The frontmatter is normative; values were extracted from `src/style.css`.

### Primary

- **Working Green** (`green`): primary actions, links, current milestone nodes, and checked controls. Its darker hover companion is `green-hover`.
- **Soft Sage** (`soft`): quiet control hover and supporting selection surfaces.

### Secondary

- **Software Slate** (`software`, `software-soft`): deterministic software labels and component icons.
- **API Clay** (`gpt`, `gpt-soft`): GPT/API labels and model-based component icons.
- **Mixed Mauve** (`mixed`, `mixed-soft`): tasks that cross both implementation kinds.
- **Warning Ochre** (`warn`) and **Error Brick** (`danger`): caution and destructive/error semantics.

### Neutral

- **Notebook Paper** (`paper`): workspace ground.
- **Clean Sheet** (`white`): panels, cards, fields, and secondary controls.
- **Forest Rail** (`forest`): persistent navigation and project context.
- **Engineering Ink** (`ink`): headings, body text, and control labels.
- **Quiet Ink** (`muted`): descriptions, dates, breadcrumbs, and counts.
- **Pencil Line** (`line`): dividers and panel borders.
- **Selected Leaf** (`nav-selected`, `nav-selected-ink`): active navigation.
- **Focus Fern** (`focus`): shared keyboard outline.

**The Semantic Color Rule.** Use accent color to convey action, selection, status, or implementation kind; keep the working canvas predominantly paper and white.

## Typography

**Display and body font:** Segoe UI, with system-ui, Apple system, and sans-serif fallbacks. **Code font:** Consolas, with SFMono-Regular and monospace fallbacks. Fonts are local system fonts; the interface requires no font service.

The hierarchy is compact and practical. Strong weight and modest negative tracking distinguish headings, while technical examples retain a monospace voice. The actual CSS supersedes the provisional scale: the page heading is (32px), reducing to (28px) on narrow screens.

- **Display:** page headings, with balanced wrapping.
- **Headline:** section headings; panel headings tighten to (16px), while dialog headings grow to (20px).
- **Title:** record and note titles. Task and milestone titles use local variants (12–13px) to preserve scan density.
- **Body:** introductions and general interface copy. Introductory paragraphs use a more open line height (1.65) and a maximum measure of (67ch).
- **Compact:** panel descriptions, task details, and dense records. Brief copy opens to (1.8) with a measure near (65ch).
- **Label:** small uppercase section labels. Form labels remain sentence case (12px, weight 600); badges are (10px, weight 600).
- **Code:** API/data examples, wrapping long content rather than widening records.

**The Small Type Rule.** Preserve small labels for metadata; keep task titles, fields, and actionable text visually distinct from their supporting details.

## Layout

The desktop shell has a fixed navigation rail (238px) and a flexible workspace. The topbar is sticky (76px high). Main content uses a centered maximum width (1560px), generous page framing (38px 42px 56px), and closer spacing inside panels. The overview balances a broad roadmap with a narrower brief/decision column (1.65:1), separated by (24px). Typical panel padding is about (20–24px); rows and badges are deliberately denser.

Above (1500px), horizontal page framing grows to (52px). At or below (1200px), the rail narrows to (215px) and page framing to (28px). At or below (1000px), the overview becomes one column, board lanes reduce from four to two, and records/notes simplify to one column. At or below (760px), the rail becomes a hidden (244px) drawer, the topbar is (64px) high, main padding is (25px 18px 36px), heading actions wrap beneath the heading, and board lanes stack. The closed mobile drawer is hidden from keyboard navigation.

Architecture comparisons retain a readable minimum width (720px) inside a horizontal scrolling container. Long technical content wraps within records. Forms use two columns where space permits and one column on mobile. The spacing frontmatter records the reusable rhythm rather than every local alignment adjustment.

**The Reflow Rule.** Stack work sections and board lanes on small screens; reserve horizontal scrolling for comparisons whose columns are meaningful together.

## Elevation & Depth

Ordinary work surfaces are flat: white panels, pale lane grounds, and thin borders establish separation without ornamental shadows. Selected navigation and current milestones use tonal contrast. Depth is reserved for temporary surfaces: the native dialog uses a substantial shadow and dim backdrop; the toast uses a smaller shadow to remain legible over the workspace.

- **Dialog lift:** `0 24px 70px #15291b30`; reserved for the native modal.
- **Toast lift:** `0 5px 20px #17301c20`; reserved for transient action feedback.
- **Modal scrim:** `#13241d70`; the drawer uses a lighter scrim (`#152d2460`).

**The Flat Workspace Rule.** Keep panels and task cards shadow-free; use elevation only when a temporary surface must sit above the workspace.

## Shapes

Controls have gently rounded corners (`control`); badges are tighter (`badge`), task cards a little softer (`card`), and panels more relaxed (`panel`). Dialogs use the largest established corner (`dialog`). Board lanes and notes have local intermediate corners (9px and 10px). Thin borders define resting surfaces.

Milestone nodes and tiny status dots are circular. Progress tracks are slim, clipped, and rounded: the overview uses a (5px) track and per-milestone summaries a (3px) track. Authored stroke SVG icons are usually (18px), with metadata icons between (12–16px).

## Components

### Buttons

Compact and direct. Primary buttons use Working Green with white text; secondary buttons use white and a fine neutral border; quiet actions remove the visible border and use muted text. Standard controls have a minimum height (36px), small variants (30px), sentence-case labels, and icon gaps (7px). Secondary hover adds a pale fill and stronger border; primary hover darkens; quiet hover uses Soft Sage. Text actions underline on hover. Disabled buttons use reduced opacity (.5) and a not-allowed cursor.

Every keyboard-focusable control receives the shared outline (3px solid Focus Fern, offset 3px). The source defines no decorative press transform; native activation remains intact.

### Chips

Small rectangular labels pair text with a light tint. Software, GPT/API, and Mixed each retain a consistent foreground/background pair. Status chips use a separate vocabulary: green for completion/accepted/building, blue for planning/todo/proposed, and ochre for doing/paused. Priority labels are unfilled. Chips describe records and are not buttons; readable words accompany color.

### Cards / Containers

Panels use a white fill, Pencil Line border, and the `panel` corner. Headers pair a compact title with an optional text action. Board lanes use a pale green-gray ground; task cards use white, a fine border, and the `card` corner. Task-card hover strengthens the border, dragging reduces opacity (.5), and the destination lane uses a tinted ground with a dashed outline. A native status select provides the alternate move control.

### Inputs / Fields

Fields use white fill, a fine green-gray border, the `control` corner, and generous internal padding for compact type. Labels sit above fields; hints use muted text. Textareas resize vertically, and code fields switch to Consolas. The shared outline handles keyboard focus; the caret uses Working Green. Form errors are small Error Brick text. Do not invent unimplemented disabled or inline-validation variants.

### Navigation

The forest rail contains the brand, labeled project picker, project sections, workspace sections, and local-storage context. Rows pair a stroke icon with text; counts sit at the trailing edge. Hover adds a darker green layer; the active row uses Selected Leaf with strong dark text. The rail becomes an explicit menu drawer on mobile. Active state uses weight and shape as well as color.

### Milestone Track

The signature recurring pattern combines a thin connecting rule, circular numbered nodes, task counts, due dates, and small progress bars. Completed nodes replace their number with a check; current nodes fill with Working Green. A lightly tinted, bordered footer exposes the next task as a text action. Keep node, title, supporting details, and date aligned as one scannable row.

### Temporary Feedback

Native dialogs carry a separated header, labeled fields, and a sticky action footer. Toasts appear near the bottom and fade in over (150ms). Drawer and progress transitions use (200ms, ease). All transitions are removed when reduced motion is requested.

## Do's and Don'ts

### Do:

- **Do** preserve the paper ground, forest rail, and flat white work surfaces.
- **Do** use the existing semantic pairs for Software, GPT/API, and Mixed labels.
- **Do** retain the shared visible keyboard outline on every interactive control.
- **Do** keep native selects, checkboxes, and dialog behavior recognizable.
- **Do** stack work sections on mobile and wrap long technical content.
- **Do** keep milestone progress, due dates, and the next task easy to scan.

### Don't:

- **Don't** add ornamental shadows to resting panels or task cards.
- **Don't** use accent colors as decoration without a semantic role.
- **Don't** turn static category chips into implied actions.
- **Don't** replace useful labels with icon-only controls or color alone.
- **Don't** require external fonts or imagery to preserve the current identity.
- **Don't** add motion that survives the reduced-motion preference.
