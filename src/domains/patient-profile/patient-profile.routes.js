import PatientProfileController from "./patient-profile.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { updatePatientProfileSchema, updatePatientPasswordSchema } from "./patient-profile.schema.js";

class PatientProfileRoutes extends BaseRoutes {
  constructor() {
    super(PatientProfileController);
  }

  routes() {
    this.router.get("/me", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient]),
      this.errCatch(this.controller.getMyProfile.bind(this.controller)),
    ]);

    this.router.patch("/me", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient]),
      this.validate(updatePatientProfileSchema),
      this.errCatch(this.controller.updateMyProfile.bind(this.controller)),
    ]);

    this.router.patch("/me/password", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient]),
      this.validate(updatePatientPasswordSchema),
      this.errCatch(this.controller.updateMyPassword.bind(this.controller)),
    ]);
  }
}

export default new PatientProfileRoutes().router;
