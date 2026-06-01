const pool = require("../config/db");
const orderRepository = require("../repositories/order.repository");

function buildHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function mapPaymentMethod(method) {
  if (method === "card") return "CARD";
  if (method === "cod") return "COD";
  if (method === "paytm") return "PAYTM";
  return "CARD";
}

async function createOrder(payload) {
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const deliveryAddress = payload?.deliveryAddress || {};
  const paymentMethod = mapPaymentMethod(payload?.paymentMethod);
  const idempotencyKey = payload?.idempotencyKey || null;

  if (!items.length) {
    throw buildHttpError("Order must contain at least one item", 400);
  }

  if (
    !deliveryAddress.name ||
    !deliveryAddress.email ||
    !deliveryAddress.number ||
    !deliveryAddress.address ||
    !deliveryAddress.pincode
  ) {
    throw buildHttpError("Delivery address is incomplete", 400);
  }

  const normalizedItems = items
    .map((item) => ({
      menuItemId: Number(item.menuItemId),
      quantity: Math.max(1, Number(item.quantity || 1)),
    }))
    .filter((item) => Number.isInteger(item.menuItemId) && item.menuItemId > 0);

  if (!normalizedItems.length) {
    throw buildHttpError("No valid menu items found in order", 400);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (idempotencyKey) {
      const existingOrder = await orderRepository.findOrderByIdempotencyKey(
        connection,
        idempotencyKey
      );
      if (existingOrder) {
        await connection.commit();
        return {
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          totalAmount: Number(existingOrder.totalAmount),
          subtotalAmount: Number(existingOrder.subtotalAmount),
          taxAmount: Number(existingOrder.taxAmount),
          deliveryFee: Number(existingOrder.deliveryFee),
          status: existingOrder.status,
          isIdempotentReplay: true,
        };
      }
    }

    const menuItemIds = normalizedItems.map((item) => item.menuItemId);
    const menuItems = await orderRepository.findMenuItemsByIds(
      connection,
      menuItemIds
    );

    if (menuItems.length !== menuItemIds.length) {
      throw buildHttpError("Some menu items are invalid or unavailable", 400);
    }

    const menuMap = new Map(menuItems.map((item) => [Number(item.id), item]));

    const orderItems = normalizedItems.map((item) => {
      const dbItem = menuMap.get(item.menuItemId);
      const unitPrice = toNumber(dbItem.pricePaise || dbItem.defaultPricePaise) / 100;
      const lineTotal = unitPrice * item.quantity;

      return {
        menuItemId: item.menuItemId,
        itemName: dbItem.name,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const subtotalAmount = Number(
      orderItems.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2)
    );
    const taxAmount = Number((subtotalAmount * 0.05).toFixed(2));
    const deliveryFee = subtotalAmount >= 300 ? 0 : 40;
    const totalAmount = Number((subtotalAmount + taxAmount + deliveryFee).toFixed(2));

    const orderNumber = `TWG-${Date.now()}`;

    const orderId = await orderRepository.createOrder(connection, {
      orderNumber,
      idempotencyKey,
      customerName: deliveryAddress.name,
      customerEmail: deliveryAddress.email,
      customerPhone: deliveryAddress.number,
      deliveryAddress: deliveryAddress.address,
      deliveryPincode: deliveryAddress.pincode,
      paymentMethod,
      subtotalAmount,
      taxAmount,
      deliveryFee,
      totalAmount,
      status: "PENDING",
    });

    await orderRepository.createOrderItems(
      connection,
      orderItems.map((item) => ({
        ...item,
        orderId,
      }))
    );

    await orderRepository.createPayment(connection, {
      orderId,
      provider: "TWIGGY_MOCK_GATEWAY",
      paymentMethod,
      amount: totalAmount,
      status: "INITIATED",
    });

    await connection.commit();

    return {
      orderId,
      orderNumber,
      totalAmount,
      subtotalAmount,
      taxAmount,
      deliveryFee,
      status: "PENDING",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function confirmOrderPayment(orderId, payload) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const order = await orderRepository.findOrderById(connection, orderId);
    if (!order) {
      throw buildHttpError("Order not found", 404);
    }

    const paymentStatus = payload?.status === "FAILED" ? "FAILED" : "SUCCESS";
    const orderStatus = paymentStatus === "SUCCESS" ? "PAID" : "FAILED";
    const paymentRef =
      payload?.paymentRef || `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const provider = payload?.provider || "TWIGGY_MOCK_GATEWAY";

    await orderRepository.updatePaymentByOrderId(connection, {
      orderId,
      paymentRef,
      provider,
      status: paymentStatus,
    });
    await orderRepository.updateOrderStatus(connection, orderId, orderStatus);

    await connection.commit();

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      paymentRef,
      paymentStatus,
      orderStatus,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createOrder,
  confirmOrderPayment,
};
