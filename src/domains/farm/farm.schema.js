
import Joi from "joi";

const createFarmSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  address: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  farmer_id: Joi.string().uuid().required(),
});

export { createFarmSchema };
