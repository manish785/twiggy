const catalog = require("../lib/catalog.json");

const RENDER_API_BASE =
  process.env.RENDER_API_URL || "https://foodheaven-api.onrender.com";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getSlug(req) {
  const slug = req.query.slug;
  if (!slug) {
    return "";
  }
  return Array.isArray(slug) ? slug.join("/") : String(slug);
}

module.exports = async (req, res) => {
  const path = getSlug(req);

  if (req.method === "GET" && path === "restaurants") {
    return sendJson(res, 200, { success: true, data: catalog.restaurants });
  }

  const menuMatch = path.match(/^restaurants\/(\d+)\/menu$/);
  if (req.method === "GET" && menuMatch) {
    const restaurantId = menuMatch[1];
    const menu = catalog.menus[restaurantId];
    if (!menu) {
      return sendJson(res, 404, {
        success: false,
        message: "Restaurant not found",
      });
    }
    return sendJson(res, 200, { success: true, data: menu });
  }

  const upstreamUrl = `${RENDER_API_BASE}/api/v1/${path}`;
  const headers = {
    "Content-Type": req.headers["content-type"] || "application/json",
  };

  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }
  if (req.headers["idempotency-key"]) {
    headers["Idempotency-Key"] = req.headers["idempotency-key"];
  }

  try {
    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      init.body =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(upstreamUrl, init);
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json"
    );
    res.end(text);
  } catch {
    sendJson(res, 502, {
      success: false,
      message:
        "Order API is offline. Deploy the Node backend on Render (rootDir: backend).",
    });
  }
};
