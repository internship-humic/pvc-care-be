import Joi from "joi";
import Roles from "../../common/enums/user-roles.enum.js";

export const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

export const registerPatientSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  profile: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    birthdate: Joi.date().iso().required(),
  }).required().messages({
    "any.required": "Profile information is required for Patient",
  })
});

export const registerDoctorSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  profile: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    birthdate: Joi.date().iso().required(),
    profile_photo: Joi.string().required(),
  }).required().messages({
    "any.required": "Profile information is required for Doctor",
  })
});
