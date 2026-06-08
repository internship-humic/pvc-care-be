
import PvcScanController from "./pvc-scan.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { createPvcScanSchema, assignDoctorSchema } from './pvc-scan.schema.js';
import upload from "../../utils/image.util.js";

class PvcScanRoutes extends BaseRoutes {
  constructor() {
    super(PvcScanController);
  }

  routes() {
    this.router.get("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Admin, this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.getAllFromUser.bind(this.controller))
    ]);
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.getById.bind(this.controller))
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient]),
      upload.single("image"),
      this.validate(createPvcScanSchema),
      this.errCatch(this.controller.uploadScan.bind(this.controller))
    ]);

    this.router.patch("/:id/assign-doctor", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient]),
      this.validate(assignDoctorSchema),
      this.errCatch(this.controller.assignDoctor.bind(this.controller))
    ]);
  }
}

export default new PvcScanRoutes().router;
