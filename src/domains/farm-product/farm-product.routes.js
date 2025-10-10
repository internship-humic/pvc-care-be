import FarmProductController from "./farm-product.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { createFarmProductSchema, updateFarmProductSchema } from "./farm-product.schema.js";

class FarmProductRoutes extends BaseRoutes {
  constructor() {
    super(FarmProductController);
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
      this.errCatch(this.controller.getFarmProductById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllFarmProduct.bind(this.controller)),
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(createFarmProductSchema),
      this.errCatch(this.controller.createFarmProduct.bind(this.controller)),
    ]);
    this.router.patch("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(updateFarmProductSchema),
      this.errCatch(this.controller.updateFarmProduct.bind(this.controller)),
    ]);
    this.router.delete("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.deleteFarmProduct.bind(this.controller)),
    ]);
  }
}

export default new FarmProductRoutes().router;
