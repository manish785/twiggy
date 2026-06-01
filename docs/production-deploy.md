# Production deployment guide

## Auth0 setup (required for orders in production)

1. In [Auth0 Dashboard](https://manage.auth0.com/), create an **API**:
   - Identifier = `AUTH0_AUDIENCE` (e.g. `https://api.foodheaven.app`)
   - Signing algorithm: RS256

2. In your **SPA application**:
   - Allowed Callback URLs: `https://your-frontend.com`
   - Allowed Logout URLs: `https://your-frontend.com`
   - Allowed Web Origins: `https://your-frontend.com`

3. Copy domain, client ID, and API identifier into env vars (see below).

## Backend environment

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend.com

DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=foodheaven_db

AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.foodheaven.app

JWT_SECRET=long-random-secret
INTERNAL_API_TOKEN=long-random-token-for-internal-calls-only
```

Run schema/seed once, then start the server. Migrations run automatically on boot.

Health check: `GET /health` returns `503` if MySQL is down.

## Frontend environment (build time)

```env
REACT_APP_API_BASE_URL=https://api.your-domain.com/api/v1
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_spa_client_id
REACT_APP_AUTH0_AUDIENCE=https://api.foodheaven.app
```

Do **not** set `REACT_APP_DEV_AUTH_KEY` in production.

Build: `npm run build` ? deploy `dist/` to static hosting (Vercel, Netlify, S3, etc.).

## Local development (without Auth0 API)

Use dev-token flow:

- Backend: `DEV_AUTH_KEY` in `backend/.env`
- Frontend: `REACT_APP_DEV_AUTH_KEY` matching the same value
- Leave `AUTH0_AUDIENCE` / `REACT_APP_AUTH0_AUDIENCE` unset

## Checklist

- [ ] Auth0 API + SPA configured with matching audience
- [ ] `NODE_ENV=production` on backend
- [ ] Strong `JWT_SECRET` and `INTERNAL_API_TOKEN`
- [ ] `CORS_ORIGIN` matches frontend URL exactly
- [ ] MySQL schema + seed applied
- [ ] `/health` monitored (includes DB check)
