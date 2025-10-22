import Joi from "joi";

const updateFarmerProfileSchema = Joi.object({
  name: Joi.string().min(4).messages({
    "string.min": "Name must be at least 4 characters long.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 special character.",
    }),
  address: Joi.string(),
  phone_number: Joi.string(),
})
  .or("name", "email", "password", "address", "phone_number")
  .messages({
    "object.missing":
      "At least one field must be provided for update from: name, email, password, address, phone_number.",
  })
  .unknown(false);

export { updateFarmerProfileSchema };
// ...existing code...