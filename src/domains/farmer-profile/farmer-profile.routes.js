import FarmerProfileController from "./farmer-profile.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { updateFarmerProfileSchema } from './farmer-profile.schema.js';

class FarmerProfileRoutes extends BaseRoutes {
  constructor() {
    super(FarmerProfileController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.getFarmerProfile.bind(this.controller)),
    ]);
    this.router.patch("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(updateFarmerProfileSchema),
      this.errCatch(this.controller.updateFarmerProfile.bind(this.controller)),
    ]);
  }
}

export default new FarmerProfileRoutes().router;
