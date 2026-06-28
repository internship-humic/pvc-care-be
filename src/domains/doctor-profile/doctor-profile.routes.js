import DoctorProfileController from "./doctor-profile.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { verifyDoctorSchema, updateDoctorProfileSchema } from "./doctor-profile.schema.js";
import upload from "../../utils/image.util.js";

class DoctorProfileRoutes extends BaseRoutes {
  constructor() {
    super(DoctorProfileController);
  }

  routes() {
    this.router.get("/me", [
      this.auth.authenticate,
      this.auth.role([this.roles.Doctor]),
      this.errCatch(this.controller.getMyProfile.bind(this.controller)),
    ]);

    this.router.patch("/me", [
      this.auth.authenticate,
      this.auth.role([this.roles.Doctor]),
      upload.single("profile_photo"),
      this.validate(updateDoctorProfileSchema),
      this.errCatch(this.controller.updateMyProfile.bind(this.controller)),
    ]);

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
