import BaseController from "../../common/base_classes/base-controller.js";
import DoctorProfileService from "./doctor-profile.service.js";

class DoctorProfileController extends BaseController {
  constructor() {
    super(DoctorProfileService);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await this.service.getById(id);
    return this.response.success(res, result, "Success fetch doctor profile");
  }

  async getMyProfile(req, res) {
    const userId = req.user.id;
    const result = await this.service.getMyProfile(userId);
    return this.response.success(res, result, "Success fetch my doctor profile");
  }

  async updateMyProfile(req, res) {
    const userId = req.user.id;
    const result = await this.service.updateMyProfile(userId, req.body, req.file);
    return this.response.success(res, result, "Doctor profile updated successfully");
  }

  async verifyDoctor(req, res) {
    const { id } = req.params;
    const { verification_status } = req.body;
    const result = await this.service.verifyDoctor(id, verification_status);
    return this.response.success(res, result, "Doctor verification updated successfully");
  }
}

export default new DoctorProfileController();
