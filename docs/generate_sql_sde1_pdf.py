from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    Paragraph,
    Table,
    TableStyle,
    Preformatted,
    PageBreak,
)


OUTPUT_PATH = "docs/SQL_SDE1_Backend_20_Questions.pdf"


QUESTIONS = [
    {
        "title": "Second Highest Salary",
        "question": "Find the second highest salary from the employees table.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["id", "INT", "Primary key"],
            ["name", "VARCHAR", "Employee name"],
            ["salary", "NUMERIC", "Monthly salary"],
        ],
        "query": """SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);""",
        "explanation": "The inner query finds the highest salary; the outer query gets the maximum value below it. This safely handles duplicate top salaries.",
    },
    {
        "title": "Top 3 Salaries Per Department",
        "question": "Return top 3 highest paid employees in each department.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["id", "INT", "Primary key"],
            ["name", "VARCHAR", "Employee name"],
            ["department_id", "INT", "Department FK"],
            ["salary", "NUMERIC", "Monthly salary"],
        ],
        "query": """SELECT id, name, department_id, salary
FROM (
  SELECT e.*,
         DENSE_RANK() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
         ) AS rnk
  FROM employees e
) x
WHERE rnk <= 3
ORDER BY department_id, salary DESC;""",
        "explanation": "DENSE_RANK within each department ranks salaries in descending order. Filtering rank <= 3 returns top earners including ties.",
    },
    {
        "title": "Running Revenue Per Customer",
        "question": "Compute running total order amount for each customer over time.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["order_id", "INT", "Primary key"],
            ["customer_id", "INT", "Customer FK"],
            ["order_ts", "TIMESTAMP", "Order creation time"],
            ["total_amount", "NUMERIC", "Order total"],
        ],
        "query": """SELECT customer_id,
       order_id,
       order_ts,
       total_amount,
       SUM(total_amount) OVER (
         PARTITION BY customer_id
         ORDER BY order_ts
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM orders
ORDER BY customer_id, order_ts;""",
        "explanation": "Window SUM accumulates spend customer-wise in chronological order, useful for LTV milestones and personalization triggers.",
    },
    {
        "title": "Month-1 Retention",
        "question": "Calculate month-1 retention: users active in signup month and next month.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["user_id", "INT", "User identifier"],
            ["activity_ts", "TIMESTAMP", "User activity event time"],
        ],
        "query": """WITH activity_months AS (
  SELECT user_id, DATE_TRUNC('month', activity_ts) AS m
  FROM user_activity
  GROUP BY user_id, DATE_TRUNC('month', activity_ts)
),
cohorts AS (
  SELECT user_id, MIN(m) AS cohort_month
  FROM activity_months
  GROUP BY user_id
)
SELECT c.cohort_month,
       COUNT(*) AS cohort_size,
       COUNT(*) FILTER (
         WHERE am_next.user_id IS NOT NULL
       ) AS retained_users,
       ROUND(
         100.0 * COUNT(*) FILTER (WHERE am_next.user_id IS NOT NULL) / COUNT(*),
         2
       ) AS retention_pct
FROM cohorts c
LEFT JOIN activity_months am_next
  ON am_next.user_id = c.user_id
 AND am_next.m = c.cohort_month + INTERVAL '1 month'
GROUP BY c.cohort_month
ORDER BY c.cohort_month;""",
        "explanation": "First month per user defines the cohort. Joining to next month activity counts retained users and gives retention percentage.",
    },
    {
        "title": "Duplicate Emails",
        "question": "Find all duplicate customer emails.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["id", "INT", "Primary key"],
            ["email", "VARCHAR", "Customer email"],
        ],
        "query": """SELECT LOWER(TRIM(email)) AS normalized_email,
       COUNT(*) AS duplicate_count
FROM customers
GROUP BY LOWER(TRIM(email))
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;""",
        "explanation": "Normalization (trim + lowercase) avoids false negatives due to casing or spaces; HAVING isolates duplicates only.",
    },
    {
        "title": "Latest Order Per Customer",
        "question": "Fetch latest order for each customer.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["order_id", "INT", "Primary key"],
            ["customer_id", "INT", "Customer FK"],
            ["order_ts", "TIMESTAMP", "Order timestamp"],
            ["status", "VARCHAR", "Order status"],
        ],
        "query": """SELECT customer_id, order_id, order_ts, status
FROM (
  SELECT o.*,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY order_ts DESC, order_id DESC
         ) AS rn
  FROM orders o
) x
WHERE rn = 1;""",
        "explanation": "ROW_NUMBER orders each customer's rows by newest first and picks the first row as the latest order deterministically.",
    },
    {
        "title": "Low Stock Alert Using Recent Demand",
        "question": "Flag SKUs where stock is below 7-day average demand.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["sku_id", "INT", "Product SKU"],
            ["stock_qty", "INT", "Current stock"],
            ["updated_at", "TIMESTAMP", "Inventory update time"],
        ],
        "query": """WITH daily_sales AS (
  SELECT oi.sku_id,
         DATE(o.order_ts) AS sales_date,
         SUM(oi.quantity) AS qty
  FROM order_items oi
  JOIN orders o ON o.order_id = oi.order_id
  WHERE o.order_ts >= NOW() - INTERVAL '7 days'
  GROUP BY oi.sku_id, DATE(o.order_ts)
),
avg_demand AS (
  SELECT sku_id, AVG(qty) AS avg_daily_demand
  FROM daily_sales
  GROUP BY sku_id
)
SELECT i.sku_id, i.stock_qty, COALESCE(a.avg_daily_demand, 0) AS avg_daily_demand
FROM inventory i
LEFT JOIN avg_demand a ON a.sku_id = i.sku_id
WHERE i.stock_qty < COALESCE(a.avg_daily_demand, 0)
ORDER BY (COALESCE(a.avg_daily_demand, 0) - i.stock_qty) DESC;""",
        "explanation": "This compares current stock against short-term demand instead of static thresholds, making alerts adaptive to seasonality spikes.",
    },
    {
        "title": "Cart to Order Conversion",
        "question": "Calculate conversion rate from created carts to completed orders per day.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["cart_id", "INT", "Cart PK"],
            ["user_id", "INT", "User FK"],
            ["created_at", "TIMESTAMP", "Cart creation time"],
            ["ordered_at", "TIMESTAMP", "Set when converted"],
        ],
        "query": """SELECT DATE(created_at) AS dt,
       COUNT(*) AS carts_created,
       COUNT(*) FILTER (WHERE ordered_at IS NOT NULL) AS carts_converted,
       ROUND(
         100.0 * COUNT(*) FILTER (WHERE ordered_at IS NOT NULL) / NULLIF(COUNT(*), 0),
         2
       ) AS conversion_pct
FROM carts
GROUP BY DATE(created_at)
ORDER BY dt;""",
        "explanation": "FILTER avoids extra CASE boilerplate. NULLIF prevents divide-by-zero and keeps conversion computation robust.",
    },
    {
        "title": "Median Delivery Time",
        "question": "Find median delivery duration (in minutes) per city.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["order_id", "INT", "Order PK"],
            ["city", "VARCHAR", "Delivery city"],
            ["picked_up_at", "TIMESTAMP", "Pickup time"],
            ["delivered_at", "TIMESTAMP", "Delivery completion time"],
        ],
        "query": """SELECT city,
       PERCENTILE_CONT(0.5) WITHIN GROUP (
         ORDER BY EXTRACT(EPOCH FROM (delivered_at - picked_up_at)) / 60.0
       ) AS median_delivery_mins
FROM deliveries
WHERE delivered_at IS NOT NULL
  AND picked_up_at IS NOT NULL
GROUP BY city
ORDER BY median_delivery_mins;""",
        "explanation": "Median is more resilient to outliers than average. percentile_cont gives accurate percentile-based SLA analysis.",
    },
    {
        "title": "Abandoned Carts Over 24 Hours",
        "question": "List carts not ordered within 24 hours of creation.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["cart_id", "INT", "Cart PK"],
            ["user_id", "INT", "User FK"],
            ["created_at", "TIMESTAMP", "Creation time"],
            ["ordered_at", "TIMESTAMP", "Order conversion time"],
        ],
        "query": """SELECT cart_id, user_id, created_at
FROM carts
WHERE ordered_at IS NULL
  AND created_at < NOW() - INTERVAL '24 hours'
ORDER BY created_at;""",
        "explanation": "A simple, operational query frequently used by growth systems for remarketing nudges and discount campaigns.",
    },
    {
        "title": "Month-on-Month GMV Growth",
        "question": "Compute monthly GMV and growth percentage.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["order_id", "INT", "Order PK"],
            ["created_at", "TIMESTAMP", "Order time"],
            ["total_amount", "NUMERIC", "Gross order amount"],
            ["status", "VARCHAR", "Use paid/completed orders"],
        ],
        "query": """WITH monthly AS (
  SELECT DATE_TRUNC('month', created_at) AS month_start,
         SUM(total_amount) AS gmv
  FROM orders
  WHERE status IN ('PAID', 'COMPLETED')
  GROUP BY DATE_TRUNC('month', created_at)
)
SELECT month_start,
       gmv,
       LAG(gmv) OVER (ORDER BY month_start) AS prev_gmv,
       ROUND(
         100.0 * (gmv - LAG(gmv) OVER (ORDER BY month_start))
         / NULLIF(LAG(gmv) OVER (ORDER BY month_start), 0),
         2
       ) AS mom_growth_pct
FROM monthly
ORDER BY month_start;""",
        "explanation": "LAG fetches previous month baseline. Growth is computed on paid/completed orders to avoid revenue inflation from cancellations.",
    },
    {
        "title": "Top Dishes by Revenue Per Restaurant",
        "question": "Return top 5 dishes by revenue for each restaurant.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["restaurant_id", "INT", "Restaurant FK"],
            ["dish_id", "INT", "Dish FK"],
            ["quantity", "INT", "Units sold"],
            ["unit_price", "NUMERIC", "Price at order time"],
        ],
        "query": """WITH dish_rev AS (
  SELECT restaurant_id,
         dish_id,
         SUM(quantity * unit_price) AS revenue
  FROM order_items
  GROUP BY restaurant_id, dish_id
)
SELECT restaurant_id, dish_id, revenue
FROM (
  SELECT dr.*,
         ROW_NUMBER() OVER (
           PARTITION BY restaurant_id
           ORDER BY revenue DESC
         ) AS rn
  FROM dish_rev dr
) x
WHERE rn <= 5
ORDER BY restaurant_id, revenue DESC;""",
        "explanation": "Pre-aggregation avoids repeated multiplication work. Ranking by partition gives per-restaurant top performers cleanly.",
    },
    {
        "title": "Consecutive Login Streak (>=3 days)",
        "question": "Identify users with at least one streak of 3 consecutive login dates.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["user_id", "INT", "User FK"],
            ["login_ts", "TIMESTAMP", "Login event time"],
        ],
        "query": """WITH d AS (
  SELECT DISTINCT user_id, DATE(login_ts) AS login_date
  FROM logins
),
g AS (
  SELECT user_id,
         login_date,
         login_date - (ROW_NUMBER() OVER (
           PARTITION BY user_id ORDER BY login_date
         ))::INT AS grp
  FROM d
)
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*) AS streak_days
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3
ORDER BY streak_days DESC;""",
        "explanation": "Date minus row_number forms constant groups across consecutive days, a classic and efficient streak-detection pattern.",
    },
    {
        "title": "Overlapping Meeting Slots",
        "question": "Find overlapping bookings for same room.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["booking_id", "INT", "Booking PK"],
            ["room_id", "INT", "Room FK"],
            ["start_ts", "TIMESTAMP", "Start time"],
            ["end_ts", "TIMESTAMP", "End time"],
        ],
        "query": """SELECT b1.room_id,
       b1.booking_id AS booking_a,
       b2.booking_id AS booking_b
FROM bookings b1
JOIN bookings b2
  ON b1.room_id = b2.room_id
 AND b1.booking_id < b2.booking_id
 AND b1.start_ts < b2.end_ts
 AND b2.start_ts < b1.end_ts
ORDER BY b1.room_id, booking_a, booking_b;""",
        "explanation": "Overlap exists when each slot starts before the other ends. Strict inequalities avoid false positives for back-to-back bookings.",
    },
    {
        "title": "Recursive Category Tree",
        "question": "Print category hierarchy paths from roots to leaves.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["id", "INT", "Category PK"],
            ["parent_id", "INT", "Self reference"],
            ["name", "VARCHAR", "Category name"],
        ],
        "query": """WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, name::TEXT AS path, 1 AS depth
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id,
         c.parent_id,
         c.name,
         t.path || ' > ' || c.name AS path,
         t.depth + 1 AS depth
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
)
SELECT id, parent_id, name, depth, path
FROM tree
ORDER BY path;""",
        "explanation": "Recursive CTE walks parent-child relationships iteratively and builds human-readable lineage paths for navigation or SEO URLs.",
    },
    {
        "title": "Possible Duplicate Payments",
        "question": "Detect same user/amount payments within 5 minutes.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["payment_id", "INT", "Payment PK"],
            ["user_id", "INT", "User FK"],
            ["amount", "NUMERIC", "Transaction amount"],
            ["paid_at", "TIMESTAMP", "Payment timestamp"],
        ],
        "query": """SELECT p1.user_id,
       p1.payment_id AS payment_a,
       p2.payment_id AS payment_b,
       p1.amount,
       p1.paid_at AS paid_at_a,
       p2.paid_at AS paid_at_b
FROM payments p1
JOIN payments p2
  ON p1.user_id = p2.user_id
 AND p1.amount = p2.amount
 AND p1.payment_id < p2.payment_id
 AND p2.paid_at BETWEEN p1.paid_at AND p1.paid_at + INTERVAL '5 minutes'
ORDER BY p1.user_id, p1.paid_at;""",
        "explanation": "This pattern catches near-duplicate charges from retries/timeouts. It is a first-pass fraud and payment quality signal.",
    },
    {
        "title": "Support SLA Breach Rate",
        "question": "Find daily percent of support tickets breaching 4-hour first response SLA.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["ticket_id", "INT", "Ticket PK"],
            ["created_at", "TIMESTAMP", "Ticket creation"],
            ["first_response_at", "TIMESTAMP", "First agent response"],
            ["priority", "VARCHAR", "Ticket severity"],
        ],
        "query": """SELECT DATE(created_at) AS dt,
       COUNT(*) AS total_tickets,
       COUNT(*) FILTER (
         WHERE first_response_at IS NULL
            OR first_response_at > created_at + INTERVAL '4 hours'
       ) AS breached_tickets,
       ROUND(
         100.0 * COUNT(*) FILTER (
           WHERE first_response_at IS NULL
              OR first_response_at > created_at + INTERVAL '4 hours'
         ) / NULLIF(COUNT(*), 0),
         2
       ) AS breach_pct
FROM tickets
GROUP BY DATE(created_at)
ORDER BY dt;""",
        "explanation": "Breaches include delayed responses and unanswered tickets. The metric is commonly used in operational dashboards and alerts.",
    },
    {
        "title": "Unique Active Email Constraint Check",
        "question": "Find active users violating unique-email rule under soft delete.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["id", "INT", "User PK"],
            ["email", "VARCHAR", "User email"],
            ["deleted_at", "TIMESTAMP", "Soft delete marker"],
        ],
        "query": """SELECT LOWER(TRIM(email)) AS normalized_email,
       COUNT(*) AS active_count
FROM users
WHERE deleted_at IS NULL
GROUP BY LOWER(TRIM(email))
HAVING COUNT(*) > 1;""",
        "explanation": "Soft delete often breaks uniqueness unless partial indexes are used. This query validates production data integrity before migration fixes.",
    },
    {
        "title": "Keyset Pagination (Stable API)",
        "question": "Fetch next page of orders using keyset pagination.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["order_id", "BIGINT", "Monotonic unique ID"],
            ["created_at", "TIMESTAMP", "Creation timestamp"],
            ["status", "VARCHAR", "Order status"],
        ],
        "query": """-- Assume last seen cursor: (created_at = :last_ts, order_id = :last_id)
SELECT order_id, created_at, status
FROM orders
WHERE (created_at, order_id) < (:last_ts, :last_id)
ORDER BY created_at DESC, order_id DESC
LIMIT 20;""",
        "explanation": "Keyset pagination avoids large OFFSET scans and inconsistent pages on high-write tables, making APIs faster and more reliable.",
    },
    {
        "title": "Daily Active Users (7-day Rolling Average)",
        "question": "Compute DAU and 7-day rolling average.",
        "schema": [
            ["Column", "Type", "Notes"],
            ["user_id", "INT", "User FK"],
            ["event_ts", "TIMESTAMP", "Event time"],
        ],
        "query": """WITH dau AS (
  SELECT DATE(event_ts) AS dt,
         COUNT(DISTINCT user_id) AS dau
  FROM events
  GROUP BY DATE(event_ts)
)
SELECT dt,
       dau,
       ROUND(
         AVG(dau) OVER (
           ORDER BY dt
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
         ),
         2
       ) AS dau_7d_avg
FROM dau
ORDER BY dt;""",
        "explanation": "Rolling averages smooth daily volatility and reveal trend direction, which is useful for feature launches and incident impact analysis.",
    },
]


