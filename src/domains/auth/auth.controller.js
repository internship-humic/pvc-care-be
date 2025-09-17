import BaseError from "../../common/base_classes/base-error.js";
import BaseResponse from "../../common/base_classes/base-response.js";
import AuthService from "./auth.service.js";

class AuthController {
  async login(req, res) {
    const info = req.body;
    const data = await AuthService.login(info);

    return BaseResponse.success(res, data, "Login Successful");
  }

  async register(req, res) {
    const info = req.body;
    const data = await AuthService.register(info);

    return BaseResponse.created(res, data, "Registration Successful");
  }
}

export default new AuthController();
