
import Farm-productService from "./farm-product.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class Farm-productController extends BaseController {
  constructor() {
    super(Farm-productService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = Farm-productService
  }

  async someMethod(req, res) {
    // implement method logic here
  }
}

export default new Farm-productController();
