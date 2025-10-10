import BaseService from "../../common/base_classes/base-service.js";

class FarmProductService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getFarmProductById(id) {
    const data = await this.db.farmProduct.findUnique({
      where: { id },
    })

    if (!data) {
      throw this.error.notFound("Farm product not found");
    }

    return data;
  }

  async getAllFarmProduct() {
    const data = await this.db.farmProduct.findMany();

    return data;
  }

  async createFarmProduct(info) {
    const { farm_id, plant_id } = info;

    const { id: planted_id } = await this.db.planted.create({ data: {} });
    const { id: harvested_id } = await this.db.harvested.create({ data: {} });
    const { id: sale_id } = await this.db.sale.create({ data: {} });

    const created = await this.db.farmProduct.create({
      data: {
        farm_id,
        plant_id,
        harvested_id,
        planted_id,
        sale_id
      },
    });
    return created;
  }

  async updateFarmProduct(id, info) {
    const ALLOWED = ["plant_id"];
    const data = {};

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        data[key] = info[key];
      }
    }

    if (Object.keys(data).length > 0) {
      await this.db.farmProduct.update({
        where: { id },
        data: { ...data },
      });
    } else {
      throw this.error.badRequest("No valid fields to update");
    }

    const updated = await this.db.farmProduct.findUnique({
      where: { id },
    });

    return updated;
  }

  async deleteFarmProduct(id) {
    const deleted = await this.db.farmProduct.delete({
      where: { id },
    });
    return deleted;
  }
}

export default new FarmProductService();
