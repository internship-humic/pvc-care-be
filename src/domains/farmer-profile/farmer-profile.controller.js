import FarmerProfileService from "./farmer-profile.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class FarmerProfileController extends BaseController {
  constructor() {
    super(FarmerProfileService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = FarmerProfileService
  }

  async getFarmerProfile(req, res) {
    const farmer_id = req.user.id;
    const data = await this.service.getFarmerProfile(farmer_id);
    return this.response.success(res, data, `Farmer profile fetched successfully.`);
  }

  async updateFarmerProfile(req, res) {
    const info = req.body;
    const farmer_id = req.user.id;
    const data = await this.service.updateFarmerProfile(info, farmer_id);
    return this.response.success(res, data, "Farmer profile updated successfully.");
  }
}

export default new FarmerProfileController();
