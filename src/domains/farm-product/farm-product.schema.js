import Joi from "joi";

const createFarmProductSchema = Joi.object({
  plant_id: Joi.string().required(),
  farm_id: Joi.string().required(),
});

const updateFarmProductSchema = Joi.object({
  plant_id: Joi.string(),
})
  .or("plant_id")
  .messages({
    "object.missing":
      "At least one field must be provided for update from: plant_id.",
  })
  .unknown(false);

export { createFarmProductSchema, updateFarmProductSchema };
