import PlantService from "./plant.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class PlantController extends BaseController {
  constructor() {
    super(PlantService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = PlantService
  }

  async getPlantById(req, res) {
    const { id } = req.params;
    const data = await this.service.getPlantById(id);
    return this.response.success(res, data, `Plant fetched successfully.`);
  }

  async getAllPlant(req, res) {
    const data = await this.service.getAllPlant();
    return this.response.success(res, data, `Plants fetched successfully.`);
  }
}

export default new PlantController();
