import FarmController from "./farm.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import ErrorMiddleware from "../../middlewares/error.middleware.js";
import validate from "../../middlewares/request-validator.middleware.js";
import { farmSchema } from "./farm.schema.js";

class FarmRoutes extends BaseRoutes {
  routes() {
    this.router.post("/", [
      ErrorMiddleware.errorCatcher(FarmController.someMethod),
    ]);
    this.router.get("/:id", [
      validate(farmSchema),
      ErrorMiddleware.errorCatcher(FarmController.someMethod),
    ]);
  }
}

export default new FarmRoutes().router;
