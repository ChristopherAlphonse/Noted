## Relevant Files

- `docker-compose.dev.yml` - Local development docker-compose (Mongo, Redis, MinIO, server, client, maildev)
- `apps/server/Dockerfile.dev` - Development Dockerfile for the server (hot-reload)
- `apps/client/Dockerfile.dev` - Development Dockerfile for the client (Vite dev server)
- `.dockerignore` - Files to exclude from Docker builds
- `scripts/docker-dev.ps1` - PowerShell helpers for starting/stopping the dev compose stack
- `apps/server/src/config/storage.ts` - MinIO / storage configuration constants
- `apps/server/src/services/storageService.ts` - MinIO adapter: upload, delete, presigned URL, image processing
- `apps/server/src/config/logger.ts` - Structured logger configuration (production/development outputs)
- `apps/server/src/middleware/requestLogger.ts` - Express middleware for request IDs and timing
- `apps/server/src/config/swagger.ts` - Swagger/OpenAPI config and spec generation
- `apps/server/src/routes/v1/` - API route files scoped under `/api/v1/`
- `packages/api-client/` - Monorepo package for the shared, typed API client (axios wrapper + generated types)
- `packages/types/` - Centralized type & zod schema definitions shared between server and client
- `apps/server/src/middleware/validationMiddleware.ts` - Request validation using Zod
- `apps/server/src/utils/errors.ts` - Standardized API error shapes and helpers
- `apps/server/__tests__/` - Server unit/integration tests (e.g., auth, file uploads)
- `apps/client/__tests__/` - Client component/unit tests (Vitest)
- `.github/workflows/ci.yml` - CI workflow: lint, build, tests, generate OpenAPI (on PRs)
- `DEV_README.md` - Developer setup steps, branch naming, PR checklist, docker:dev commands

- `pnpm-workspace.yaml` - pnpm workspace configuration to manage packages across the monorepo
- `turbo.json` - Turborepo configuration for task running and caching
- `packages/*` - Reusable packages (`@noted/types`, `@noted/api-client`, `@noted/config`, `@noted/email-templates`, etc.) to be split out from apps
- `apps/server/.env.example` - Example env file for the server (secrets, DB, MinIO, Redis)
- `apps/client/.env.example` - Example env file for the client (VITE_ variables)
- `packages/logger/` - Optional shared logger package wrapper or configuration if you want to centralize logging behavior


### Notes

- Unit tests should be placed alongside code (`MyComponent.tsx` + `MyComponent.test.tsx`) or under the matching `__tests__` folders for server routes.
- Use `npx jest [optional/path/to/test/file]` or `npx vitest` depending on the target (server vs client). Running without a path executes the full test suite per project config.
- Generated OpenAPI JSON (`/api-docs.json`) should be used by `openapi-typescript` to generate the client types into `packages/api-client/src/generated.ts` during CI or local dev.

## Process Rules (mandatory for all tasks)

These rules apply to every task in this roadmap and must be followed without exception:

- Branching & PRs
  - Create a new branch for every task using the naming convention:
    - `feature/upgrade/<task-number>-<short-desc>`
    - Example: `feature/upgrade/1.1-docker-compose`
  - Push the branch to GitHub and open a PR referencing the task number.
  - Each task MUST have its own PR branch and PR.

- Sequential gating
  - Tasks must be executed sequentially. Do not start task N+1 until task N's PR is merged to the default branch and verified.
  - A task is considered merged only after:
    - CI (lint/build/tests) passes on the PR
    - Required functional smoke tests pass (see Acceptance Criteria below)
    - An approver (repo owner or assigned reviewer) merges the PR

- Testing
  - Every task that changes code must include automated tests (unit or integration) that cover affected behavior.
  - Add or update test files under the relevant project `__tests__` folders.
  - CI must run the tests and enforce minimum coverage per task (configured in CI).

