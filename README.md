# Noted - Secure Note-Taking Application

A modern, secure full-stack note-taking application built with React, Express, and MongoDB in a Turborepo monorepo architecture.

##  Architecture

This project uses a monorepo structure managed by **Turborepo** and **pnpm**:

```
noted/
├── apps/
│   ├── client/          # React + Vite frontend
│   └── server/          # Express + TypeScript backend
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── email-templates/ # React Email templates
│   └── config/          # Shared configurations
└── turbo.json           # Turborepo configuration
```

##  Features

### Security Features
- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **HttpOnly Cookies** - Tokens never exposed to JavaScript
- ✅ **Token Rotation** - Automatic refresh token rotation
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Helmet Security Headers** - XSS, clickjacking protection
- ✅ **Password Strength Validation** - 8+ characters with complexity requirements
- ✅ **CORS Configuration** - Proper credential handling
- ✅ **Environment Variable Validation** - Fail-fast on missing configs

### Technical Features
-  **Full TypeScript** - Both frontend and backend
-  **Monorepo** - Shared code and types across apps
-  **React Email** - Beautiful, component-based emails
-  **Auto Token Refresh** - Seamless authentication
-  **Tailwind CSS** - Modern, responsive UI
-  **Tauri Ready** - Desktop app support

##  Prerequisites

- Node.js 18+
- pnpm 9+
- MongoDB 6+

##  Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Noted
```

2. **Install pnpm (if not already installed):**
```bash
npm install -g pnpm@9.15.0
```

3. **Install dependencies:**
```bash
pnpm install
```

4. **Setup environment variables:**

Create `.env` in `apps/server/`:
```env
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/noted
DB_MESSAGE=Database Connected Successfully

# JWT Secrets (use strong random strings in production)
JWT_SECRET=your-access-token-secret-minimum-32-characters
REFRESH_TOKEN_SECRET=your-refresh-token-secret-minimum-32-characters

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Optional: Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `.env` in `apps/client/`:
```env
VITE_APP_BACKEND_URL=http://localhost:5000
```

##  Running the Application

### Development Mode

**Run both client and server:**
```bash
pnpm dev
```

**Run client only:**
```bash
pnpm dev:client
```

**Run server only:**
```bash
pnpm dev:server
```

### Production Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

##  Project Structure

### Backend (`apps/server/`)

```
src/
├── controllers/         # Request handlers
│   ├── userController.ts
│   └── contactController.ts
├── middleware/          # Express middleware
│   ├── authMiddleware.ts
│   └── errorMiddleware.ts
├── models/             # Mongoose models
│   ├── userModel.ts
│   └── tokenModel.ts
├── routes/             # API routes
│   ├── userRoute.ts
│   └── contactRoute.ts
├── utils/              # Utility functions
│   └── sendEmail.ts
└── server.ts           # Server entry point
```

### Frontend (`apps/client/`)

```
src/
├── components/         # React components
├── pages/             # Page components
│   ├── auth/         # Authentication pages
│   ├── Home/         # Landing page
│   └── profile/      # User profile
├── redux/            # State management
│   ├── features/
│   │   └── auth/    # Auth slice
│   └── store.tsx    # Redux store
├── services/         # API services
│   └── authService.tsx
└── customHook/       # Custom React hooks
```

### Shared Packages

**`packages/types/`** - Shared TypeScript interfaces:
```typescript
IUser, IAuthResponse, ILoginRequest, IRegisterRequest, etc.
```

**`packages/email-templates/`** - React Email templates:
- PasswordResetEmail
- WelcomeEmail
- ContactFormEmail

**`packages/config/`** - Shared configurations:
- TypeScript configs
- ESLint configs (future)

##  Authentication Flow

### Login/Register
1. User submits credentials
2. Server validates and creates JWT tokens:
   - Access token (15 min) - for API requests
   - Refresh token (7 days) - for refreshing access tokens
3. Tokens stored as httpOnly cookies
4. User data returned (no tokens in response body)

### API Requests
1. Access token sent automatically via cookie
2. If expired (401), axios interceptor triggers
3. Automatic refresh using refresh token
4. Original request retried with new token
5. If refresh fails, redirect to login

### Logout
1. Refresh token deleted from database
2. All cookies cleared
3. User redirected to home

##  Email Templates

React Email templates are located in `packages/email-templates/`. To preview:

```bash
cd packages/email-templates
pnpm dev
```

Visit `http://localhost:3000` to see email previews.

##  Security Best Practices

### Implemented
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens in httpOnly cookies only
- Refresh token rotation on each use
- Rate limiting on auth endpoints
- CORS with credential support
- Helmet security headers
- Environment variable validation
- Password strength requirements

### Recommendations
- Use strong, random JWT secrets (32+ characters)
- Enable HTTPS in production
- Regular security audits
- Keep dependencies updated
- Monitor rate limit violations
- Implement 2FA (future enhancement)

##  Testing

Run type checking across all packages:
```bash
pnpm type-check
```

Build all packages:
```bash
pnpm build
```

##  Package Management

This project uses pnpm workspaces. Key commands:

```bash
# Add dependency to specific package
pnpm add <package> --filter @noted/client
pnpm add <package> --filter @noted/server

# Add dev dependency
pnpm add -D <package> --filter @noted/client

# Update all dependencies
pnpm update -r

# Clean all node_modules and reinstall
pnpm clean
pnpm install
```

## Deployment

### Backend
1. Build TypeScript: `pnpm build --filter @noted/server`
2. Set environment variables on your hosting platform
3. Run: `node dist/server.js`

### Frontend
1. Build: `pnpm build --filter @noted/client`
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

### Environment Variables in Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Enable HTTPS
- Update `FRONTEND_URL` to production domain
- Configure email service for production

## API Endpoints

### Public Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/forgotpassword` - Request password reset
- `PUT /api/users/resetpassword/:token` - Reset password
- `GET /api/users/loggedin` - Check login status

### Protected Routes (require authentication)
- `POST /api/users/refresh` - Refresh access token
- `GET /api/users/logout` - Logout user
- `GET /api/users/getuser` - Get user profile
- `PATCH /api/users/updateuser` - Update user profile
- `PATCH /api/users/changepassword` - Change password
- `POST /api/contactus` - Send contact form

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm type-check` and `pnpm lint`
5. Submit a pull request

##  License

UNLICENSED

##  Acknowledgments

- Turborepo for monorepo management
- React Email for beautiful email templates
- Express.js for robust backend
- MongoDB for flexible data storage
