import SaleController from "./sale.controller.js";
import BaseRoutes from "../../../common/base_classes/base-routes.js";
import { updateSaleSchema } from './sale.schema.js';

class SaleRoutes extends BaseRoutes {
  constructor() {
    super(SaleController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/:id", [
      this.auth.authenticate,
      this.errCatch(this.controller.getSaleById.bind(this.controller)),
    ]);
    this.router.get("/", [
      this.auth.authenticate,
      this.errCatch(this.controller.getAllSale.bind(this.controller)),
    ]);
    this.router.patch("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(updateSaleSchema),
      this.errCatch(this.controller.updateSale.bind(this.controller)),
    ]);
  }
}

export default new SaleRoutes().router;
