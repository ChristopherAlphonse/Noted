# Noted Application Roadmap

##  Completed (v2.0)

### Architecture & Infrastructure

- [] Monorepo architecture with Turborepo
- [] Migration from Yarn to pnpm
- [] Full TypeScript backend with strict types
- [] Shared packages (`@noted/types`, `@noted/email-templates`, `@noted/config`)

### Security

- [] JWT refresh token implementation
- [] HttpOnly cookies for token storage
- [] Rate limiting on auth endpoints
- [] Helmet security headers
- [] Password strength validation (8+ chars with complexity)
- [] Extended password reset token expiry (30 minutes)
- [] CORS with credentials properly configured
- [] Environment variable validation

### Features

- [] React Email integration for templated emails
- [] Automatic token refresh with axios interceptor
- [] Token rotation on refresh
- [] Welcome emails on registration
- [] Branded password reset emails

### Package Updates

- [] All dependencies updated to latest stable versions
- [] Tauri updated to 2.x
- [] React Router v7
- [] Redux Toolkit v2.5
- [] Mongoose v8

---

## Planned (v2.1) - Infrastructure & DevOps

### Docker & Container Strategy

**Priority:** HIGH
**Status:** Planned

#### Local Development with Docker

- [ ] Create `docker-compose.yml` for local development environment
- [ ] Multi-service setup:
  - MongoDB container
  - Redis container (for caching/sessions)
  - MinIO container (object storage)
  - Server container (hot-reload enabled)
  - Client container (Vite dev server)
- [ ] Volume mounting for hot-reload development
- [ ] Network configuration for service communication
- [ ] Environment variable management via `.env` files
- [ ] Health checks for all services
- [ ] Scripts: `pnpm docker:dev`, `pnpm docker:stop`, `pnpm docker:clean`

**Benefits:**

- Consistent development environment across team
- Easy onboarding for new developers
- Production-like environment locally
- No need to install MongoDB, Redis, MinIO locally

**Files to Create:**

```
docker-compose.yml
docker-compose.dev.yml
apps/server/Dockerfile.dev
apps/client/Dockerfile.dev
.dockerignore
scripts/docker-dev.sh
```

#### MinIO Object Storage Integration

**Priority:** HIGH
**Status:** Planned

Replace Cloudinary with self-hosted MinIO for file storage:

- [ ] Set up MinIO in Docker container
- [ ] Create MinIO service configuration
- [ ] Install MinIO SDK: `@minio/minio-js`
- [ ] Create file upload service: `apps/server/src/services/storageService.ts`
- [ ] Implement file upload endpoints
- [ ] Add file deletion/management
- [ ] Create presigned URL generation for private files
- [ ] Set up bucket policies and access control
- [ ] Add file size and type validation
- [ ] Implement image optimization (sharp integration)
- [ ] Update file upload UI components

**Configuration:**

```typescript
// apps/server/src/config/storage.ts
export const storageConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
};
```

**Buckets:**

- `noted-avatars` - User profile pictures
- `noted-attachments` - Note attachments
- `noted-public` - Public assets

**Benefits:**

- No third-party dependency (Cloudinary)
- Better cost control
- Full data ownership
- Faster local development
- S3-compatible API

#### Structured Logging with @calphonse/logger

**Priority:** MEDIUM
**Status:** Planned

Replace console.log with structured logging:

- [ ] Install `@calphonse/logger`
- [ ] Create logging configuration: `apps/server/src/config/logger.ts`
- [ ] Replace all `console.log` with logger
- [ ] Set up log levels (debug, info, warn, error)
- [ ] Add request ID tracking
- [ ] Implement log rotation
- [ ] Add performance monitoring logs
- [ ] Create log aggregation strategy
- [ ] Set up log viewers (development)
- [ ] Configure different outputs per environment

**Implementation:**

```typescript
// apps/server/src/config/logger.ts
import { createLogger } from '@calphonse/logger';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  outputs: [
    { type: 'console' },
    { type: 'file', path: 'logs/app.log' },
    { type: 'file', path: 'logs/error.log', level: 'error' },
  ],
});
```

**Usage Examples:**

```typescript
logger.info('User logged in', { userId: user._id, ip: req.ip });
logger.error('Database connection failed', { error: err.message });
logger.debug('Token refresh initiated', { userId });
```

**Benefits:**

- Structured, searchable logs
- Better debugging in production
- Performance monitoring
- Security audit trails
- Integration with log management tools

#### API Documentation with OpenAPI/Swagger

**Priority:** MEDIUM
**Status:** Planned

Implement comprehensive API documentation with OpenAPI specification:

