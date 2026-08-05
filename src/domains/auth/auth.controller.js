import AuthService from "./auth.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class AuthController extends BaseController {
  constructor() {
    super(AuthService);
  }

  async login(req, res) {
    const info = req.body;
    const data = await this.service.login(info);

    return this.response.success(res, data, "Login Successful");
  }

  async registerPatient(req, res) {
    const info = req.body;
    const data = await this.service.registerPatient(info);

    return this.response.created(res, data, "Registration Successful");
  }

  async registerDoctor(req, res) {
    const info = req.body;
    const profilePhoto = req.file;
    const data = await this.service.registerDoctor(info, profilePhoto);

    return this.response.created(res, data, "Registration Successful");
  }

  async changePassword(req, res) {
    const userId = req.user.id;
    const { old_password, new_password } = req.body;
    await this.service.changePassword(userId, old_password, new_password);

    return this.response.success(res, null, "Password updated successfully");
  }
}

export default new AuthController();
