---
description: 'Enhanced Discipline: expanded process (analysis, design, implementation), templates, and technical debt handling.'
applyTo: '**'
---

Enhanced Discipline — Process & Templates

1. Analysis

- State the problem in one sentence.
- Enumerate assumptions (max 2) and list them in the task description.
- Identify 3-5 edge cases to validate.

2. Design

- Write a tiny contract:
  - Inputs
  - Outputs
  - Error modes

- Sketch data shapes (1-2 examples)
- Choose one library for the job; avoid adding multiple competing dependencies.

3. Implementation

- Small commits: each commit should be a runnable increment and contain tests.
- Tests first when possible: add minimal unit tests before changing production code if feasible.

Templates

- Implementation Task Template (use in PR body):
  - Summary: 1–2 lines
  - Files changed
  - Design choices + tradeoffs
  - How to test (smoke + happy path)
  - Rollback plan

Technical Debt Handling

- Record decisions that trade speed for quality in `docs/decision-records/`.
- Create an auto-issue if you remove a test for expediency — link the PR and mark Severity: Medium.

Quality gates (pre-merge)

- Build: must pass (no TypeScript errors)
- Lint: zero new lint errors
- Tests: include a happy path unit test and one boundary test
- CI: minimal smoke end-to-end check (if touching auth or infra)

Read: `tasks/tasks-ROADMAP.md`, `ROADMAP.md`
