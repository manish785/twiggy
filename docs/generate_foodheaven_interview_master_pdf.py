# -*- coding: utf-8 -*-
"""Generate Food Heaven complete interview master PDF (HLD, LLD, Schema, APIs)."""

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

OUTPUT = "docs/FoodHeaven_Interview_Master_HLD_LLD_Schema_APIs.pdf"


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
        title="Food Heaven Interview Master",
    )
    ss = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=ss["Heading1"], fontSize=16, fontName="Helvetica-Bold", spaceAfter=6)
    h2 = ParagraphStyle("h2", parent=ss["Heading2"], fontSize=11, fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=3)
    h3 = ParagraphStyle("h3", parent=ss["Heading3"], fontSize=9.5, fontName="Helvetica-Bold", spaceBefore=4, spaceAfter=2)
    body = ParagraphStyle("body", parent=ss["Normal"], fontSize=8.5, leading=11)
    lbl = ParagraphStyle("lbl", parent=ss["Normal"], fontSize=8.5, fontName="Helvetica-Bold", spaceBefore=3)
    cd = ParagraphStyle("cd", parent=ss["Code"], fontName="Courier", fontSize=7.2, leading=9, backColor=colors.HexColor("#F3F4F6"), borderPadding=4)

    s = []
    s.append(Paragraph("Food Heaven - Complete Interview Guide (SDE-1)", h1))
    s.append(Paragraph(
        "Zomato/Swiggy-style food delivery. Stack: React 18 + Redux Toolkit + Auth0 | Node.js + Express 5 + MySQL 8. "
        "Use this doc for HLD, LLD, DB schema, every API endpoint, flows, and interview depth.",
        body,
    ))

    # 1 OVERVIEW
    s.append(Paragraph("1. Project Overview", h2))
    s.append(tbl([
        ["Feature", "Implementation"],
        ["Browse restaurants", "GET /restaurants - Swiggy-shaped JSON"],
        ["View menu", "GET /restaurants/:id/menu"],
        ["Cart", "Redux in-memory (client only)"],
        ["Checkout", "Address form -> Redux deliveryAddress"],
        ["Place order", "POST /orders (JWT + Idempotency-Key)"],
        ["Payment", "POST /orders/:id/payments (mock gateway)"],
        ["Auth UI", "Auth0 (login/logout)"],
        ["Auth API", "JWT via POST /auth/dev-token (non-prod)"],
    ]))

    # 2 TECH STACK
    s.append(Paragraph("2. Tech Stack", h2))
    s.append(tbl([
        ["Layer", "Technology", "Purpose"],
        ["Frontend", "React 18, React Router 6", "SPA routing"],
        ["State", "Redux Toolkit", "Cart slice only"],
        ["UI Auth", "Auth0 React SDK", "User login"],
        ["HTTP Client", "axios", "API calls"],
        ["Bundler", "Parcel", "Dev/build"],
        ["Styling", "Tailwind CSS", "Responsive UI"],
        ["Backend", "Node 20, Express 5", "REST API"],
        ["DB", "MySQL 8 (mysql2 pool)", "Persistence"],
        ["Validation", "Joi", "Request body schemas"],
        ["Security", "Helmet, CORS, rate-limit", "HTTP hardening"],
        ["Logging", "Pino + pino-http", "Structured logs + request-id"],
        ["Tests", "Jest", "Unit + integration"],
        ["Deploy", "Docker Compose", "MySQL + API container"],
    ]))
    s.append(PageBreak())

    # 3 HLD
    s.append(Paragraph("3. High-Level Design (HLD)", h2))
    s.append(code("""
+------------------+       HTTPS/REST        +---------------------------+
|  React Web App   | ----------------------> |  Express API (port 5000)  |
|  Auth0 + Redux   |                         |  /api/v1/*                |
+------------------+                         +-------------+-------------+
      |                                                    |
      |  Public reads                                      |  Protected writes
      v                                                    v
 GET /restaurants                              POST /orders, /payments
 GET /restaurants/:id/menu                     POST /auth/dev-token (dev)
                                                    |
                                                    v
                                              +-------------+
                                              |  MySQL 8    |
                                              | foodheaven_db|
                                              +-------------+
""", cd))
    s.append(Paragraph("3.1 HLD Building Blocks", h3))
    s.append(tbl([
        ["Block", "Responsibility", "Scaling Note"],
        ["Client Layer", "Browse, cart, checkout, payment UI", "CDN for static assets"],
        ["API Gateway Layer", "Express app, CORS, rate limit, routing", "Stateless horizontal scale"],
        ["Auth Module", "JWT verify, dev token, internal token", "No user DB - stateless JWT"],
        ["Restaurant Module", "List + menu (read-heavy)", "Redis cache candidate"],
        ["Order Module", "Create order, pricing, idempotency", "DB transactions"],
        ["Payment Module", "Mock confirm (TWIGGY_MOCK_GATEWAY)", "Replace with real gateway"],
        ["Data Layer", "MySQL OLTP", "Read replicas later"],
    ]))
    s.append(Paragraph("3.2 Core User Flows", h3))
    s.append(code("""
Browse:  Home -> GET /restaurants -> filter/search client-side -> click card
Menu:    /restaurants/:resId -> GET menu -> addToCart (Redux)
Cart:    /cart -> /checkout (address) -> /payment
Order:   ensureSessionToken -> POST /orders -> POST /payments -> /payment/confirm
""", cd))

    # 4 LLD
    s.append(Paragraph("4. Low-Level Design (LLD)", h2))
    s.append(Paragraph("4.1 Backend Layered Architecture", h3))
    s.append(code("""
Request -> Route -> [authMiddleware] -> [validateBody(Joi)] -> Controller
         -> Service (business logic, transaction) -> Repository (SQL) -> MySQL
         -> Response { success, message?, data }
Errors  -> asyncHandler -> errorHandler (statusCode, message)
""", cd))
    s.append(tbl([
        ["Folder", "Files", "Role"],
        ["routes/v1/", "restaurant, order, auth.routes", "HTTP mapping + middleware chain"],
        ["controllers/", "order, restaurant.controller", "Parse req, HTTP status, JSON envelope"],
        ["services/", "order, restaurant.service", "Pricing, idempotency, DTO mapping"],
        ["repositories/", "order, restaurant.repository", "Parameterized SQL queries"],
        ["middlewares/", "auth, validate, errorHandler", "Cross-cutting concerns"],
        ["validators/", "order, auth.validator", "Joi schemas"],
        ["config/", "db.js, migrate.js", "Connection pool"],
        ["utils/", "asyncHandler, logger", "Helpers"],
    ]))
    s.append(Paragraph("4.2 Frontend Structure", h3))
    s.append(tbl([
        ["Path", "Component", "Responsibility"],
        ["src/App.js", "Router + providers", "Auth0, Redux, routes"],
        ["components/Body.js", "Home", "Restaurant list + filters"],
        ["components/RestaurantMenu.js", "Menu page", "Fetch menu, add to cart"],
        ["components/Cart.js", "Cart", "Display items, link checkout"],
        ["components/Checkout.js", "Checkout", "Address -> Redux"],
        ["Pages/PaymentPage/", "Payment", "Order + payment API calls"],
        ["utils/useRestaurants.js", "Hook", "GET restaurants"],
        ["utils/useRestaurantMenu.js", "Hook", "GET menu by resId"],
        ["utils/sessionAuth.js", "Auth helper", "Dev JWT in sessionStorage"],
        ["redux/CartPage/", "reducer, actions", "Cart state machine"],
    ]))
    s.append(PageBreak())

    # 5 SCHEMA
    s.append(Paragraph("5. Database Schema (MySQL - foodheaven_db)", h2))
    s.append(Paragraph("5.1 ER Relationships", h3))
    s.append(code("""
restaurants (1) ----< menu_items (many)
orders (1) ----< order_items (many) >---- menu_items
orders (1) ----< payments (many, typically 1)
Note: No users table. Customer info stored on orders row.
""", cd))

    tables_schema = [
        ("restaurants", [
            ["Column", "Type", "Constraints"],
            ["id", "BIGINT", "PRIMARY KEY"],
            ["name", "VARCHAR(150)", "NOT NULL"],
            ["cloudinary_image_id", "VARCHAR(255)", "NULL"],
            ["locality", "VARCHAR(120)", "NULL"],
            ["area_name", "VARCHAR(120)", "NULL"],
            ["avg_rating", "DECIMAL(3,2)", "DEFAULT 0.00"],
            ["cost_for_two_message", "VARCHAR(60)", "NULL"],
            ["is_open", "TINYINT(1)", "DEFAULT 1"],
            ["delivery_time_minutes", "INT", "DEFAULT 30"],
            ["cuisines", "JSON", "NOT NULL"],
            ["is_active", "TINYINT(1)", "DEFAULT 1"],
            ["created_at, updated_at", "TIMESTAMP", "auto"],
        ]),
        ("menu_items", [
            ["Column", "Type", "Constraints"],
            ["id", "BIGINT", "PK AUTO_INCREMENT"],
            ["restaurant_id", "BIGINT", "FK -> restaurants ON DELETE CASCADE"],
            ["name", "VARCHAR(150)", "NOT NULL"],
            ["image_id", "VARCHAR(255)", "NULL"],
            ["price_paise", "INT", "NULL (19900 = Rs 199)"],
            ["default_price_paise", "INT", "NULL fallback"],
            ["rating", "DECIMAL(3,2)", "NULL"],
            ["is_active", "TINYINT(1)", "DEFAULT 1"],
            ["created_at, updated_at", "TIMESTAMP", "auto"],
            ["INDEX", "idx_menu_restaurant_id", "restaurant_id"],
        ]),
        ("orders", [
            ["Column", "Type", "Constraints"],
            ["id", "BIGINT", "PK AUTO_INCREMENT"],
            ["order_number", "VARCHAR(30)", "UNIQUE (TWG-timestamp)"],
            ["idempotency_key", "VARCHAR(80)", "UNIQUE NULL"],
            ["customer_name", "VARCHAR(120)", "NOT NULL"],
            ["customer_email", "VARCHAR(180)", "NOT NULL"],
            ["customer_phone", "VARCHAR(20)", "NOT NULL"],
            ["delivery_address", "VARCHAR(255)", "NOT NULL"],
            ["delivery_pincode", "VARCHAR(12)", "NOT NULL"],
            ["payment_method", "VARCHAR(30)", "CARD/COD/PAYTM"],
            ["subtotal_amount", "DECIMAL(10,2)", "NOT NULL"],
            ["tax_amount", "DECIMAL(10,2)", "NOT NULL"],
            ["delivery_fee", "DECIMAL(10,2)", "NOT NULL"],
            ["total_amount", "DECIMAL(10,2)", "NOT NULL"],
            ["status", "VARCHAR(20)", "PENDING -> PAID/FAILED"],
            ["created_at, updated_at", "TIMESTAMP", "auto"],
        ]),
        ("order_items", [
            ["Column", "Type", "Constraints"],
            ["id", "BIGINT", "PK AUTO_INCREMENT"],
            ["order_id", "BIGINT", "FK -> orders CASCADE"],
            ["menu_item_id", "BIGINT", "FK -> menu_items RESTRICT"],
            ["item_name", "VARCHAR(150)", "Snapshot at order time"],
            ["unit_price", "DECIMAL(10,2)", "NOT NULL"],
            ["quantity", "INT", "NOT NULL"],
            ["line_total", "DECIMAL(10,2)", "NOT NULL"],
            ["INDEX", "idx_order_items_order_id", "order_id"],
        ]),
        ("payments", [
            ["Column", "Type", "Constraints"],
            ["id", "BIGINT", "PK AUTO_INCREMENT"],
            ["order_id", "BIGINT", "FK -> orders CASCADE"],
            ["payment_ref", "VARCHAR(60)", "UNIQUE NULL"],
            ["provider", "VARCHAR(80)", "TWIGGY_MOCK_GATEWAY"],
            ["payment_method", "VARCHAR(30)", "NOT NULL"],
            ["amount", "DECIMAL(10,2)", "NOT NULL"],
            ["status", "VARCHAR(20)", "INITIATED -> SUCCESS/FAILED"],
            ["paid_at", "TIMESTAMP", "NULL until paid"],
            ["INDEX", "idx_payments_order_id", "order_id"],
        ]),
    ]
    for name, rows in tables_schema:
        s.append(Paragraph(f"5.{tables_schema.index((name, rows)) + 2} Table: {name}", h3))
        s.append(tbl(rows))
        s.append(Spacer(1, 3))

    s.append(Paragraph("5.8 Seed Data", h3))
    s.append(Paragraph("20 restaurants + 22 menu items in db/seed.sql. Prices stored in paise. ON DUPLICATE KEY UPDATE for restaurants.", body))
    s.append(PageBreak())

    # 6 APIs
    s.append(Paragraph("6. Complete API Reference", h2))
    s.append(tbl([
        ["#", "Method", "Path", "Auth", "Purpose"],
        ["1", "GET", "/health", "No", "Liveness probe"],
        ["2", "GET", "/api/docs", "No", "OpenAPI stub JSON"],
        ["3", "GET", "/api/v1/restaurants", "No", "List active restaurants"],
        ["4", "GET", "/api/v1/restaurants/:restaurantId/menu", "No", "Menu + restaurant info"],
        ["5", "POST", "/api/v1/auth/dev-token", "No*", "JWT for dev (*404 in prod)"],
        ["6", "POST", "/api/v1/orders", "Bearer JWT", "Create order"],
        ["7", "POST", "/api/v1/orders/:orderId/payments", "Bearer JWT", "Confirm mock payment"],
    ], [8 * mm, 14 * mm, 52 * mm, 18 * mm, 78 * mm]))

    api_details = [
        ("GET /health", "200", '{ "success": true, "message": "...", "uptime": <sec> }'),
        ("GET /api/v1/restaurants", "200", '{ "success": true, "data": [{ "info": { id, name, avgRating, cuisines, sla, ... } }] }'),
        ("GET /api/v1/restaurants/:id/menu", "200/404", '{ "success": true, "data": { "info": {...}, "itemCards": [...] } }'),
        ("POST /api/v1/auth/dev-token", "200", 'Body: { devKey, userId?, email?, role? } -> { token }'),
        ("POST /api/v1/orders", "201", 'Header: Authorization, Idempotency-Key. Body: items[], paymentMethod, deliveryAddress'),
        ("POST /api/v1/orders/:id/payments", "200", 'Body: { status: SUCCESS|FAILED, paymentRef?, provider? }'),
    ]
    s.append(Paragraph("6.1 Request / Response Details", h3))
    for ep, status, detail in api_details:
        s.append(Paragraph(f"<b>{ep}</b> [{status}]", lbl))
        s.append(Paragraph(detail, body))

    s.append(Paragraph("6.2 POST /orders - Full Request Body", h3))
    s.append(code("""
{
  "items": [ { "menuItemId": 1, "quantity": 2 } ],
  "paymentMethod": "card" | "cod" | "paytm",
  "deliveryAddress": {
    "name": "Manish", "email": "user@mail.com",
    "number": "9876543210", "address": "Flat 12, MG Road",
    "pincode": "411001"
  }
}
Headers: Authorization: Bearer <JWT>
         Idempotency-Key: <uuid> (optional, prevents duplicate orders)
""", cd))

    s.append(Paragraph("6.3 POST /orders - Response (201)", h3))
    s.append(code("""
{
  "success": true, "message": "Order created successfully",
  "data": {
    "orderId": 42, "orderNumber": "TWG-1716980000000",
    "totalAmount": 458.95, "subtotalAmount": 398.00,
    "taxAmount": 19.90, "deliveryFee": 40.00,
    "status": "PENDING", "isIdempotentReplay": false
  }
}
""", cd))

    s.append(Paragraph("6.4 Pricing Rules (Server-Side - Never Trust Client)", h3))
    s.append(tbl([
        ["Rule", "Formula"],
        ["Unit price", "price_paise or default_price_paise / 100"],
        ["Subtotal", "SUM(unit_price * quantity)"],
        ["Tax", "5% of subtotal"],
        ["Delivery fee", "Rs 0 if subtotal >= 300, else Rs 40"],
        ["Total", "subtotal + tax + delivery_fee"],
        ["Order number", "TWG-<timestamp>"],
    ]))

    s.append(Paragraph("6.5 Status State Machine", h3))
    s.append(code("""
Order:   PENDING --payment SUCCESS--> PAID
                 --payment FAILED--> FAILED
Payment: INITIATED (on order create) --> SUCCESS | FAILED (on confirm API)
""", cd))
    s.append(PageBreak())

    # 7 FRONTEND ROUTES
    s.append(Paragraph("7. Frontend Routes & Redux", h2))
    s.append(tbl([
        ["Route", "Component", "Backend Call"],
        ["/", "Body", "GET /restaurants"],
        ["/restaurants/:resId", "RestaurantMenu", "GET /menu"],
        ["/cart", "Cart", "Redux only"],
        ["/checkout", "Checkout", "Redux Address()"],
        ["/payment", "PaymentPage", "POST /orders + /payments"],
        ["/payment/confirm", "PaymentConfirm", "Shows orderNumber"],
        ["/login", "Login", "Auth0 redirect"],
        ["/about", "About (lazy)", "GitHub API"],
        ["/contact", "Contact", "None (client form)"],
        ["/grocery", "Grocery (lazy)", "Static UI only"],
    ]))

    s.append(Paragraph("7.1 Redux Cart State", h3))
    s.append(code("""
State: { loading, data[], itemCount, totalCartPrice, deliveryAddress{} }
Actions: addToCart | manageQuantityOfData | removeItem | Address
         | successPayment | clearCart
Reducer: merge items by id, recalc totals, reset on payment success
""", cd))

    s.append(Paragraph("7.2 Frontend API Constants", h3))
    s.append(tbl([
        ["Constant", "URL"],
        ["API_BASE_URL", "REACT_APP_API_BASE_URL or localhost:5000/api/v1"],
        ["GET_RESTAURANTS_URL", "/restaurants"],
        ["getRestaurantMenuUrl(id)", "/restaurants/{id}/menu"],
        ["CREATE_ORDER_URL", "/orders"],
        ["getConfirmPaymentUrl(id)", "/orders/{id}/payments"],
        ["DEV_TOKEN_URL", "/auth/dev-token"],
    ]))

    # 8 FLOWS
    s.append(Paragraph("8. Sequence Flows", h2))
    s.append(Paragraph("8.1 Auth Flow (Dual Layer)", h3))
    s.append(code("""
Layer 1 - Auth0: User clicks Login -> Auth0 hosted page -> redirect back with session
Layer 2 - Backend JWT: Payment page calls ensureSessionToken()
  -> POST /auth/dev-token { devKey, userId: auth0.sub, email, role: customer }
  -> stores token in sessionStorage key: foodheaven_session_jwt
  -> Authorization: Bearer <token> on order APIs
Production: dev-token returns 404; use real auth service instead.
""", cd))

    s.append(Paragraph("8.2 Order Create Flow (Transaction)", h3))
    s.append(code("""
1. authMiddleware verifies JWT
2. validateBody(createOrderSchema) - Joi
3. order.service.createOrder():
   a. Check idempotency_key -> return existing if found
   b. BEGIN TRANSACTION
   c. Validate menu_item_ids exist and active
   d. Compute pricing server-side
   e. INSERT orders (status PENDING)
   f. INSERT order_items (price snapshot)
   g. INSERT payments (status INITIATED)
   h. COMMIT
4. Return 201 with orderId, totals
""", cd))

    s.append(Paragraph("8.3 Payment Confirm Flow", h3))
    s.append(code("""
1. Client POST /orders/:orderId/payments { status: SUCCESS, provider: TWIGGY_MOCK_GATEWAY }
2. Service finds order, updates payments row (payment_ref, paid_at)
3. Updates orders.status -> PAID (or FAILED)
4. Frontend dispatches successPayment() -> clears cart -> /payment/confirm
""", cd))
    s.append(PageBreak())

    # 9 VALIDATION & SECURITY
    s.append(Paragraph("9. Validation (Joi Schemas)", h2))
    s.append(tbl([
        ["Schema", "Fields"],
        ["createDevTokenSchema", "devKey required; userId, email, role optional"],
        ["createOrderSchema", "items[] min 1; menuItemId +; quantity >= 1; paymentMethod enum; deliveryAddress all required"],
        ["confirmPaymentSchema", "status SUCCESS|FAILED; paymentRef, provider optional"],
    ]))
    s.append(Paragraph("validate.js: abortEarly=false, stripUnknown=true -> 400 with errors[]", body))

    s.append(Paragraph("10. Security & Middleware", h2))
    s.append(tbl([
        ["Control", "Implementation"],
        ["Authentication", "JWT Bearer; optional INTERNAL_API_TOKEN bypass"],
        ["Authorization", "All order/payment routes require auth"],
        ["Rate limiting", "120 req/min on /api/* (configurable)"],
        ["CORS", "CORS_ORIGIN env (default localhost:1234)"],
        ["Headers", "Helmet security headers"],
        ["Input validation", "Joi on POST bodies"],
        ["SQL injection", "Parameterized queries in repositories"],
        ["Idempotency", "Idempotency-Key header + UNIQUE DB column"],
        ["Logging", "Pino JSON + x-request-id per request"],
    ]))

    s.append(Paragraph("11. Error Handling", h2))
    s.append(tbl([
        ["Source", "Response Format"],
        ["Joi validation", "400 { success:false, message, errors[] }"],
        ["authMiddleware", "401 { success:false, message }"],
        ["Service buildHttpError", "4xx/5xx via errorHandler"],
        ["errorHandler", "{ success:false, message } - no stack in prod response"],
        ["notFoundHandler", "404 unknown routes"],
    ]))

    s.append(Paragraph("12. Environment Variables", h2))
    s.append(tbl([
        ["Variable", "Purpose", "Default"],
        ["NODE_ENV", "environment", "development"],
        ["PORT", "server port", "5000"],
        ["DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME", "MySQL", "localhost/foodheaven_db"],
        ["JWT_SECRET, JWT_EXPIRES_IN", "JWT sign/verify", "1h"],
        ["DEV_AUTH_KEY", "dev-token endpoint", "-"],
        ["INTERNAL_API_TOKEN", "optional static bearer", "-"],
        ["CORS_ORIGIN", "allowed origin", "localhost:1234"],
        ["RATE_LIMIT_WINDOW_MS", "rate limit window", "60000"],
        ["RATE_LIMIT_MAX_REQUESTS", "max requests", "120"],
        ["REACT_APP_API_BASE_URL", "frontend API base", "localhost:5000/api/v1"],
        ["REACT_APP_DEV_AUTH_KEY", "frontend dev key", ""],
    ]))

    s.append(Paragraph("13. Docker & Deployment", h2))
    s.append(code("""
docker-compose.yml:
  mysql:8.0  -> port 3306, init schema.sql + seed.sql
  backend    -> Node 20 alpine, port 5000, depends on mysql
Dockerfile: npm ci --omit=dev, CMD npm start
Health: GET /health for k8s/load balancer probes
""", cd))

    s.append(Paragraph("14. Testing", h2))
    s.append(tbl([
        ["Test File", "Type", "Covers"],
        ["order-security.test.js", "Unit", "Auth middleware, Joi schemas"],
        ["order.integration.test.js", "Integration", "Full order + payment -> PAID"],
        ["Header.test.js", "Frontend", "Login button, cart link"],
        ["Search.test.js", "Frontend", "Body search input"],
        ["Contact.test.js", "Frontend", "Contact form"],
        ["RestaurantCard.test.js", "Frontend", "Card renders name"],
    ]))
    s.append(PageBreak())

    # INTERVIEW
    s.append(Paragraph("15. SDE-1 Interview Talking Points", h2))
    points = [
        "Why no users table? Auth0 handles identity; order stores customer snapshot for fulfillment.",
        "Why price in paise? Avoid floating-point errors; divide by 100 at runtime.",
        "Why item_name snapshot in order_items? Menu price/name can change later; order history stays accurate.",
        "Why idempotency key? Network retries on mobile can duplicate orders without it.",
        "Why server-side pricing? Client totals can be tampered; backend is source of truth.",
        "Why mock payment? Demo project; production would use Razorpay/Stripe webhooks.",
        "Why Redux only for cart? Cart is ephemeral UI state; order persistence is backend.",
        "Why Swiggy-shaped JSON? Frontend migrated from Swiggy API mock; backend mirrors that contract.",
        "How to scale reads? Redis cache on GET /restaurants and /menu with TTL + invalidation.",
        "How to scale writes? Shard orders by user_id or city when single MySQL saturates.",
        "What is missing for production? Real payment webhooks, user service, order tracking, rider assignment, notifications.",
        "Transaction boundary? Single MySQL transaction wraps order + items + payment insert.",
        "FK ON DELETE RESTRICT on menu_item_id? Prevents deleting menu items referenced by past orders.",
    ]
    for p in points:
        s.append(Paragraph(f"- {p}", body))

    s.append(Paragraph("16. Quick Revision Checklist", h2))
    s.append(tbl([
        ["Topic", "Must Know"],
        ["Tables", "5 tables: restaurants, menu_items, orders, order_items, payments"],
        ["APIs", "7 endpoints (2 public catalog, 2 protected transactional, 1 health, 1 docs, 1 dev auth)"],
        ["Order status", "PENDING -> PAID | FAILED"],
        ["Payment status", "INITIATED -> SUCCESS | FAILED"],
        ["Tax", "5%"],
        ["Free delivery", "subtotal >= 300"],
        ["Auth", "Auth0 UI + JWT API"],
        ["Layers", "Route -> Middleware -> Controller -> Service -> Repository"],
    ]))

    doc.build(s)
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    build()
