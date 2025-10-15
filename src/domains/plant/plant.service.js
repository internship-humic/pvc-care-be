import BaseService from "../../common/base_classes/base-service.js";

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

  async getAllPlant() {
    const data = await this.db.plant.findMany();

    return data;
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
