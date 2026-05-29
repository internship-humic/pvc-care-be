import AuthController from "./auth.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { loginSchema, registerPatientSchema, registerDoctorSchema } from "./auth.schema.js";

class AuthRoutes extends BaseRoutes {
  constructor() {
    super(AuthController);
  }

  routes() {
    this.router.post("/login", [
      this.validate(loginSchema),
      this.errCatch(this.controller.login.bind(this.controller)),
    ]);
    this.router.post("/register/patient", [
      this.validate(registerPatientSchema),
      this.errCatch(this.controller.registerPatient.bind(this.controller)),
    ]);
    this.router.post("/register/doctor", [
      this.validate(registerDoctorSchema),
      this.errCatch(this.controller.registerDoctor.bind(this.controller)),
    ]);
  }
}

export default new AuthRoutes().router;
