# FoodHeaven System Design (Brief)

## 1) Problem Statement
FoodHeaven is a food delivery web app where users can:
- browse restaurants and menus,
- add items to cart,
- place orders,
- confirm payments,
- view order status.

The project has:
- Frontend: React + Redux Toolkit
- Backend: Node.js + Express
- Database: MySQL

## 2) HLD (High-Level Design)

### Core Building Blocks
- **Client Layer (Web App):** React SPA handles UI, routing, cart state, and checkout flow.
- **API Layer (Backend):** Express REST APIs under `/api/v1` for restaurants, orders, and auth token generation (dev).
- **Business Layer:** Services and controllers enforce order lifecycle, payment update flow, and validation.
- **Data Layer:** MySQL stores restaurants, menu items, orders, and order items.
- **Cross-Cutting:** JWT auth, rate limiting, request logging, validation, and centralized error handling.

### HLD Diagram (Logical)
```text
[React Web App]
      |
      | HTTPS/REST
      v
[Express API Gateway Layer]
  |      |        |
  |      |        +--> [Auth Module - JWT Validation]
  |      +-----------> [Order Module]
  +------------------> [Restaurant Module]
              |
              v
           [MySQL DB]
```

### Key Flows
1. **Browse Flow:** UI -> `GET /restaurants` and `GET /restaurants/:id/menu` -> render menu.
2. **Order Flow:** UI sends authenticated `POST /orders` with cart items -> order and items persisted.
3. **Payment Flow:** UI sends authenticated `POST /orders/:orderId/payments` -> payment status updated.

### Scalability (Near-Term)
- Stateless API instances allow horizontal scaling.
- Read-heavy restaurant/menu endpoints can add Redis caching.
- Use idempotency key to prevent duplicate order creation on retries.

### Reliability & Security
- JWT bearer auth for order/payment operations.
- Input validation via Joi on request bodies.
- Rate limiting on `/api/*`.
- Helmet + CORS configuration.
- Structured request logs with request ID for tracing.

## 3) LLD (Low-Level Design)

### Backend Layering
- **Routes:** define endpoint + middleware chain.
- **Controllers:** map HTTP request/response and call services.
- **Services:** business logic and orchestration.
- **Repositories:** SQL queries and persistence.
- **Middlewares:** auth, validation, errors.
- **Config:** DB connection and migration utilities.

### Module-wise LLD

#### Restaurant Module
- Endpoints:
  - `GET /api/v1/restaurants`
  - `GET /api/v1/restaurants/:restaurantId/menu`
- Responsibilities:
  - Fetch active restaurants
  - Fetch menu for selected restaurant
- Data access:
  - Repository queries from `restaurants` and menu-related tables

#### Order Module
- Endpoints:
  - `POST /api/v1/orders`
  - `POST /api/v1/orders/:orderId/payments`
- Responsibilities:
  - Validate payload (items, totals, payment state)
  - Create order + order items transactionally
  - Confirm/update payment status
  - Enforce idempotency using `Idempotency-Key` (when provided)

#### Auth Module
- Endpoint:
  - `POST /api/v1/auth/dev-token` (non-production)
- Responsibilities:
  - Generate short-lived JWT for dev/testing
  - Verify protected routes using auth middleware

### Request Lifecycle (Order Create)
1. Route applies `authMiddleware`.
2. `validateBody(createOrderSchema)` validates payload.
3. Controller extracts user + request data.
4. Service computes totals and business checks.
5. Repository persists order and order items.
6. Response returns created order summary.

### Database Design (Core)
- **restaurants**: master restaurant metadata
- **menu_items**: item details and pricing per restaurant
- **orders**: order header (`user_id`, totals, status, idempotency key)
- **order_items**: line items (`order_id`, `item_id`, qty, price)

### Error Handling & Observability
- Standard JSON error shape from centralized error middleware.
- Request-scoped IDs (`x-request-id`) for tracing across logs.
- Health endpoint: `GET /health`.

## 4) NFR Snapshot
- **Performance:** p95 API latency target < 300ms for browse APIs (single region, warm DB).
- **Availability:** target 99.9% for backend service.
- **Security:** JWT validation, least-privilege DB user, env-secret isolation.
- **Maintainability:** versioned routes (`/api/v1`) and layered folder structure.

## 5) Suggested Next Evolution
- Add payment gateway adapter abstraction (Razorpay/Stripe).
- Add Redis cache for menu and restaurant listing.
- Add async event pipeline (order placed -> notifications/analytics).
- Add OpenTelemetry traces and metrics dashboards.
