
import HarvestedController from "./harvested.controller.js";
import BaseRoutes from "../../../common/base_classes/base-routes.js";
import { updateHarvestedSchema } from './harvested.schema.js';

class HarvestedRoutes extends BaseRoutes {
  constructor() {
    super(HarvestedController);
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
      this.errCatch(this.controller.getHarvestedById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllHarvested.bind(this.controller)),
    ]);
    this.router.patch("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(updateHarvestedSchema),
      this.errCatch(this.controller.updateHarvested.bind(this.controller)),
    ]);
  }
}

export default new HarvestedRoutes().router;
