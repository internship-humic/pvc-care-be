import Joi from "joi";

const updateSaleSchema = Joi.object({
  quantity: Joi.number(),
  price: Joi.number(),
  status: Joi.boolean(),
})
  .or("quantity", "price", "status")
  .messages({
    "object.missing":
      "At least one field must be provided for update from: quantity, price, status.",
    "boolean.base": "Status must be true or false.",
  })
  .unknown(false);

export { updateSaleSchema };