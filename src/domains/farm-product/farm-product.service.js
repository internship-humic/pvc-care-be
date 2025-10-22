import BaseService from "../../common/base_classes/base-service.js";
import { ORMfilterable } from "../../utils/filter.util.js";
import { getMeta, getPagination } from "../../utils/pagination.util.js";

class FarmProductService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getFarmProductById(id) {
    const data = await this.db.farmProduct.findUnique({
      where: { id },
      include: {
        farm: true,
        plant: true,
        planted: true,
        harvested: true,
        sale: true,
      },
    });

    if (!data) {
      throw this.error.notFound("Farm product not found");
    }

    return data;
  }

  async getAllFarmProduct(query) {
    const { page, limit, offset } = getPagination(query);
    const filter = ORMfilterable(query, ["farm_id", "plant_id"]);
    if (query.plant_name) {
      filter.plant = {
        name: { contains: query.plant_name, mode: "insensitive" },
      };
    }
    const total = await this.db.farmProduct.count({ where: filter });

    const data = await this.db.farmProduct.findMany({
      where: filter,
      include: {
        farm: true,
        plant: true,
        planted: true,
        harvested: true,
        sale: true,
      },
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const meta = getMeta(total, page, limit);

    return { data, meta };
  }

  async createFarmProduct(info, farmer_id) {
    const { farm_id, plant_id } = info;

    const is_exist = await this.db.farm.findUnique({
      where: { id: farm_id, farmer_id },
    });

    if (!is_exist) {
      throw this.error.notFound("Farm not found or you do not own this farm");
    }

    return await this.db.$transaction(async (tx) => {
      const created = await tx.farmProduct.create({
        data: {
          farm_id: farm_id,
          plant_id: plant_id,
        },
      });

      await tx.planted.create({
        data: {
          farm_product_id: created.id,
        },
      });

      await tx.harvested.create({
        data: {
          farm_product_id: created.id,
        },
      });

      await tx.sale.create({
        data: {
          farm_product_id: created.id,
        },
      });

      return created;
    });
  }

  async updateFarmProduct(id, info, farmer_id) {
    const ALLOWED = ["plant_id"];
    const data = {};

    const is_exist = await this.db.farmProduct.findUnique({
      where: { id },
    });

    if (!is_exist) {
      throw this.error.notFound("Farm product not found");
    }

    const is_owned = await this.db.farm.findUnique({
      where: { id: is_exist.farm_id, farmer_id },
    });

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

  async deleteFarmProduct(id, farmer_id) {
    const is_exist = await this.db.farmProduct.findUnique({
      where: { id },
    });

    if (!is_exist) {
      throw this.error.notFound("Farm product not found");
    }

    const is_owned = await this.db.farm.findUnique({
      where: { id: is_exist.farm_id, farmer_id },
    });

    if (!is_owned) {
      throw this.error.forbidden("You do not own this farm product");
    }

    const deleted = await this.db.farmProduct.delete({
      where: { id },
    });

    return deleted;
  }
}

export default new FarmProductService();
