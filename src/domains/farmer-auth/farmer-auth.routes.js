import FarmerAuthController from "./farmer-auth.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { loginSchema, registerSchema } from './farmer-auth.schema.js';

class FarmerAuthRoutes extends BaseRoutes {
  constructor() {
    super(FarmerAuthController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.post("/login", [
      this.validate(loginSchema),
      this.errCatch(this.controller.login.bind(this.controller)),
    ]);
    this.router.post("/register", [
      this.validate(registerSchema),
      this.errCatch(this.controller.register.bind(this.controller)),
    ]);
  }
}

export default new FarmerAuthRoutes().router;
