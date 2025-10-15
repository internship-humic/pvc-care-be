import Joi from "joi";

const createPlantSchema = Joi.object({
  name: Joi.string().required(),
});

export { createPlantSchema };
