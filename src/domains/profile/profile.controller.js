import ProfileService from "./profile.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class ProfileController extends BaseController {
  constructor() {
    super(ProfileService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = ProfileService
  }

  async getProfile(req, res) {
    const role = req.user.role;
    const user_id = req.user.id;
    const data = await this.service.getProfile(user_id, role);
    return this.response.success(res, data, `Profile fetched successfully.`);
  }

  async updateProfile(req, res) {
    const info = req.body;
    const user_id = req.user.id;
    const role = req.user.role;
    const data = await this.service.updateProfile(info, user_id, role);
    return this.response.success(res, data, "Profile updated successfully.");
  }

  async updateProfilePicture(req, res) {
    const image_path = `/images/${req.file.filename}`;
    const user_id = req.user.id;
    const role = req.user.role;
    const data = await this.service.updateProfilePicture(
      image_path,
      user_id,
      role
    );
    return this.response.success(
      res,
      data,
      "Profile picture updated successfully."
    );
  }
}

export default new ProfileController();
