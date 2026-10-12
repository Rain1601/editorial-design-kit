# Editorial Design Kit

**English** · [简体中文](README.zh-CN.md)

A configurable editorial design skill for Codex, with reusable UI modules and working examples. Build hierarchy through typography, whitespace and content; keep context intact when changing appearance or reviewing sources.

Inspired by Anthropic’s editorial design. This is an independent project, not an official Anthropic component library.

![Illustrative palette preview](docs/preview.svg)

## Copy into Codex: install and use

Copy the whole prompt below into Codex. It installs the skill and applies it to the page you name; replace the bracketed task before sending. If the same skill is already installed, reuse it and preserve local changes.

```text
Use $skill-installer to install Editorial Design Kit:
https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design

If editorial-design is already installed, check its version and local changes.
Do not overwrite existing customizations.

Then use $editorial-design for this task:
Task type: [refine an existing page / create a new page]
Project path: [project path]
Target page: [file, route or page name]
Audience and main task: [who uses it and what they need to accomplish]

Keep the editorial design natural and concise. Refine typography, spacing,
information hierarchy and interactions. Choose a layout for the task;
do not force every page into one template.
Default to Paper / Paper Night and inline 中文 / English buttons.
Allow a custom brand palette. Use semantic color roles and configure
layout independently from appearance.

For an existing page, preserve real content, behavior and saved configuration.
For a new page, define content and states before composing required components.
Reuse the existing framework rather than changing stacks to apply the skill.

When switching language or appearance, preserve reading position, selected items,
filters, sorting, expanded sections, figure modes and source panel state.
Do not rewrite original source excerpts.
Handle empty, loading, error, approval-needed and completed states as appropriate.
Distinguish demo content from real execution.

Verify affected interactions and deliver a working preview, verified behavior
and known limits. If the installed skill is not detected, explain that Codex
needs a restart and provide the prompt to continue afterward.
```

## Live previews

