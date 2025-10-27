---
description: 'Specification-Driven Workflow v1 provides a structured approach to software development, ensuring that requirements are clearly defined, designs are meticulously planned, and implementations are thoroughly documented and validated.'
applyTo: '**'
---


Purpose: provide a compact entry-point to the project's specification-driven workflow and coding disciplines. The full guidance has been split into three focused documents:

- `copilot-instructions-core.md` — Core Discipline: essential rules, minimal coding guidelines, and quick checks.
- `copilot-instructions-enhanced.md` — Enhanced Discipline: expanded process (analysis, design, implementation), templates, and technical debt handling.
- `copilot-instructions-full.md` — Full Spec Mode: exhaustive templates, QA, and EARS reference for full-spec work.

Where to start:
- For day-to-day development follow `copilot-instructions-core.md`.
- For project-level design & coordination read `copilot-instructions-enhanced.md`.
- For formal delivery, documentation, and handoff use `copilot-instructions-full.md`.

Maintainers: keep these files synchronized. Add small edits to the appropriate discipline file; keep this index short.

  - **Architecture:** High-level overview of components and interactions.
  - **Data Flow:** Diagrams and descriptions.
  - **Interfaces:** API contracts, schemas, public-facing function signatures.
  - **Data Models:** Data structures and database schemas.

- [ ] **Document error handling:**
  - Create an error matrix with procedures and expected responses.

- [ ] **Define unit testing strategy.**

- [ ] **Create implementation plan in `tasks.md`:**
  - For each task, include description, expected outcome, and dependencies.

**Critical Constraint:**

- **Do not proceed to implementation until design and plan are complete and validated.**

### **Phase 3: IMPLEMENT**

**Objective:**

- Write production-quality code according to the design and plan.

**Checklist:**

- [ ] Code in small, testable increments.
      - Document each increment with code changes, results, and test links.
- [ ] Implement from dependencies upward.
      - Document resolution order, justification, and verification.
- [ ] Follow conventions.
      - Document adherence and any deviations with a Decision Record.
- [ ] Add meaningful comments.
      - Focus on intent ("why"), not mechanics ("what").
- [ ] Create files as planned.
      - Document file creation log.
- [ ] Update task status in real time.

**Critical Constraint:**

- **Do not merge or deploy code until all implementation steps are documented and tested.**

### **Phase 4: VALIDATE**

**Objective:**

- Verify that implementation meets all requirements and quality standards.

**Checklist:**

- [ ] Execute automated tests.
      - Document outputs, logs, and coverage reports.
      - For failures, document root cause analysis and remediation.
- [ ] Perform manual verification if necessary.
      - Document procedures, checklists, and results.
- [ ] Test edge cases and errors.
      - Document results and evidence of correct error handling.
- [ ] Verify performance.
      - Document metrics and profile critical sections.
- [ ] Log execution traces.
      - Document path analysis and runtime behavior.

**Critical Constraint:**

- **Do not proceed until all validation steps are complete and all issues are resolved.**

### **Phase 5: REFLECT**

**Objective:**

- Improve codebase, update documentation, and analyze performance.

**Checklist:**

- [ ] Refactor for maintainability.
      - Document decisions, before/after comparisons, and impact.
- [ ] Update all project documentation.
      - Ensure all READMEs, diagrams, and comments are current.
- [ ] Identify potential improvements.
      - Document backlog with prioritization.
- [ ] Validate success criteria.
      - Document final verification matrix.
- [ ] Perform meta-analysis.
      - Reflect on efficiency, tool usage, and protocol adherence.
- [ ] Auto-create technical debt issues.
      - Document inventory and remediation plans.

**Critical Constraint:**

- **Do not close the phase until all documentation and improvement actions are logged.**

### **Phase 6: HANDOFF**

**Objective:**

- Package work for review and deployment, and transition to next task.

**Checklist:**

- [ ] Generate executive summary.
      - Use **Compressed Decision Record** format.
