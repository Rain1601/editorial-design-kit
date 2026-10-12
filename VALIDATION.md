# Local standalone validation · 2026-10-12

- Copied the project to /tmp/editorial-kit-isolated and served only that directory on localhost:8880. No Uteki service, fonts, credentials or company data used by this package.
- check-portability.py: 70 local runtime references and 29 installed references resolve. Initially installed all 44 skill files in an isolated temporary destination; bytes identical. A second install was rejected and left existing files unchanged. No GitHub fetch attempted because this project is not uploaded.
- node --test tests/*.test.mjs: 34 passed. Covers palette roles/atomic apply, report identity/content/value semantics, source identity/return coordinates and independent reading sessions.
- Actual browser: four-chapter report renders in the standalone folder; table switch works; source opens exact rule-table, its original href is ./sources/PDF_LAYOUT_RULES.md, and appearance switching keeps the dialog open and selected source unchanged. Return restores the citation. Report library lists 3 reports.
- Actual starter: selected zero-valued record stays selected across Paper Night and reading-layout changes.
- Repaired two relocation defects: Header links now resolve ../index.html to absolute same-origin URLs; source originals live in examples/sources and use ./sources/... to respect existing safe-link contracts. Did not loosen component validators.
- Skill Creator quick_validate.py was attempted but unavailable because this host Python lacks PyYAML. Frontmatter/name/metadata are inherited from the installed skill, with no metadata changes; automatic Codex discovery on a second machine has not been tested. Local file installation and dependency closure were tested.
- No full accessibility audit, arbitrary-report acceptance, cross-browser matrix, PDF export or live research backend tested.
- MIT selected by the owner; license text is included at repository and skill roots. No remote repository created or upload performed.

Illustrative preview: docs/preview.svg

## Pre-release documentation and license check

- Project name confirmed: Editorial Design Kit; repository slug editorial-design-kit; skill editorial-design.
- Owner selected MIT. Repository LICENSE, skill LICENSE and package.json SPDX identifier are consistent.
- English README.md and Chinese README.zh-CN.md cross-link, carry equivalent shell commands, example paths, scope and publication status. Internal Skill references remain primarily Chinese.
- Portability check expanded to Markdown links: 98 package-local links/dependencies, 33 installed references, 45 identical installed files including LICENSE. Repeat install rejects overwrite.
- Historical source-document links to absent prototype pages changed to labeled reference text; exact quoted source excerpts retained.
- Contract tests still 34/34. Example application code was unchanged from the standalone browser validation above.
- GitHub installation, second-machine Codex discovery and GitHub Pages hosting remain untested; no upload performed.

## GitHub publication

Owner-authorized publication and remote installation verification are in progress; exact results will be appended after execution. Historical local checks above remain recorded.
