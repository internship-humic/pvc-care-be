import ProfileController from "./profile.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { updateProfileSchema } from './profile.schema.js';

class ProfileRoutes extends BaseRoutes {
  constructor() {
    super(ProfileController);
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
      this.errCatch(this.controller.getProfile.bind(this.controller)),
    ]);
    this.router.patch("/", [
      this.auth.authenticate,
      this.validate(updateProfileSchema),
      this.errCatch(this.controller.updateProfile.bind(this.controller)),
    ]);
  }
}

export default new ProfileRoutes().router;
