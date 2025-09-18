
import FarmService from "./farm.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class FarmController extends BaseController {
  constructor() {
    super(FarmService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = FarmService
  }

  async someMethod(req, res) {
    // implement method logic here
  }
}

export default new FarmController();
