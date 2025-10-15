import HarvestedService from "./harvested.service.js";
import BaseController from "../../../common/base_classes/base-controller.js";

class HarvestedController extends BaseController {
  constructor() {
    super(HarvestedService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = HarvestedService
  }

  async getHarvestedById(req, res) {
    const { id } = req.params;
    const data = await this.service.getHarvestedById(id);
    return this.response.success(res, data, `Harvested fetched successfully.`);
  }

  async updateHarvested(req, res) {
    const info = req.body;
    const { id } = req.params;
    const data = await this.service.updateHarvested(id, info);
    return this.response.success(res, data, "Harvested updated successfully.");
  }
}

export default new HarvestedController();