SAMPLE_IO = {
    "Second Highest Salary": {
        "sample_data": [["id", "name", "salary"], ["1", "Asha", "90000"], ["2", "Ravi", "120000"], ["3", "Mira", "110000"], ["4", "Ish", "120000"]],
        "output": [["second_highest_salary"], ["110000"]],
    },
    "Top 3 Salaries Per Department": {
        "sample_data": [["id", "name", "department_id", "salary"], ["1", "A", "10", "100"], ["2", "B", "10", "90"], ["3", "C", "10", "80"], ["4", "D", "10", "70"], ["5", "E", "20", "95"]],
        "output": [["department_id", "name", "salary"], ["10", "A", "100"], ["10", "B", "90"], ["10", "C", "80"], ["20", "E", "95"]],
    },
    "Running Revenue Per Customer": {
        "sample_data": [["order_id", "customer_id", "order_ts", "total_amount"], ["101", "1", "2026-01-01 10:00", "200"], ["102", "1", "2026-01-02 11:00", "150"], ["201", "2", "2026-01-01 12:00", "300"]],
        "output": [["customer_id", "order_id", "running_total"], ["1", "101", "200"], ["1", "102", "350"], ["2", "201", "300"]],
    },
    "Month-1 Retention": {
        "sample_data": [["user_id", "activity_ts"], ["1", "2026-01-10"], ["1", "2026-02-02"], ["2", "2026-01-15"], ["3", "2026-02-03"], ["3", "2026-03-05"]],
        "output": [["cohort_month", "cohort_size", "retained_users", "retention_pct"], ["2026-01-01", "2", "1", "50.00"], ["2026-02-01", "1", "1", "100.00"]],
    },
    "Duplicate Emails": {
        "sample_data": [["id", "email"], ["1", "A@x.com"], ["2", "a@x.com "], ["3", "b@x.com"]],
        "output": [["normalized_email", "duplicate_count"], ["a@x.com", "2"]],
    },
    "Latest Order Per Customer": {
        "sample_data": [["order_id", "customer_id", "order_ts", "status"], ["1", "10", "2026-01-01 10:00", "PLACED"], ["2", "10", "2026-01-02 10:00", "DELIVERED"], ["3", "20", "2026-01-03 11:00", "PLACED"]],
        "output": [["customer_id", "order_id"], ["10", "2"], ["20", "3"]],
    },
    "Low Stock Alert Using Recent Demand": {
        "sample_data": [["sku_id", "stock_qty"], ["1001", "4"], ["1002", "20"], ["1003", "2"]],
        "output": [["sku_id", "stock_qty", "avg_daily_demand"], ["1001", "4", "6.0"], ["1003", "2", "3.5"]],
    },
    "Cart to Order Conversion": {
        "sample_data": [["cart_id", "created_at", "ordered_at"], ["1", "2026-01-01 09:00", "2026-01-01 09:10"], ["2", "2026-01-01 10:00", "NULL"], ["3", "2026-01-01 11:00", "2026-01-01 11:20"]],
        "output": [["dt", "carts_created", "carts_converted", "conversion_pct"], ["2026-01-01", "3", "2", "66.67"]],
    },
    "Median Delivery Time": {
        "sample_data": [["order_id", "city", "picked_up_at", "delivered_at"], ["1", "Pune", "10:00", "10:20"], ["2", "Pune", "10:00", "10:30"], ["3", "Pune", "10:00", "10:40"]],
        "output": [["city", "median_delivery_mins"], ["Pune", "30"]],
    },
    "Abandoned Carts Over 24 Hours": {
        "sample_data": [["cart_id", "created_at", "ordered_at"], ["10", "2026-01-01 08:00", "NULL"], ["11", "2026-01-02 08:00", "2026-01-02 09:00"]],
        "output": [["cart_id", "user_id", "created_at"], ["10", "...", "2026-01-01 08:00"]],
    },
    "Month-on-Month GMV Growth": {
        "sample_data": [["order_id", "created_at", "total_amount", "status"], ["1", "2026-01-05", "100", "COMPLETED"], ["2", "2026-02-02", "150", "PAID"], ["3", "2026-02-10", "50", "COMPLETED"]],
        "output": [["month_start", "gmv", "prev_gmv", "mom_growth_pct"], ["2026-01-01", "100", "NULL", "NULL"], ["2026-02-01", "200", "100", "100.00"]],
    },
    "Top Dishes by Revenue Per Restaurant": {
        "sample_data": [["restaurant_id", "dish_id", "quantity", "unit_price"], ["1", "501", "10", "100"], ["1", "502", "3", "200"], ["1", "503", "2", "120"]],
        "output": [["restaurant_id", "dish_id", "revenue"], ["1", "501", "1000"], ["1", "502", "600"], ["1", "503", "240"]],
    },
    "Consecutive Login Streak (>=3 days)": {
        "sample_data": [["user_id", "login_ts"], ["1", "2026-01-01"], ["1", "2026-01-02"], ["1", "2026-01-03"], ["2", "2026-01-01"], ["2", "2026-01-03"]],
        "output": [["user_id", "streak_start", "streak_end", "streak_days"], ["1", "2026-01-01", "2026-01-03", "3"]],
    },
    "Overlapping Meeting Slots": {
        "sample_data": [["booking_id", "room_id", "start_ts", "end_ts"], ["1", "A", "10:00", "11:00"], ["2", "A", "10:30", "11:30"], ["3", "A", "11:30", "12:00"]],
        "output": [["room_id", "booking_a", "booking_b"], ["A", "1", "2"]],
    },
    "Recursive Category Tree": {
        "sample_data": [["id", "parent_id", "name"], ["1", "NULL", "Food"], ["2", "1", "Snacks"], ["3", "2", "Chips"]],
        "output": [["id", "depth", "path"], ["1", "1", "Food"], ["2", "2", "Food > Snacks"], ["3", "3", "Food > Snacks > Chips"]],
    },
    "Possible Duplicate Payments": {
        "sample_data": [["payment_id", "user_id", "amount", "paid_at"], ["10", "7", "499", "10:00"], ["11", "7", "499", "10:03"], ["12", "7", "499", "10:20"]],
        "output": [["user_id", "payment_a", "payment_b"], ["7", "10", "11"]],
    },
    "Support SLA Breach Rate": {
        "sample_data": [["ticket_id", "created_at", "first_response_at"], ["1", "09:00", "11:00"], ["2", "09:00", "15:30"], ["3", "09:00", "NULL"]],
        "output": [["dt", "total_tickets", "breached_tickets", "breach_pct"], ["2026-01-01", "3", "2", "66.67"]],
    },
    "Unique Active Email Constraint Check": {
        "sample_data": [["id", "email", "deleted_at"], ["1", "x@y.com", "NULL"], ["2", "X@y.com ", "NULL"], ["3", "x@y.com", "2026-01-01"]],
        "output": [["normalized_email", "active_count"], ["x@y.com", "2"]],
    },
    "Keyset Pagination (Stable API)": {
        "sample_data": [["order_id", "created_at", "status"], ["100", "2026-01-05 10:00", "PAID"], ["99", "2026-01-05 09:59", "PAID"], ["98", "2026-01-05 09:58", "PLACED"]],
        "output": [["order_id", "created_at"], ["99", "2026-01-05 09:59"], ["98", "2026-01-05 09:58"]],
    },
    "Daily Active Users (7-day Rolling Average)": {
        "sample_data": [["user_id", "event_ts"], ["1", "2026-01-01"], ["2", "2026-01-01"], ["1", "2026-01-02"], ["3", "2026-01-02"]],
        "output": [["dt", "dau", "dau_7d_avg"], ["2026-01-01", "2", "2.00"], ["2026-01-02", "2", "2.00"]],
    },
}


