import PlantedService from "./planted.service.js";
import BaseController from "../../../common/base_classes/base-controller.js";

class PlantedController extends BaseController {
  constructor() {
    super(PlantedService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = PlantedService
  }

  async getPlantedById(req, res) {
    const { id } = req.params;
    const data = await this.service.getPlantedById(id);
    return this.response.success(res, data, `Planted fetched successfully.`);
  }

  async getAllPlanted(req, res) {
    const data = await this.service.getAllPlanted();
    return this.response.success(res, data, `Planted fetched successfully.`);
  }

  async updatePlanted(req, res) {
    const info = req.body;
    const { id } = req.params;
    const farmer_id = req.user.id;
    const data = await this.service.updatePlanted(id, info, farmer_id);
    return this.response.success(res, data, "Planted updated successfully.");
  }
}

export default new PlantedController();
