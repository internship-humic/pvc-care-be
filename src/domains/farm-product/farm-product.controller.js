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
    return this.response.success(
      res,
      data.data,
      `Farm product fetched successfully.`,
      data.meta
    );
  }

  async getAllFarmProduct(req, res) {
    const query = req.query;
    const data = await this.service.getAllFarmProduct(query);
    return this.response.success(
      res,
      data.data,
      `Farm products fetched successfully.`,
      data.meta
    );
  }

  async createFarmProduct(req, res) {
    const info = req.body;
    const farmer_id = req.user.id;
    const data = await this.service.createFarmProduct(info, farmer_id);
    return this.response.created(
      res,
      data,
      "Farm product created successfully."
    );
  }

  async updateFarmProduct(req, res) {
    const info = req.body;
    const { id } = req.params;
    const farmer_id = req.user.id;
    const data = await this.service.updateFarmProduct(id, info, farmer_id);
    return this.response.success(
      res,
      data,
      "Farm product updated successfully."
    );
  }

  async deleteFarmProduct(req, res) {
    const { id } = req.params;
    const farmer_id = req.user.id;
    const data = await this.service.deleteFarmProduct(id, farmer_id);
    return this.response.success(
      res,
      data,
      "Farm product deleted successfully."
    );
  }
}

export default new FarmProductController();
