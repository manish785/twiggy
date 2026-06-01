from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, Preformatted, SimpleDocTemplate, Spacer


OUTPUT_PATH = "docs/FoodHeaven_System_Design_Diagrams.pdf"


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
        title="FoodHeaven System Design Diagrams",
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
    h2_style = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#111827"),
        spaceBefore=7,
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=9.8,
        leading=13,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=3,
    )
    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.3,
        leading=10.8,
        leftIndent=4,
        rightIndent=4,
        backColor=colors.HexColor("#F9FAFB"),
        borderColor=colors.HexColor("#D1D5DB"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=5,
    )

    story = []
    story.append(Paragraph("FoodHeaven: Proper System Design Diagrams", title_style))
    story.append(Paragraph("Very brief HLD + LLD for your current React + Node + MySQL project.", body_style))
    story.append(Spacer(1, 3))

    story.append(Paragraph("1) HLD Diagram", h2_style))
    story.append(Paragraph("Purpose: show core system blocks and request flow.", body_style))
    hld = """+------------------+         HTTPS/REST         +------------------------+
|  React Web App   | -------------------------> |    Express Backend      |
|  (UI + Redux)    |                            |  /api/v1 routes layer   |
+------------------+                            +-----------+------------+
                                                            |
                                                            v
                                                +------------------------+
                                                |  Services + Repos      |
                                                |  (business + SQL)      |
                                                +-----------+------------+
                                                            |
                                                            v
                                                +------------------------+
                                                |       MySQL DB         |
                                                | restaurants/orders/... |
                                                +------------------------+"""
    story.append(Preformatted(hld, code_style))

    story.append(Paragraph("2) LLD Component Diagram", h2_style))
    story.append(Paragraph("Purpose: show backend internal layering.", body_style))
    lld = """[Routes]
   |-- restaurant.routes
   |-- order.routes
   |-- auth.routes
      |
      v
[Middlewares] --> auth / validate / errorHandler
      |
      v
[Controllers]
      |
      v
[Services]
      |
      v
[Repositories]
      |
      v
[MySQL tables: restaurants, menu_items, orders, order_items]"""
    story.append(Preformatted(lld, code_style))

    story.append(Paragraph("3) Sequence Diagram (Place Order)", h2_style))
    story.append(Paragraph("Purpose: show step-by-step order creation.", body_style))
    seq = """Client -> API: POST /api/v1/orders (Bearer token)
API -> AuthMiddleware: verify JWT
AuthMiddleware -> API: user context
API -> ValidateMiddleware: validate createOrderSchema
ValidateMiddleware -> API: payload valid
API -> OrderController: createOrder(req)
OrderController -> OrderService: apply business checks
OrderService -> OrderRepository: insert order + order_items
OrderRepository -> DB: COMMIT transaction
DB -> API: created order id
API -> Client: 201 Created + order summary"""
    story.append(Preformatted(seq, code_style))

    story.append(Paragraph("4) Deployment Diagram (Current Local Setup)", h2_style))
    story.append(Paragraph("Purpose: show runtime nodes.", body_style))
    deploy = """+--------------------+        +----------------------------+
| Browser (localhost)| -----> | Frontend Dev Server :3000 |
+--------------------+        +----------------------------+
                                         |
                                         | API calls
                                         v
                            +----------------------------+
                            | Backend Server :5000       |
                            | Node + Express             |
                            +-------------+--------------+
                                          |
                                          v
                            +----------------------------+
                            | MySQL Server :3306         |
                            +----------------------------+"""
    story.append(Preformatted(deploy, code_style))

    story.append(Paragraph("5) Brief Notes", h2_style))
    story.append(Paragraph("- Security: JWT auth for order/payment APIs, validation, rate limit.", body_style))
    story.append(Paragraph("- Scale next: Redis for restaurant/menu reads, horizontal API replicas.", body_style))
    story.append(Paragraph("- Reliability: idempotency key on order creation avoids duplicate charges.", body_style))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated: {OUTPUT_PATH}")