- [ ] Install Swagger tools: `swagger-jsdoc`, `swagger-ui-express`
- [ ] Alternative: `@nestjs/swagger` style with decorators or `tsoa` for TypeScript
- [ ] Generate OpenAPI 3.0 specification from code
- [ ] Create Swagger UI endpoint: `/api-docs`
- [ ] Document all endpoints with:
  - Request parameters
  - Request body schemas
  - Response schemas
  - Authentication requirements
  - Example requests/responses
  - Error responses
- [ ] Add JSDoc comments to controllers with OpenAPI tags
- [ ] Generate TypeScript types from OpenAPI spec
- [ ] Set up automated spec validation
- [ ] Add spec generation to build pipeline
- [ ] Version API documentation
- [ ] Export OpenAPI spec as JSON/YAML

**Implementation Options:**

**Option 1: swagger-jsdoc (JSDoc-based)**

```typescript
// apps/server/src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Noted API',
      version: '2.0.0',
      description: 'Secure note-taking application API',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://api.noted.app', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

**Option 2: TSOA (TypeScript OpenAPI)**

```typescript
// Generates OpenAPI from TypeScript decorators
import { Controller, Get, Post, Route, Body, Tags } from 'tsoa';

@Route('api/users')
@Tags('Authentication')
export class UserController extends Controller {
  @Post('/login')
  public async login(@Body() body: ILoginRequest): Promise<IAuthResponse> {
    // Implementation
  }
}
```

**Swagger UI Setup:**

```typescript
// apps/server/src/server.ts
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Noted API Documentation',
}));

// Export spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

**Example Documentation:**

```typescript
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *       429:
 *         description: Too many requests
 */
```

**Features to Document:**

- All authentication endpoints (login, register, refresh, logout)
- User management (profile, password change)
- Password reset flow
- Contact form
- File upload endpoints (when MinIO is integrated)
- Rate limiting information
- Error response formats

**Tools Integration:**

- [ ] Postman collection generation
- [ ] OpenAPI client generation for frontend
- [ ] API testing with documented contracts
- [ ] Versioning strategy (v1, v2)

**Benefits:**

- Self-documenting API
- Interactive API testing via Swagger UI
- Client SDK generation
- Contract testing capabilities
- Better developer onboarding
- API versioning support
- Frontend-backend contract validation

**Alternative Tools to Consider:**

- **Redoc** - Better looking documentation UI
- **Stoplight Studio** - Visual API designer
- **Postman** - Auto-generate from OpenAPI spec
- **Scalar** - Modern API documentation

#### REST API Enhancement & Best Practices

**Priority:** MEDIUM
**Status:** Planned

Enhance the current REST API with improved type safety and developer experience:

##### 1. Shared API Client Package

Create a centralized, type-safe API client:

- [ ] Create `packages/api-client/` package
- [ ] Build type-safe wrapper around axios
- [ ] Export all API methods with proper types
- [ ] Add automatic error handling
- [ ] Include retry logic
- [ ] Add request/response logging in development

**Implementation:**

```typescript
// packages/api-client/src/index.ts
import axios from 'axios';
import type {
  ILoginRequest,
  IAuthResponse,
  IRegisterRequest,
  IUserResponse
} from '@noted/types';

const apiClient = axios.create({
  baseURL: process.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

export const api = {
  auth: {
    login: (data: ILoginRequest) =>
      apiClient.post<IAuthResponse>('/api/users/login', data),
    register: (data: IRegisterRequest) =>
      apiClient.post<IAuthResponse>('/api/users/register', data),
    logout: () =>
      apiClient.get<{ message: string }>('/api/users/logout'),
    refresh: () =>
      apiClient.post<{ message: string }>('/api/users/refresh'),
  },
  users: {
    getProfile: () =>
      apiClient.get<IUserResponse>('/api/users/getuser'),
    updateProfile: (data: Partial<IUserResponse>) =>
      apiClient.patch<IUserResponse>('/api/users/updateuser', data),
  },
};
```

**Benefits:**

- Single source of truth for API calls
- Autocomplete for all endpoints
- Type checking at compile time
- Easier to mock for testing
- Centralized error handling

##### 2. OpenAPI Client Generation

Generate TypeScript client from OpenAPI specification:

- [ ] Install `openapi-typescript-codegen` or `openapi-typescript`
- [ ] Add generation script: `pnpm generate:api-client`
- [ ] Generate client on each build
- [ ] Add generated client to `.gitignore`
- [ ] Use generated types in frontend
- [ ] Add CI check for API contract drift

**Script:**

