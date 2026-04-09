import Joi from "joi";


export const dateFilterSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

export const trendQuerySchema = Joi.object({
  year: Joi.number().optional(),
});

export const recentQuerySchema = Joi.object({
  limit: Joi.number().min(1).max(20).optional(),
});