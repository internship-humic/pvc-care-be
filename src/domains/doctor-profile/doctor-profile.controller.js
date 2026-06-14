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

  async verifyDoctor(req, res) {
    const { id } = req.params;
    const { verification_status } = req.body;
    const result = await this.service.verifyDoctor(id, verification_status);
    return this.response.success(res, result, "Doctor verification updated successfully");
  }
}

export default new DoctorProfileController();
