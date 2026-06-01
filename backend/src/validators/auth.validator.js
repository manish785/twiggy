const Joi = require("joi");

const createDevTokenSchema = Joi.object({
  devKey: Joi.string().trim().required(),
  userId: Joi.string().trim().default("dev-user-1"),
  email: Joi.string().email().default("dev@foodheaven.app"),
  role: Joi.string().trim().default("customer"),
});

module.exports = {
  createDevTokenSchema,
};
