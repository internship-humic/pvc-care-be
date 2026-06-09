import Joi from "joi";

const updatePatientProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().min(8).max(20).optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
  birthdate: Joi.date().iso().optional(),
});

const updatePatientPasswordSchema = Joi.object({
  current_password: Joi.string().min(6).required(),
  new_password: Joi.string().min(6).required(),
});

export { updatePatientProfileSchema, updatePatientPasswordSchema };
