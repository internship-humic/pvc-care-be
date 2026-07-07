import Joi from "joi";

const verifyDoctorSchema = Joi.object({
  verification_status: Joi.string().valid("Pending", "Declined", "Verified").required(),
});

const updateDoctorProfileSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
  birthdate: Joi.date().iso().optional(),
  // profile_photo is handled by multer (req.file), but some clients
  // send it as a body field too — allow it here to avoid Joi rejection.
  profile_photo: Joi.any().optional(),
});

export { verifyDoctorSchema, updateDoctorProfileSchema };
