import Joi from "joi";

// Schema untuk query parameter GET /notifications
export const getNotificationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  is_read: Joi.boolean().optional(),
});
