import FarmService from "./farm.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class FarmController extends BaseController {
  constructor() {
    super(FarmService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = FarmService
  }

  async getFarmById(req, res) {
    const { id } = req.params;
    const data = await this.service.getFarmById(id);
    return this.response.success(res, data, `Farm fetched successfully.`);
  }

  async getAllFarm(req, res) {
    const query = req.query;
    const data = await this.service.getAllFarm(query);
    return this.response.success(
      res,
      data.data,
      `Farms fetched successfully.`,
      data.meta
    );
  }

  async getNearestFarm(req, res) {
    const info = req.body;
    const data = await this.service.getNearestFarm(info);
    return this.response.success(
      res,
      data,
      "Nearest farms fetched successfully."
    );
  }

  async createFarm(req, res) {
    const info = req.body;
    const farmerId = req.user.id;
    const data = await this.service.createFarm(farmerId, info);
    return this.response.created(res, data, "Farm created successfully.");
  }

  async updateFarm(req, res) {
    const info = req.body;
    const { id } = req.params;
    const farmerId = req.user.id;
    const data = await this.service.updateFarm(farmerId, id, info);
    return this.response.success(res, data, "Farm updated successfully.");
  }

  async deleteFarm(req, res) {
    const info = req.body;
    const { id } = req.params;
    const farmerId = req.user.id;
    const data = await this.service.deleteFarm(farmerId, id, info);
    return this.response.success(res, data, "Farm deleted successfully.");
  }
}

export default new FarmController();
