/**
 * Request body validation middleware (Joi).
 * Used on auth and order routes before controllers run.
 */
// Factory: pass a Joi schema, get an Express middleware function
function validateBody(schema) {
  return (req, res, next) => {
    // Validate req.body; collect all errors; remove fields not in schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // return every validation error, not just the first
      stripUnknown: true, // drop extra keys the client sent but schema does not define
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message), // human-readable Joi messages
      });
    }

    // Replace body with Joi-coerced/defaulted values (e.g. trimmed strings, defaults)
    req.body = value;
    return next();
  };
}

module.exports = {
  validateBody,
};
