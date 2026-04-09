import Joi from "joi";


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("viewer", "analyst", "admin").optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("viewer", "analyst", "admin").optional(),
  status: Joi.string().valid("active", "inactive").optional(),
}).min(1);

export const statusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").required(),
});

export const getUsersQuerySchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).optional(),
  search: Joi.string().optional(),
  role: Joi.string().optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  sortBy: Joi.string().optional(),
  order: Joi.string().valid("asc", "desc").optional(),
});