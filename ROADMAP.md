# Noted Application Roadmap

## ✅ Completed (v2.0)

### Architecture & Infrastructure

- [x] Monorepo architecture with Turborepo
- [x] Migration from Yarn to pnpm
- [x] Full TypeScript backend with strict types
- [x] Shared packages (`@noted/types`, `@noted/email-templates`, `@noted/config`)

### Security

- [x] JWT refresh token implementation
- [x] HttpOnly cookies for token storage
- [x] Rate limiting on auth endpoints
- [x] Helmet security headers
- [x] Password strength validation (8+ chars with complexity)
- [x] Extended password reset token expiry (30 minutes)
- [x] CORS with credentials properly configured
- [x] Environment variable validation

### Features

- [x] React Email integration for templated emails
- [x] Automatic token refresh with axios interceptor
- [x] Token rotation on refresh
- [x] Welcome emails on registration
- [x] Branded password reset emails

### Package Updates

- [x] All dependencies updated to latest stable versions
- [x] Tauri updated to 2.x
- [x] React Router v7
- [x] Redux Toolkit v2.5
- [x] Mongoose v8

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

---

## Planned (v2.2) - Testing & Quality

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
- [ ] Add API documentation (Swagger/OpenAPI)
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

- [ ] API documentation
- [ ] Architecture decision records (ADRs)
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Deployment guide
- [ ] Troubleshooting guide

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
- Testing infrastructure setup

### Q2 2025

- Two-factor authentication
- Email verification
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
