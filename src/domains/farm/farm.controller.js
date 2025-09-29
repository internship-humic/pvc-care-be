
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
		const data = await this.service.getFarmById(farmerId, id);
		return this.response.success(res, data, `Farm fetched successfully.`);
	}

  async getAllFarm(req, res) {
		const data = await this.service.getFarmById();
		return this.response.success(res, data, `Farms fetched successfully.`);
	}

	async createFarm(req, res) {
		const info = req.body;
		const farmerId = req.user.id;
		const data = await this.service.createFarm(farmerId, info);
		return this.response.created(res, data, "Farm created successfully.");
	}
}

export default new FarmController();
