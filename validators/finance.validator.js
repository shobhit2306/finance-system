import Joi from "joi";


export const createFinanceSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().min(2).max(50).required(),
  date: Joi.date().required(),
  note: Joi.string().allow("").optional(),
});

export const updateFinanceSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().min(2).max(50).optional(),
  date: Joi.date().optional(),
  note: Joi.string().allow("").optional(),
}).min(1);

export const financeQuerySchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  sortBy: Joi.string().optional(),
  order: Joi.string().valid("asc", "desc").optional(),
});