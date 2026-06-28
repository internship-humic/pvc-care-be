import Joi from "joi";

const verifyDoctorSchema = Joi.object({
  verification_status: Joi.string().valid("Pending", "Declined", "Verified").required(),
});

const updateDoctorProfileSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
  birthdate: Joi.date().iso().optional(),
});

export { verifyDoctorSchema, updateDoctorProfileSchema };
