import PlantController from "./plant.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { createPlantSchema } from "./plant.schema.js";

class PlantRoutes extends BaseRoutes {
  constructor() {
    super(PlantController);
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
      this.errCatch(this.controller.getPlantById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllPlant.bind(this.controller)),
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.validate(createPlantSchema),
      this.errCatch(this.controller.createPlant.bind(this.controller)),
    ]);
  }
}

export default new PlantRoutes().router;
