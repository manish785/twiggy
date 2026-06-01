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


OUTPUT_PATH = "docs/FoodHeaven_System_Design_20_Questions.pdf"


QUESTIONS = [
    {
        "title": "Design Food Heaven (Zomato-like) at Scale",
        "difficulty": "Hard",
        "question": "Design an end-to-end food delivery platform: browse restaurants, cart, checkout, payment, order tracking, and delivery.",
        "components": [
            ["Layer", "Service", "Responsibility"],
            ["Client", "React Web / Mobile", "Browse, cart, checkout, live tracking UI"],
            ["Edge", "API Gateway", "Auth, rate limit, routing, TLS termination"],
            ["Core", "Restaurant, Menu, Order, Payment", "Catalog, cart checkout, order lifecycle"],
            ["Async", "Kafka / SQS", "Order events, notifications, analytics"],
            ["Data", "MySQL + Redis + S3", "Transactional data, cache, media assets"],
            ["Ops", "Delivery, Notification", "Rider assignment, push/SMS/email"],
        ],
        "flow": """User -> API Gateway -> Restaurant Service (list)
User -> Menu Service (items)
User -> Order Service (create) -> Payment Service
Order Service -> Event Bus -> Notification + Delivery Service
Delivery Service -> Tracking Service -> User (WebSocket/SSE)""",
        "answer": "Split read-heavy catalog from write-heavy order path. Use stateless APIs behind a load balancer. Persist orders in OLTP DB with idempotency keys. Push side effects (notify rider, send SMS) to async queues. Cache restaurant lists and menus in Redis. Start monolith-friendly (your Food Heaven stack) and extract services when traffic justifies it.",
    },
    {
        "title": "Restaurant Discovery Near User Location",
        "difficulty": "Medium",
        "question": "How do you show nearby open restaurants sorted by relevance (distance, rating, delivery time)?",
        "components": [
            ["Component", "Tech Choice", "Why"],
            ["Geo Index", "PostGIS / Redis GEO", "Fast radius queries by lat-lng"],
            ["Search", "Elasticsearch", "Filters: cuisine, veg, cost, offers"],
            ["Ranking", "Scoring service", "Weighted score: distance + ETA + rating"],
            ["Cache", "Redis (city shard)", "Hot listings per area"],
        ],
        "flow": """1. Client sends lat, lng, filters
2. Geo service returns restaurant IDs within radius
3. Ranking service scores and sorts
4. Paginated response with ETA + delivery fee""",
        "answer": "Use geospatial index for candidate set, not full table scan. Precompute popular area caches (e.g., 2 km grid). Ranking can be rule-based first (distance 40%, rating 30%, prep time 30%), ML later. Paginate with cursor/keyset for mobile scroll.",
    },
    {
        "title": "Menu Service & Real-Time Availability",
        "difficulty": "Medium",
        "question": "Design menu APIs when items go out-of-stock during peak hours.",
        "components": [
            ["Entity", "Storage", "Notes"],
            ["Restaurant", "MySQL", "Master profile"],
            ["Menu Category", "MySQL", "Normalized menu tree"],
            ["Menu Item", "MySQL + Redis cache", "Price, veg flag, image URL"],
            ["Inventory", "Redis / DB", "stock_flag updated by restaurant app"],
        ],
        "flow": """Restaurant app -> Inventory Service -> updates item availability
Menu read API -> Redis cache (TTL 5-15 min) + DB fallback
Order Service validates item availability at checkout time""",
        "answer": "Cache menu reads aggressively; invalidate on stock update events. Always re-validate availability at order placement (optimistic UI can show stale menu). Version menu snapshots on order so price changes do not break past orders.",
    },
    {
        "title": "Cart & Checkout Flow",
        "difficulty": "Medium",
        "question": "Design cart persistence across sessions and devices with promo codes.",
        "components": [
            ["Store", "Key", "TTL"],
            ["Guest cart", "Redis cart:{sessionId}", "7 days"],
            ["Logged-in cart", "Redis cart:{userId}", "30 days"],
            ["Promo engine", "Service + rules DB", "Validate min order, city, restaurant"],
        ],
        "flow": """Add item -> Cart Service (Redis)
Login -> merge guest cart into user cart
Checkout -> price breakdown service (items + tax + delivery + discount)
Place order -> cart cleared after successful order create""",
        "answer": "Keep cart in Redis for speed; merge on login. Compute totals server-side never trust client totals. Promo validation should be atomic at checkout. Handle concurrent updates with cart version or optimistic locking.",
    },
    {
        "title": "Order Placement with Idempotency",
        "difficulty": "Hard",
        "question": "Prevent duplicate orders when user taps Pay twice or network retries.",
        "components": [
            ["Mechanism", "Implementation", "Outcome"],
            ["Idempotency-Key", "Header per checkout attempt", "Same response on retry"],
            ["DB unique index", "(user_id, idempotency_key)", "Hard duplicate block"],
            ["State machine", "CREATED->PAID->CONFIRMED", "Legal transitions only"],
        ],
        "flow": """Client sends Idempotency-Key + cart snapshot
Order API checks key in Redis/DB
If exists -> return existing order
Else -> transaction: insert order + items + reserve inventory""",
        "answer": "Idempotency key is mandatory for POST /orders. Store mapping key->order_id with 24h TTL. Use DB transaction for order + order_items. Return 409 only when business rule fails, not on duplicate retry (return 200 with same order).",
    },
    {
        "title": "Payment System Integration",
        "difficulty": "Hard",
        "question": "Design payment flow supporting UPI, cards, COD with failure handling.",
        "components": [
            ["State", "Trigger", "Next State"],
            ["INITIATED", "User selects method", "PENDING"],
            ["PENDING", "Gateway callback", "SUCCESS / FAILED"],
            ["SUCCESS", "Webhook verified", "Order CONFIRMED"],
            ["FAILED", "Timeout or decline", "Order PAYMENT_FAILED"],
        ],
        "flow": """Create payment intent -> Payment Gateway (Razorpay/Stripe)
Async webhook -> verify signature -> update payment + order
Polling fallback for clients if webhook delayed""",
        "answer": "Never mark order paid on client callback alone. Verify gateway webhook with HMAC signature. Use outbox pattern: write payment event then publish to order service. Support reconciliation job for stuck PENDING payments.",
    },
    {
        "title": "Real-Time Order Tracking",
        "difficulty": "Medium",
        "question": "Show live order status: placed, preparing, picked up, on the way, delivered.",
        "components": [
            ["Channel", "Protocol", "Use Case"],
            ["Mobile/Web", "WebSocket or SSE", "Live status to user"],
            ["Backend", "Order State Service", "Source of truth for status"],
            ["Rider app", "GPS stream -> Kafka", "Location updates"],
        ],
        "flow": """State change -> Order Service updates DB
-> publishes OrderStatusUpdated event
-> Notification + Tracking fanout
Client subscribes -> receives push over WS/SSE""",
        "answer": "Order status is source of truth in DB; WebSocket is delivery channel only. On reconnect, client fetches current state via REST then subscribes. Throttle GPS updates (every 5-10 sec) to reduce cost.",
    },
    {
        "title": "Delivery Partner Assignment",
        "difficulty": "Hard",
        "question": "Assign nearest available rider when restaurant marks order ready.",
        "components": [
            ["Step", "Service", "Logic"],
            ["1", "Rider Location Service", "Redis GEO of online riders"],
            ["2", "Matcher", "Filter: free, same city, vehicle type"],
            ["3", "Allocator", "Score by distance + acceptance rate"],
            ["4", "Fallback", "Expand radius / surge incentive"],
        ],
        "flow": """ORDER_READY event -> Matcher picks top N riders
-> push offer to rider apps (30 sec timeout)
-> first accept wins -> assign rider_id to order""",
        "answer": "Treat assignment as competitive offer, not immediate bind. Use distributed lock per order during assignment. If no rider in 3-5 min, escalate radius or cancel with refund policy.",
    },
    {
        "title": "ETA Prediction (Delivery Time)",
        "difficulty": "Medium",
        "question": "Estimate 'Arrives in 32-40 min' before order placement.",
        "components": [
            ["Signal", "Weight", "Source"],
            ["Restaurant prep time", "35%", "Historical per restaurant"],
            ["Rider pickup distance", "25%", "Maps API / internal routing"],
            ["Traffic / weather", "15%", "External APIs"],
            ["Kitchen load (queue)", "25%", "Active orders count"],
        ],
        "flow": """ETA Service aggregates signals
-> returns range (p50, p90)
-> refresh ETA after rider assigned""",
        "answer": "Show range not single number to manage expectations. Recompute ETA on major state changes. Cache map distance matrix per zone. During rain/peak, apply multiplier from ops config.",
    },
    {
        "title": "Peak Hour & Lunch Rush",
        "difficulty": "Hard",
        "question": "Handle 10x traffic during 12-2 PM without outages.",
        "components": [
            ["Tactic", "Where", "Benefit"],
            ["Auto-scale API pods", "K8s HPA", "Handle request spike"],
            ["CDN + cache menus", "Edge", "Reduce origin load"],
            ["Queue order writes", "Kafka buffer", "Smooth DB spikes"],
            ["Circuit breaker", "Downstream calls", "Graceful degradation"],
            ["Dynamic surge", "Pricing service", "Demand shaping"],
        ],
        "flow": """Traffic spike -> scale replicas
-> serve reads from cache
-> shed non-critical features (recommendations)
-> rate limit abusive clients""",
        "answer": "Pre-warm cache before lunch. Load test at 3-5x expected QPS. Degrade gracefully: disable heavy features before core checkout fails. Use bulkhead pattern per dependency.",
    },
    {
        "title": "Database Design for Orders",
        "difficulty": "Medium",
        "question": "Design schema and scaling strategy for millions of daily orders.",
        "components": [
            ["Table", "Shard Key", "Notes"],
            ["orders", "user_id or city_id", "High write volume"],
            ["order_items", "order_id", "FK to orders"],
            ["payments", "order_id", "Separate for PCI boundaries"],
            ["order_status_history", "order_id", "Append-only audit trail"],
        ],
        "flow": """Write path -> primary shard
Read own orders -> user_id shard
Ops/admin analytics -> read replicas / OLAP""",
        "answer": "Start single MySQL with proper indexes. Shard by user_id or geo when single DB saturates. Archive orders older than 12-18 months to cold storage. Use read replicas for order history queries.",
    },
    {
        "title": "Search: Restaurant & Dish Autocomplete",
        "difficulty": "Medium",
        "question": "Design fast search as user types 'biryani near me'.",
        "components": [
            ["Index", "Fields", "Analyzer"],
            ["restaurants", "name, cuisine, tags", "Edge n-gram"],
            ["dishes", "name, restaurant_id", "Synonyms: biriyani/biryani"],
            ["Geo filter", "lat/lng", "Post-filter by distance"],
        ],
        "flow": """Query -> Elasticsearch
-> text score + geo boost
-> return top 10 restaurants + dishes
-> debounce client 300ms""",
        "answer": "Elasticsearch/OpenSearch for fuzzy + autocomplete. Combine text relevance with geo boost. Log zero-result queries for catalog gaps. Rate limit search API to prevent abuse.",
    },
    {
        "title": "Notification System",
        "difficulty": "Medium",
        "question": "Send push/SMS/email for order confirmed, rider assigned, delivered.",
        "components": [
            ["Channel", "Provider", "Priority"],
            ["Push (FCM/APNs)", "Firebase", "High"],
            ["SMS", "Twilio/MSG91", "Medium (OTP, critical)"],
            ["Email", "SES/SendGrid", "Low (receipts)"],
        ],
        "flow": """Order event -> Notification Service
-> template engine (per event type)
-> provider adapter -> retry with backoff
-> delivery log for support""",
        "answer": "Async only; never block order API on SMS. Template per locale. Idempotent notification_id per event. User preferences control marketing vs transactional channels.",
    },
    {
        "title": "Caching Strategy",
        "difficulty": "Easy",
        "question": "What to cache in a food delivery app and invalidation rules?",
        "components": [
            ["Data", "TTL", "Invalidation"],
            ["Restaurant list by zone", "5-10 min", "On restaurant status change"],
            ["Menu by restaurant", "15 min", "On menu/inventory update"],
            ["User session/profile", "30 min", "On logout/profile update"],
            ["ETA estimates", "1-2 min", "Time-based expiry"],
        ],
        "flow": """Cache-aside pattern:
Read -> Redis -> miss -> DB -> populate Redis
Write -> DB -> publish invalidation event""",
        "answer": "Cache reads not writes. Use cache-aside with TTL + event invalidation. Avoid caching personalized cart in CDN. Monitor hit ratio; stampede protection with request coalescing.",
    },
    {
        "title": "Reviews & Ratings",
        "difficulty": "Easy",
        "question": "Allow rating only after delivery; prevent fake reviews.",
        "components": [
            ["Rule", "Enforcement", "Reason"],
            ["Delivered orders only", "Check order status", "Authentic feedback"],
            ["One review per order", "Unique (user, order)", "No spam"],
            ["Moderation queue", "ML + manual", "Abuse detection"],
        ],
        "flow": """Delivery complete -> prompt review
POST /reviews with order_id
Service verifies eligibility -> store -> update aggregate rating async""",
        "answer": "Aggregate restaurant rating via async job (avg over last N reviews). Weight recent reviews higher. Separate food rating vs delivery rating for better insights.",
    },
    {
        "title": "Multi-City Expansion",
        "difficulty": "Hard",
        "question": "Launch Food Heaven in a new city with isolated config and ops.",
        "components": [
            ["Dimension", "Strategy", "Example"],
            ["Data residency", "City-based partitioning", "orders_mumbai"],
            ["Config", "Feature flags per city", "Surge, min order value"],
            ["Ops", "Local restaurant onboarding", "Separate admin portal"],
            ["DNS/Routing", "Geo DNS or city header", "Route to nearest region"],
        ],
        "flow": """New city -> seed restaurants + riders
-> enable city flag in gateway
-> monitor SLAs separately per city""",
        "answer": "Use city_id on all core entities early. Config service for fees, taxes, SLA. Start single region multi-city; split regions when latency/compliance requires.",
    },
    {
        "title": "Fraud & Abuse Prevention",
        "difficulty": "Medium",
        "question": "Detect promo abuse, fake orders, and payment fraud.",
        "components": [
            ["Threat", "Detection", "Action"],
            ["Promo farming", "Device fingerprint + velocity", "Block redeem"],
            ["COD abuse", "User history score", "Disable COD"],
            ["Payment fraud", "Gateway risk score", "Step-up verification"],
        ],
        "flow": """Checkout -> Risk Service score (0-100)
-> allow / challenge / block
-> audit log for ops""",
        "answer": "Rule engine first (new user + high discount + COD = flag). Integrate payment gateway risk APIs. Rate limit OTP and coupon APIs. Never expose internal risk score to client.",
    },
    {
        "title": "Event-Driven Architecture for Orders",
        "difficulty": "Hard",
        "question": "Use events so restaurant, rider, and customer apps stay in sync.",
        "components": [
            ["Event", "Consumers", "Purpose"],
            ["OrderCreated", "Restaurant, Analytics", "Kitchen ticket"],
            ["OrderPaid", "Delivery matcher", "Start prep workflow"],
            ["OrderReady", "Rider matcher", "Pickup assignment"],
            ["OrderDelivered", "Billing, Loyalty", "Close loop"],
        ],
        "flow": """Order Service writes DB + outbox table
Outbox relay -> Kafka topic order.events
Consumers process at-least-once with idempotent handlers""",
        "answer": "Transactional outbox avoids dual-write problem. Consumers must be idempotent (check processed event_id). Use dead-letter queue for failures. Schema versioning for events.",
    },
    {
        "title": "Observability & SLOs",
        "difficulty": "Medium",
        "question": "What metrics and alerts matter for a food delivery backend?",
        "components": [
            ["SLO", "Target", "Alert If"],
            ["Browse API p95", "< 300ms", "> 500ms for 5 min"],
            ["Order success rate", "> 99.5%", "Drops below 99%"],
            ["Payment success", "> 98%", "Gateway errors spike"],
            ["Assignment time", "< 5 min", "P95 > 8 min"],
        ],
        "flow": """Logs (JSON) -> ELK/Datadog
Metrics -> Prometheus/Grafana
Traces -> OpenTelemetry (order_id correlation)""",
        "answer": "Golden signals: latency, traffic, errors, saturation. Correlate logs with order_id and trace_id. Runbooks for payment gateway down and DB failover.",
    },
    {
        "title": "Migrate Food Heaven Monolith to Microservices",
        "difficulty": "Hard",
        "question": "Your current stack is React + Express + MySQL. How do you evolve safely?",
        "components": [
            ["Phase", "Action", "Risk"],
            ["1", "Extract Notification service", "Low"],
            ["2", "Extract Payment webhooks", "Medium"],
            ["3", "Split Order + Restaurant read APIs", "Medium"],
            ["4", "Separate Delivery service", "High"],
        ],
        "flow": """Strangler fig: route % traffic to new service via gateway
Shared DB initially -> split DB per service later
Contract tests between services""",
        "answer": "Do not microservice too early. Extract when team or scale pain is real. Keep API gateway stable for clients. Your Food Heaven backend already has routes/controllers/services - next step is async events, then extract payment and notifications first.",
    },
]