def make_schema_table(rows):
    t = Table(rows, colWidths=[45 * mm, 35 * mm, 90 * mm], hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#9CA3AF")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def make_data_table(rows):
    if not rows or len(rows[0]) == 0:
        rows = [["No data"]]
    col_count = len(rows[0])
    usable_width = 170 * mm
    col_width = usable_width / col_count
    t = Table(rows, colWidths=[col_width] * col_count, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111827")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#9CA3AF")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return t


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="SQL Interview Questions for SDE-1 Backend",
        author="Codex",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        spaceAfter=6,
        textColor=colors.HexColor("#111827"),
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=10,
    )
    h_style = ParagraphStyle(
        "QHeading",
        parent=styles["Heading3"],
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
    )
    label_style = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#111827"),
        spaceBefore=5,
        spaceAfter=2,
    )
    code_style = ParagraphStyle(
        "Code",
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
    story.append(Paragraph("SQL for SDE-1 Backend: 20 High-Quality Interview Questions", title_style))
    story.append(
        Paragraph(
            "Database flavor: PostgreSQL syntax. Each question includes practical schema context, production-style query, and interview-ready explanation.",
            subtitle_style,
        )
    )
    story.append(Spacer(1, 4))

    for i, item in enumerate(QUESTIONS, start=1):
        story.append(Paragraph(f"{i}. {item['title']}", h_style))
        story.append(Paragraph(f"<b>Question:</b> {item['question']}", body_style))
        story.append(Spacer(1, 4))
        story.append(Paragraph("Schema Table", label_style))
        story.append(make_schema_table(item["schema"]))
        story.append(Spacer(1, 5))
        story.append(Paragraph("Query", label_style))
        story.append(Preformatted(item["query"], code_style))
        io = SAMPLE_IO.get(item["title"], {})
        story.append(Paragraph("Sample Data", label_style))
        story.append(make_data_table(io.get("sample_data", [["No sample data provided"]])))
        story.append(Spacer(1, 4))
        story.append(Paragraph("Expected Output", label_style))
        story.append(make_data_table(io.get("output", [["No output provided"]])))
        story.append(Spacer(1, 4))
        story.append(Paragraph("Explanation", label_style))
        story.append(Paragraph(item["explanation"], body_style))
        if i % 2 == 0 and i != len(QUESTIONS):
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 8))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated: {OUTPUT_PATH}")
