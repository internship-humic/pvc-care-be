import AuthController from "./auth.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import ErrorMiddleware from "../../middlewares/error.middleware.js";
import validate from "../../middlewares/request-validator.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import Roles from "../../common/enums/user-roles.enum.js";
import AuthMiddleware from "../../middlewares/auth.middleware.js";

class AuthRoutes extends BaseRoutes {
  routes() {
    this.router.post("/login", [
      validate(loginSchema),
      ErrorMiddleware.errorCatcher(AuthController.login),
    ]);
    this.router.post("/register", [
      validate(registerSchema),
      ErrorMiddleware.errorCatcher(AuthController.register),
    ]);
  }
}

export default new AuthRoutes().router;
