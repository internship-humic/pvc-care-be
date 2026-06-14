import Joi from "joi";

const verifyDoctorSchema = Joi.object({
  verification_status: Joi.string().valid("Pending", "Declined", "Verified").required(),
});

export { verifyDoctorSchema };
