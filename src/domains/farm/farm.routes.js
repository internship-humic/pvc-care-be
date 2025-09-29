import FarmController from "./farm.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { createFarmSchema } from "./farm.schema.js";

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
      this.errCatch(this.controller.getFarmById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllFarm.bind(this.controller)),
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(createFarmSchema),
      this.errCatch(this.controller.createFarm.bind(this.controller)),
    ]);
  }
}

export default new FarmRoutes().router;
