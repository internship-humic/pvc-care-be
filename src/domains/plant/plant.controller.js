
import PlantService from "./plant.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class PlantController extends BaseController {
  constructor() {
    super(PlantService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = PlantService
  }

  async someMethod(req, res) {
    // implement method logic here
  }
}

export default new PlantController();
