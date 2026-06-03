# FoodHeaven Backend (Node + Express + MySQL)

## Run Locally

1. Copy env file:
   - `cp .env.example .env`
2. Update DB credentials in `.env`.
3. Create schema and seed data:
   - `mysql -u root -p < db/schema.sql`
   - `mysql -u root -p < db/seed.sql`
4. Start backend:k
   - `npm run dev`
5. Run tests:
   - `npm test`
6. Run DB integration tests:
   - `npm run test:integration`

## API (v1)

- `GET /health` - readiness check (includes MySQL `SELECT 1`)
- `GET /api/docs` - lightweight OpenAPI-style API docs
- `GET /api/v1/restaurants` - list active restaurants
- `GET /api/v1/restaurants/:restaurantId/menu` - restaurant menu
- `POST /api/v1/orders` - create order (auth required)
- `POST /api/v1/orders/:orderId/payments` - confirm payment (auth required)
- `POST /api/v1/auth/dev-token` - development JWT only (`NODE_ENV` ≠ `production`)

## Authentication

| Environment | Order/payment auth |
|-------------|-------------------|
| **Production** | Auth0 access token (`AUTH0_DOMAIN` + `AUTH0_AUDIENCE`) |
| **Development** | Auth0 access token **or** dev-token (`JWT_SECRET` + `DEV_AUTH_KEY`) |
| **Internal** | `INTERNAL_API_TOKEN` as Bearer token (server-to-server only) |

See [../docs/production-deploy.md](../docs/production-deploy.md) for Auth0 setup.

## Security and Reliability

- Auth0 JWT validation via JWKS (RS256) in production
- Helmet, CORS, rate limiting on `/api/*`
- Order idempotency via `Idempotency-Key` header
- Joi request validation
- Structured logging with `x-request-id`
- Migrations run on server startup (`orders.idempotency_key`)
- `trust proxy` enabled when `NODE_ENV=production`

## Docker

```bash
docker compose up --build
```

## CI

- `.github/workflows/backend-ci.yml` — unit + integration tests

## Project Structure

- `src/config` - DB config and migrations
- `src/repositories` - SQL access layer
- `src/services` - business/data mapping logic
- `src/controllers` - request/response handlers
- `src/routes` - versioned REST routes
- `src/middlewares` - auth, validation, errors
