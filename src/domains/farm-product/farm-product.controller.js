import FarmProductService from "./farm-product.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class FarmProductController extends BaseController {
  constructor() {
    super(FarmProductService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = FarmProductService
  }

  async getFarmProductById(req, res) {
    const { id } = req.params;
    const data = await this.service.getFarmProductById(id);
    return this.response.success(res, data, `Farm product fetched successfully.`);
  }

  async getAllFarmProduct(req, res) {
    const data = await this.service.getAllFarmProduct();
    return this.response.success(res, data, `Farm products fetched successfully.`);
  }

  async createFarmProduct(req, res) {
    const info = req.body;
    const data = await this.service.createFarmProduct(info);
    return this.response.created(res, data, "Farm product created successfully.");
  }

  async updateFarmProduct(req, res) {
    const info = req.body;
    const { id } = req.params;
    const data = await this.service.updateFarmProduct(id, info);
    return this.response.success(res, data, "Farm product updated successfully.");
  }

  async deleteFarmProduct(req, res) {
    const info = req.body;
    const { id } = req.params;
    const data = await this.service.deleteFarmProduct(id, info);
    return this.response.success(res, data, "Farm product deleted successfully.");
  }
}

export default new FarmProductController();
