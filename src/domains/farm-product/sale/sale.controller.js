
import SaleService from "./sale.service.js";
import BaseController from "../../../common/base_classes/base-controller.js";

class SaleController extends BaseController {
  constructor() {
    super(SaleService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = SaleService
  }

  async getSaleById(req, res) {
    const { id } = req.params;
    const data = await this.service.getSaleById(id);
    return this.response.success(res, data, `Sale fetched successfully.`);
  }

  async getAllSale(req, res) {
    const data = await this.service.getAllSale();
    return this.response.success(res, data, `Sales fetched successfully.`);
  }

  async updateSale(req, res) {
    const info = req.body;
    const { id } = req.params;
    const farmer_id = req.user.id;
    const data = await this.service.updateSale(id, info, farmer_id);
    return this.response.success(res, data, "Sale updated successfully.");
  }
}

export default new SaleController();
