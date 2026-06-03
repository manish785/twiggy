/**
 * Order repository — SQL data access only.
 * All functions take a mysql2 connection (for transactions). No HTTP or pricing logic.
 */
// Detect schema missing idempotency_key column (older DB migrations)
function isMissingIdempotencyColumnError(error) {
  return error?.code === "ER_BAD_FIELD_ERROR";
}

// Fetch active menu items by id — used to price order lines server-side
async function findMenuItemsByIds(connection, itemIds) {
  if (!itemIds.length) {
    return [];
  }

  const placeholders = itemIds.map(() => "?").join(", ");
  const [rows] = await connection.query(
    `SELECT id, name, price_paise AS pricePaise, default_price_paise AS defaultPricePaise
     FROM menu_items
     WHERE id IN (${placeholders}) AND is_active = 1`,
    itemIds
  );

  return rows;
}

// INSERT into orders; falls back to schema without idempotency_key if column absent
async function createOrder(connection, payload) {
  let result;
  try {
    [result] = await connection.query(
      `INSERT INTO orders (
        order_number,
        idempotency_key,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_pincode,
        payment_method,
        subtotal_amount,
        tax_amount,
        delivery_fee,
        total_amount,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.orderNumber,
        payload.idempotencyKey,
        payload.customerName,
        payload.customerEmail,
        payload.customerPhone,
        payload.deliveryAddress,
        payload.deliveryPincode,
        payload.paymentMethod,
        payload.subtotalAmount,
        payload.taxAmount,
        payload.deliveryFee,
        payload.totalAmount,
        payload.status,
      ]
    );
  } catch (error) {
    if (!isMissingIdempotencyColumnError(error)) {
      throw error;
    }

    // Backward compatibility for older DB schema without idempotency_key.
    [result] = await connection.query(
      `INSERT INTO orders (
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_pincode,
        payment_method,
        subtotal_amount,
        tax_amount,
        delivery_fee,
        total_amount,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.orderNumber,
        payload.customerName,
        payload.customerEmail,
        payload.customerPhone,
        payload.deliveryAddress,
        payload.deliveryPincode,
        payload.paymentMethod,
        payload.subtotalAmount,
        payload.taxAmount,
        payload.deliveryFee,
        payload.totalAmount,
        payload.status,
      ]
    );
  }

  return result.insertId;
}

// Lookup prior order by Idempotency-Key header; null if column missing or no match
async function findOrderByIdempotencyKey(connection, idempotencyKey) {
  let rows;
  try {
    [rows] = await connection.query(
      `SELECT
        id,
        order_number AS orderNumber,
        subtotal_amount AS subtotalAmount,
        tax_amount AS taxAmount,
        delivery_fee AS deliveryFee,
        total_amount AS totalAmount,
        status
       FROM orders
       WHERE idempotency_key = ?
       LIMIT 1`,
      [idempotencyKey]
    );
  } catch (error) {
    if (!isMissingIdempotencyColumnError(error)) {
      throw error;
    }
    return null;
  }
  return rows[0] || null;
}

// Bulk INSERT order line items (snapshot name/price at order time)
async function createOrderItems(connection, orderItems) {
  if (!orderItems.length) {
    return;
  }

  const values = orderItems.map((item) => [
    item.orderId,
    item.menuItemId,
    item.itemName,
    item.unitPrice,
    item.quantity,
    item.lineTotal,
  ]);

  await connection.query(
    `INSERT INTO order_items (
      order_id,
      menu_item_id,
      item_name,
      unit_price,
      quantity,
      line_total
    ) VALUES ?`,
    [values]
  );
}

// INSERT initial payment record when order is created
async function createPayment(connection, payload) {
  const [result] = await connection.query(
    `INSERT INTO payments (
      order_id,
      provider,
      payment_method,
      amount,
      status
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      payload.orderId,
      payload.provider,
      payload.paymentMethod,
      payload.amount,
      payload.status,
    ]
  );

  return result.insertId;
}

// Load order header by primary key (for payment confirmation)
async function findOrderById(connection, orderId) {
  const [rows] = await connection.query(
    `SELECT id, order_number AS orderNumber, total_amount AS totalAmount
     FROM orders
     WHERE id = ?
     LIMIT 1`,
    [orderId]
  );
  return rows[0] || null;
}

// Update payment row after mock gateway success/failure
async function updatePaymentByOrderId(connection, payload) {
  await connection.query(
    `UPDATE payments
     SET payment_ref = ?, provider = ?, status = ?, paid_at = NOW()
     WHERE order_id = ?`,
    [payload.paymentRef, payload.provider, payload.status, payload.orderId]
  );
}

// Set orders.status (e.g. PENDING → PAID or FAILED)
async function updateOrderStatus(connection, orderId, status) {
  await connection.query(`UPDATE orders SET status = ? WHERE id = ?`, [
    status,
    orderId,
  ]);
}

module.exports = {
  findMenuItemsByIds,
  createOrder,
  findOrderByIdempotencyKey,
  createOrderItems,
  createPayment,
  findOrderById,
  updatePaymentByOrderId,
  updateOrderStatus,
};
