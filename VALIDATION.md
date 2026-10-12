# Validation · 2026-10-12

## Initial local checks (historical, before publication)

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

Published publicly at https://github.com/Rain1601/editorial-design-kit under MIT. GitHub recognizes MIT. Both READMEs use the real installation URL. Search topics: codex, agent-skills, design-system, editorial-design, research-reports, ui-components; these describe the project, not a search ranking guarantee.

### Real remote installation

Official Codex Skill Installer successfully downloaded https://github.com/Rain1601/editorial-design-kit/tree/main/skills/editorial-design into an isolated temporary project's .agents/skills directory. Tested main revision: 998cad12f70730e52f3ad91c7713e7936b3a64e7. All 45 installed files match the published commit byte for byte, including LICENSE. The user's existing installation was not replaced. Later documentation-only updates do not change the tested skill files.

### Real Codex use

A fresh ephemeral Codex CLI session in the isolated workspace read the installed SKILL.md and references and generated a bilingual reading queue: three fictional readings, selectable list/detail, Paper / Paper Night. It reused ItemList and applyPalette, preserved LICENSE, and completed JavaScript syntax plus three controller/dependency/license tests. No original repository or network runtime dependency was needed for its page.

Parent browser verification: selected “A library for rain”, changed Paper Night, and confirmed the same detail title; switched to Chinese and confirmed “雨的图书馆” remained selected. The generated page is a local verification artifact, not a GitHub-hosted demo or a live backend. Raw session logs are not included in this repository.

### GitHub checks

Initial main revision passed GitHub Actions portability and 34 contract tests. Final remote parity is checked after uploading this record. These checks do not establish arbitrary-content quality, full accessibility, cross-OS font parity or production research.

## PK04 — Online examples and inline appearance controls (2026-10-12)

Pages workflow checks the portable package and Node contracts before staging an explicit static allowlist (`index.html`, `examples`, `skills`, `docs`, README and LICENSE). Git metadata, local execution logs and private workspace files are excluded. The workflow uses GitHub Pages deployment with HTTPS and a project-relative asset tree.

Paper / Paper Night and the other report palettes are directly visible as controlled buttons. The reusable mountChoiceSwitch leaves business state to its caller. The fictional bilingual reading queue is included as an additional authored example; selecting a reading and changing appearance keeps its identity. Report appearance changes retain the mounted reader and source panel. Local portability verification passed with 111 references and 47 identical installed files; the existing 34 Node checks passed. Browser checks and the final deployment result are recorded after publication.

Deployment evidence: GitHub Actions run [38201934260](https://github.com/Rain1601/editorial-design-kit/actions/runs/38201934260) completed successfully for implementation revision `c4ef3a52e27f4903c92e65accc217883cfa9506a`. The [live index](https://rain1601.github.io/editorial-design-kit/) and report/library/reading-queue pages loaded in the browser. Report buttons selected both Paper (rgb 247,245,239) and Paper Night (rgb 48,46,42). The report library retained all three reports on switching. The fictional queue retained the selected second reading across appearance and language changes. A targeted local report check preserved the chapter hash and scrollTop 1310; a source-panel check retained its dialog ID, search “表格” and scrollTop 2241 across appearance change, and returned focus to citation `rule-table` on close. This is bounded interaction verification, not a full accessibility audit.

## PK05 — Inline bilingual controls and copy-to-Codex onboarding (2026-10-12)

The three bilingual examples now use the same controlled choice-switch with fixed 中文 / English labels. Report remounting restores the stable chapter ID and chapter-relative offset, figure modes and disclosures; library translation restores expanded report IDs alongside existing filters and sort order. Reading queue translation retains the selected reading and appearance. Source excerpt text is not translated. The palette/layout starter remains a Chinese configuration specimen.

Targeted local browser results: report `evidence-to-judgment` kept hash `#evidence-comparison`, an expanded disclosure and independent figure modes `[data, chart]`; chapter viewport offset changed only from -139.859375 to -139.8515625 px after switching zh → en. Library retained `unread`, `date-desc` and expanded `evidence-to-judgment`. The fictional queue retained `rain-library` and Paper Night while switching to Chinese. Portability and all 34 existing Node contract checks passed. These checks do not imply all reports or full accessibility have been audited.

English and Chinese README now include a complete prompt to copy into Codex: install via the official Skill Installer, reuse existing installations without overwriting local changes, apply the skill to a user-specified page, and restart Codex if a new installation is not yet detected. The prompt documents a supported workflow; this revision did not run another model generation task.

## PK06 — Fresh-project Agent forward test (2026-10-12)

Official Skill Installer downloaded the public GitHub skill into a new, empty project. All 47 installed files matched published revision `cc8938bcc471dd6630c5f7d689991b05cb6faadc`; SKILL.md SHA-256 `c79c562c1aeea18bf9e5f6f113693716f02635203c091c4f9fc5257e21e7c28b`. This was a two-stage execution of the README workflow: the main session performed the official installation, then an independent Codex CLI session used the already-installed branch of the prompt. The task specified a complete bilingual Agent task demo, Paper themes, input/files, approval, cancellation and artifacts. This proves that bounded workflow; it does not claim one message was tested from installation through generation in the same session.

The independent session read the installed SKILL and composition/component/palette references, copied five runtime resources, and generated a self-contained Vanilla project, TaskEngine and 12 Node checks. It could not complete its browser probe in the sandbox. The main session then fixed the header in place and adjusted reading-anchor selection to the visible header boundary, and performed targeted real browser checks. These review changes are not presented as untouched one-shot generation. A separate read-only audit found no blocking engine or rendering defects and independently exercised stale-callback invalidation.

Observed browser results: blank input rejected; synthetic attachment metadata displayed (66 bytes, text/plain), no body loading or upload code; run paused with no artifacts and disabled approval until scope AND acknowledgement. During review, switching to English and Paper Night retained the task, attachment, expanded scope, acknowledgement and open execution log. Approval produced two authored specimens containing the entered task. Selected checklist, open structure section, data table mode and original text survived language change. Downloaded review-checklist.md was 535 bytes and contained the entered task. Sticky-header language switching preserved execution-section viewport top exactly at 119.984375px. Rejection enabled editing with no output; cancellation kept input with no output; simulated failure produced no output and recovered after disabling the option and obtaining fresh approval.

Published example has only runtime assets, MIT, source, usage notes and Node checks. Hidden installation directories, raw model logs, browser probe scripts/profiles and downloaded artifacts are excluded. The portable test compares copied assets to the published skill rather than the discarded private installation directory. The UI uses local timers and original templates; no real Agent/backend, factual research or attachment analysis occurred.
