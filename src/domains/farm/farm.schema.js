import Joi from "joi";

const createFarmSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required().allow(""),
  address: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

const nearestFarmSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  maxDistance: Joi.number().min(1000).required(),
});

const updateFarmSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  address: Joi.string(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
})
  .or("name", "description", "address", "latitude", "longitude")
  .messages({
    "object.missing":
      "At least one field must be provided for update from: name, description, address, latitude, longitude (latitude and longitude must be provided together).",
  })
  .unknown(false);

export { createFarmSchema, nearestFarmSchema, updateFarmSchema };
