import DoctorProfileController from "./doctor-profile.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { verifyDoctorSchema } from "./doctor-profile.schema.js";

class DoctorProfileRoutes extends BaseRoutes {
  constructor() {
    super(DoctorProfileController);
  }

  routes() {
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Admin]),
      this.errCatch(this.controller.getById.bind(this.controller)),
    ]);

    this.router.patch("/:id/verify", [
      this.auth.authenticate,
      this.auth.role([this.roles.Admin]),
      this.validate(verifyDoctorSchema),
      this.errCatch(this.controller.verifyDoctor.bind(this.controller)),
    ]);
  }
}

export default new DoctorProfileRoutes().router;
