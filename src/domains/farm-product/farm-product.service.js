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

  async createFarmProduct(info, farmer_id) {
    const { farm_id, plant_id } = info;

    const is_exist = await this.db.farm.findFirst({
      where: { id: info.farm_id, farmer_id }
    });

    if (!is_exist) {
      throw this.error.notFound("Farm not found or you do not own this farm");
    }

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

  async updateFarmProduct(id, info, farmerId) {
    const ALLOWED = ["plant_id"];
    const data = {};

    const is_exist = await this.db.farmProduct.findUnique({
      where: { id }
    })

    if (!is_exist) {
      throw this.error.notFound("Farm product not found");
    }

    const is_owned = await this.db.farm.findUnique({
      where: { id: is_exist.farm_id, farmer_id: farmerId }
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

  async deleteFarmProduct(id, info, farmerId) {
    const is_exist = await this.db.farmProduct.findUnique({
      where: { id }
    })

    if (!is_exist) {
      throw this.error.notFound("Farm product not found");
    }

    const is_owned = await this.db.farm.findUnique({
      where: { id: is_exist.farm_id, farmer_id: farmerId }
    })

    if (!is_owned) {
      throw this.error.forbidden("You do not own this farm product");
    }

    return await this.db.$transaction(async (tx) => {
      const deleted = await tx.farmProduct.findUnique({
        where: { id },
      });
      
      await tx.farmProduct.delete({
        where: { id },
      });

      await tx.harvested.delete({
        where: { id: deleted.harvested_id },
			});
      await tx.planted.delete({
        where: { id: deleted.planted_id },
      });
      await tx.sale.delete({
        where: { id: deleted.sale_id },
      });

			return deleted;
		});
  }
}

export default new FarmProductService();
