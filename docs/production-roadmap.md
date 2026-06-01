# FoodHeaven Production Roadmap

## Step 1 (Completed)

- Separate backend service created in `backend/`.
- REST API v1 created with health + restaurants + menu endpoints.
- MySQL schema and seed files created in `backend/db/`.
- Layered architecture added (controller/service/repository).

## Step 2 (Completed)

- Replace frontend static home and menu data usage with backend APIs.
- Add frontend API constants for backend base URL and endpoint builders.
- Keep response mapping backward compatible with existing components.

## Step 3 (Completed)

- Auth-aware order and payment APIs with JWT / Auth0.
- Cart/order/payment persisted in backend DB.

## Step 4 (Completed)

- Validation, logging, rate limiting, tests, Docker.
- Production Auth0 integration — see `docs/production-deploy.md`.
