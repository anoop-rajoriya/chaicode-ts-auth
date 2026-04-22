# Chaicode Typescript Authentication Express Server

A robust TypeScript-based Express server for handling user authentication, built with Drizzle ORM, PostgreSQL, JWT tokens, and Zod validation.

## Content List
- [Problem it solves](#problem-it-solves)
- [Local Setup Instructions](#local-setup-instructions)
- [API Endpoints](#api-endpoints)
- [Project Architecture](#project-architecture)

## Problem it solves

This project provides a secure authentication system for web applications. It handles user registration, login, token-based authentication, refresh tokens for session management, and user profile retrieval. The server uses JWT for stateless authentication, password hashing with salts for security, and PostgreSQL as the database backend.

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Docker (for PostgreSQL database)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chaicode-ts-auth
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://myUser:myPassword@localhost:5432/myDatabase
   JWT_SECRET=your-secret-key-here
   ```

4. Start the PostgreSQL database:
   ```bash
   pnpm run db:up
   ```

5. Run database migrations:
   ```bash
   pnpm run drizzle:migrate
   ```

6. Build and start the server:
   - For development: `pnpm run dev`
   - For production: `pnpm run build && pnpm start`

The server will be running on `http://localhost:8080`.

### Additional Commands
- Stop the database: `pnpm run db:down`
- Generate new migrations: `pnpm run drizzle:generate`
- Open Drizzle Studio: `pnpm run drizzle:studio`

## API Endpoints

All authentication endpoints are prefixed with `/auth`. The server also provides a health check endpoint.

### Health Check
- **GET** `/health` - Returns server status

### Authentication Endpoints

- **POST** `/auth/signup`
  - Registers a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`
  - Response: `{ "userId": "uuid", "userEmail": "string" }`

- **POST** `/auth/signin`
  - Logs in an existing user
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "id": "uuid", "refreshToken": "string" }`
  - Headers: `Authorization: Bearer <accessToken>`

- **GET** `/auth/refresh/:token`
  - Refreshes access token using refresh token
  - Response: `{ "id": "uuid", "refreshToken": "string" }`
  - Headers: `Authorization: Bearer <newAccessToken>`

- **GET** `/auth/signout`
  - Logs out the user (requires authentication)
  - Headers: `Authorization: Bearer <accessToken>`
  - Response: `{ "userId": "uuid", "isSignout": true }`

- **GET** `/auth/me`
  - Retrieves current user profile (requires authentication)
  - Headers: `Authorization: Bearer <accessToken>`
  - Response: `{ "id": "uuid", "name": "string", "email": "string", "createdAt": "timestamp", "updatedAt": "timestamp" }`

## Project Architecture

The project follows a modular structure for maintainability and scalability:

- **`src/index.ts`**: Main entry point that creates and starts the HTTP server
- **`src/app/index.ts`**: Express application setup with middleware and routes
- **`src/app/middleware/auth.middleware.ts`**: Authentication middleware for extracting and validating JWT tokens
- **`src/app/user/`**:
  - `controller.ts`: Business logic for user authentication operations
  - `route.ts`: Route definitions and middleware application
  - `validation.ts`: Zod schemas for request validation
- **`src/db/`**:
  - `index.ts`: Database connection setup with Drizzle ORM
  - `schema.ts`: Database schema definitions
- **`src/utils/`**:
  - `crypto.utils.ts`: Password hashing and salt generation utilities
  - `tokens.utils.ts`: JWT token generation and verification functions
- **`types/express.d.ts`**: TypeScript declarations for extending Express Request interface
- **`drizzle/`**: Database migration files and metadata
- **`docker-compose.yml`**: PostgreSQL database container configuration