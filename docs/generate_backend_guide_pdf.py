# -*- coding: utf-8 -*-
"""Generate FoodHeaven Backend Complete Guide PDF."""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT = "docs/FoodHeaven_Backend_Complete_Guide.pdf"


def tbl(rows, widths=None):
    if widths is None:
        w = 170 * mm / max(len(rows[0]), 1)
        widths = [w] * len(rows[0])
    t = Table(rows, colWidths=widths, hAlign="LEFT", repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#9CA3AF")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return t


def code(text, style):
    return Preformatted(text.strip(), style)


def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=11 * mm,
        bottomMargin=11 * mm,
        title="FoodHeaven Backend Complete Guide",
    )
    ss = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=ss["Heading1"], fontSize=16, fontName="Helvetica-Bold", spaceAfter=6)
    h2 = ParagraphStyle("h2", parent=ss["Heading2"], fontSize=11, fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=3)
    h3 = ParagraphStyle("h3", parent=ss["Heading3"], fontSize=9.5, fontName="Helvetica-Bold", spaceBefore=4, spaceAfter=2)
    body = ParagraphStyle("body", parent=ss["Normal"], fontSize=8.5, leading=11, spaceAfter=3)
    cd = ParagraphStyle(
        "cd",
        parent=ss["Code"],
        fontName="Courier",
        fontSize=7.0,
        leading=8.5,
        backColor=colors.HexColor("#F3F4F6"),
        borderPadding=4,
    )

    s = []
    s.append(Paragraph("FoodHeaven Backend - Complete Guide", h1))
    s.append(
        Paragraph(
            "Node.js + Express 5 + MySQL 8 food-delivery REST API. "
            "This document explains architecture, startup flow, request lifecycle, "
            "every layer, database schema, authentication, order/checkout flow, "
            "middleware, error handling, and environment configuration.",
            body,
        )
    )

    # 1 OVERVIEW
    s.append(Paragraph("1. What the Backend Does", h2))
    s.append(
        Paragraph(
            "The backend serves the React frontend with restaurant catalog data, "
            "menus, authenticated order creation, and mock payment confirmation. "
            "It follows a layered architecture: Routes ? Controllers ? Services ? Repositories ? MySQL.",
            body,
        )
    )
    s.append(tbl([
        ["Capability", "Endpoint", "Auth"],
        ["Health check", "GET /health", "No"],
        ["API docs stub", "GET /api/docs", "No"],
        ["List restaurants", "GET /api/v1/restaurants", "No"],
        ["Restaurant menu", "GET /api/v1/restaurants/:id/menu", "No"],
        ["User login (JWT)", "POST /api/v1/auth/login", "No"],
        ["Dev JWT (local only)", "POST /api/v1/auth/dev-token", "No (404 in prod)"],
        ["Create order", "POST /api/v1/orders", "Bearer JWT required"],
        ["Confirm payment", "POST /api/v1/orders/:id/payments", "Bearer JWT required"],
    ]))

    # 2 PROJECT STRUCTURE
    s.append(Paragraph("2. Project Structure", h2))
    s.append(code("""
backend/
??? src/
?   ??? server.js              Entry point - DB check, init, migrate, listen
?   ??? app.js                 Express app - middleware, routes, error handlers
?   ??? config/
?   ?   ??? db.js              MySQL connection pool (mysql2/promise)
?   ?   ??? migrate.js         Startup schema patches (idempotency column)
?   ??? routes/v1/
?   ?   ??? restaurant.routes.js   Public read endpoints
?   ?   ??? auth.routes.js         JWT issuance (login + dev-token)
?   ?   ??? order.routes.js        Protected write endpoints
?   ??? controllers/           HTTP adapters (req/res only)
?   ??? services/              Business logic, transactions, pricing
?   ??? repositories/          Raw SQL queries
?   ??? middlewares/
?   ?   ??? auth.js            Bearer JWT verification
?   ?   ??? validate.js        Joi body validation factory
?   ?   ??? errorHandler.js    404 + global error JSON
?   ??? validators/            Joi schemas per domain
?   ??? utils/
?       ??? asyncHandler.js    Async error ? next(err)
?       ??? logger.js          Pino structured logger
??? db/
?   ??? schema.sql             Full DDL (restaurants, menus, orders, payments)
?   ??? seed.sql               Demo restaurant + menu data
??? scripts/init-db.js         First-boot schema + seed if DB empty
??? docker-compose.yml         MySQL + API container
??? package.json               npm scripts: dev, start, test
""", cd))

    s.append(PageBreak())

    # 3 STARTUP FLOW
    s.append(Paragraph("3. Server Startup Flow (server.js)", h2))
    s.append(
        Paragraph(
            "When you run npm run dev or npm start, server.js orchestrates boot in this order:",
            body,
        )
    )
    s.append(code("""
1. dotenv.config()           Load backend/.env into process.env
2. require('./app')          Build Express app (no listen yet)
3. pool.query('SELECT 1')    Fail fast if MySQL unreachable
4. initializeDatabaseIfEmpty(pool)
   ?? If restaurants table missing ? run db/schema.sql + db/seed.sql
5. runMigrations(pool, logger)
   ?? Patch older DBs (e.g. add orders.idempotency_key if missing)
6. app.listen(PORT)          Accept HTTP traffic (default port 5000)
""", cd))
    s.append(
        Paragraph(
            "init-db.js safety: only runs schema+seed when restaurants table does not exist. "
            "Existing production databases are never wiped. Incremental changes use migrate.js.",
            body,
        )
    )

    # 4 REQUEST LIFECYCLE
    s.append(Paragraph("4. HTTP Request Lifecycle (app.js)", h2))
    s.append(code("""
Incoming HTTP Request
        ?
        ?
?????????????????????????????????????????????????????????????
? 1. CORS          Allow frontend origin (CORS_ORIGIN env)    ?
? 2. Helmet        Security headers (XSS, clickjacking-)    ?
? 3. pino-http     Log request + assign x-request-id (UUID)   ?
? 4. express.json  Parse JSON body ? req.body               ?
? 5. rateLimit     Throttle /api/* (120 req/min default)      ?
?????????????????????????????????????????????????????????????
        ?
        ?
   Route matched?
   ??? GET /health        ? MySQL ping ? 200 or 503
   ??? GET /api/docs      ? OpenAPI-style JSON listing
   ??? /api/v1/*          ? Domain routers (restaurant/auth/order)
   ??? No match           ? notFoundHandler ? 404 JSON
        ?
        ? (on thrown error)
   errorHandler ? { success: false, message } + statusCode
""", cd))

    s.append(Paragraph("4.1 Layered Handler Chain (per route)", h3))
    s.append(code("""
Example: POST /api/v1/orders

Client
  ? authMiddleware        Verify Authorization: Bearer <token>
  ? validateBody(schema)  Joi validate req.body ? 400 or cleaned body
  ? asyncHandler(ctrl)    Catch async rejections ? errorHandler
  ? orderController       Parse headers/params, call service, shape JSON
  ? orderService          Business rules, pricing, DB transaction
  ? orderRepository       INSERT/SELECT SQL on shared connection
  ? MySQL
""", cd))

    s.append(PageBreak())

    # 5 RESTAURANT FLOW
    s.append(Paragraph("5. Restaurant & Menu Flow (Public)", h2))
    s.append(
        Paragraph(
            "Restaurant endpoints are public - no authentication. Data is shaped to match "
            "Swiggy-style JSON the React frontend expects.",
            body,
        )
    )
    s.append(tbl([
        ["Step", "File", "Action"],
        ["1", "restaurant.routes.js", "GET /restaurants or GET /restaurants/:id/menu"],
        ["2", "restaurant.controller.js", "Validate restaurantId param; return 400/404"],
        ["3", "restaurant.service.js", "Map DB rows ? Swiggy card shapes"],
        ["4", "restaurant.repository.js", "SELECT active restaurants / menu items"],
        ["5", "MySQL", "restaurants + menu_items tables"],
    ]))
    s.append(Paragraph("5.1 Response Shapes", h3))
    s.append(code("""
GET /api/v1/restaurants
? { success: true, data: [{ info: { id, name, cloudinaryImageId, avgRating, cuisines, sla- } }] }

GET /api/v1/restaurants/123/menu
? { success: true, data: { info: {...}, itemCards: [{ card: { info: { id, name, price- } } }] } }

Prices stored in DB as paise (INT); exposed to frontend as price/defaultPrice fields.
""", cd))

    # 6 AUTH
    s.append(Paragraph("6. Authentication Flow", h2))
    s.append(
        Paragraph(
            "Protected routes (orders, payments) require Authorization: Bearer <token>. "
            "Tokens are issued by auth routes and verified by authMiddleware.",
            body,
        )
    )
    s.append(tbl([
        ["Endpoint", "Purpose", "Production?"],
        ["POST /auth/login", "Email + name ? JWT (role: customer, 7d expiry)", "Yes"],
        ["POST /auth/dev-token", "devKey ? custom JWT (userId, role, 1h expiry)", "No (404)"],
    ]))
    s.append(Paragraph("6.1 authMiddleware Resolution Order", h3))
    s.append(code("""
1. Missing / non-Bearer header     ? 401
2. token === INTERNAL_API_TOKEN    ? req.user = { role: 'system' } (server-to-server)
3. jwt.verify(token, JWT_SECRET)   ? req.user = payload (sub, email, name, role)
4. Invalid/expired JWT             ? 401
""", cd))
    s.append(
        Paragraph(
            "Note: README mentions Auth0 for production frontend; authMiddleware currently "
            "verifies HS256 tokens signed with JWT_SECRET from /auth/login or /auth/dev-token.",
            body,
        )
    )

    s.append(PageBreak())

    # 7 ORDER FLOW
    s.append(Paragraph("7. Order Creation Flow (Detailed)", h2))
    s.append(code("""
POST /api/v1/orders
Headers: Authorization: Bearer <token>
         Idempotency-Key: <optional unique string>

Body: {
  items: [{ menuItemId, quantity }],
  paymentMethod: "card" | "cod" | "paytm",
  deliveryAddress: { name, email, number, address, pincode }
}
""", cd))
    s.append(Paragraph("7.1 order.service.createOrder Steps", h3))
    s.append(tbl([
        ["#", "Step", "Detail"],
        ["1", "Validate", "?1 item; complete delivery address; valid menuItemIds"],
        ["2", "Begin transaction", "pool.getConnection() + beginTransaction()"],
        ["3", "Idempotency", "If Idempotency-Key exists in DB ? return same order"],
        ["4", "Load menu prices", "SELECT active menu_items - client prices NOT trusted"],
        ["5", "Calculate totals", "subtotal + 5% tax + delivery fee (?40 if subtotal < ?300)"],
        ["6", "Insert order", "status PENDING, order_number TWG-{timestamp}"],
        ["7", "Insert order_items", "Snapshot name, unit_price, line_total"],
        ["8", "Insert payment", "status INITIATED, provider TWIGGY_MOCK_GATEWAY"],
        ["9", "Commit", "Return orderId, orderNumber, totals"],
    ]))
    s.append(Paragraph("7.2 Payment Confirmation Flow", h3))
    s.append(code("""
POST /api/v1/orders/:orderId/payments
Body: { status: "SUCCESS" | "FAILED", paymentRef?, provider? }

1. Load order by id ? 404 if missing
2. paymentStatus = SUCCESS or FAILED
3. orderStatus = PAID or FAILED
4. UPDATE payments SET payment_ref, status, paid_at = NOW()
5. UPDATE orders SET status
6. Return { orderId, orderNumber, paymentRef, paymentStatus, orderStatus }
""", cd))

    # 8 DATABASE
    s.append(PageBreak())
    s.append(Paragraph("8. Database Schema", h2))
    s.append(tbl([
        ["Table", "Purpose", "Key columns"],
        ["restaurants", "Catalog header", "id, name, cuisines (JSON), is_active, avg_rating"],
        ["menu_items", "Dishes per restaurant", "restaurant_id FK, price_paise, is_active"],
        ["orders", "Checkout header", "order_number, idempotency_key, totals, status"],
        ["order_items", "Line items snapshot", "order_id FK, menu_item_id, unit_price, quantity"],
        ["payments", "Payment record", "order_id FK, payment_ref, status, paid_at"],
    ]))
    s.append(Paragraph("8.1 Order Status Lifecycle", h3))
    s.append(code("""
Create order  ? orders.status = PENDING,  payments.status = INITIATED
Pay SUCCESS   ? orders.status = PAID,     payments.status = SUCCESS
Pay FAILED    ? orders.status = FAILED,     payments.status = FAILED
""", cd))
    s.append(Paragraph("8.2 Pricing Rules (server-side)", h3))
    s.append(code("""
unitPrice = menu_item.price_paise / 100  (or default_price_paise)
subtotal  = sum(unitPrice - quantity)
tax       = subtotal - 5%
delivery  = subtotal >= 300 ? 0 : 40 (INR)
total     = subtotal + tax + delivery
""", cd))

    # 9 MIDDLEWARE
    s.append(Paragraph("9. Middleware & Utilities", h2))
    s.append(tbl([
        ["File", "Purpose"],
        ["validate.js", "validateBody(schema) - Joi validate req.body, strip unknown, 400 on fail"],
        ["errorHandler.js", "notFoundHandler (404) + errorHandler (err.statusCode or 500)"],
        ["asyncHandler.js", "Wraps async controllers - rejected promises ? next(err)"],
        ["auth.js", "Bearer token extraction + JWT verify + INTERNAL_API_TOKEN bypass"],
        ["logger.js", "Pino JSON logger; level from LOG_LEVEL env"],
    ]))

    # 10 ERROR RESPONSES
    s.append(Paragraph("10. Error Response Format", h2))
    s.append(code("""
All errors return consistent JSON:
{ "success": false, "message": "Human readable message" }

Validation adds: "errors": ["field message 1", "field message 2"]

Sources:
  validate.js     ? 400 (validation failed)
  auth.js         ? 401 (missing/invalid token)
  controller      ? 400 (bad route params)
  service         ? 400/404 via buildHttpError(message, statusCode)
  notFoundHandler ? 404 (unknown route)
  unhandled       ? 500 (Internal server error)
""", cd))

    s.append(PageBreak())

    # 11 ENV
    s.append(Paragraph("11. Environment Variables", h2))
    s.append(tbl([
        ["Variable", "Purpose", "Default"],
        ["NODE_ENV", "development | production | test", "development"],
        ["PORT", "HTTP listen port", "5000"],
        ["CORS_ORIGIN", "Allowed frontend origin(s)", "http://localhost:3000"],
        ["DB_HOST/PORT/USER/PASSWORD/NAME", "MySQL connection", "-"],
        ["DATABASE_URL", "Alternative single connection string", "-"],
        ["JWT_SECRET", "Sign/verify login & dev tokens", "required"],
        ["JWT_EXPIRES_IN", "Token TTL", "7d (login), 1h (dev-token)"],
        ["DEV_AUTH_KEY", "Gate /auth/dev-token", "required for dev"],
        ["INTERNAL_API_TOKEN", "Optional server-to-server Bearer bypass", "optional"],
        ["RATE_LIMIT_WINDOW_MS", "Rate limit window", "60000"],
        ["RATE_LIMIT_MAX_REQUESTS", "Max requests per IP per window", "120"],
        ["LOG_LEVEL", "Pino log severity", "info"],
    ]))

    # 12 TESTING & DOCKER
    s.append(Paragraph("12. Testing & Deployment", h2))
    s.append(code("""
npm test              Unit tests (Jest + Supertest)
npm run test:integration   DB integration tests (order flow)

Docker: docker compose up --build
  ? MySQL container + API container

Health probe: GET /health
  ? { success, status: healthy|unhealthy, db: up|down, uptime }
""", cd))

    # 13 END-TO-END USER JOURNEY
    s.append(Paragraph("13. End-to-End Backend Journey", h2))
    s.append(code("""
???????????   GET /restaurants        ???????????
? Browser ? ????????????????????????? ? Express ? ??? MySQL restaurants
???????????                           ???????????
     ?
     ?  GET /restaurants/:id/menu
     ?
???????????   POST /auth/login        ???????????
? Browser ? ????????????????????????? ?  Auth   ? ??? JWT token
???????????                           ???????????
     ?
     ?  POST /orders + Bearer + Idempotency-Key
     ?
???????????                           ???????????
? Browser ? ????????????????????????? ?  Order  ? ??? TX: orders + items + payment
???????????                           ???????????
     ?
     ?  POST /orders/:id/payments
     ?
                              Order PAID / FAILED in MySQL
""", cd))

    # 14 FILE REFERENCE
    s.append(PageBreak())
    s.append(Paragraph("14. File-by-File Reference", h2))
    s.append(tbl([
        ["File", "Responsibility"],
        ["server.js", "Boot: env, DB ping, init-db, migrate, listen"],
        ["app.js", "Middleware stack, health, docs, mount routers, error handlers"],
        ["config/db.js", "mysql2 connection pool singleton"],
        ["config/migrate.js", "Idempotent ALTER on startup"],
        ["scripts/init-db.js", "First-run schema.sql + seed.sql"],
        ["routes/v1/*.routes.js", "URL paths + middleware chain per domain"],
        ["controllers/*.js", "HTTP I/O only - no SQL or pricing"],
        ["services/*.js", "Business logic, transactions, validation"],
        ["repositories/*.js", "Parameterized SQL queries"],
        ["validators/*.js", "Joi schemas for request bodies"],
        ["middlewares/auth.js", "JWT Bearer verification"],
        ["middlewares/validate.js", "Joi middleware factory"],
        ["middlewares/errorHandler.js", "404 + global error JSON"],
        ["utils/asyncHandler.js", "Async route error propagation"],
        ["utils/logger.js", "Pino logger instance"],
        ["db/schema.sql", "DDL source of truth"],
        ["db/seed.sql", "Demo data"],
    ]))

    s.append(Spacer(1, 8))
    s.append(
        Paragraph(
            "Generated from FoodHeaven backend source (Node + Express + MySQL). "
            "Run: python3 docs/generate_backend_guide_pdf.py",
            body,
        )
    )

    doc.build(s)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build()
