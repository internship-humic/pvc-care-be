
import FarmController from "./farm.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { farmSchema } from './farm.schema.js';

class FarmRoutes extends BaseRoutes {
  constructor() {
    super(FarmController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(farmSchema),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
  }
}

export default new FarmRoutes().router;