- PR checklist (must be completed in each PR description)
  - Link to task number and this roadmap entry.
  - List of files changed and a short summary.
  - Tests added/updated and how to run them locally.
  - Manual smoke test steps and expected outcomes.
  - Confirmation that no anti-patterns were introduced.

- Anti-patterns policy
  - Never introduce or keep anti-patterns. Examples (non-exhaustive):
    - Committing secrets or hard-coded credentials.
    - Using global mutable state where avoidable.
    - Adding undocumented, non-typed, or unsafe code (any TS `// @ts-ignore` or `any` without justification).
    - Blocking the event loop (sync heavy IO) in server code.
    - Introducing long-lived feature flags without lifecycle plan.
  - Every PR must include a brief "Anti-patterns check" section stating what checks were performed.

- Rollback & Safety
  - If a task introduces a risky change (storage, auth, DB schema), implement feature-flagged behavior and a rollback plan in the PR description.
  - Keep previous providers/adapters available until migration is validated (e.g., Cloudinary adapter should remain until MinIO validated).

- Env files
  - Add or update `.env.example` for any env variables introduced.
  - Do not commit real secrets or `.env` files containing secrets.

## Tasks (updated with process requirements & dependencies)

### PHASE 1: Workspace & Infrastructure Setup (start first, some tasks can run in parallel)

- [ ] 1.0 Developer Experience & Local Dev Environment
  - [ ] 1.1 Create `docker-compose.dev.yml`, `.dockerignore`, and development Dockerfiles for server and client
    - Branch: `feature/upgrade/1.1-docker-compose-setup`
    - Depends on: None (start immediately)
    - Tests: smoke test that dev stack starts and server/client respond on expected ports; include simple integration test hitting `/health`
    - Acceptance Criteria: `pnpm docker:dev` starts services; server responds; health endpoint OK
    - Anti-patterns check: no secrets in committed files; volume mounts documented
  - [ ] 1.2 Add `scripts/docker-dev.ps1` and `package.json` scripts (`pnpm docker:dev`, `pnpm docker:stop`, `pnpm docker:clean`)
    - Branch: `feature/upgrade/1.2-docker-dev-scripts`
    - Depends on: 1.1 merged
    - Tests: manual script run documented + CI job that validates `docker-compose` file syntax (yaml lint)
  - [ ] 1.3 Add `DEV_README.md` documenting start-up, secrets, and PR checklists
    - Branch: `feature/upgrade/1.3-dev-documentation`
    - Depends on: None (can run parallel with 1.1–1.2)
    - Acceptance Criteria: README contains branch rules, pnpm install steps, docker commands, and env guidance
  - [ ] 1.4 Add `pnpm-workspace.yaml` and ensure `package.json` root uses pnpm scripts; document `pnpm` usage in `DEV_README.md`
    - Branch: `feature/upgrade/1.4-pnpm-workspace-config`
    - Depends on: None (start immediately, foundational)
    - Tests: CI installs with `pnpm install --frozen-lockfile` successfully
  - [ ] 1.5 Add `turbo.json` (Turborepo) configuration and update scripts to use turbo pipelines for builds/tests
    - Branch: `feature/upgrade/1.5-turborepo-config`
    - Depends on: 1.4 merged
    - Tests: local `pnpm turbo run build` runs; CI pipeline integrates turbo cache
  - [ ] 1.6 Split reusable/shared code into `packages/` (e.g., `@noted/types`, `@noted/config`, `@noted/email-templates`, `@noted/api-client`, `@noted/logger`) and wire them into the workspace
    - Branch: `feature/upgrade/1.6-split-shared-packages`
    - Depends on: 1.4 merged, 1.5 preferred (for turbo integration)
    - Tests: workspace build succeeds; imports resolve; unit tests for packages added

### PHASE 2: Storage & Environment (start after Phase 1 complete)

