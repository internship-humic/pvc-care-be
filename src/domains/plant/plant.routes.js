
import PlantController from "./plant.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { plantSchema } from './plant.schema.js';

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
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(plantSchema),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
  }
}

export default new PlantRoutes().router;
