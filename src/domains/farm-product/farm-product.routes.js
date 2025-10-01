
import Farm-productController from "./farm-product.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { farm-productSchema } from './farm-product.schema.js';

class Farm-productRoutes extends BaseRoutes {
  constructor() {
    super(Farm-productController);
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
      this.validate(farm-productSchema),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
  }
}

export default new Farm-productRoutes().router;