def make_table(rows, col_widths=None):
    if col_widths is None:
        usable = 170 * mm
        col_widths = [usable / len(rows[0])] * len(rows[0])
    t = Table(rows, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#9CA3AF")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
        title="Food Heaven System Design Interview Questions",
        author="Codex",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=21,
        textColor=colors.HexColor("#111827"),
        spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=8,
    )
    q_title = ParagraphStyle(
        "QTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#B45309"),
        spaceBefore=6,
        spaceAfter=3,
    )
    label = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        textColor=colors.HexColor("#111827"),
        spaceBefore=4,
        spaceAfter=2,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1F2937"),
    )
    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.2,
        leading=10.5,
        leftIndent=4,
        backColor=colors.HexColor("#F3F4F6"),
        borderPadding=5,
        spaceAfter=5,
    )

    story = []
    story.append(
        Paragraph(
            "Food Heaven / Zomato-Style: 20 System Design Interview Questions",
            title_style,
        )
    )
    story.append(
        Paragraph(
            "Tailored for food delivery apps (browse, cart, checkout, payment, tracking, delivery). "
            "Each question includes core components table, architecture flow, and interview answer outline. "
            "Maps to your stack: React + Redux, Node.js + Express, MySQL.",
            subtitle_style,
        )
    )

    for i, q in enumerate(QUESTIONS, start=1):
        story.append(
            Paragraph(
                f"Q{i}. {q['title']} <font color='#6B7280'>[{q['difficulty']}]</font>",
                q_title,
            )
        )
        story.append(Paragraph(f"<b>Question:</b> {q['question']}", body))
        story.append(Paragraph("Core Components", label))
        story.append(make_table(q["components"]))
        story.append(Spacer(1, 4))
        story.append(Paragraph("Architecture / Flow", label))
        story.append(Preformatted(q["flow"], code_style))
        story.append(Paragraph("How to Answer (Interview Outline)", label))
        story.append(Paragraph(q["answer"], body))
        if i % 2 == 0 and i < len(QUESTIONS):
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 6))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated: {OUTPUT_PATH}")
