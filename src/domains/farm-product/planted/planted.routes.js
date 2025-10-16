import PlantedController from "./planted.controller.js";
import BaseRoutes from "../../../common/base_classes/base-routes.js";
import { updatePlantedSchema } from './planted.schema.js';

class PlantedRoutes extends BaseRoutes {
  constructor() {
    super(PlantedController);
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
      this.errCatch(this.controller.getPlantedById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllPlanted.bind(this.controller)),
    ]);
    this.router.patch("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(updatePlantedSchema),
      this.errCatch(this.controller.updatePlanted.bind(this.controller)),
    ]);
  }
}

export default new PlantedRoutes().router;
