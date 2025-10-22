import BaseService from "../../common/base_classes/base-service.js";
import { ORMfilterable } from "../../utils/filter.util.js";
import { getMeta, getPagination } from "../../utils/pagination.util.js";

class PlantService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getPlantById(id) {
    const data = await this.db.plant.findUnique({
      where: { id },
    });

    if (!data) {
      throw this.error.notFound("Plant not found");
    }

    return data;
  }

  async getAllPlant(query) {
    const { page, limit, offset } = getPagination(query);
    const filter = ORMfilterable(query, ["name"]);
    const total = await this.db.plant.count({ where: filter });
    const data = await this.db.plant.findMany({
      where: filter,
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const meta = getMeta(total, page, limit);

    return { data, meta};
  }

  async createPlant(info) {
    const { name } = info;
    const created = await this.db.plant.create({
      data: { name: name },
    });
    return created;
  }
}

export default new PlantService();