- [ ] 2.0 MinIO Object Storage Integration
  - [ ] 2.1 Add MinIO service to compose and create bucket-init script
    - Branch: `feature/upgrade/2.1-minio-docker-service`
    - Depends on: 1.1 merged
    - Tests: MinIO service available in dev stack; init script creates buckets
  - [ ] 2.2 Implement `storageService.ts` with upload/delete/presign and image optimization
    - Branch: `feature/upgrade/2.2-minio-storage-service`
    - Depends on: 2.1 merged
    - Tests: unit tests for service methods; integration test that uploads/downloads a sample file to MinIO
    - Acceptance Criteria: endpoint/files accessible via presigned URLs
  - [ ] 2.3 Add environment configuration and feature-flag for switching storage providers
    - Branch: `feature/upgrade/2.3-storage-provider-flag`
    - Depends on: 2.2 merged
    - Tests: switching provider via env variable works; Cloudinary adapter remains until validated
  - [ ] 2.4 Add `apps/server/.env.example` and `apps/client/.env.example` with all required variables
    - Branch: `feature/upgrade/2.4-env-files-examples`
    - Depends on: 2.1 merged (can run parallel with 2.2–2.3)
    - Anti-patterns check: no secrets committed

### PHASE 3: Logging & Observability (start after Phase 2 complete)

- [ ] 3.0 Structured Logging & Observability
  - [ ] 3.1 Install and configure structured logger (`@calphonse/logger`) in `apps/server/src/config/logger.ts`
    - Branch: `feature/upgrade/3.1-calphonse-logger-config`
    - Depends on: 1.1 merged (server running in docker)
    - Tests: logger unit tests and sample logging middleware integration test (request-id present)
    - Acceptance Criteria: logs show request-id; config supports pretty/dev and JSON/prod outputs
  - [ ] 3.2 Add request-id middleware and replace key `console.log` usages in auth/storage flows
    - Branch: `feature/upgrade/3.2-request-id-middleware`
    - Depends on: 3.1 merged
    - Tests: verify middleware attaches request-id header and logs include it
  - [ ] 3.3 Integrate Sentry/APM (conditional on env) and enable log rotation
    - Branch: `feature/upgrade/3.3-sentry-apm-integration`
    - Depends on: 3.2 merged
    - Tests: Sentry init conditional; do not ship DSN in repo
  - [ ] 3.4 (Optional) Create `packages/logger` wrapper package for standardized logger creation
    - Branch: `feature/upgrade/3.4-packages-logger-wrapper`
    - Depends on: 1.6 merged, 3.1 merged
    - (Lower priority—can defer or run in parallel with 3.3)

### PHASE 4: API Documentation & Type-Safe Client (start after Phase 3 complete)

- [ ] 4.0 API Documentation and Type-Safe Client
  - [ ] 4.1 Add Swagger/OpenAPI generation and mount UI at `/api-docs` endpoint
    - Branch: `feature/upgrade/4.1-swagger-openapi-setup`
    - Depends on: 3.3 merged (stable server setup)
    - Tests: `/api-docs.json` generation in CI; UI serves locally at `http://localhost:5000/api-docs`
  - [ ] 4.2 Add `packages/api-client` and generator script (`pnpm generate:api-client`) using `openapi-typescript`
    - Branch: `feature/upgrade/4.2-packages-api-client`
    - Depends on: 4.1 merged, 1.6 merged (workspace established)
    - Tests: generated client compiles; frontend uses generated types in a small test
  - [ ] 4.3 Document all core endpoints (auth, users, file upload, contact) with OpenAPI JSDoc or decorators
    - Branch: `feature/upgrade/4.3-endpoint-documentation`
    - Depends on: 4.1 merged
    - Tests: all endpoints appear in `/api-docs.json`
  - [ ] 4.4 Ensure `packages/api-client` is added to `pnpm-workspace.yaml` and documented in `DEV_README.md`
    - Branch: `feature/upgrade/4.4-api-client-workspace-wiring`
    - Depends on: 4.2 merged

### PHASE 5: Validation, Error Handling & API Versioning (start after Phase 4 complete)

