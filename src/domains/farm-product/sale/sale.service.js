import BaseService from "../../../common/base_classes/base-service.js";

class SaleService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getSaleById(id) {
    const data = await this.db.sale.findUnique({
      where: { id },
    });

    if (!data) {
      throw this.error.notFound("Sale product not found");
    }

    return data;
  }

  async getAllSale() {
    const data = await this.db.sale.findMany();

    return data;
  }

  async updateSale(id, info, farmer_id) {
    const ALLOWED = ["quantity", "price", "status"];
    const data = {};

    const is_exist = await this.db.sale.findUnique({
      where: { id }
    })

    if (!is_exist) {
      throw this.error.notFound("Sale product not found");
    }

    const farmProduct = await this.db.farmProduct.findUnique({
      where: { id: is_exist.farm_product_id }
    });

    const is_owned = await this.db.farm.findUnique({
      where: { id: farmProduct.farm_id, farmer_id }
    })

    if (!is_owned) {
      throw this.error.forbidden("You do not own this farm product");
    }

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        data[key] = info[key];
      }
    }

    if (Object.keys(data).length > 0) {
      await this.db.sale.update({
        where: { id },
        data: { ...data },
      });
    } else {
      throw this.error.badRequest("No valid fields to update");
    }

    const updated = await this.db.sale.findUnique({
      where: { id },
    });

    return updated;
  }
}

export default new SaleService();
