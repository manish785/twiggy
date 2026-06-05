# Project configuration reference

This document explains key config files and how the frontend talks to the backend API.

---

## Overview

The React frontend always calls the **Express API** in `backend/` (MySQL). There is no static mock API layer.

| Environment | API URL |
|-------------|---------|
| **Local dev** | `http://localhost:5000/api/v1` (from root `.env`) |
| **Production (Vercel)** | `https://foodheaven-api.onrender.com/api/v1` (from `vercel.json` or Vercel env) |

Set `REACT_APP_API_BASE_URL` to point the frontend at the backend. All data — restaurants, menus, orders, login — comes from the real API.

---

## `backend/docker-compose.yml`

**Location:** `backend/docker-compose.yml`

**Purpose:** Run **MySQL 8** and the **Express backend** together in Docker for local development (or a containerized stack) without installing MySQL on the host.

### Services

1. **`mysql`**
   - Image: `mysql:8.0`
   - Port: `3306`
   - On first start, runs `db/schema.sql` and `db/seed.sql` from mounted init scripts
   - Persists data in a named volume `mysql_data`
   - Health check ensures DB is ready before the API starts

2. **`backend`**
   - Built from `backend/Dockerfile`
   - Port: `5000`
   - Waits for healthy MySQL, then starts with env vars pointing at the `mysql` service

### When to use

```bash
cd backend
docker compose up --build
```

Use this when you want the full stack in containers instead of a local MySQL install.

---

## `backend/.dockerignore`

**Purpose:** Tells Docker which files to **exclude** from the build context when building the backend image.

### Excluded paths

| Pattern | Why |
|---------|-----|
| `node_modules` | Reinstalled inside the image via `npm install` |
| `.env`, `.env.local` | Secrets must not be baked into images |
| `coverage`, `dist` | Build artifacts / test output |
| `.git` | Not needed in the image; reduces size |

**Need:** Faster, smaller, safer Docker builds.

---

## `.env` files (actual secrets — not in Git)

**Locations:**

- **Root:** `.env` — frontend (Parcel reads `REACT_APP_*` at build/dev time)
- **Backend:** `backend/.env` — Express server, DB, JWT, Auth0, etc.

Both are listed in `.gitignore` and are **never committed**.

### Root `.env` (frontend)

Typical variables:

| Variable | Purpose |
|----------|---------|
| `PORT` | Dev server port (default 3000) |
| `REACT_APP_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000/api/v1` locally, Render URL in production) |
| `REACT_APP_DEV_AUTH_KEY` | Key for backend `POST /api/v1/auth/dev-token` in local dev |
| `REACT_APP_AUTH0_*` | Auth0 settings for production login |

### `backend/.env` (API server)

Typical variables:

| Variable | Purpose |
|----------|---------|
| `NODE_ENV`, `PORT` | Runtime mode and listen port |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `CORS_ORIGIN` | Allowed frontend origin |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `DEV_AUTH_KEY` | Dev JWT and dev-token endpoint |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | Production Auth0 JWT validation |
| `INTERNAL_API_TOKEN` | Server-to-server bearer token |
| `RATE_LIMIT_*`, `LOG_LEVEL` | Rate limiting and logging |

**Need:** Keeps credentials and environment-specific URLs out of source code.

---

## `.env.example` files (templates — safe to commit)

**Locations:**

- **Root:** `.env.example`
- **Backend:** `backend/.env.example`

**Purpose:** Document **which variables are required** and show placeholder values. New developers copy them:

```bash
cp .env.example .env          # frontend
cd backend && cp .env.example .env   # backend
```

Then replace placeholders (e.g. `your_mysql_password`, `replace_with_jwt_secret`) with real local values.

**Need:** Onboarding and deployment docs without leaking secrets.

---

## `jest.config.js` (project root)

**Purpose:** Jest configuration for **frontend** tests (React components, Redux, etc.).

| Setting | Value | Meaning |
|---------|--------|---------|
| `testEnvironment` | `jsdom` | Simulates a browser DOM |
| `testPathIgnorePatterns` | includes `backend/` | Backend tests use their own config |
| `clearMocks` | `true` | Reset mocks between tests |

**Run:** `npm test` from project root.

---

## `backend/jest.config.js`

**Purpose:** Jest configuration for **backend unit tests** (no real database).

| Setting | Value | Meaning |
|---------|--------|---------|
| `testEnvironment` | `node` | Node.js, not browser |
| Ignores | `helpers/`, `*.integration.test.js` | Integration tests run separately |

**Run:** `cd backend && npm test`

**Example tests:** `backend/src/__tests__/order-security.test.js` (auth, validation, mocked DB).

---

## `backend/jest.integration.config.js`

**Purpose:** Jest configuration for **backend integration tests** that hit a **real MySQL** database.

| Setting | Value | Meaning |
|---------|--------|---------|
| `testMatch` | `**/*.integration.test.js` | Only integration test files |
| `testEnvironment` | `node` | Node.js |

**Run:** `cd backend && npm run test:integration`

**Example:** `backend/src/__tests__/order.integration.test.js` — full order flow against DB (requires MySQL running and `.env` configured).

**Why separate config:** Integration tests are slower, need DB setup, and are often run in CI separately from fast unit tests.

---

## Quick reference

| File / folder | Layer | Need |
|---------------|--------|------|
| `backend/` | API | Express + MySQL — single source of truth for all data |
| `backend/docker-compose.yml` | Infrastructure | One-command MySQL + API in Docker |
| `backend/.dockerignore` | Docker | Smaller, safer image builds |
| `.env` | Config (secret) | Local/production secrets (gitignored) |
| `.env.example` | Config (template) | Documents required env vars for setup |
| `jest.config.js` | Testing | Frontend unit tests |
| `backend/jest.config.js` | Testing | Backend unit tests |
| `backend/jest.integration.config.js` | Testing | Backend tests with real MySQL |

---

## Related docs

- [README.md](../README.md) — quick start
- [backend/README.md](../backend/README.md) — API endpoints and backend structure
- [DEPLOY_RENDER_VERCEL.md](./DEPLOY_RENDER_VERCEL.md) — production deployment