```json
{
  "scripts": {
    "generate:api-client": "openapi-typescript http://localhost:5000/api-docs.json -o packages/api-client/src/generated.ts"
  }
}
```

**Benefits:**

- Always in sync with backend
- Zero manual type definitions
- Catch breaking changes early
- Generate SDK automatically

##### 3. Runtime Type Validation

Add runtime validation to ensure API responses match types:

- [ ] Install `zod` for runtime schema validation
- [ ] Create Zod schemas from `@noted/types`
- [ ] Add validation middleware
- [ ] Log validation errors in development
- [ ] Add contract testing suite

**Implementation:**

```typescript
// packages/types/src/schemas.ts
import { z } from 'zod';

export const AuthResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  photo: z.string(),
  phone: z.string(),
  bio: z.string(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Usage in API client
const response = await api.auth.login(data);
const validated = AuthResponseSchema.parse(response.data);
```

**Benefits:**

- Catch type mismatches at runtime
- Better error messages
- Production safety
- Contract testing

##### 4. API Versioning Strategy

Implement proper API versioning for future changes:

- [ ] Move current endpoints to `/api/v1/`
- [ ] Create versioning middleware
- [ ] Document deprecation policy
- [ ] Add version headers
- [ ] Support multiple versions simultaneously

**Structure:**

```
apps/server/src/
├── routes/
│   ├── v1/
│   │   ├── userRoute.ts
│   │   └── contactRoute.ts
│   └── v2/  (future)
└── server.ts
```

**Benefits:**

- Non-breaking changes
- Gradual migration path
- Better API lifecycle management
- Clear deprecation timeline

##### 5. Enhanced Error Handling

Standardize error responses across all endpoints:

- [ ] Create error classes hierarchy
- [ ] Implement error codes (e.g., `AUTH_001`, `VALIDATION_002`)
- [ ] Add error response types to `@noted/types`
- [ ] Document all possible errors in OpenAPI
- [ ] Add error tracking IDs

**Implementation:**

```typescript
// packages/types/src/errors.ts
export interface IApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

// Example error codes
export enum ApiErrorCode {
  AUTH_INVALID_CREDENTIALS = 'AUTH_001',
  AUTH_TOKEN_EXPIRED = 'AUTH_002',
  USER_NOT_FOUND = 'USER_001',
  VALIDATION_FAILED = 'VAL_001',
}
```

**Benefits:**

- Consistent error format
- Easy error tracking
- Better debugging
- Frontend can handle errors systematically

##### 6. Request/Response Interceptors

Enhance axios interceptors with additional functionality:

- [ ] Add request ID generation
- [ ] Implement request timing
- [ ] Add performance monitoring
- [ ] Create request queue for offline support
- [ ] Add request deduplication

##### 7. API Client Testing

Comprehensive testing for API client:

- [ ] Unit tests for API client methods
- [ ] Mock server responses
- [ ] Test error handling
- [ ] Test retry logic
- [ ] Integration tests with real server

**Benefits:**

- Reliable API layer
- Catch regressions early
- Better confidence in changes
- Documentation through tests

---

## 📋 Planned (v2.2) - Testing & Quality

### Testing Infrastructure

**Priority:** HIGH
**Status:** Planned

- [ ] Set up Vitest for unit testing
- [ ] Add Jest for integration testing
- [ ] Create test utilities and mocks
- [ ] Add testing scripts to Turborepo pipeline
- [ ] Set up test coverage reporting
- [ ] Add Playwright for E2E testing

### Test Coverage Goals

- [ ] Unit tests for controllers (>80% coverage)
- [ ] Integration tests for auth flow
- [ ] API endpoint tests
- [ ] Email template tests
- [ ] React component tests
- [ ] E2E user journey tests

---

## Planned (v2.3) - Features

### Authentication & Security Enhancements

**Priority:** MEDIUM
**Status:** Planned

- [ ] Two-Factor Authentication (2FA) with TOTP
- [ ] Email verification on registration
- [ ] Login history and session management
- [ ] Device tracking and management
- [ ] Suspicious activity detection
- [ ] Password change email notifications
- [ ] Account recovery options

### User Experience

**Priority:** MEDIUM
**Status:** Planned

- [ ] Dark mode toggle
- [ ] User preferences system
- [ ] Notification system
- [ ] Real-time updates (WebSocket)
- [ ] Collaborative editing
- [ ] Note sharing and permissions
- [ ] Search functionality
- [ ] Keyboard shortcuts

---

## Future (v3.0+)

### Advanced Features