- [ ] Prepare pull request (if applicable):
    1. Executive summary.
    2. Changelog from **Streamlined Action Log**.
    3. Links to validation artifacts and Decision Records.
    4. Links to final `requirements.md`, `design.md`, and `tasks.md`.
- [ ] Finalize workspace.
      - Archive intermediate files, logs, and temporary artifacts to `.agent_work/`.
- [ ] Continue to next task.
      - Document transition or completion.

**Critical Constraint:**

- **Do not consider the task complete until all handoff steps are finished and documented.**

## Troubleshooting & Retry Protocol

**If you encounter errors, ambiguities, or blockers:**

**Checklist:**

1. **Re-analyze**:
   - Revisit the ANALYZE phase.
   - Confirm all requirements and constraints are clear and complete.
2. **Re-design**:
   - Revisit the DESIGN phase.
   - Update technical design, plans, or dependencies as needed.
3. **Re-plan**:
   - Adjust the implementation plan in `tasks.md` to address new findings.
4. **Retry execution**:
   - Re-execute failed steps with corrected parameters or logic.
5. **Escalate**:
   - If the issue persists after retries, follow the escalation protocol.

**Critical Constraint:**

- **Never proceed with unresolved errors or ambiguities. Always document troubleshooting steps and outcomes.**

## Technical Debt Management (Automated)

### Identification & Documentation

- **Code Quality**: Continuously assess code quality during implementation using static analysis.
- **Shortcuts**: Explicitly record all speed-over-quality decisions with their consequences in a Decision Record.
- **Workspace**: Monitor for organizational drift and naming inconsistencies.
- **Documentation**: Track incomplete, outdated, or missing documentation.

### Auto-Issue Creation Template

```text
**Title**: [Technical Debt] - [Brief Description]
**Priority**: [High/Medium/Low based on business impact and remediation cost]
**Location**: [File paths and line numbers]
**Reason**: [Why the debt was incurred, linking to a Decision Record if available]
**Impact**: [Current and future consequences (e.g., slows development, increases bug risk)]
**Remediation**: [Specific, actionable resolution steps]
**Effort**: [Estimate for resolution (e.g., T-shirt size: S, M, L)]
```

### Remediation (Auto-Prioritized)

- Risk-based prioritization with dependency analysis.
- Effort estimation to aid in future planning.
- Propose migration strategies for large refactoring efforts.

## Quality Assurance (Automated)

### Continuous Monitoring

- **Static Analysis**: Linting for code style, quality, security vulnerabilities, and architectural rule adherence.
- **Dynamic Analysis**: Monitor runtime behavior and performance in a staging environment.
- **Documentation**: Automated checks for documentation completeness and accuracy (e.g., linking, format).

### Quality Metrics (Auto-Tracked)

- Code coverage percentage and gap analysis.
- Cyclomatic complexity score per function/method.
- Maintainability index assessment.
- Technical debt ratio (e.g., estimated remediation time vs. development time).
- Documentation coverage percentage (e.g., public methods with comments).

## EARS Notation Reference

**EARS (Easy Approach to Requirements Syntax)** - Standard format for requirements:

- **Ubiquitous**: `THE SYSTEM SHALL [expected behavior]`
- **Event-driven**: `WHEN [trigger event] THE SYSTEM SHALL [expected behavior]`
- **State-driven**: `WHILE [in specific state] THE SYSTEM SHALL [expected behavior]`
- **Unwanted behavior**: `IF [unwanted condition] THEN THE SYSTEM SHALL [required response]`
- **Optional**: `WHERE [feature is included] THE SYSTEM SHALL [expected behavior]`
- **Complex**: Combinations of the above patterns for sophisticated requirements

Each requirement must be:

- **Testable**: Can be verified through automated or manual testing
- **Unambiguous**: Single interpretation possible
- **Necessary**: Contributes to the system's purpose
- **Feasible**: Can be implemented within constraints
- **Traceable**: Linked to user needs and design elements
