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

## PK07 — Reusable Agent components and closeout (2026-10-12)

Extracted four controlled renderers into the installable skill, plus a facade, scoped CSS and standalone starter. Business options and output generators remain explicit demo adapters. Input’s error simulation controls are hidden by default and enabled only by the demo. Confirmation events carry request identity; switching to a new request requires fresh selection and acknowledgement. Original text is rendered safely without HTML execution or language rewriting.

The independent delivery-review configuration uses three options and three artifacts with different IDs. Node contracts cover arbitrary counts, invalid selection, duplicate identity, terminal approval, fresh requests, retained controls, cancellation and stale callbacks. All 61 checks passed. The isolated install check passed: 173 local references, 50 installed references and 59 byte-identical installed files; overwrite rejected. No new model generation was performed for this extraction.

Targeted browser checks: delivery-review paused with zero artifacts; risk scope, acknowledgement and expanded execution log survived English + Paper Night. Approval produced three artifacts. Selecting the handoff artifact, opening structure and selecting the data table survived switching back to Chinese. Original text was identical and its heading viewport top remained exactly 91.609375px. The standalone packaged starter also loaded and rendered the default task. Prior native attachment/download checks were not repeated; no new real backend, full accessibility or cross-OS audit is claimed.

Skill Creator quick_validate.py could not run in the local bundled Python because PyYAML is absent. This is recorded separately from the passing repository portability / installation and Node checks.

Packaged default starter completed its original two-artifact approval flow in the browser; the draft retained the supplied task.

## M01 — Motion Lab foundation (2026-10-12)

Three independent presentation adapters now cover measured disclosure, a selection marker and non-modal presence. Caller state updates precede motion; cancellation resolves false and only the current animation applies final visibility. Each update rechecks reduced motion. Four focused Node checks cover rapid reversal, stale completion, natural-height settling, immediate reduced-motion state, measured unequal-width targets, cleanup and invalid inputs. Repository portability passed with 191 local references, 59 installed references and 64 byte-identical installed files before the README links were added.

Targeted browser observations: double-click disclosure returned to hidden with aria-expanded=false; subsequent expansion remained open through English / Paper Night. Selected method and source-return record survived these switches. Marker and the selected English button both measured 46.703125px wide. Escape returned focus to the original record. The explicit reduced-motion control closed evidence immediately and detail close returned focus to the state record with hidden=true. The browser DOM inspection facade did not expose getAnimations(), so no frame-count claim is made. This is bounded behavior verification, not a full accessibility or timing audit.

## M02 — Motion in report and Agent pages (2026-10-12)

Report explanations and per-figure markers now share motion adapters. Agent execution, approval and artifacts opt in with motion:true; the portable example and installed starter do so. The details adapter saves logical expansion immediately, even while native open stays true during closing; restoration skips animation. Focus inside closing content returns to summary. Five additional lifecycle checks cover interrupted requests, restoration, focus and teardown. Teardown verification exposed displaced leading whitespace nodes; the shared helper now restores original child order.

Targeted local browser checks: report disclosure and independent data/chart modes survived English; comparison heading top changed from 96.859375px to 96.8515625px. Source search for 表格 and open panel survived palette change; return restored focus to rule-table citation. Agent review retained risk scope, acknowledgement and execution disclosure through English/Paper Night; approval produced three specimens. Handoff selection, open structure and data mode survived switching back to Chinese; original preview text was identical and its heading stayed at 79.609375px. Agent is still a local template simulation, without external execution or attachment analysis. These are bounded lifecycle/state checks, not a frame-timing, full accessibility or cross-OS audit.

Final M02 checks passed: all 70 Node checks; 205 local dependency references, 65 installed references and 64 byte-identical isolated-install files; existing installation overwrite rejected. Report close followed by language change stayed closed and retained independent figure modes. No Agent console errors appeared in the targeted local flow.

## M03 — Dashboard reorder and module expansion (2026-10-12)

Added the independent dashboard-board adapter and a complete portable synthetic research Dashboard. Modules have heterogeneous spans and original DOM content; pointer and keyboard reorder commit only after drop/Enter, with cancellation restoring the pre-drag snapshot. Full-width expansion uses the same node and a bottom module navigation rail. Closing restores the initial module anchor and focus, including when translation changed content height; a configurable scrollOffset accounts for fixed headers. Motion respects the system reduced-motion preference at each layout update.

Eight focused Node checks cover detached saved state, invalid IDs and targets, validation before DOM writes, keyboard preview/commit/cancel, original content identity, expansion switching, focus/scroll return and height-change anchor restoration. All 78 repository/example checks passed. Portable installation verified 222 local references, 77 installed references and 70 byte-identical files; existing-install overwrite refused.

Targeted local browser observations: queue moved before activity using keyboard; a native pointer drag moved it back and left no floating card or placeholder. Escape cancelled a subsequent keyboard preview. Activity data mode and a Chinese note survived reorder, expansion, English and Paper Night. Expanded note viewport top changed from 184.171875px to 184.0546875px after translation. Bottom navigation selected activity with its data mode retained. In the final implementation, closing notes with Escape after translation/theme change restored the original notes trigger, all six modules and the unchanged input. No console errors appeared. These are bounded desktop checks; touch-device, cross-browser, full accessibility and frame-timing audits were not performed. The demo has no live data or Agent execution, no cross-board drag, free resizing or viewport-edge auto-scroll.

Final native keyboard verification exposed a browser mechanism: moving a focused card with insertBefore dropped focus to BODY. Locator-based key calls had refocused the handle and masked this. The shared reorder operation now restores handle focus with preventScroll after DOM movement; validation uses native successive keys without locator refocusing. This applies to every module, without sample-specific repair.

After the focus repair, all 79 checks passed (9 Dashboard checks). Native Space → Left → Right → Left → Return committed queue before activity, retained focus on the queue handle and ended grab state. This replays the original focus-loss trigger with no intermediate locator refocusing.

## M04 — Single-page continuous reading (2026-10-12)

User preference superseded the initial pagination direction: all four chapters remain readable on one page, with natural content heights. Seven adapter checks cover identity validation, native scroll state, focus boundaries, interruption, silent restoration, reduced motion and teardown. All 73 current Node checks passed.

Targeted local browser checks: all sections had hidden=false and inert=false; their English heights were about 447, 786, 487 and 522px, with no viewport-height floor. English/Paper Night preserved the connection chapter anchor (fraction 0.0000448 before, 0.0000398 after), logical open annotation and a Chinese note. Native downward scroll moved the host from 447 to 807px, advanced the curved illustration and kept focus on the appearance button. This is bounded desktop/state verification, not a full accessibility, mobile or word-level translation-anchor audit.

Chapter-middle verification: returning to Chinese restored fraction 0.4582235 to 0.4584842 (within pixel rounding), retaining the annotation and note. Portability passed: 239 local references, 90 installed references, 76 identical isolated-install files; existing installation overwrite rejected.