- [ ] 5.0 Runtime Validation, Error Handling & Versioning
  - [ ] 5.1 Add `zod` schemas in `packages/types` and apply validation middleware to routes
    - Branch: `feature/upgrade/5.1-zod-validation-schemas`
    - Depends on: 1.6 merged
    - Tests: validation unit tests; invalid inputs return standardized 400 error
  - [ ] 5.2 Implement standardized error shapes (`IApiError`) and error codes in `apps/server/src/utils/errors.ts`
    - Branch: `feature/upgrade/5.2-standardized-error-handling`
    - Depends on: 5.1 merged
    - Tests: error middleware unit tests; all errors use IApiError format
  - [ ] 5.3 Move all routes under `/api/v1/` and add versioning middleware for future v2 compatibility
    - Branch: `feature/upgrade/5.3-api-v1-versioning`
    - Depends on: 5.2 merged, 4.1 merged (Swagger ready)
    - Acceptance Criteria: existing clients continue to work under `/api/v1` paths; `/api-docs` reflects v1

### PHASE 6: Testing & CI Infrastructure (start after Phase 5 complete)

- [ ] 6.0 Testing, CI and Quality Gates
  - [ ] 6.1 Add Vitest/Jest configs and initial test suites for critical flows (auth, refresh, uploads, error handling)
    - Branch: `feature/upgrade/6.1-vitest-jest-setup`
    - Depends on: 5.3 merged (routes stable)
    - Tests: CI runs test suites and fails on regression
  - [ ] 6.2 Add GitHub Actions CI workflow that runs lint, build, tests, and OpenAPI generation on PRs
    - Branch: `feature/upgrade/6.2-github-actions-ci`
    - Depends on: 6.1 merged, 4.1 merged (Swagger ready)
    - Acceptance Criteria: PRs must pass CI before merge; all required jobs present
  - [ ] 6.3 Add coverage reporting and enforce minimum thresholds (70%+) for PR merges
    - Branch: `feature/upgrade/6.3-coverage-reporting`
    - Depends on: 6.2 merged
  - [ ] 6.4 Configure Turborepo caching in CI to speed up builds/tests across workspace
    - Branch: `feature/upgrade/6.4-turborepo-ci-cache`
    - Depends on: 6.2 merged, 1.5 merged (turbo configured)
  - [ ] 6.5 Add workspace-level `pnpm-lock.yaml` handling guidance and CI commands for `pnpm install --frozen-lockfile`
    - Branch: `feature/upgrade/6.5-pnpm-lockfile-ci`
    - Depends on: 6.4 merged

### PHASE 7: Google Auth (start after Phase 6 complete; 7.1 can start early for setup)

- [ ] 7.0 Google Auth Integration
  - [ ] 7.1 Create Google OAuth2 credentials in Google Cloud Console and document redirect URIs
    - Branch: `feature/upgrade/7.1-google-oauth-credentials`
    - Depends on: None (pure documentation; can start in parallel for setup)
    - Security: DO NOT commit client secret; add to secret manager only
  - [ ] 7.2 Implement server-side OAuth flow routes and `apps/server/src/services/oauth/googleService.ts`
    - Branch: `feature/upgrade/7.2-google-oauth-server-flow`
    - Depends on: 6.5 merged, 5.3 merged (versioning in place)
    - Tests: mock Google token/userinfo responses in CI integration tests
    - Acceptance Criteria: login via Google links to/creates user and issues tokens consistent with existing auth flows
  - [ ] 7.3 Add frontend "Sign in with Google" button and OAuth redirect flow in client
    - Branch: `feature/upgrade/7.3-google-frontend-integration`
    - Depends on: 7.2 merged, 4.2 merged (api-client ready)
    - Tests: E2E test that follows redirect flow (mock endpoints in CI)
  - [ ] 7.4 Add OpenAPI documentation and update Swagger spec for new Google Auth endpoints
    - Branch: `feature/upgrade/7.4-google-auth-documentation`
    - Depends on: 7.3 merged

...existing code...
