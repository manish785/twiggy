from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, Preformatted, SimpleDocTemplate, Spacer


OUTPUT_PATH = "docs/FoodHeaven_System_Design_Brief.pdf"


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="FoodHeaven System Design Brief",
        author="Codex",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#111827"),
        spaceAfter=8,
    )
    h2_style = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#111827"),
        spaceBefore=8,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=4,
    )
    code_style = ParagraphStyle(
        "CodeBlock",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.8,
        leading=11,
        leftIndent=6,
        rightIndent=6,
        backColor=colors.HexColor("#F3F4F6"),
        borderColor=colors.HexColor("#D1D5DB"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=6,
    )

    story = []
    story.append(Paragraph("FoodHeaven: System Design (HLD + LLD Brief)", title_style))
    story.append(
        Paragraph(
            "Stack: React + Redux frontend, Node.js + Express backend, MySQL database.",
            body_style,
        )
    )
    story.append(Spacer(1, 4))

    story.append(Paragraph("1) High-Level Design (HLD)", h2_style))
    story.append(
        Paragraph(
            "- Client Layer: React SPA handles browsing, cart, checkout, and confirmation flows.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- API Layer: Express REST endpoints for restaurants, orders, and auth token generation.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Business Layer: controllers + services enforce order/payment lifecycle and business checks.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Data Layer: MySQL stores restaurants, menu items, orders, and order items.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Platform Concerns: JWT auth, request validation, rate limiting, error middleware, structured logging.",
            body_style,
        )
    )

    hld_diagram = """[React Web App]
      |
      | HTTPS/REST
      v
[Express API Layer]
  |      |      |
  |      |      +--> Auth Module
  |      +---------> Order Module
  +----------------> Restaurant Module
              |
              v
           [MySQL DB]"""
    story.append(Preformatted(hld_diagram, code_style))

    story.append(Paragraph("2) Low-Level Design (LLD)", h2_style))
    story.append(
        Paragraph(
            "- Route Layer: endpoint mapping with middleware chain (auth + validation).",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Controller Layer: request parsing, response shaping, and service delegation.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Service Layer: business logic (order totals, payment status transitions, idempotency checks).",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Repository Layer: SQL access for restaurants, menu, orders, and order_items.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "- Middleware Layer: auth verification, Joi body validation, 404 + centralized error handling.",
            body_style,
        )
    )

    story.append(Paragraph("3) Core API Contract Snapshot", h2_style))
    story.append(Paragraph("- GET /api/v1/restaurants", body_style))
    story.append(Paragraph("- GET /api/v1/restaurants/:restaurantId/menu", body_style))
    story.append(Paragraph("- POST /api/v1/orders (JWT required)", body_style))
    story.append(Paragraph("- POST /api/v1/orders/:orderId/payments (JWT required)", body_style))
    story.append(Paragraph("- POST /api/v1/auth/dev-token (non-production)", body_style))

    story.append(Paragraph("4) Core Order Flow", h2_style))
    order_flow = """1. Client sends POST /orders with Bearer token.
2. Auth middleware verifies JWT.
3. Validation middleware enforces schema.
4. Controller invokes order service.
5. Service applies business checks and idempotency.
6. Repository writes order + order_items.
7. API returns created order response."""
    story.append(Preformatted(order_flow, code_style))

    story.append(Paragraph("5) NFRs and Scale Path", h2_style))
    story.append(Paragraph("- p95 browse API latency target: < 300ms.", body_style))
    story.append(Paragraph("- Availability target: 99.9% backend uptime.", body_style))
    story.append(Paragraph("- Horizontal scale via stateless API instances.", body_style))
    story.append(Paragraph("- Next upgrades: Redis cache, event-driven notifications, tracing.", body_style))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated: {OUTPUT_PATH}")