- [ ] AI-powered note suggestions
- [ ] Voice-to-text notes
- [ ] Note categories and tags
- [ ] Advanced search with filters
- [ ] Export notes (PDF, Markdown, HTML)
- [ ] Note templates
- [ ] Kanban board view
- [ ] Calendar integration

### Mobile App

- [ ] React Native mobile app
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Biometric authentication

### Performance & Scalability

- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] CDN integration
- [ ] Database sharding strategy
- [ ] Load balancing setup
- [ ] Horizontal scaling support

### Monitoring & Analytics

- [ ] Application Performance Monitoring (APM)
- [ ] Error tracking (Sentry integration)
- [ ] User analytics
- [ ] Usage metrics dashboard
- [ ] Health check endpoints
- [ ] Uptime monitoring

### CI/CD & Deployment

- [ ] GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Automated deployments
- [ ] Staging environment
- [ ] Production deployment pipeline
- [ ] Rollback strategy
- [ ] Blue-green deployment

---

## Technical Debt & Improvements

### Immediate

- [ ] Complete frontend TypeScript migration
- [ ] Fix remaining type errors in client components
- [ ] Add return types to all functions
- [ ] Remove any remaining `any` types

### Short Term

- [ ] Implement redux-persist properly
- [ ] Create development guidelines
- [ ] Add code quality metrics
- [ ] Set up automated dependency updates

### Long Term

- [ ] Consider Tauri 2.x migration
- [ ] Evaluate GraphQL adoption
- [ ] Research serverless options
- [ ] Consider microservices architecture

---

## Learning & Documentation

### Documentation

- [ ] Architecture decision records (ADRs)
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Deployment guide
- [ ] Troubleshooting guide

### Architecture Decisions

#### ADR-001: REST API over tRPC

**Decision:** Continue using REST API architecture instead of migrating to tRPC

**Status:** Accepted (January 2025)

**Context:**

- Application has working REST API with full TypeScript types
- Shared `@noted/types` package provides type safety
- Refresh token authentication already implemented
- Future plans include public API, mobile apps, and integrations

**Rationale:**

**Pros of REST:**

- ✅ Already implemented and production-ready
- ✅ Universal standard - any client can consume
- ✅ Better tooling (Postman, Swagger, curl)
- ✅ Public API ready for third-party integrations
- ✅ Works with Tauri desktop app
- ✅ Team familiarity
- ✅ OpenAPI documentation support
- ✅ Standard HTTP caching

**Cons of tRPC Migration:**

- ❌ 2-3 weeks migration effort
- ❌ TypeScript-only clients
- ❌ Harder for native mobile apps
- ❌ Limited external tooling
- ❌ No automatic OpenAPI docs
- ❌ Learning curve for team

**Enhancement Strategy:**
Instead of migrating to tRPC, enhance REST with:

1. Shared API client package (`@noted/api-client`)
2. OpenAPI/Swagger documentation
3. Generated TypeScript client from OpenAPI spec
4. Runtime validation with Zod
5. API versioning strategy
6. Standardized error handling

**Consequences:**

- Maintain REST endpoints with enhanced type safety
- Use OpenAPI for documentation and client generation
- Keep flexibility for public API and integrations
- Avoid large migration effort
- Can reconsider tRPC for internal admin tools if needed

**Alternatives Considered:**

- Full tRPC migration (rejected - too much effort, limits flexibility)
- Hybrid approach (REST public + tRPC internal) (deferred - adds complexity)
- GraphQL (rejected - overkill for current needs)

### Developer Experience

- [ ] VSCode workspace configuration
- [ ] Recommended extensions list
- [ ] Debug configurations
- [ ] Git hooks documentation
- [ ] Quick start video tutorial

---

## Timeline Estimates

### Q1 2025

- Docker local development setup
- MinIO object storage integration
- Structured logging implementation
- OpenAPI/Swagger API documentation
- Shared API client package
- Runtime type validation (Zod)
- Testing infrastructure setup

### Q2 2025

- Two-factor authentication
- Email verification
- API versioning (v1, v2)
- Enhanced error handling with error codes
- Test coverage >80%
- Performance monitoring

### Q3 2025

- Advanced features (search, tags, sharing)
- Mobile app planning
- CI/CD pipeline
- Production deployment

### Q4 2025

- Mobile app MVP
- Scalability improvements
- Analytics dashboard
- Feature refinements

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines (coming soon) for:

- How to submit feature requests
- Bug reporting process
- Code review process
- Development workflow

---

## Notes

- This roadmap is subject to change based on user feedback and priorities
- Features marked as "Planned" may shift between versions
- Community contributions can accelerate timeline
- Breaking changes will be properly communicated

**Last Updated:** October 2025
**Next Review:** March 2026
