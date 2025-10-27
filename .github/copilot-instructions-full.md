---
description: 'Full Spec Mode: exhaustive templates, QA, and EARS reference for full-spec work.'
applyTo: '**'
---

Full Spec Mode — Exhaustive Delivery Checklist

When working in Full Spec Mode, follow these sections strictly. This mode is for large, high-risk changes (auth, infra, migrations).

1. Requirements (EARS-style)

- THE SYSTEM SHALL ... (single sentence requirements)
- WHEN [trigger] THE SYSTEM SHALL ...
- IF [unwanted condition] THEN THE SYSTEM SHALL ...

2. Design Document

- Architecture diagram (1 page) with components and data flow
- Sequence diagrams for critical flows (login, file upload, recovery)
- Data model changes and migration strategy

3. Implementation Plan

- Break the work into small PRs (3–7 PRs) with clear gating and rollback steps.
- Each PR: one logical change, tests, and smoke instructions.

4. Validation Plan

- Automated tests: unit + integration + e2e as required
- Load smoke: basic throughput test for new infra
- Security review: dependency check, secrets audit, threat model notes

5. Handoff

- Executive summary (1 paragraph)
- List of follow-ups
- Monitoring plan: SLOs, alert rules, runbooks

EARS Reference

- See `copilot-instructions-full.md` sections above for examples.

Decision Records

- Must be added to `docs/decision-records/` for changes made in this mode.

Read: `ROADMAP.md`, `tasks/tasks-ROADMAP.md`
