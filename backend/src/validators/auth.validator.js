const Joi = require("joi");

const createDevTokenSchema = Joi.object({
  devKey: Joi.string().trim().required(),
  userId: Joi.string().trim().default("dev-user-1"),
  email: Joi.string().email().default("dev@foodheaven.app"),
  role: Joi.string().trim().default("customer"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(1).max(120).required(),
});

module.exports = {
  createDevTokenSchema,
  loginSchema,
};
