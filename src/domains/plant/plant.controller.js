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
    const query = req.query;
    const data = await this.service.getAllPlant(query);
    return this.response.success(res, data.data, `Plants fetched successfully.`, data.meta);
  }

  async createPlant(req, res) {
    const info = req.body;
    const data = await this.service.createPlant(info);
    return this.response.created(res, data, "Plant created successfully.");
  }
}

export default new PlantController();
