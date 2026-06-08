
import Joi from "joi";

const createPvcScanSchema = Joi.object({
  patient_note: Joi.string().optional().allow(""),
  doctor_profile_id: Joi.string().uuid().optional().allow(null, ""),
});

const assignDoctorSchema = Joi.object({
  patient_note: Joi.string().optional().allow(""),
});

export { createPvcScanSchema, assignDoctorSchema };