[Open the kit](https://rain1601.github.io/editorial-design-kit/) · [Paper report](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?report=evidence-to-judgment&palette=paper) · [Paper Night report](https://rain1601.github.io/editorial-design-kit/examples/research-report.html?report=evidence-to-judgment&palette=paper-night) · [Agent task workspace](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html) · [Reading queue](https://rain1601.github.io/editorial-design-kit/examples/reading-queue.html) · [Install the Codex skill](https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design)

Open these pages directly; no local server is needed. Appearance choices are shown as inline buttons. Switching appearance preserves the current report and source panel instance. Copy the installation prompt above into Codex.

## What is included

- A self-contained `editorial-design` skill: principles, composition guidance, interaction contracts and templates.
- Seven semantic palettes, including Paper and Paper Night; complete custom palette JSON and independent layout choices.
- Vanilla ES modules for navigation, tables, cards, lists, reading, media and source review. Adapt the relevant interfaces to an existing React/Vue project rather than replacing its stack.
- A report library with three authored specimens: summaries, chapters, independent chart/data modes, source excerpts and reading return.

The skill guides Codex; it does not automatically add a UI dependency to your app. Examples contain authored proposals and synthetic data, not a live research or Agent backend.

## Supported pages and components

| Page type | Current support |
|---|---|
| Articles, case studies and reading pages | Text hierarchy, quotations, media windows, video, animated explainers and image inspection |
| Research reports | Summaries, chapter navigation, chart/data switching, citations, centralized sources and reading return |
| Research libraries, lists and detail pages | Cards, lists, tables, filtering, sorting, selected records and details |
| Agent task pages | Input, attachment metadata, execution logs, approval requests, artifact previews and download actions |
| Dashboards and financial analysis | Composition guidance, scope controls, signed charts, linked data points and source review; compose for the task |
| Settings | General settings first, advanced disclosure, preview/save/revert rules and basic controls |

Reusable components by purpose:

- **Structure and navigation**: Header, Sidebar, tabs/inline choices, breadcrumbs and pagination.
- **Content and records**: cards, lists, tables, record details, article leads and quotations.
- **Input and feedback**: text fields, action menus, tooltips, disclosures, notices, errors and loading states.
- **Evidence and media**: citations, centralized source panels, media windows, video, animated explainers and image inspection.
- **Charts and reports**: signed charts, linked hover states, chart/data switching and a report reader.
- **Agent workflow**: controlled input, execution logs, approval requests and artifacts; callers supply tasks, options, labels and artifact counts.

[Component interfaces and limits](skills/editorial-design/references/components.md) · [Page composition](skills/editorial-design/references/composition.md) · [Agent integration contract](skills/editorial-design/references/agent-tasks.md).

Reports and Agent tasks have complete runnable examples. Dashboards, financial analysis and settings have composition rules and building blocks; not every page pattern has a complete template. Components are Vanilla ES modules + CSS, adaptable to an existing React/Vue architecture. PDF typography rules are reference guidance; no PDF renderer is bundled. Real research, Agent execution, attachment-content analysis and backend integration remain application responsibilities.

### Reusable Agent components

Agent Studio now uses four controlled components: task input, execution log, approval request and artifacts. Import them from [agent-components.mjs](skills/editorial-design/assets/editorial/agent-components.mjs), with the scoped stylesheet and your own task state, labels and action callbacks. [Integration contract](skills/editorial-design/references/agent-tasks.md).

[Try a second task](https://rain1601.github.io/editorial-design-kit/examples/agent-task/agent-task.html?task=review-plan): three approval options and three artifacts use the same components. 中文 / English and Paper / Paper Night preserve current state and reading position. The [portable starter](skills/editorial-design/assets/editorial/agent-starter.html) ships inside the installed skill. Its timer/template engine is explicitly a local demo; connect your own backend for real execution.

## Install locally

Requirements: Codex; Python 3.10+ for installation and local serving; Node.js 18+ for optional tests. No npm dependencies or `npm install` required.

Clone the repository (or extract a downloaded archive), then run from its root:

```sh
git clone https://github.com/Rain1601/editorial-design-kit.git
cd editorial-design-kit
python3 scripts/install-local.py
```

The default destination is `~/.agents/skills/editorial-design`. To install only for a project:

```sh
python3 scripts/install-local.py --dest /path/to/project/.agents/skills
```

`--dest` is the parent skills directory. The installer copies the complete skill, including assets and LICENSE, and refuses to overwrite an existing installation. It does not modify Codex configuration or appearance. Avoid installing duplicate copies with the same skill name.

Codex detects new skills automatically. If it does not appear, restart Codex. For updates, back up and move the existing folder before running the installer again; files are never silently merged. To uninstall, remove only the installed `editorial-design` folder after preserving any local changes.

### Install from GitHub

Ask Codex to install the skill from this repository:

```text
Use $skill-installer to install:
https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design
```

Verified: the official Skill Installer downloaded this repository, and a fresh Codex CLI session generated a working bilingual page using the installed skill. See [VALIDATION.md](VALIDATION.md) for the tested revision and limits. [Official Codex skill documentation](https://learn.chatgpt.com/docs/build-skills).

## Use with Codex

```text
Use $editorial-design to refine my existing research report.
Preserve real content and behavior. Use Paper / Paper Night.
Keep reading position, figure modes and the source panel state when switching appearance.
```

```text
Use $editorial-design to build a task page in this React project.
Use a custom warm blue-gray palette and a list/detail layout.
Keep the design natural and concise; reuse the existing application architecture.
```

Choose palettes and layouts separately. Reuse only the required modules and their relative dependencies. The skill’s [entrypoint](skills/editorial-design/SKILL.md) and current detailed references are written primarily in Chinese; this bilingual README is not a claim that all internal guidance has been translated.

## Run the examples

From the project root:

```sh
python3 -m http.server 8880 --bind 127.0.0.1
```

Open [the example index](http://127.0.0.1:8880/). If port 8880 is occupied, choose another port and adjust the URL. ES modules require HTTP; do not open these pages with `file://`.

| Example | File |
|---|---|
| Agent task: input, execution, approval and artifacts | [Agent Studio](examples/agent-task/agent-task.html) |
| Report library and per-report reading state | [Report library](examples/report-library.html) |
| Paper report | [Paper](examples/research-report.html?report=evidence-to-judgment&palette=paper) |
| Paper Night report | [Paper Night](examples/research-report.html?report=evidence-to-judgment&palette=paper-night) |
| Palettes, custom JSON, layouts and basic components | [Starter](skills/editorial-design/assets/editorial/starter.html) |

Use the HTTP-served example index for interactive previews; GitHub’s file view displays source files. Examples use system fonts, so glyphs can vary by OS. Reading metadata stays in the current tab’s sessionStorage; an open source panel is not restored across navigation. The current report contract accepts `authored-specimen`; production reports need an explicit contract adaptation.

## Verify

```sh
python3 scripts/check-portability.py
node --test tests/*.test.mjs examples/agent-task/tests/*.test.mjs
```

The portability check resolves local runtime/document links and verifies isolated installation, byte-for-byte contents and overwrite rejection. Tests check value semantics, identity, reading state and palette contracts. See [VALIDATION.md](VALIDATION.md) for actual results and limits; these checks do not prove arbitrary-report quality or full accessibility.

## License and status

**Editorial Design Kit · 0.1.0 · MIT.** See [LICENSE](LICENSE) and [license notes](LICENSE.md). The installable skill also carries LICENSE. No proprietary fonts, remote videos or brand assets are bundled.

Source is distributed through GitHub; this is not an npm package. The repository name is `editorial-design-kit`; the Codex invocation remains `$editorial-design`. See [CHANGELOG.md](CHANGELOG.md).

A second fresh-project trial installed the GitHub skill and used an independent Codex session to generate Agent Studio. Its approval/cancellation lifecycle and actual browser interactions were checked; this is a local template demo, not a live Agent backend. Details: [Agent example](examples/agent-task/README.md) and [validation](VALIDATION.md).
