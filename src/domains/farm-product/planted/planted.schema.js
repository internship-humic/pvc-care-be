import Joi from "joi";

const updatePlantedSchema = Joi.object({
  quantity: Joi.number(),
})
  .or("quantity")
  .messages({
    "object.missing":
      "At least one field must be provided for update from: quantity.",
  })
  .unknown(false);


export { updatePlantedSchema };