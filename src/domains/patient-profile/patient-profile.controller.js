import BaseController from "../../common/base_classes/base-controller.js";
import PatientProfileService from "./patient-profile.service.js";

class PatientProfileController extends BaseController {
  constructor() {
    super(PatientProfileService);
  }

  async getMyProfile(req, res) {
    const userId = req.user.id;
    const result = await this.service.getMyProfile(userId);
    return this.response.success(res, result, "Success fetch patient profile");
  }

  async updateMyProfile(req, res) {
    const userId = req.user.id;
    const result = await this.service.updateMyProfile(userId, req.body);
    return this.response.success(res, result, "Patient profile updated successfully");
  }

  async updateMyPassword(req, res) {
    const userId = req.user.id;
    const result = await this.service.updateMyPassword(userId, req.body);
    return this.response.success(res, result, "Password updated successfully");
  }
}

export default new PatientProfileController();
